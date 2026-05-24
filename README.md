# CareTrack Clinic MRMS 🩺
### Medical Record Management System by MediCore Solutions

Welcome to the **CareTrack Clinic Medical Record Management System (MRMS)**, a highly secure, role-based, full-stack healthcare web application developed by **MediCore Solutions**. 

This system was custom-engineered for CareTrack Clinic—a mid-sized private medical centre—to completely replace their legacy paper-based workflows and disconnected spreadsheets with a modern, high-performance, single-page application.

---

## 🌟 Key Features

### 1. Operations Command Center (Dashboard)
* **Real-time Analytics**: Live counts of active Doctors, Patients, and Diagnoses compiled from the database.
* **Workload Load Factor Calculator**: Computes a dynamic pressure indicator showing the average patient-to-doctor ratio (`patientCount / doctorCount`) and alerts staff if workload pressure is dangerously high (load factor > 18).
* **Role-Adaptive Interface**: Features time-of-day dynamic greetings and a tailored Quick Actions panel that only exposes options the logged-in staff role is authorized to perform.

### 2. Practitioner Directory (Doctor Network)
* **Workload Tracker**: Displays the real-time active patient count assigned to each doctor using advanced relational aggregates.
* **Smart Search & Filters**: Multi-field full-text search by name, department, or specialty with case-insensitive filtering.
* **Practitioner Profiles**: Secure CRUD interface allowing authorized staff to manage practitioner details.

### 3. Patient Registry
* **Demographics Database**: Comprehensive profile views including full contact info, birth dates, assigned doctors, and automatic registration audit timestamps.
* **Assigned Doctor Links**: Securely maps each patient to exactly one primary care physician.
* **History Aggregator**: Renders a complete chronological timeline of a patient's historical diagnoses and disease logs directly on their profile.

### 4. Diagnosis Log & ICD-10 Disease Tracking
* **Standardized Coding**: Supports linking official **ICD Codes** (International Classification of Diseases) to patient records.
* **Severity Tiers**: Classifies diagnoses into `Low`, `Medium`, and `High` severity categories, dynamically rendering visually distinct color-coded badges.

---

## 🔐 Security & Role-Based Access Control (RBAC)

The system enforces strict security boundaries across three distinct organizational roles using secure stateless **JSON Web Tokens (JWT)** via **Auth.js (NextAuth v5)**:

| Feature / Page | Administrator | Clinician | Receptionist |
| :--- | :---: | :---: | :---: |
| **Manage Doctor Directory (CRUD)** | ✅ Full | ❌ Blocked | ❌ Blocked |
| **Register New Patients** | ✅ Full | ❌ Blocked | ✅ Full |
| **Update Patient Demographics** | ✅ Full | ✅ Full | ❌ Blocked |
| **Manage Diagnosis Records (CRUD)**| ✅ Full | ✅ Full | ❌ Blocked |
| **View Patient Registry** | ✅ Full | ✅ Full | ✅ Full |
| **Patient Confidentiality Guard** | ✅ Unrestricted | ✅ Unrestricted | 🚫 **Blocked** (No clinical/ICD logs visible) |

* **Cryptographic Password Hashing**: Passwords are secure at rest in the database, cryptographically hashed using standard `bcryptjs` algorithms during user registration.
* **Server-Side Security**: If a user attempts to bypass UI elements by manually editing the URL address bar, Next.js server-side route guards immediately intercept, block the request, and safely redirect them.

---

## 🛠️ Full-Stack Technology Stack

* **Fullstack Framework**: [Next.js 16.2.6 (App Router)](https://nextjs.org/) — Serves as the core runtime handling server-side logic, React Server Components (RSC), route handlers for API endpoints, and dynamic Client-side page transitions.
* **Front-End UI**: [React 19.2.4](https://react.dev/) — The component model powering dynamic front-end forms, pagination, dashboards, and live search layouts.
* **Database Layer**: [MongoDB](https://www.mongodb.com/) — Cloud-hosted persistent storage for user credentials, doctor rosters, patient logs, and disease entries.
* **Object-Relational Mapper**: [Prisma ORM 6.19.2](https://www.prisma.io/) — Translates schemas into fully type-safe database queries.
* **Authentication**: [NextAuth.js 5.0.0-beta.31 (Auth.js)](https://authjs.dev/) — Secure, cookie-based session management utilizing JWTs.
* **Styling Engine**: [Tailwind CSS 4.x](https://tailwindcss.com/) — Next-generation CSS-first engine styling sleek dashboard components, cards, lists, tables, and adaptive mobile responsive layouts.
* **Language**: [TypeScript 5.x](https://www.typescriptlang.org/) — Ensures compile-time type safety across database schemas, APIs, and React props.

---

## 💾 Database Model (ERD Schema)

The database strictly enforces referential integrity through three core connected collections:

* **Doctor** has a `One-to-Many` relationship with **Patient** (A doctor can oversee multiple patients; a patient is assigned to exactly one primary doctor).
* **Patient** has a `One-to-Many` relationship with **Disease** (A patient can compile multiple diagnoses over time; a disease entry is linked to exactly one patient chart).
* **User** is an isolated system authorization table designed to handle employee accounts, roles, and password credentials separate from patient medical logs to preserve HIPAA and clinical safety standards.

---

## 🚀 Local Quickstart

### Prerequisites
* [Node.js 20+](https://nodejs.org/) installed on your machine.
* A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas cluster).

### 1. Clone & Install Dependencies
```bash
# Install package dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
DATABASE_URL="your-mongodb-connection-string"
AUTH_SECRET="your-secure-random-authjs-secret"
```

### 3. Generate Database Client
```bash
npx prisma generate
```

### 4. Run the Application
```bash
# Launch the local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🌐 Production Deployment (Vercel)

1. Deploy the code to a Git repository (e.g. GitHub).
2. Connect your repository to **Vercel** and select the Next.js preset.
3. Configure the following **Environment Variables** in your Vercel Dashboard Settings:
   * `DATABASE_URL`: Your production MongoDB connection string.
   * `AUTH_SECRET`: A high-entropy secure random string to encrypt JWT sessions.
4. Trigger a production build. Next.js will compile pages and optimize layouts automatically.

---
*Developed by MediCore Solutions for CareTrack Clinic Center. Authorized clinical staff use only.*
