from flask import Blueprint, render_template, abort
import os


webapp = Blueprint('webapp', __name__,
                        template_folder=os.path.join('static', 'templates'))

@webapp.route('/')
def index():
    return render_template(os.path.join('pages', 'hello.html'), name='Rreli')

@webapp.route('/reaction')
def reaction():
    return render_template('reaction.html')
