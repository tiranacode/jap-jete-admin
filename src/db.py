from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, String, BigInteger, DateTime, Integer, SmallInteger, ForeignKey, Text
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

def seed():
    session = Session()

    session.query(CampainBlood).delete()
    session.query(Campain).delete()
    session.query(UserHistory).delete()
    session.query(User).delete()
    session.query(Hospital).delete()

    #user history
    bexhet = User(1235, 'Behgjet', 'Pacolli', 'fb-token-lol', 'gcm-id-haha', 'A+')
    qsut = Hospital('QSUT', 'qsut@email.com', 'qsut', 'password', 'ja-ja-jakujam', 'contact')
    session.add(bexhet)
    session.add(qsut)
    session.commit()

    first_donation = UserHistory(bexhet.user_id, qsut._id, 20)
    first_donation.donation_date = datetime.datetime.now() - datetime.timedelta(days=10)
    second_donation = UserHistory(bexhet.user_id, qsut._id, 50)
    second_donation.donation_date = datetime.datetime.now() - datetime.timedelta(days=50)
    session.add(first_donation)
    session.add(second_donation)
    session.commit()

    # campains
    campain = Campain(qsut._id,
                        'NameOfCampain',
                        'This is a Campain message',
                        datetime.datetime.now(),
                        datetime.datetime.now() + datetime.timedelta(days=50))
    session.add(campain)
    session.commit()
    campain_blood = CampainBlood(campain._id, 'A+')
    session.add(campain_blood)
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


class UserHistory(Base):
    __tablename__ = "user_history"

    _id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'))
    hospital_id = Column(BigInteger, ForeignKey('hospitals._id'))
    amount = Column(Integer) # how much blood was donated
    donation_date = Column(DateTime) # when did the donation took place

    user = relationship('User', foreign_keys=[user_id])
    hospital = relationship('Hospital', foreign_keys=[hospital_id])

    def __init__(self, user_id, hospital_id, amount):
        self.user_id = user_id
        self.hospital_id = hospital_id
        self.amount = amount
        self.donation_date = datetime.datetime.now()

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

class Campain(Base):
    __tablename__ = 'campains'

    _id = Column(BigInteger, primary_key=True)
    hospital_id = Column(BigInteger, ForeignKey('hospitals._id'))
    name = Column(String(255))
    message = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)

    hospital = relationship('Hospital', foreign_keys=[hospital_id])

    def __init__(self, hospital_id, name, message, start_date, end_date):
        self.hospital_id = hospital_id
        self.name = name
        self.message = message
        self.start_date = start_date
        self.end_date = end_date

class CampainBlood(Base):
    __tablename__ = "campains_bloodtypes"

    _id = Column(BigInteger, primary_key=True)
    campain_id = Column(BigInteger, ForeignKey('campains._id'))
    blood_type = Column(String(3))

    campain = relationship('Campain', foreign_keys=[campain_id])

    def __init__(self, campain_id, blood_type):
        self.campain_id = campain_id
        self.blood_type = blood_type
