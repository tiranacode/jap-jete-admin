from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, String, Integer
import os


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
    
    id = Column(Integer, primary_key=True)
    username = Column(String(20))
    
    
    def __init__(self,username):
        self.username = username
    
    def  __repr__(self):
        return "<User %r %r >" % (self.id, self.username)
    

