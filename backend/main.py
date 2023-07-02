import time
from typing import List

import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, String
from sqlalchemy.engine.cursor import LegacyCursorResult
from starlette.middleware.cors import CORSMiddleware
from ratelimiter import RateLimiter
from database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)
metadata = Base.metadata

origins = [
    'http://localhost:3000'
]

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


@app.get("/")
def read_root():
    return {"Hello": "World"}

# @RateLimiter(max_calls=5, period=1)
# def timeout(until, duration=5):
#     t=int(round(until-time.time()))
#     print(f"timeout:{duration}".format(duration))

@app.get("/users", response_model=List[UsersSchema])
async def read_data(conn:LegacyCursorResult=Depends(get_db), skip: int = 0, limit: int = 10):
    user_table_data = list(conn.execute("select * from users;"))
    print("temp", user_table_data)
    username = [i[0] for i in user_table_data]
    print(username)
    password = [i[1] for i in user_table_data]
    print(password)
    if not ( username ):
        raise HTTPException(
            status_code=404,
            detail="user not found",
        )
    return user_table_data[skip : skip + limit]


@app.post("/register")
async def register(user:UsersSchema, conn:LegacyCursorResult=Depends(get_db))->UsersSchema:
    sql = f"insert into users values('{user.username}', '{user.password}');"
    conn.execute(sql)
    return user

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


if __name__ == "__main__":
    uvicorn.run(app)
