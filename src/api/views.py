from flask import Blueprint, render_template, abort, request
from db import *

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
    data = json.loads(request.data)
    user_id = data['user_id']
    gcmID = data['gcmID']
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
    user = session.query(User).filter_by(user_id=user_id).first()
    gcm_id = request.args.get('gcm_id', '')
    blood_type = request.args.get('blood_type', '')

    if user:
        user.fb_token = fb_token
        token, expires_at = User.generate_session_token()
        user.session_token = token
        user.session_token_expires_at = expires_at
        if gcm_id:
            user.gcm_id = gcm_id
        if blood_type:
            user.blood_type = blood_type
        session.commit()
    else:
        user = User(user_id, fb_token=fb_token, gcm_id=gcm_id,
                    blood_type=blood_type)
        session.add(user)
        session.commit()

    if user:
        return ApiResponse({
            'status': 'OK',
            'session_token': user.session_token,
            'expires_at': to_timestamp(user.session_token_expires_at)
        })
    else:
        return ApiResponse({
            'status': 'Failed',
            'message': "Couldn't create new user"
        })
