from flask import Response
import time, datetime
import config
import json

def ApiResponse(data, mimetype=config.MIMETYPE, **kwargs):
    return Response(
        json.dumps(data) if type(data) == dict else data,
        mimetype=mimetype,
        **kwargs
    )

def to_timestamp(dt):
    """
        Converts a datetime into a unix timestamp
    """
    return time.mktime(dt.timetuple())
