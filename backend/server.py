from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
import jwt
from datetime import datetime, timezone, timedelta
import bcrypt
from bson import ObjectId
import asyncio
import resend

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
resend.api_key = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Literal["admin", "employer", "employee"]
    company_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class EmployerEnquiryRequest(BaseModel):
    company_name: str
    contact_person_name: str
    work_email: EmailStr
    phone_number: str
    city: str
    industry: str
    number_of_employees: int
    payroll_cycle: str
    payroll_software: Optional[str] = None
    message: Optional[str] = None

class ApproveEmployerRequest(BaseModel):
    enquiry_id: str
    employer_email: str
    employer_password: str

class AddEmployeeRequest(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    monthly_salary: float
    advance_limit_percentage: float = 30.0
    department: Optional[str] = None

class AdvanceRequestCreate(BaseModel):
    amount: float
    reason: Optional[str] = None
    repayment_date: str

class ApproveRejectRequest(BaseModel):
    request_id: str
    action: Literal["approve", "reject"]
    rejection_reason: Optional[str] = None

@api_router.post("/auth/register")
async def register(request: RegisterRequest, response: Response):
    email_lower = request.email.lower()
    existing = await db.users.find_one({"email": email_lower})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if request.role == "employee" and not request.company_id:
        raise HTTPException(status_code=400, detail="Employees must be linked to a company")
    
    user_doc = {
        "email": email_lower,
        "password_hash": hash_password(request.password),
        "name": request.name,
        "role": request.role,
        "company_id": request.company_id,
        "created_at": datetime.now(timezone.utc),
        "status": "active" if request.role == "employee" else "pending"
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email_lower)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {"id": user_id, "email": email_lower, "name": request.name, "role": request.role}

@api_router.post("/auth/login")
async def login(request: LoginRequest, response: Response):
    email_lower = request.email.lower()
    user = await db.users.find_one({"email": email_lower})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email_lower)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {"id": user_id, "email": email_lower, "name": user["name"], "role": user["role"], "company_id": user.get("company_id"), "status": user.get("status", "active")}

