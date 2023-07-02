from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import text
import pymysql
pymysql.install_as_MySQLdb()
SQLALCHEMY_DB_URL = "mysql://root:mumbaicity@localhost:3306/codewars"

engine = create_engine(SQLALCHEMY_DB_URL)
SessionLocal = sessionmaker(autocommit=False, bind=engine)
Base = declarative_base()
conn = engine.connect()
temp = conn.execute(text("select * from users;"))
# print(list(temp))
