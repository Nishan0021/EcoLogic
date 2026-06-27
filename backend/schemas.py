from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from decimal import Decimal

# --- Student Schemas ---
class StudentBase(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_first_gen: Optional[bool] = True
    state: Optional[str] = None
    course: Optional[str] = None
    year_of_study: Optional[int] = None
    annual_family_income: Optional[Decimal] = None
    category: Optional[str] = None
    disability_status: Optional[bool] = False
    gender: Optional[str] = None
    preferred_language: Optional[str] = "en"
    score: Optional[float] = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Scholarship Schemas ---
class ScholarshipResponse(BaseModel):
    id: str
    title: str
    provider: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    deadline: Optional[date] = None
    eligibility_criteria: Optional[Dict[str, Any]] = None
    required_documents: Optional[List[Dict[str, Any]]] = None
    application_link: Optional[str] = None
    tags: Optional[List[str]] = None
    is_verified: Optional[bool] = False
    created_at: datetime

    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    scholarship_id: str
    status: Optional[str] = "saved"
    checklist: Optional[Dict[str, bool]] = Field(default_factory=dict)
    essay: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    checklist: Optional[Dict[str, bool]] = None
    essay: Optional[str] = None
    progress_percent: Optional[int] = None

class ApplicationResponse(BaseModel):
    id: str
    student_id: str
    scholarship_id: str
    status: str
    progress_percent: int
    checklist: Dict[str, bool]
    essay: Optional[str] = None
    applied_at: Optional[datetime] = None
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Document Schemas ---
class DocumentResponse(BaseModel):
    id: str
    student_id: str
    doc_type: str
    file_url: str
    expiry_date: Optional[date] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True

class DocumentUploadResponse(BaseModel):
    document: DocumentResponse
    extracted_income: Optional[float] = None
    extracted_score: Optional[float] = None
    message: str

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: str
    student_id: str
    scholarship_id: Optional[str] = None
    channel: str
    sent_at: datetime
    message: str

    class Config:
        from_attributes = True

# --- Chatbot Schemas ---
class ChatQuery(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