@api_router.post("/auth/logout")
async def logout(response: Response, current_user: dict = Depends(get_current_user)):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@api_router.post("/enquiry/submit")
async def submit_enquiry(request: EmployerEnquiryRequest):
    enquiry_doc = {
        **request.model_dump(),
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.enquiries.insert_one(enquiry_doc)
    
    try:
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1D4ED8;">Thank You for Your Enquiry</h2>
            <p>Dear {request.contact_person_name},</p>
            <p>We have received your enquiry from <strong>{request.company_name}</strong>.</p>
            <p>Our team will review your request and get back to you within 24-48 hours.</p>
            <p style="margin-top: 30px;">Best regards,<br>Mob Pae Team</p>
        </div>
        """
        params = {
            "from": SENDER_EMAIL,
            "to": [request.work_email],
            "subject": "Mob Pae - Enquiry Received",
            "html": html_content
        }
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:
        logging.error(f"Failed to send confirmation email: {str(e)}")
    
    return {"message": "Enquiry submitted successfully", "enquiry_id": str(result.inserted_id)}

@api_router.get("/admin/enquiries")
async def get_enquiries(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    enquiries = await db.enquiries.find({}, {"_id": 0}).to_list(1000)
    return enquiries

@api_router.post("/admin/approve-employer")
async def approve_employer(request: ApproveEmployerRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    enquiry = await db.enquiries.find_one({"work_email": request.enquiry_id}) or await db.enquiries.find_one({})
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    employer_doc = {
        "email": request.employer_email.lower(),
        "password_hash": hash_password(request.employer_password),
        "name": enquiry.get("contact_person_name", "Employer"),
        "role": "employer",
        "company_name": enquiry.get("company_name"),
        "phone_number": enquiry.get("phone_number"),
        "city": enquiry.get("city"),
        "industry": enquiry.get("industry"),
        "created_at": datetime.now(timezone.utc),
        "status": "active"
    }
    
    result = await db.users.insert_one(employer_doc)
    company_id = str(result.inserted_id)
    
    await db.enquiries.update_one(
        {"_id": enquiry["_id"]},
        {"$set": {"status": "approved", "employer_id": company_id}}
    )
    
    try:
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1D4ED8;">Welcome to Mob Pae!</h2>
            <p>Dear {enquiry.get('contact_person_name', 'Employer')},</p>
            <p>Your employer account has been approved.</p>
            <p><strong>Login Credentials:</strong></p>
            <p>Email: {request.employer_email}<br>Password: {request.employer_password}</p>
            <p>Please login and change your password.</p>
            <p style="margin-top: 30px;">Best regards,<br>Mob Pae Team</p>
        </div>
        """
        params = {
            "from": SENDER_EMAIL,
            "to": [request.employer_email],
            "subject": "Mob Pae - Account Approved",
            "html": html_content
        }
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:
        logging.error(f"Failed to send approval email: {str(e)}")
    
    return {"message": "Employer approved and account created", "employer_id": company_id}

@api_router.get("/admin/users")
async def get_all_users(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

@api_router.get("/admin/advance-requests")
async def get_all_advance_requests(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    requests = await db.advance_requests.find({}, {"_id": 0}).to_list(1000)
    return requests

@api_router.post("/employer/add-employee")
async def add_employee(request: AddEmployeeRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employer":
        raise HTTPException(status_code=403, detail="Employer access required")
    
    email_lower = request.email.lower()
    existing = await db.users.find_one({"email": email_lower})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    employee_doc = {
        "email": email_lower,
        "password_hash": hash_password("employee123"),
        "name": request.name,
        "role": "employee",
        "company_id": current_user["id"],
        "phone_number": request.phone_number,
        "monthly_salary": request.monthly_salary,
        "advance_limit_percentage": request.advance_limit_percentage,
        "department": request.department,
        "created_at": datetime.now(timezone.utc),
        "status": "active"
    }
    
    result = await db.users.insert_one(employee_doc)
    return {"message": "Employee added successfully", "employee_id": str(result.inserted_id)}

@api_router.get("/employer/employees")
async def get_employees(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employer":
        raise HTTPException(status_code=403, detail="Employer access required")
    employees = await db.users.find({"company_id": current_user["id"], "role": "employee"}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return employees

@api_router.get("/employer/advance-requests")
async def get_employer_advance_requests(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employer":
        raise HTTPException(status_code=403, detail="Employer access required")
    requests = await db.advance_requests.find({"employer_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    return requests

@api_router.post("/employer/handle-request")
async def handle_advance_request(request: ApproveRejectRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employer":
        raise HTTPException(status_code=403, detail="Employer access required")
    
    advance_request = await db.advance_requests.find_one({"request_id": request.request_id})
    if not advance_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    update_data = {
        "status": "approved" if request.action == "approve" else "rejected",
        "updated_at": datetime.now(timezone.utc)
    }
    
    if request.action == "reject" and request.rejection_reason:
        update_data["rejection_reason"] = request.rejection_reason
    
    await db.advance_requests.update_one(
        {"request_id": request.request_id},
        {"$set": update_data}
    )
    
    return {"message": f"Request {request.action}d successfully"}

@api_router.post("/employee/request-advance")
async def request_advance(request: AdvanceRequestCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employee":
        raise HTTPException(status_code=403, detail="Employee access required")
    
    user = await db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    monthly_salary = user.get("monthly_salary", 0)
    advance_limit_percentage = user.get("advance_limit_percentage", 30)
    max_advance = (monthly_salary * advance_limit_percentage) / 100
    
    if request.amount > max_advance:
        raise HTTPException(status_code=400, detail=f"Amount exceeds limit of {max_advance}")
    
    pending_request = await db.advance_requests.find_one({"employee_email": current_user["email"], "status": "pending"})
    if pending_request:
        raise HTTPException(status_code=400, detail="You already have a pending request")
    
    import uuid
    request_doc = {
        "request_id": str(uuid.uuid4()),
        "employee_email": current_user["email"],
        "employee_name": current_user["name"],
        "employer_id": user.get("company_id"),
        "amount": request.amount,
        "reason": request.reason,
        "repayment_date": request.repayment_date,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.advance_requests.insert_one(request_doc)
    return {"message": "Advance request submitted successfully", "request_id": request_doc["request_id"]}

@api_router.get("/employee/my-requests")
async def get_my_requests(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employee":
        raise HTTPException(status_code=403, detail="Employee access required")
    requests = await db.advance_requests.find({"employee_email": current_user["email"]}, {"_id": 0}).to_list(1000)
    return requests

@api_router.get("/employee/dashboard-stats")
async def get_employee_stats(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "employee":
        raise HTTPException(status_code=403, detail="Employee access required")
    
    user = await db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    monthly_salary = user.get("monthly_salary", 0)
    advance_limit_percentage = user.get("advance_limit_percentage", 30)
    max_advance = (monthly_salary * advance_limit_percentage) / 100
    
    approved_requests = await db.advance_requests.find({"employee_email": current_user["email"], "status": "approved"}).to_list(1000)
    total_used = sum(req.get("amount", 0) for req in approved_requests)
    
    return {
        "monthly_salary": monthly_salary,
        "available_advance": max_advance - total_used,
        "max_advance": max_advance,
        "total_used": total_used,
        "usage_percentage": (total_used / max_advance * 100) if max_advance > 0 else 0
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get('FRONTEND_URL', 'http://localhost:3000')],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await db.users.create_index("email", unique=True)
    
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@mobpae.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
            "status": "active"
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
    
    Path("/app/memory").mkdir(exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"""# Test Credentials for Mob Pae

## Admin Account
- Email: {admin_email}
- Password: {admin_password}
- Role: admin

## Test Employee Account (created by employer)
- Email: employee@company.com
- Password: employee123
- Role: employee

## Auth Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
""")
    
    logger.info("Admin user seeded successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()