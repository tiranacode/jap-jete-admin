import db
from utils import ApiResponse
import config
import time, datetime
import utils
import random

from functools import wraps
from flask import request

def require_login(handler):
    @wraps(handler)
    def safe_handler(*args, **kwargs):
        session = db.Session()
        session_token = request.args.get('session_token', '')
        user_id = request.args.get('user_id', 0)
        user = session.query(db.User).filter_by(user_id=user_id).first()
        if user and utils.str_equal(user.session_token, session_token) and \
            utils.to_timestamp(user.session_token_expires_at) > time.time():
            response = handler(*args, **kwargs)
        else:
            response = ApiResponse(config.ACCESS_DENIED_MSG, status='403')
        session.close()
        return response
    return safe_handler

def hospital_login(handler):
    @wraps(handler)
    def safe_handler(*args, **kwargs):
        session = db.Session()
        session_token = request.data.get('session_token', '')
        hospital_id = request.data.get('hospital_id', 0)

        hospital = session.query(db.Hospital).filter_by(_id=hospital_id).first()
        if hospital and utils.str_equal(hospital.session_token, session_token):
            response = handler(*args, **kwargs)
        else:
            response = ApiResponse(config.ACCESS_DENIED_MSG, status='403')
        session.close()
        return response
    return safe_handler
