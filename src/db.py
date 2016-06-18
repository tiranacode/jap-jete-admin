from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, String, BigInteger, DateTime, Integer, \
                        SmallInteger, ForeignKey, Text, Float, Boolean
import os
import uuid
import datetime, time
from sqlalchemy.orm import validates

import bcrypt

class ValidationError(Exception):
    pass

Base = declarative_base()
#postgresql://user:password@host/database
engine = create_engine(os.environ.get('PG_CONNSTR'), pool_recycle=60)

Base.metadata.bind = engine
Session = sessionmaker(bind=engine)

#create database structure
def Init():
    Base.metadata.create_all(bind=engine, checkfirst=True)

def seed():
    session = Session()

    qsut = session.query(Hospital).first()
    if qsut is not None and qsut.name is 'QSUT':
        return 0

    session.query(CampaignBlood).delete()
    session.query(Campaign).delete()
    session.query(Appointment).delete()
    session.query(User).delete()
    session.query(Hospital).delete()

    #user history
    bexhet = User(1235, 'Behgjet', 'Pacolli', 'fb-token-lol', 'gcm-id-haha', 'A+')
    password = bcrypt.hashpw("password", bcrypt.gensalt())
    qsut = Hospital('QSUT', 'qsut@email.com', 'qsut', password, 'ja-ja-jakujam', 'contact')
    qsut.login()
    session.add(bexhet)
    session.add(qsut)
    session.commit()

    first_donation = Appointment(bexhet.user_id, qsut._id, 20)
    first_donation.donation_time = datetime.datetime.now() - datetime.timedelta(days=10)
    second_donation = Appointment(bexhet.user_id, qsut._id, 50)
    second_donation.donation_time = datetime.datetime.now() - datetime.timedelta(days=50)
    session.add(first_donation)
    session.add(second_donation)
    session.commit()

    # campaigns
    campaign = Campaign(qsut._id,
                        'NameOfCampaign',
                        'This is a Campaign message',
                        datetime.datetime.now(),
                        datetime.datetime.now() + datetime.timedelta(days=50))
    session.add(campaign)
    session.commit()
    campaign_blood = CampaignBlood(campaign._id, 'A+')
    session.add(campaign_blood)
    session.commit()
    session.close()


class User(Base):
    __tablename__ = 'users'

    user_id = Column(BigInteger, primary_key=True)
    first_name = Column(String(30))
    last_name = Column(String(30))
    fb_token = Column(String(255))
    session_token = Column(String(255))
    session_token_expires_at = Column(DateTime)
    gcm_id = Column(String(512))
    blood_type = Column(String(3))
    blood_typeF = Column(SmallInteger, ForeignKey('blood_types._id'))
    email = Column(String(128))
    phone_number = Column(String(24))
    address = Column(String(128))

    def __init__(self, user_id, first_name, last_name, fb_token='', gcm_id='', blood_type=''):
        self.user_id = user_id
        self.first_name = first_name
        self.last_name = last_name
        self.fb_token = fb_token
        self.gcm_id = gcm_id
        self.blood_type = blood_type
        self.session_token, self.session_token_expires_at = User.generate_session_token()

    @classmethod
    def generate_session_token(cls):
        token = ''.join([uuid.uuid4().hex for x in range(4)])
        expires_at = datetime.datetime.now() + datetime.timedelta(days=10)
        return (token, expires_at)


class Appointment(Base):
    __tablename__ = "user_history"

    _id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'))
    hospital_id = Column(BigInteger, ForeignKey('hospitals._id'))
    amount = Column(Integer) # how much blood was donated
    donation_time = Column(DateTime) # when did the donation took place
    status = Column(String(10)) # 'pending', 'approved', 'cancelled', 'done',
                                # 'pending_input'
    user = relationship('User', foreign_keys=[user_id])
    hospital = relationship('Hospital', foreign_keys=[hospital_id])

    def __init__(self, user_id, hospital_id, amount):
        self.user_id = user_id
        self.hospital_id = hospital_id
        self.amount = amount
        self.donation_time = datetime.datetime.now()

    @validates('status')
    def validate_status(self, key, status):
        valid_status_set = {
            'pending',
            'approved',
            'cancelled',
            'done',
            'pending_input'
        }
        status = status.lower()
        if status in valid_status_set:
            return status
        else:
            raise ValidationError('%s is not a valid status' % status)

    def get_status(self):
        if self.status == 'pending' and datetime.datetime.now() > self.donation_time:
            return 'pending_input' # A Hospital Admin should set this to
                                   # "done" or "cancelled", depending on whether
                                   # the donor showed up.
        else:
            return self.status

class BloodType(Base):
    __tablename__ = "blood_types"

    _id = Column(SmallInteger, primary_key=True)
    type = Column(String(3), unique=True)

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
    session_token = Column(String(255))
    latitude = Column(Float)
    longitude = Column(Float)

    def __init__(self, name, email, username, password, address, contact, latitude=0.0, longitude=0.0):
        self.name = name
        self.email = email
        self.username = username
        self.password = password
        self.address = address
        self.contact = contact
        self.latitude = latitude
        self.longitude = longitude

    def login(self):
        self.session_token = ''.join([uuid.uuid4().hex for x in range(4)])

    def logout(self):
        self.session_token = ''

class Campaign(Base):
    __tablename__ = 'campaigns'

    _id = Column(BigInteger, primary_key=True)
    hospital_id = Column(BigInteger, ForeignKey('hospitals._id'))
    name = Column(String(255))
    message = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    active = Column(Boolean)

    hospital = relationship('Hospital', foreign_keys=[hospital_id])

    def __init__(self, hospital_id, name, message, start_date, end_date):
        self.hospital_id = hospital_id
        self.name = name
        self.message = message
        self.start_date = start_date
        self.end_date = end_date
        self.active = True

    def deactivate(self):
        self.active = False

    def activate(self):
        self.active = True

class CampaignBlood(Base):
    __tablename__ = "campaigns_bloodtypes"

    _id = Column(BigInteger, primary_key=True)
    campaign_id = Column(BigInteger, ForeignKey('campaigns._id'))
    blood_type = Column(String(3))

    campaign = relationship('Campaign', foreign_keys=[campaign_id], backref='requirement')

    def __init__(self, campaign_id, blood_type):
        self.campaign_id = campaign_id
        self.blood_type = blood_type
