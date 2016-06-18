from flask import Blueprint, abort, request
from pushjack import GCMClient
import bcrypt
import db

import os
import json
import requests
import config
import time, datetime
from utils import ApiResponse, to_timestamp
from decorators import hospital_login


BASE_PATH = os.path.join("/api/v1", "hospitals")
hospitals = Blueprint('hospitals', __name__, url_prefix=BASE_PATH)


@hospitals.route('/login/', methods=['POST'])
def login_hospital():
    data = json.loads(request.data)

    username = data['username']
    password = data['password'].encode('ascii', 'replace')

    session = db.Session()
    h = session.query(db.Hospital).filter_by(username=username).first()
    pwd = h.password.encode('ascii', 'replace')

    if not h or bcrypt.hashpw(password, pwd) != pwd:
        session.close()
        return ApiResponse(config.ACCESS_DENIED_MSG, status='403')

    h.login()
    session.add(h)
    session.commit()
    response = ApiResponse({
        'id': h._id,
        'session_token': h.session_token
    })
    session.close()
    return response


@hospitals.route('/logout/', methods=['GET'])
@hospital_login
def logout():
    session = db.Session()
    hospital_id = request.args.get('hospital_id', 0)
    # TODO: shiko per injection
    hospital = session.query(db.Hospital).filter_by(_id=hospital_id).first()
    hospital.logout()
    session.add(hospital)
    session.commit()
    session.close()
    return ApiResponse({
        'status': 'ok'
    })


@hospitals.route('/', methods=['GET'])
def all_hospitals():
    session = db.Session()
    hospitals = session.query(db.Hospital).all()
    response = ApiResponse({
        'hospitals': [{
            'id': h._id,
            'name': h.name,
            'email': h.email,
            'address': h.address,
            'contact': h.contact,
            'latitude': h.latitude,
            'longitude': h.longitude
        } for h in hospitals]
    })
    session.close()
    return response


@hospitals.route('/campaigns/', methods=['GET'])
# @hospital_login
def all_campaigns():
    session = db.Session()
    hospital_id = request.args.get('hospital_id', 0)
    #campaigns = session.query(db.Campaign).filter_by(hospital_id=hospital_id).all()
    campaigns = session.query(db.Campaign).all()

    bloodtypes = session.query()
    response = ApiResponse({
        'campaigns': [
            {
                'id': c._id,
                'name': c.name,
                'message': c.message,
                'start_date': to_timestamp(c.start_date),
                'end_date': to_timestamp(c.end_date),
                'active': c.active,
                'bloodtypes': [r.blood_type for r in c.requirement]
            } for c in campaigns]
    })
    session.close()
    return response


@hospitals.route('/campaigns/', methods=['POST'])
# @hospital_login
def create_campaign():
    session = db.Session()
    data = json.loads(request.data)
    hospital_id = request.args.get('hospital_id', 0)

    # hospital = session.query(db.Hospital).filter_by(_id=hospital_id).first()
    hospital = session.query(db.Hospital).first()

    name = data['name']
    message = data['message']
    bloodtypes = data['bloodtypes']
    start_date = datetime.datetime.now()
    end_date = datetime.datetime.now() + datetime.timedelta(days=10)
    campaign = db.Campaign(hospital._id, name, message, start_date, end_date)
    session.add(campaign)
    session.commit()

    for bloodtype in bloodtypes:
        campaign_blood = db.CampaignBlood(campaign._id, bloodtype)
        session.add(campaign_blood)

    session.commit()

    gcmClient = GCMClient(api_key=os.environ.get('GCM_API_KEY'))
    alert = {
        'subject': 'Fushate e re',
        'message': campaign.hospital.name,
        'data': {
            'id': campaign._id,
            'name': name,
            'hospital': {
                'name': campaign.hospital.name,
                'latitude': campaign.hospital.latitude,
                'longitude': campaign.hospital.longitude,
            },
            'message': message,
            'start_date': to_timestamp(start_date),
            'end_date': to_timestamp(end_date)
        }
    }

    interested_users = session.query(db.User).filter(db.User.blood_type.in_(bloodtypes))
    gcm_id_list = [user.gcm_id for user in interested_users]
    session.close()

    response = gcmClient.send(gcm_id_list, alert, time_to_live=3600)
    if response:
        return ApiResponse({
            'status': 'ok'
        })
    else:
        return ApiResponse({
            'status': 'some error occurred'
        })


@hospitals.route('/campaign/<campaign_id>', methods=['DELETE'])
# @hospital_login
def delete_campaign(campaign_id):
    session = db.Session()
    campaign = session.query(db.Campaign).filter_by(_id=campaign_id).first()
    if not campaign:
        session.close()
        response = ApiResponse({
            'status': 'wrong campaign id'
        })
    else:
        campaign.deactivate()
        session.add(campaign)
        session.commit()
        response = ApiResponse({
            'status': 'ok'
        })

    session.close()
    return response


