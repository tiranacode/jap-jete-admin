from flask import Response
import time, datetime
import config
import json

def ApiResponse(data, mimetype=config.MIMETYPE, **kwargs):
    return Response(
        json.dumps(data) if type(data) in [dict, list] else data,
        mimetype=mimetype,
        **kwargs
    )

def to_timestamp(dt):
    """
        Converts a datetime into a unix timestamp
    """
    return time.mktime(dt.timetuple())

def str_equal(str1, str2):
    """
        Time-safe string comparison
    """
    if len(str1) != len(str2):
        return False

    are_equal = True
    i = 0
    while i < len(str1):
        if str1[i] != str2[i] and are_equal:
            are_equal = False
        i += 1
    return are_equal
