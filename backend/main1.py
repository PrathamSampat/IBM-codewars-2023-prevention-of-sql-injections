import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status, Form
from typing import List
from sqlalchemy.engine.cursor import LegacyCursorResult
from pydantic.schema import datetime
from sqlalchemy import Column, DECIMAL, DateTime, ForeignKey, Integer, LargeBinary, String, TIMESTAMP, Table, text
from sqlalchemy.orm import relationship, Session
from sqlalchemy.dialects.mysql import BIT

from database import Base, engine, SessionLocal, conn
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
metadata = Base.metadata

origins = [
    'http://localhost:3000'
]

# ServiceMaster table class
class Users(Base):
    __tablename__ = 'users'

    username = Column(String(20), primary_key=True)
    password = Column(String(100), nullable=False, unique=True)

# ServiceMaster table schema
class UsersSchema(BaseModel):
    username : str
    password : str




def get_db():
    # db = SessionLocal()
    conn = engine.connect()
    try:
        yield conn
    finally:
        conn.close()

app = FastAPI()
@app.get("/employees", response_model=List[UsersSchema])
async def read_data(conn:LegacyCursorResult=Depends(get_db)):
    employee_table_data = list(conn.execute("select * from Employee;"))
    print("temp", employee_table_data)
    username = [i[3] for i in employee_table_data]
    print(username)
    password = [i[4] for i in employee_table_data]
    print(password)
    if not ( username ):
        raise HTTPException(
            status_code=404,
            detail="user not found",
        )
    return employee_table_data


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['GET'],
    allow_headers=['Content-Type','application/xml']
)

if __name__ == "__main__":
    uvicorn.run(app)