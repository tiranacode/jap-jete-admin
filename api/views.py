from flask import Blueprint, render_template, abort, Response
import os
import json

import config


BASE_PATH = os.path.join("/api", "v1")
api = Blueprint('api', __name__, url_prefix=BASE_PATH)

@api.route('/version/')
def version():
    return Response(json.dumps({
        "version": config.API_VERSION,
    }), mimetype='application/json')

@api.route('/hello/')
def hello():
    return Response(json.dumps({
        "message": "To every action, there is always opposed an equal reaction. | Sir Isaac Newton |"
    }), mimetype='application/json')
