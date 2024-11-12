from fastapi import FastAPI, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import sessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# CORS configuration
origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Database Dependency
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ensure database tables are created
models.Base.metadata.create_all(bind=engine)

# Pydantic models
class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

class TransactionResponse(TransactionBase):
    id: int

    class Config:
        orm_mode = True  # Required to convert SQLAlchemy model to Pydantic schema

# Root Endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI application!"}

# API Endpoints
@app.post("/transactions/", response_model=TransactionResponse)
async def create_transaction(transaction: TransactionBase, db: Session = Depends(get_db)):  # Corrected type hint
    try:
        db_transaction = models.Transaction(**transaction.dict())
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transaction creation failed: {str(e)}")

@app.get("/transactions/", response_model=List[TransactionResponse])
async def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):  # Corrected type hint
    try:
        transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
        return transactions
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching transactions: {str(e)}")
