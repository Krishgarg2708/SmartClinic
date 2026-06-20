<div align="center">

<h1>🏥 SmartClinic</h1>

<p><strong>A modern, cloud-based Clinic Management System for small clinics, nursing homes, and independent healthcare practitioners.</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>
<p>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" />
</p>
<p>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge&logo=pwa" />
</p>

</div>

---

## Overview

Managing a clinic means juggling patient records, appointments, prescriptions, billing, medicine inventory, staff, and reports — all at once. Most small and mid-sized clinics still rely on manual registers and spreadsheets, making daily operations slow and error-prone.

**SmartClinic** digitizes the entire workflow into a single, intelligent platform — enabling clinics to cut paperwork, improve efficiency, and focus on what actually matters: patient care.

---

## Features

### Dashboard
- Real-time analytics and daily patient statistics
- Revenue overview, appointment summary, pending bills
- Medicine stock alerts and interactive charts
- Quick action shortcuts

### Patient Management
- Digital patient registration with complete profiles
- Medical history, allergy records, and chronic disease tracking
- Previous visit timeline and document uploads
- QR Code patient identification and advanced search

### Appointment Management
- Online scheduling, walk-in registration, token and queue management
- Doctor availability, calendar view, appointment reminders
- Follow-up scheduling

### Electronic Medical Records (EMR)
- Digital consultation records with diagnosis history, symptoms, and clinical notes
- Vital signs tracking, medical attachments, and patient timeline

### Prescription Management
- Digital prescription creation with printable and PDF export options
- QR verification, medicine schedules, follow-up instructions, and doctor signatures

### Billing System
- OPD billing with invoice generation and GST support
- Multiple payment methods, receipt printing, refund management, and revenue tracking

### Pharmacy & Inventory
- Medicine inventory with batch tracking, expiry management, and barcode support
- Supplier management, purchase orders, low stock alerts, and stock valuation

### Laboratory Management
- Lab test booking, sample tracking, report generation, and PDF exports

### Staff Management
- Doctor, receptionist, and nurse management
- Attendance tracking, roles and permissions, and shift management

### Reports & Analytics
- Revenue, patient, appointment, doctor performance, disease statistics, and inventory reports
- Export to PDF and Excel

### AI-Powered Assistance
- Medical report simplification and prescription explanation
- Clinical note summarization, disease risk insights, and medicine interaction checking
- Lifestyle recommendations, follow-up suggestions, and intelligent patient search

### Security
- Role-Based Access Control (RBAC) with secure authentication
- Firestore security rules, protected routes, audit logs, and encrypted data handling

### Additional
- Dark Mode / Light Mode, PWA with offline support
- QR code support, barcode scanner, voice notes, cloud backup, and responsive design

---

## Technology Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React + TypeScript | Core UI framework |
| Vite | Build tooling |
| Tailwind CSS + Shadcn UI | Styling and components |
| Framer Motion | Animations |
| TanStack Query | Data fetching and caching |
| React Hook Form + Zod | Forms and validation |
| Recharts | Data visualization |
| React Router | Client-side routing |

### Backend & Cloud
| Tech | Purpose |
|------|---------|
| Firebase Authentication | Secure auth |
| Firestore | NoSQL database |
| Firebase Storage | File and document storage |
| Cloud Functions | Serverless backend logic |
| Firebase Hosting | Deployment |

### AI & Integrations
| Tech | Purpose |
|------|---------|
| Gemini API | AI-powered medical assistance |
| OCR Services | Document text extraction |
| Speech-to-Text | Voice note support |
| QR Code Generator | Patient identification |
| Barcode Scanner | Pharmacy inventory |

---

## Project Structure

```
SmartClinic/
│
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level page components
│   ├── layouts/          # Page layout wrappers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API and Firebase service layer
│   ├── firebase/         # Firebase config and helpers
│   ├── context/          # React context providers
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── assets/           # Static assets
│   ├── styles/           # Global styles
│   └── lib/              # Third-party lib configurations
│
├── public/
├── functions/            # Firebase Cloud Functions
├── firestore.rules
├── firestore.indexes.json
├── package.json
└── README.md
```

---

## User Roles

| Role | Access |
|------|--------|
| Super Admin | Full system control |
| Clinic Admin | Clinic-level management |
| Doctor | EMR, prescriptions, appointments |
| Receptionist | Appointments, billing, patient registration |
| Nurse | Vitals, patient care notes |
| Pharmacist | Inventory and dispensing |
| Laboratory Technician | Lab tests and reports |
| Accountant | Billing, invoices, revenue |
| Patient | Self-portal access |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/SmartClinic.git

# Navigate to the project
cd SmartClinic

# Install dependencies
npm install
```

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

```bash
# Run the development server
npm run dev

# Create a production build
npm run build

# Preview the build
npm run preview
```

---

## Future Enhancements

- Telemedicine and video consultation
- WhatsApp and SMS notification integration
- Insurance and ABHA (Ayushman Bharat) integration
- Digital consent forms and AI Health Assistant
- Mobile applications (iOS and Android)
- Advanced analytics and multi-language support
- Payment gateway integration

---

## Vision

SmartClinic aims to empower healthcare professionals with a modern digital ecosystem that simplifies clinic operations, improves patient care, and makes healthcare management smarter, faster, and more accessible — for clinics of every size.

---

## Contributing

Contributions are welcome. Fork the repository, open issues, and submit pull requests to help improve SmartClinic.

---

## Author

<div align="center">

**Krish**
B.Tech Computer Science | Manav Rachna University

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/krish-garg-047649330/)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://portfolio-website-gxe6.vercel.app/)

*Built with a vision to simplify healthcare management through modern technology.*

</div>

---

## License

This project is licensed under the [MIT License](LICENSE).