@hospitals.route('/campaign/<campaign_id>/activate/')
# @hospital_login
def reactivate_campaign(campaign_id):
    session = db.Session()
    campaign = session.query(db.Campaign).filter_by(_id=campaign_id).first()
    if not campaign:
        session.close()
        response = ApiResponse({
            'status': 'wrong campaign id'
        })
    else:
        campaign.activate()
        session.add(campaign)
        session.commit()
        response = ApiResponse({
            'status': 'ok'
        })

    session.close()
    return response

@hospitals.route('/users/edit/')
@hospital_login
def edit_user_blood_type():
    valid_blood_types = {
        'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'
    } # @TODO Move form validation in the respective class in db.py
    session = db.Session()
    data = json.loads(request.data)
    user_id = request.args.get('user_id', 0)
    hospital_id = request.args.get('hospital_id')
    user = session.query(db.User).filter_by(user_id=user_id).first()
    user_has_donated = session.query(db.Appointment).filter_by(
        user_id=user_id, hospital_id=hospital_id).exists()
    blood_type = request.args.get('blood_type', '').upper()
    if not user_has_donated:
        return ApiResponse({
            'status': 'Error',
            'message': 'Permission denied.'
        }, status='403')
    if blood_type not in valid_blood_types:
        return ApiResponse({
            'status': 'Error',
            'message': 'Bad request: %s is not a valid blood type' % blood_type,
            }, status='400')

    user.blood_type = blood_type
    user.blood_typeF = session.query(db.BloodType).filter_by(type=blood_type).first()
    session.commit()
    session.close()
    return ApiResponse({
        'status': 'OK'
    })

@hospitals.route('/appointments/')
@hospital_login
def list_appointments():
    session = db.Session()
    hospital_id = request.args['hospital_id']
    # optional filters
    status = request.args.get('status')
    blood_type = request.args.get('blood_type')

    appointments = session.query(db.Appointment).filter_by(hospital_id=hospital_id)
    if status:
        appointments = appointments.filter_by(status=status)
    if blood_type:
        appointments = appointments.filter(db.Appointment.user.has(blood_type=blood_type))
    session.commit()
    response = ApiResponse({
        'status': 'OK',
        'appointments': [
            {
                'time': ap.donation_time,
                'user_fname': ap.user.first_name,
                'user_lname': ap.user.last_name,
                'blood_type': ap.user.blood_type,
                'status': ap.status
            }
            for ap in appointments.all()
        ]
    })
    session.close()
    return response

@hospitals.route('/appointments/', methods=['PUT'])
@hospital_login
def edit_appointment():
    appointment_id = request.args.get('appointment_id')
    editable_fields = [
        'amount',
        'status',
        'donation_time'
    ]
    if not appointment_id:
        return ApiResponse({
            'status': 'Error',
            'message': 'appointment_id must be specified'
        })
    session = db.Session()
    appointment = session.query(db.Appointment).filter_by(_id=int(appointment_id)).first()
    if not appointment:
        return ApiResponse({
            'status': 'Error',
            'message': 'Appointment with id %d does not exist' % appointment_id
        }, status='400')
    user = appointment.user
    made_at_least_one_change = False
    for field in editable_fields:
        val = request.args.get(field)
        if val:
            try:
                setattr(appointment, field, val)
                made_at_least_one_change = True
            except db.ValidationError:
                session.close()
                return ApiResponse({
                    'status': 'Error',
                    'message': '%s=%s is not valid' % (field, val)
                })
    session.commit()
    if not made_at_least_one_change:
        session.close()
        return ApiResponse({
            'status': 'OK'
        })
    gcmClient = GCMClient(api_key=os.environ.get('GCM_API_KEY'))
    message = '%s ka bere ndryshime ne takimin tuaj.' % appointment.hospital.name
    alert = {
        'subject': 'Ndryshim i takimit',
        'message': appointment.hospital.name,
        'data': {
            'id': appointment._id,
            'hospital_name': appointment.hospital.name,
            'message': message,
            'time': to_timestamp(appointment.donnation_time),
            'status': appointment.status
        }
    }

    gcm_id_list = [user.gcm_id]
    session.close()
    response = gcmClient.send(gcm_id_list, alert, time_to_live=3600)
    if response:
        return ApiResponse({
            'status': 'OK'
        })
    else:
        return ApiResponse({
            'status': 'Error',
            'message': 'Failed to send notification to %s' % user.first_name
        })


# @hospitals.route('/donations')
# def demo_history():
#     session = db.Session()
#     users = session.query(db.User).all()
#     result = []
#     for u in users:
#         donations = session.query(db.Appointment).filter_by(user_id=u.user_id).all()
#         result.append({
#             'user': u.user_id,
#             'history': [{
#                 'date': to_timestamp(d.donation_time),
#                 'amount': d.amount,
#                 'hospital': d.hospital.name
#             } for d in donations]
#         })
#     session.close()
#     return ApiResponse({
#         'history': result
#     })
