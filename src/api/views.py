from flask import Blueprint, render_template, abort, request
from pushjack import GCMClient
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

    payload= {
        'access_token': fb_token,
        'fields': 'id'
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
        user = db.User(user_id, fb_token=fb_token, gcm_id=gcm_id)
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


# List blood types
@api.route('/blood-types/')
def get_blood_types():
    session = db.Session()
    response = ApiResponse([x.type for x in session.query(db.BloodType).all()])
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


@api.route('/gcm-message/', methods=['POST'])
def gcm_message():
    if request.form.get('message'):
        gcmClient = GCMClient(api_key=os.environ.get('GCM_API_KEY'))

        alert = {
            'subject': 'Subject goes here', # TODO: set a better subject
            'message': request.form.get('message')
        }

        session = db.Session()
        gcm_id_list = [user.gcm_id for user in session.query(db.User).all()]
        session.close()

        response = gcmClient.send(gcm_id_list,
                                  alert,
                                  time_to_live=3600)
        if response:
            return ApiResponse({
                'message': 'Mesazhi u dergua'
            })
        else:
            return ApiResponse({
                'message': 'Father, why have you forsaken me?'
            })
    else:
        return ApiResponse({
            'message': 'Can\'t send a blank message...'
        })
