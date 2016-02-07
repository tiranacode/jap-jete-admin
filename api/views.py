from flask import Blueprint, render_template, abort, Response
import os
import json

import config


BASE_PATH = os.path.join("/api", "v1")
api = Blueprint('api', __name__)

@api.route(os.path.join(BASE_PATH, 'version'))
def version():
    return Response(json.dumps({
        "version": config.API_VERSION,
    }), mimetype='application/json')
