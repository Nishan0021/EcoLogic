# Scholar Mate - First-Gen College Scholar Navigator (India)

**Scholar Mate** is a digital matching dashboard and application workflow tracker designed specifically for **first-generation college students in India**. It combines scholarship aggregation with a supportive, jargon-free support layer to make navigating higher education funding simpler and less stressful.

---

## Key Features

1. **Animated welcome Page**: An engaging, high-fidelity entry screen introducing the platform's features to first-generation scholars.
2. **Onboarding Profile**: Collects essential academic scores (CGPA or percentage), caste categories (SC/ST/OBC/EWS/General), home states (domicile), and annual family income in Lakhs to personalize opportunities.
3. **Smart matching Engine**: Matches students with government schemes (NSP, state DBTs) and private corporate fellowships based on their credentials, providing an instant matching score.
4. **Interactive Eligibility Checker**: Analyzes qualifications against scholarship rules and flags missing requirements.
5. **Plain-Language Jargon Dictionary**: Decodes administrative terms like *Bonafide Certificate*, *Tehsildar Income Certificate*, *Domicile Certificate*, and *Aadhaar Seeding* in simple terms.
6. **Task-by-Task Kanban Tracker**: Breaks down scholarship requirements into checklists (documents, essays, reference letters) and organizes them into Saved, In Progress, Submitted, and Expired columns.
7. **Resource Hub**: Offers copy-paste email templates to request recommendation letters and Bonafide certificates from schools or colleges.
8. **Interactive Mentor Chat**: Connects students with Sarah (an AI college counselor) who provides suggestions and reviews essay drafts.

---

## Tech Stack
- **Frontend Core**: React.js
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (enhanced with premium glassmorphism, glowing matches, and scale transitions)
- **Icons**: Lucide React

---

## Setup and Installation Instructions

Follow these simple steps to run Scholar Mate locally on your device:

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system. You can verify this by running:
```bash
node -v
npm -v
```

### Installation Steps

1. **Navigate to the Project Directory**:
   Open your terminal/command prompt and navigate to the project directory:
   ```bash
   cd "Scholar Mate"
   ```

2. **Install Dependencies**:
   Install all the required npm packages (including React, Vite, and Lucide Icons):
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   Launch the local dev environment:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Once the server starts, open your browser and navigate to:
   [http://localhost:5173/](http://localhost:5173/)

5. **Build for Production** (Optional):
   To generate static production files, run:
   ```bash
   npm run build
   ```
   This will compile the application into a compact, production-ready bundle inside the `dist/` directory.
