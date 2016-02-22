from flask import Blueprint, render_template, abort, Flask, request
import os
from db import *

webapp = Blueprint('webapp', __name__,
                    static_folder='static',
                    static_url_path='/webapp/static',
                    template_folder=os.path.join('static', 'templates'))

@webapp.route('/')
def index():
    user_id = request.args.get('user_id', -1)
    user = session.query(User).filter_by(user_id=int(user_id)).first()
    if user:
        user_id = user.user_id # just a demo (reading user data)

    if user_id == -1:
        return render_template(os.path.join('pages', 'hello.html'), name="Stranger")
    else:
        # Will always return GET['user_id'] if provided (regardless of whether
        # a user with that ID exists or not.)
        return render_template(os.path.join('pages', 'hello.html'), name=user_id)



@webapp.route('/reaction')
def reaction():
    return render_template('reaction.html')
