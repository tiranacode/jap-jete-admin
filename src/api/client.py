from flask import Blueprint, abort, request
import db

import os
import json
import requests
import config
import time, datetime
from utils import ApiResponse, to_timestamp
from decorators import require_login


BASE_PATH = os.path.join("/api", "v1")
api = Blueprint('api', __name__, url_prefix=BASE_PATH)


@api.route('/version/')
def version():
    return ApiResponse({
        "version": config.API_VERSION,
    })

@api.route('/hello/')
@require_login
def hello():
    return ApiResponse({
        "message": "To every action, there is always opposed an equal reaction. | Sir Isaac Newton |"
    })


@api.route('/login/', methods=['POST'])
def login():
    session = db.Session()
    data = json.loads(request.data)
    user_id = data['user_id']
    gcm_id = data['gcm_id']
    fb_token = data['fb_token']

    payload = {
        'access_token': fb_token,
        'fields': ['id', 'name']
    }
    fb_response = requests.get(config.FB_ENDPOINT, params=payload).json()
    if 'error' in fb_response:
        return ApiResponse(config.ACCESS_DENIED_MSG, status='403')
    elif user_id != fb_response['id']:
        return ApiResponse(config.ACCESS_DENIED_MSG, status='403')

    # Facebook login was successful
    user = session.query(db.User).filter_by(user_id=user_id).first()

    if user:
        user.fb_token = fb_token
        token, expires_at = db.User.generate_session_token()
        user.session_token = token
        user.session_token_expires_at = expires_at
        if gcm_id:
            user.gcm_id = gcm_id
    else:
        name = fb_response['name'].split()
        user = db.User(user_id, name[0], name[-1], fb_token=fb_token, gcm_id=gcm_id)
                    #blood_type=blood_type)
        session.add(user)
    session.commit()

    response = ApiResponse({
        'status': 'OK',
        'session_token': user.session_token,
        'expires_at': to_timestamp(user.session_token_expires_at)
    } if user else {
        'status': 'Failed',
        'message': "Couldn't create new user"
    })
    session.close()
    return response


@api.route('/user/', methods=['PUT'])
@require_login
def update_profile():
    session = db.Session()
    attribs =[
        'gcm_id',
        'email',
        'phone_number',
        'address',
        'blood_type'
    ]
    response = None
    if request.data:
        data = json.loads(request.data)
        user_id = request.args.get('user_id')

        user = session.query(db.User).filter_by(user_id=user_id).first()
        if user:
            for attr in attribs:
                val = data.get(attr)
                if val is not None:
                    setattr(user, attr, val)
                     # trigger update
                    if attr == 'blood_type':
                        user.blood_typeF = session.query(db.BloodType).filter_by(type=val).first()

            session.commit()
            response = ApiResponse({
                'status': 'OK'
            })

    session.close()
    return response or ApiResponse({
        'status': 'Failed',
        'message': 'No data found'
    })


@api.route('/user/', methods=["GET"])
@require_login
def get_profile():
    session = db.Session()
    user_id = request.args.get('user_id', 0)
    user = session.query(db.User).filter_by(user_id=user_id).first()
    response = ApiResponse({
        'gcm_id': user.gcm_id,
        'blood_type': user.blood_type,
        'email': user.email,
        'phone_number': user.phone_number,
        'address': user.address
    } if user else {
        'status': 'Failed',
        'message': 'Wrong data'
    })
    session.close()
    return response


@api.route('/users/', methods=['GET'])
def get_users():
    session = db.Session()
    response = ApiResponse([
        {
            'user_id': x.user_id,
            'blood_type': x.blood_type,
            'email': x.email,
            'address': x.address,
            'phone_number': x.phone_number,
            'first_name': x.first_name,
            'last_name': x.last_name
        }
        for x in session.query(db.User).all()])

    session.close()
    return response


@api.route('/donations/')
@api.route('/donations/<int:user_id>')
@require_login
def user_past_donations(user_id=None):
    session = db.Session()

    if user_id is None:
        user_id = request.args.get('user_id', 0)

    user = session.query(db.User).filter_by(user_id=user_id).first()
    if not user:
        session.close()
        return ApiResponse({
            'status': 'error',
            'message': 'No user with id {0} found'.format(id)
        })

    donations = session.query(db.Appointment).filter_by(user_id=user.user_id).all()
    result = {
        'user': user.user_id,
        'history': [{
            'date': to_timestamp(d.donation_time),
            'amount': d.amount,
            'hospital': d.hospital.name
        } for d in donations]
    }
    session.close()
    return ApiResponse({
        'status': 'OK',
        'history': result
    })

@api.route('/appointments/cancel/', methods=['PUT'])
@require_login
def cancel_appointment():
    appointment_id = request.args.get('appointment_id')
    user_id = int(request.args['user_id'])
    session = db.Session()
    appointment = session.query(db.Appointment).filter_by(_id=int(appointment_id)).first()
    if not appointment:
        return ApiResponse({
            'status': 'Error',
            'message': 'Appointment with id %d does not exist' % appointment_id
        }, status='400')
    if appointment.user_id != user_id or appointment.status == 'done':
        return ApiResponse({
            'status': 'Error',
            'message': 'Permission denied.'
        })
    appointment.status = 'cancelled'
    session.commit()
    session.close()
    return ApiResponse({
        'status': 'OK'
    })


@api.route('/campaigns/', methods=['GET'])
@require_login
def get_campaigns_by_bloodtype():
    session = db.Session()
    user_id = request.args.get('user_id', 0)

    # filter by user Blood Type
    user = session.query(db.User).filter_by(user_id=user_id).first()
    if not user:
        session.close()
        return ApiResponse({
            'status': 'error',
            'message': 'No user with id {0} found'.format(user_id)
        })

    campaigns_blood = session.query(db.CampaignBlood).filter_by(blood_type=user.blood_type).all()
    campaigns = [
        {
            'name': c.campaign.name,
            'hospital': {
                'name': c.campaign.hospital.name,
                'latitude': c.campaign.hospital.latitude,
                'longitude': c.campaign.hospital.longitude,
            },
            'message': c.campaign.message,
            'start_date': to_timestamp(c.campaign.start_date),
            'end_date': to_timestamp(c.campaign.end_date)
        } for c in campaigns_blood]
    session.close()

    # return data
    return ApiResponse({
        "campaigns": campaigns
    })
