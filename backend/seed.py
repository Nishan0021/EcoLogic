import datetime
from sqlalchemy.orm import Session
import models

def seed_scholarships(db: Session):
    # Check if scholarships already seeded
    count = db.query(models.Scholarship).count()
    if count > 0:
        print("[Database] Scholarships already seeded.")
        return

    print("[Database] Seeding initial scholarship listings...")

    scholarships_data = [
        {
            "id": "nsp-post-matric-sc",
            "title": "NSP Post-Matric Scholarship Scheme for SC Students",
            "provider": "Ministry of Social Justice & Empowerment, Govt of India",
            "description": "The Post-Matric Scholarship for Scheduled Caste students is designed to reduce student dropout rates after Class 10 by covering full compulsory course fees, book allowances, and monthly stipends.",
            "amount": 12000,
            "deadline": datetime.date(2026, 10, 31),
            "eligibility_criteria": {
                "gpaMin": 5.0,
                "incomeMax": 250000,
                "firstGenRequired": False,
                "stateResidency": None,
                "academicLevel": ["Class 12", "Undergrad", "Postgraduate", "Diploma"],
                "casteRequired": ["SC"],
                "genderRequired": None
            },
            "required_documents": [
                {
                    "id": "caste_cert",
                    "name": "Caste Certificate (SC)",
                    "jargonTerm": "Caste Certificate",
                    "plainExplanation": "An official government document proving your caste category. It must be issued by a competent authority (Tehsildar/Sub-Divisional Officer).",
                    "mentorTip": "Make sure your Caste Certificate is digitally verified and matches the spelling on your Aadhaar card exactly!"
                },
                {
                    "id": "income_cert",
                    "name": "Income Certificate (< ₹2.5 Lakhs)",
                    "jargonTerm": "Tehsildar Income Certificate",
                    "plainExplanation": "A certificate proving your family's annual income is below ₹2.5 Lakhs, issued by a Tehsildar or Revenue Officer.",
                    "mentorTip": "Apply for this early at your local Aaple Sarkar or Seva Kendra portal. A salary slip or self-declaration is NOT accepted for government schemes!"
                },
                {
                    "id": "bonafide_cert",
                    "name": "College Bonafide Student Certificate",
                    "jargonTerm": "Bonafide Student Certificate",
                    "plainExplanation": "A certificate stamped and signed by your college Principal or Registrar confirming that you are enrolled for the current academic year.",
                    "mentorTip": "Go to your college administration office, show your fee receipt, and request a Bonafide Certificate specifically for NSP scholarship application."
                },
                {
                    "id": "aadhaar_seeding",
                    "name": "Aadhaar Card Bank Account Seeding",
                    "jargonTerm": "Aadhaar Seeding",
                    "plainExplanation": "The process of linking your 12-digit Aadhaar number with your bank account to receive direct scholarship money transfer.",
                    "mentorTip": "Visit your bank branch with an Aadhaar copy and submit the 'Aadhaar Seeding Consent Form'. You can verify the status on UIDAI portal."
                }
            ],
            "application_link": "https://scholarships.gov.in",
            "tags": ["first_gen", "central", "need_based"],
            "is_verified": True
        },
        {
            "id": "pragati-girls",
            "title": "Pragati Scholarship Scheme for Girl Students",
            "provider": "AICTE (All India Council for Technical Education)",
            "description": "Pragati is a key government fellowship providing ₹50,000 per annum to young women. The funds can be utilized to cover college tuition fees, purchasing computers, laptops, books, or paying hostel accommodation charges.",
            "amount": 50000,
            "deadline": datetime.date(2026, 11, 30),
            "eligibility_criteria": {
                "gpaMin": 6.0,
                "incomeMax": 800000,
                "firstGenRequired": False,
                "stateResidency": None,
                "academicLevel": ["Undergrad", "Diploma"],
                "casteRequired": None,
                "genderRequired": "Female"
            },
            "required_documents": [
                {
                    "id": "admission_proof",
                    "name": "Technical Course Admission Letter",
                    "jargonTerm": "Admission Letter",
                    "plainExplanation": "Proof of your admission through the centralized allotment process (e.g. CAP / JEE counseling allotment).",
                    "mentorTip": "Upload the official allotment letter issued by the state cell, showing your roll number and the college name."
                },
                {
                    "id": "income_cert",
                    "name": "Income Certificate (< ₹8 Lakhs)",
                    "jargonTerm": "Tehsildar Income Certificate",
                    "plainExplanation": "Government issued income certificate showing family earnings under ₹8 Lakhs per year.",
                    "mentorTip": "This certificate must be valid for the current financial year. Ensure it is signed digitally by a Tehsildar or above."
                },
                {
                    "id": "bonafide_cert",
                    "name": "Bonafide Student Certificate",
                    "jargonTerm": "Bonafide Student Certificate",
                    "plainExplanation": "Official document issued by your college proving you are currently enrolled in a technical branch.",
                    "mentorTip": "Ask the college clerk to use the AICTE-prescribed format for the Pragati Scholarship Bonafide."
                }
            ],
            "application_link": "https://scholarships.gov.in",
            "tags": ["merit_based", "technical", "central"],
            "is_verified": True
        },
        {
            "id": "hdfc-badhte-kadam",
            "title": "HDFC Bank Badhte Kadam Scholarship",
            "provider": "HDFC Bank Initiative",
            "description": "HDFC Badhte Kadam scholarship supports students who are going through financial distress (e.g. loss of earning parent, medical crisis). First-generation college students are highly preferred during shortlisting.",
            "amount": 30000,
            "deadline": datetime.date(2026, 8, 30),
            "eligibility_criteria": {
                "gpaMin": 6.0,
                "incomeMax": 600000,
                "firstGenRequired": True,
                "stateResidency": None,
                "academicLevel": ["Class 12", "Undergrad", "Diploma"],
                "casteRequired": None,
                "genderRequired": None
            },
            "required_documents": [
                {
                    "id": "marksheet",
                    "name": "Class 10/12 Marksheet",
                    "jargonTerm": "Previous Marksheet",
                    "plainExplanation": "Your report card showing grades/marks from your previous year of study.",
                    "mentorTip": "Scan and upload the original marksheet. Do not upload pixelated screenshots of online result portals."
                },
                {
                    "id": "income_proof",
                    "name": "Income Certificate or ITR",
                    "jargonTerm": "Income Proof",
                    "plainExplanation": "Documents indicating family income, such as a salary slip, Tehsildar certificate, or Income Tax Return (ITR).",
                    "mentorTip": "If your parents are farmers or daily wage workers, get a certified Income Certificate from the local Panchayat or Tehsildar."
                },
                {
                    "id": "fee_receipt",
                    "name": "Current College Fee Receipt",
                    "jargonTerm": "Fee Receipt",
                    "plainExplanation": "A paid receipt showing you have deposited admission fees in your current school/college.",
                    "mentorTip": "Make sure the receipt clearly shows your name, roll number, course, and the amount paid."
                }
            ],
            "application_link": "https://www.buddy4study.com/page/hdfc-bank-scholarship",
            "tags": ["first_gen", "need_based", "private"],
            "is_verified": True
        },
        {
            "id": "kotak-kanya",
            "title": "Kotak Kanya Scholarship",
            "provider": "Kotak Education Foundation",
            "description": "The Kotak Kanya Scholarship funds professional degree courses like engineering, medicine, law, design, or architecture. It provides ₹75,000 annually until graduation, covering tuition, books, and laptops.",
            "amount": 75000,
            "deadline": datetime.date(2026, 9, 15),
            "eligibility_criteria": {
                "gpaMin": 8.5,
                "incomeMax": 600000,
                "firstGenRequired": False,
                "stateResidency": ["MH", "KA", "DL", "TN"],
                "academicLevel": ["Undergrad"],
                "casteRequired": None,
                "genderRequired": "Female"
            },
            "required_documents": [
                {
                    "id": "marksheet_12",
                    "name": "Class 12 Board Marksheet (>= 85%)",
                    "jargonTerm": "Previous Marksheet",
                    "plainExplanation": "Your Class 12 board scorecard showing at least 85% marks.",
                    "mentorTip": "Ensure the scan is clear. High merit is a strict checklist item for Kotak shortlisting."
                },
                {
                    "id": "income_cert",
                    "name": "Tehsildar Income Certificate",
                    "jargonTerm": "Tehsildar Income Certificate",
                    "plainExplanation": "Official document showing family income below ₹6 Lakhs.",
                    "mentorTip": "Must be signed digitally. Keep the original document handy for physical verification steps."
                },
                {
                    "id": "recom",
                    "name": "Two Teacher Recommendation Letters",
                    "jargonTerm": "Letter of Recommendation (LoR)",
                    "plainExplanation": "Letters from your junior college or high school teachers explaining your academic dedication and character.",
                    "mentorTip": "Ask your Class 12 English, Math, or Science teachers. Print them on school letterhead with their signature and stamp!"
                }
            ],
            "application_link": "https://kotakeducation.org/kotak-kanya-scholarship/",
            "tags": ["merit_based", "private", "state"],
            "is_verified": True
        },
        {
            "id": "tata-pankh",
            "title": "Tata Capital Pankh Scholarship",
            "provider": "Tata Capital Ltd.",
            "description": "The Tata Capital Pankh Scholarship aims to support the educational expenses of students from lower-income backgrounds. It covers up to 80% of their college tuition fees.",
            "amount": 50000,
            "deadline": datetime.date(2026, 8, 15),
            "eligibility_criteria": {
                "gpaMin": 6.0,
                "incomeMax": 400000,
                "firstGenRequired": True,
                "stateResidency": None,
                "academicLevel": ["Undergrad", "Diploma"],
                "casteRequired": None,
                "genderRequired": None
            },
            "required_documents": [
                {
                    "id": "marksheet",
                    "name": "Previous Class Marksheet (>= 60%)",
                    "jargonTerm": "Previous Marksheet",
                    "plainExplanation": "Marksheet showing 60% or higher marks in the previous exam.",
                    "mentorTip": "Keep a digital copy of both Class 10 and 12 marksheets as they are commonly matched."
                },
                {
                    "id": "income_cert",
                    "name": "Income Certificate",
                    "jargonTerm": "Tehsildar Income Certificate",
                    "plainExplanation": "Income certificate proving family earnings under ₹4 Lakhs.",
                    "mentorTip": "Ensure it is issued by an authorized state revenue office."
                },
                {
                    "id": "bonafide_cert",
                    "name": "Bonafide Certificate",
                    "jargonTerm": "Bonafide Student Certificate",
                    "plainExplanation": "A certificate proving you are a full-time student in college.",
                    "mentorTip": "Get this from the college administrative office. It should have the official college seal."
                }
            ],
            "application_link": "https://www.buddy4study.com/page/tata-capital-pankh-scholarship",
            "tags": ["first_gen", "need_based", "private"],
            "is_verified": True
        },
        {
            "id": "loreal-science",
            "title": "L'Oréal India For Young Women In Science Scholarship",
            "provider": "L'Oréal India Pvt. Ltd.",
            "description": "L'Oréal India provides this scholarship to young girls who want to study pure sciences, engineering, or medical sciences. The award provides ₹85,000 per year, covering total tuition and lab fees.",
            "amount": 85000,
            "deadline": datetime.date(2026, 10, 15),
            "eligibility_criteria": {
                "gpaMin": 8.5,
                "incomeMax": 600000,
                "firstGenRequired": False,
                "stateResidency": None,
                "academicLevel": ["Undergrad"],
                "casteRequired": None,
                "genderRequired": "Female"
            },
            "required_documents": [
                {
                    "id": "marksheet_12",
                    "name": "Class 12 Science Marksheet (>= 85%)",
                    "jargonTerm": "Previous Marksheet",
                    "plainExplanation": "Marksheet showing 85%+ aggregate in Physics, Chemistry, and Math/Biology.",
                    "mentorTip": "Must be a regular science stream board result. Vocational/Correspondence classes are not eligible."
                },
                {
                    "id": "domicile",
                    "name": "Domicile Certificate of India",
                    "jargonTerm": "Domicile Certificate",
                    "plainExplanation": "Government certificate verifying your residency status in India.",
                    "mentorTip": "Request a Domicile Certificate from your local Tehsil office or state portal. It serves as permanent proof of state residence."
                },
                {
                    "id": "admission_proof",
                    "name": "College Admission Letter & Fee Receipt",
                    "jargonTerm": "Admission Letter",
                    "plainExplanation": "Proof of enrollment in a pure science or applied science degree program.",
                    "mentorTip": "Ensure it shows your course duration and active student credentials."
                }
            ],
            "application_link": "https://www.buddy4study.com/page/loreal-india-for-young-women-in-science-scholarship",
            "tags": ["merit_based", "private", "gender_exclusive"],
            "is_verified": False
        }
    ]

    for item in scholarships_data:
        scholarship = models.Scholarship(**item)
        db.add(scholarship)
    
    db.commit()
    print(f"[Database] Successfully seeded {len(scholarships_data)} scholarships.")
