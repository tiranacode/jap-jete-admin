from flask import Flask
from webapp.views import webapp
from api.hospitals import hospitals
from api.client import api as client_api
import sys
from db import Session, Base, engine, seed

app = Flask(__name__)
app.register_blueprint(webapp)
app.register_blueprint(hospitals)
app.register_blueprint(client_api)

DEFAULT_PORT = 5000

if __name__ == '__main__':
    app.debug = True

    Base.metadata.create_all(bind=engine)
    # TODO: uncomment below if developing locally
    # seed()
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    app.run(host='0.0.0.0', port=port, threaded=True)
