from db import *
from utils import ApiResponse
import config
import time, datetime
import utils
import random

from functools import wraps
from flask import g, request

def require_login(handler):
    @wraps(handler)
    def safe_handler(*args, **kwargs):
        session_token = request.args.get('session_token', '')
        user_id = request.args.get('user_id', 0)
        user = session.query(User).filter_by(user_id=user_id).first()
        sleep_amount = random.random()/5
        if user and utils.str_equal(str(user.session_token), str(session_token)) and \
            utils.to_timestamp(user.session_token_expires_at) > time.time():
            return handler(*args, **kwargs)
        else:
            time.sleep(sleep_amount)
            return ApiResponse(config.ACCESS_DENIED_MSG, status='403')

    return safe_handler
