from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, BigInteger, DateTime, Integer, SmallInteger, ForeignKey
import os
import uuid
import datetime, time

Base = declarative_base()
#postgresql://user:password@host/database
engine = create_engine(os.environ.get('PG_CONNSTR'), pool_recycle=60)

Base.metadata.bind = engine
Session = sessionmaker(bind=engine)

#create database structure
def Init():
    Base.metadata.create_all(bind=engine, checkfirst=True)

class User(Base):
    __tablename__ = 'users'

    user_id = Column(BigInteger, primary_key=True)
    fb_token = Column(String(255))
    session_token = Column(String(255))
    session_token_expires_at = Column(DateTime)
    gcm_id = Column(String(512))
    blood_type = Column(String(2))
    blood_typeF = Column(SmallInteger, ForeignKey('blood_types._id'))
    email = Column(String(128))
    phone_number = Column(String(24))
    address = Column(String(128))


    def __init__(self, user_id, fb_token='', gcm_id='', blood_type=''):
        self.user_id = user_id
        self.fb_token = fb_token
        self.gcm_id = gcm_id
        self.blood_type = blood_type
        self.session_token, self.session_token_expires_at = User.generate_session_token()

    @classmethod
    def generate_session_token(cls):
        token = ''.join([uuid.uuid4().hex for x in range(4)])
        expires_at = datetime.datetime.now() + datetime.timedelta(days=10)
        return (token, expires_at)



class BloodType(Base):
    __tablename__ = "blood_types"

    _id = Column(SmallInteger, primary_key=True)
    type = Column(String(2), unique=True)

    def __init__(self, type):
        self.type = type


class Hospital(Base):
    __tablename__ = 'hospitals'

    _id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255))
    username = Column(String(255), unique=True)
    password = Column(String(255))
    address = Column(String(255))
    contact = Column(String(255))

    def __init__(self, name, email, username, password, address, contact):
        self.name = name
        self.email = email
        self.username = username
        self.password = password
        self.address = address
        self.contact = contact
