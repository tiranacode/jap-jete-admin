from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, BigInteger, DateTime
import os
import uuid
import datetime, time

Base = declarative_base()
#postgresql://user:password@host/database
engine = create_engine(os.environ.get('PG_CONNSTR'))

Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

#create database structure
def dbInit():
    Base.metadata.create_all(bind=engine)


class User(Base):
    __tablename__ = 'users'

    user_id = Column(BigInteger, primary_key=True)
    fb_token = Column(String(255))
    session_token = Column(String(255))
    session_token_expires_at = Column(DateTime)
    gcm_id = Column(String(512))
    blood_type = Column(String(3))

    def __init__(self, user_id, fb_token='', gcm_id='', blood_type=''):
        self.user_id = user_id
        self.fb_token = fb_token
        self.gcm_id = gcm_id
        self.blood_type = blood_type
        self.session_token, self.session_token_expires_at = User.generate_session_token()

    def  __repr__(self):
        return "<User %r %r >" % (self.id, self.username)

    @classmethod
    def generate_session_token(cls):
        token = ''.join([uuid.uuid4().hex for x in range(4)])
        expires_at = datetime.datetime.now() + datetime.timedelta(days=10)
        return (token, expires_at)
