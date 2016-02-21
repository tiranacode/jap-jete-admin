from flask import Blueprint, render_template, abort, Flask
import os
from db import *

webapp = Blueprint('webapp', __name__,
                    static_folder='static',
                    static_url_path='/webapp/static',
                    template_folder=os.path.join('static', 'templates'))

@webapp.route('/')
def index():

    name = "Rreli"
    res = session.query(User).filter_by(username=name).first()
    if res:
        name = res.username; #get the username
    else:
        u = User(name)
        session.add(u)
        session.commit()
        
    
    return render_template(os.path.join('pages', 'hello.html'), name=name)

@webapp.route('/reaction')
def reaction():
    return render_template('reaction.html')
