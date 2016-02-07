from flask import Flask
from webapp.views import webapp
from api.views import api

app = Flask(__name__)
app.register_blueprint(webapp)
app.register_blueprint(api)

if __name__ == '__main__':
    app.debug = True
    app.run()
