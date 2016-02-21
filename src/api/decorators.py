from db import *
from flask import request
from utils import ApiResponse
import config
import time, datetime
import utils

def require_login(handler):
    def safe_handler():
        session_token = request.args.get('session_token', '')
        user_id = request.args.get('user_id', 0)
        user = session.query(User).filter_by(user_id=user_id, session_token=session_token).first()
        if user and user.session_token == session_token and \
            utils.to_timestamp(user.session_token_expires_at) > time.time():
            return handler()
        else:
            return ApiResponse(config.ACCESS_DENIED_MSG, status='403')

    return safe_handler
