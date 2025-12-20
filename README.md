# 📧 EmailManager– Email Management System

EmailManager is a full-stack **Email Management System** built with **Next.js** that allows users to create, manage, and send bulk emails using customizable and AI-generated templates. It includes secure authentication, contact and group management, email logging, and Google Form integration for easy contact collection.

---

## 🚀 Features

### 🔐 Authentication
- Secure **Login & Signup**
- Firebase Authentication
- User-specific data isolation

---

### ✉️ Email API Integration
- Gmail SMTP integration using **Nodemailer**
- Server-side email sending via Next.js API routes
- Supports sending and receiving emails

---

### 📝 Template Management
- Create new email templates
- Edit and delete templates
- Dynamic content using input fields
- **AI-generated templates** using **Google Gemini API**

---

### 🗄️ Template Storage
- Templates stored securely in **Firebase Firestore**
- Full CRUD operations
- User-based access control

---

### 👥 Contact Management
- Add, edit, and delete contacts
- Store contact details securely
- Organize contacts into groups

---

### 📂 Group Management
- Create, edit, and delete groups
- View contacts inside a group
- Select groups for bulk email sending

---

### 📤 Bulk Email Sending
- Select an email template
- Send emails to multiple contacts or groups in one action
- Optimized using **Redis**

---

### 📜 Email Logs
- Track sent emails
- Logs include:
  - Recipient(s)
  - Template used
  - Timestamp

---

### 🔗 Google Form Integration
- Generate a shareable Google Form link
- Collect contact information easily
- Add collected data directly to contacts

---

### 🧠 AI Integration
- Google Gemini API for email template generation
- Prompt-based professional email creation

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | Next.js (App Router) |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Email | Gmail SMTP (Nodemailer) |
| Caching | Redis |
| AI | Google Gemini API |

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/saru0213/EmailManager.git
cd EmailManager



## 🔄 System Flow Diagram

```mermaid
flowchart TD
    A[User Signup / Login] --> B[Firebase Authentication]

    B --> C[Dashboard]

    C --> D[Template Management]
    D --> D1[Create / Edit Template]
    D --> D2[AI Generate Template (Gemini API)]
    D1 --> F[Store Template in Firestore]
    D2 --> F

    C --> E[Contact Management]
    E --> E1[Add / Edit / Delete Contact]
    E --> E2[Create / Manage Groups]
    E1 --> G[Store Contacts in Firestore]
    E2 --> G

    C --> H[Bulk Email Sending]
    H --> I[Select Template]
    H --> J[Select Contacts / Groups]
    I --> K[Send Email via Nodemailer (Gmail SMTP)]
    J --> K

    K --> L[Email Sent]
    L --> M[Store Email Log in Firestore]

    C --> N[Google Form Integration]
    N --> O[Collect Contact Data]
    O --> G

