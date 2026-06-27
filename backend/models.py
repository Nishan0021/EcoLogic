import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Numeric, Date, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=True)
    phone = Column(String, nullable=True)
    is_first_gen = Column(Boolean, default=True)
    state = Column(String, nullable=True)
    course = Column(String, nullable=True)
    year_of_study = Column(Integer, nullable=True)
    annual_family_income = Column(Numeric, nullable=True)
    category = Column(String, nullable=True)  # General/OBC/SC/ST/EWS
    disability_status = Column(Boolean, default=False)
    gender = Column(String, nullable=True)
    preferred_language = Column(String, default="en")
    score = Column(Numeric, nullable=True)  # CGPA out of 10 or Percentage %
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="student", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="student", cascade="all, delete-orphan")

class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))  # primary key with auto UUID
    title = Column(String, nullable=False)
    provider = Column(String, nullable=True)
    description = Column(String, nullable=True)
    amount = Column(Numeric, nullable=True)
    deadline = Column(Date, nullable=True)
    eligibility_criteria = Column(JSON, nullable=True)  # {gpaMin, incomeMax, firstGenRequired, stateResidency[], academicLevel[], casteRequired[], genderRequired}
    required_documents = Column(JSON, nullable=True)  # List of objects containing id, name, jargonTerm, plainExplanation, mentorTip
    application_link = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)  # ['first_gen', 'merit', 'state']
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="scholarship", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="scholarship", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    scholarship_id = Column(String, ForeignKey("scholarships.id"), nullable=False)
    status = Column(String, default="saved")  # saved / In Progress / Submitted / won / rejected
    progress_percent = Column(Integer, default=0)
    checklist = Column(JSON, default=dict)  # {req_id: true/false}
    essay = Column(String, nullable=True)
    applied_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("Student", back_populates="applications")
    scholarship = relationship("Scholarship", back_populates="applications")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    doc_type = Column(String, nullable=False)  # income_cert / caste_cert / marksheet_12 / aadhaar / domicile etc.
    file_url = Column(String, nullable=False)
    expiry_date = Column(Date, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="documents")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    scholarship_id = Column(String, ForeignKey("scholarships.id"), nullable=True)
    channel = Column(String, nullable=False)  # email / sms / whatsapp / in-app
    sent_at = Column(DateTime, default=datetime.utcnow)
    message = Column(String, nullable=False)

    student = relationship("Student", back_populates="notifications")
    scholarship = relationship("Scholarship", back_populates="notifications")
