from flask import Blueprint, render_template, abort, Flask, request
import os
import db
webapp = Blueprint('webapp', __name__,
                    static_folder='static',
                    static_url_path='/webapp/static',
                    template_folder='static/')

@webapp.route('/')
def index():
    return render_template('index.html')

@webapp.route('/admin')
def admin():
    return render_template(os.path.join('pages', 'donators.html'))

@webapp.route('/gcm-message')
def gcm_message():
    return render_template('gcm-message.html')
