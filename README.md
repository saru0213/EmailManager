# 📧 EmailManager– Email Management System

EmailManager is a full-stack **Email Management System** built with **Next.js** that allows users to create, manage, and send bulk emails using customizable and AI-generated templates. It includes secure authentication, contact and group management, email logging, and Google Form integration for easy contact collection.


🔗 Live Demo: https://mailvora.vercel.app

👤 Demo Account  
Email: saraswati13122002@gmail.com  
Password: Kale@megha

---

## 🚀 Features

### 🚀 Redis Integration
- Uses Redis (Upstash) to store temporary data such as secure invite tokens with automatic expiration (TTL), improving performance and security.
 
---

### 🔐 Authentication
- Secure **Login & Signup** for new and existing users  
- **Firebase Authentication** handles credential validation and user management  
- **JWT tokens** are generated for authenticated users to **protect routes and manage sessions**  
- **User-specific data isolation** ensures each user only accesses their own contacts, templates, and email logs  

---

### ✉️ Email API Integration
- Gmail SMTP integration using **Nodemailer**
- Server-side email sending via Next.js API routes
- Supports sending and receiving emails

---

### 📝 Template Management
- **AI-generated templates** using **Google Gemini API**
- Create new email templates
- Edit and delete templates
- Dynamic content using input fields


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

### 📁 Import / Export Contacts

- Easily **import contacts** from Excel format into the system  
- **Export contacts** for backup or external use  
- Supports **bulk upload and bulk download**, saving time for large contact lists  
- Contacts can be **organized into groups** for targeted bulk emails  
- Integration ensures imported/exported data **syncs seamlessly with Firestore**  

---

### 📂 Group Management
- Create, edit, read and delete groups
- View contacts inside a group
- Select groups for bulk email sending

---

### 📤 Email Sending
- Select an email template
- Send emails to Single and Bulk contacts or groups in one action

---

### 📜 Email Logs
- Track sent emails
- Logs include:
  - Recipient(s)
  - Template used
  - Timestamp

---

### 🔗 Contact Form Integration like Google form
- Generate a **shareable Contact Form link** for external users  
- Collect contact information easily from form submissions  
- Add collected data **directly to the contacts database (Firestore)**  
- **Redis** is used to generate and manage **temporary tokens** for form links, ensuring links are secure and expire after a limited time  

---

### 🧠 AI Integration
- Google Gemini API for email template generation
- Prompt-based professional email creation
- The system is designed to produce three high-quality email templates at a time, ensuring users can choose the most suitable version for their communication needs.

---

### 📱 Responsive Design & Device Compatibility
-The application is developed with a fully responsive infrastructure to ensure smooth usability across all devices. It adapts dynamically to different screen sizes,    including desktops, laptops, tablets, and mobile phones. This guarantees a consistent and optimized user experience regardless of device type or operating system.

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



## 🏗️ System Architecture Diagram

```mermaid
flowchart LR
    User[User Browser] -->|Login / Signup| FE[Next.js Frontend]

    FE -->|Auth Requests| Auth[Firebase Authentication]
    FE -->|API Calls| API[Next.js API Routes]

    API -->|Read / Write| DB[Firebase Firestore]
    API -->|Cache / Token| Cache[Redis]

    API -->|Send Emails| Mail[Nodemailer]
    Mail -->|SMTP| Gmail[Gmail SMTP Server]

    API -->|Generate Content| AI[Google Gemini API]

    External[Contact Form] -->|Contact Data| DB
```

---

### 📌 Flow Explanation

1. **User Registration/Login**  
   - A new user starts by **signing up or logging in**.  
   - Credentials are **validated via Firebase Authentication**.  
   - Once authenticated, the user is **redirected to the home dashboard**.

2. **Dashboard / Home**  
   - Users can **create contacts, groups, and templates**.  
   - Templates can be **customized manually or generated automatically** using **Google Gemini API**.

3. **Bulk Email Sending**  
   - Users can **send emails to individual contacts or groups**.  
   - **Nodemailer** sends emails through **Gmail SMTP**.  
   - Email logs are stored in **Firestore** to track sent emails.

4. **Contact Management via Contact Form**  
   - External users can fill a **Contact Form**.  
   - Form submissions are stored in **Firestore** as new contacts.  
   - Each link can have an **expiry time** (controlled via Redis).

5. **Redis Usage**  
   - **Generate temporary tokens** for links or authentication.  
   - Store **user IDs or temporary tokens** for actions like form submission links.  
   - Tokens have a **limited lifetime** to ensure security.

6. **Template Search and Management**  
   - Users can **search templates by name, date, or other filters**.  
   - Templates can be **edited or deleted** as needed.  
   - Templates can be **archived for future use** or **reused** for sending new emails. 
---

### 🔹 Summary of Components

| Component | Purpose |
|-----------|---------|
| **Next.js Frontend** | User interface and client-side routing |
| **Firebase Auth** | User authentication and validation |
| **Firestore DB** | Storing contacts, groups, templates, email logs |
| **Redis** | Token storage for temporary links and caching |
| **Nodemailer + Gmail SMTP** | Sending emails to contacts |
| **Google Gemini API** | AI-powered template generation |
| **ContactForm** | External contact submission |

---

This architecture ensures:  

- **Secure authentication and token handling** via Firebase + Redis  
- **Efficient bulk email sending** with logs  
- **AI-powered template creation** for dynamic content  
- **External form integration** to automatically add contacts

---

## 📂 Project Structure

```plaintext
EmailManager/
├─ src/
│  ├─ app/                 # Main app pages and API routes
│  │  ├─ api/              # Next.js API routes (auth, contacts, templates)
│  │  ├─ auth/             # Authentication pages (login, signup)
│  │  ├─ contacts/         # Contacts pages
│  │  │  └─ create/        # Contact creation page/component
│  │  ├─ components/       # Reusable page-level components
│  │  ├─ ui/               # UI components (buttons, modals, tables)
│  │  ├─ layout.js         # App layout
│  │  └─ page.js           # Home page
│  ├─ lib/                 # Utility libraries (export/import contacts, helpers)
│  └─ globals.css          # Global styles
├─ public/                  # Static assets (images, favicon)
├─ node_modules/            # Node dependencies
├─ .env.local               # Environment variables
├─ .gitignore
├─ package.json
└─ README.md

```

## 📦 Installation & Setup

## ⚡ Getting Started

Follow these steps to run **EmailManager** locally:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/saru0213/EmailManager.git
cd EmailManager
```
2️⃣ Install Dependencies
bash
Copy code
npm install

```
3️⃣ Add Environment Variables
Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=

# Gemini API key
GEMINI_API_KEY=

# JWT secret for authentication
JWT_SECRET=

# App URL
NEXT_PUBLIC_URL_LINK=
NEXT_PUBLIC_APP_URL=

# Expiration time for tokens/sessions
NEXT_PUBLIC_EXPIRE_TIME=

# Upstash Redis configuration
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```
4️⃣ Run the Development Server
bash
Copy code
npm run dev

Open http://localhost:3000 to view the app locally.
```
5️⃣ Live Demo
You can also see the live version here:
🔗 Live Demo: https://mailvora.vercel.app
```

---

### 📬 Contact

For questions, feedback, or collaboration inquiries, feel free to reach out 🤝

- **Email:** [saraswati13122002@gmail.com] 
- **Phone:** [9518323988]
- **Portfolio:** [[https://saraswati-adkine.vercel.app/]]  

We welcome suggestions and contributions to improve this project 🚀











