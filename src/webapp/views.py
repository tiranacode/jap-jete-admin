from flask import Blueprint, render_template, abort, Flask, request
import os
import db
webapp = Blueprint('webapp', __name__,
                    static_folder='static',
                    static_url_path='/webapp/static',
                    template_folder=os.path.join('static', 'templates'))

@webapp.route('/')
def index():
    session = db.Session()
    user_id = request.args.get('user_id', 0)
    user = session.query(db.User).filter_by(user_id=int(user_id)).first()
    user_id = user.user_id if user else None
    session.close()
    return render_template(os.path.join('pages', 'hello.html'),
                           name = user_id or 'Stranger')

@webapp.route('/admin')
def admin():
    return render_template(os.path.join('pages', 'donators.html'))

@webapp.route('/gcm-message')
def gcm_message():
    return render_template('gcm-message.html')
