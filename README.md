# EcoLogic: First-Gen College Student Navigator (Scholar Mate)

**Scholar Mate** is a digital matching dashboard, document locker, and application workflow tracker designed specifically to support **first-generation college students in India**. It combines scholarship discovery with a supportive, jargon-free assistant layer to make navigating higher education funding simpler, accessible, and completely stress-free.

---

## 👥 Team Details
*   **Team Name:** EcoLogic
*   **Team Size:** 4 Members
*   **Mentor Guide:** Prof. Swetha P M
*   **Event:** Hackathon Pitch Presentation

---

## ⚠️ Problem Statement
Over 60% of low-income and rural students in India drop out after high school because they cannot afford college. While billions of rupees are available in central, state, and private corporate scholarships, first-generation college students struggle to apply because:
1.  **Administrative Jargon:** Portals use complex terms like *Bonafide Certificates, Domicile Certificates, Caste seeding, and Aadhaar-linkage*.
2.  **No Parental Guidance:** Parents, often working as daily wage earners, cannot guide them through complex online forms.
3.  **Fragmented Portals:** Scholarships are spread across hundreds of different government and NGO website tabs.
4.  **Complex Document Limits:** Upload portals demand PDFs strictly under 500KB, which is hard to compress on low-end mobile phones.

---

## 🛠️ Technology Stack
*   **Frontend Client:** React.js + Vite (built with premium glassmorphism, responsive grids, and clean visual tokens)
*   **Styling:** Vanilla CSS (Tailored color palettes, dark modes, and slide transitions)
*   **Backend Server:** FastAPI (Python 3.13)
*   **Database:** SQLite (zero-setup relational database, runs out-of-the-box using the SQL standard)
*   **ORM Layer:** SQLAlchemy (Python Object-Relational Mapper)
*   **OCR Parsing:** PyMuPDF + Tesseract/PIL integration (simulated regex scanner fallbacks)
*   **Icons:** Lucide React

---

## 🌟 Key MVP Features Delivered (Our 10 Core Focus Areas)

1.  **Smart matching Eligibility Engine:** Collects academic GPA, caste category, domicile state, and income, and compares them against scholarship criteria to give an instant match percentage.
2.  **Plain-Language Jargon Buster:** Decodes complex bureaucratic jargon on hover, explaining terms like *Tehsildar Income Certificate* or *Bonafide Request* in simple English, Hindi, and Kannada.
3.  **Kanban Tracker workflow:** Breaks down scholarship deadlines and guidelines into checklists, moving applications through Saved, In Progress, and Submitted columns.
4.  **EcoVault Document Locker:** A secure document manager that adapts to the student's reservation category, offering uploads, read-only reviewer sharing links, and bulk ZIP bundle compilations.
5.  **Auto-Document Letter Generator:** Formats college request sheets (e.g. Bonafide Certificates, Income Affidavits) and saves them directly to the locker vault with one click.
6.  **In-App Autofill Browser Simulator:** Opens a simulated NSP (National Scholarship Portal) with a floating AI Assistant sidebar that guides students and fills out fields automatically.
7.  **AI OCR Document Extractor:** Scans uploaded marksheets or income certificates in the vault, auto-extracts GPA or income, and updates their profile and matches instantly.
8.  **Multi-Language Translation Engine:** Translates the entire app shell and navigation menus to English, हिन्दी (Hindi), and ಕನ್ನಡ (Kannada) for accessibility.
9.  **Meta WhatsApp Business Alert Log:** A notification console showcasing automated template message payloads sent to the student's mobile number on submission.
10. **Interactive Mentor Chat:** Connects students with Sarah (AI College Counselor) who helps draft recommendation letters, essay prompts, and guides application steps.

---

## ⚡ Setup & Run Instructions

To run the full-stack EcoLogic Scholar Mate application locally:

### 1. Backend Server Setup (FastAPI + SQLite)
1.  Open your terminal, navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the database seeder to populate SQLite (`scholarships.db`):
    ```bash
    python seed.py
    ```
4.  Start the FastAPI server on port 8080:
    ```bash
    python -m uvicorn main:app --reload --port 8080
    ```
    *   *Interactive Swagger Documentation will be active at: [http://localhost:8080/docs](http://localhost:8080/docs)*

### 2. Frontend client Setup (React + Vite)
1.  Open a second terminal inside the root workspace folder.
2.  Install the Node package dependencies:
    ```bash
    npm install
    ```
3.  Launch the React development server:
    ```bash
    npm run dev
    ```
4.  Access the application at: **[http://localhost:5173/](http://localhost:5173/)**
