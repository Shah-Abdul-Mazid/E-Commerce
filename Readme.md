# ⚡ EZOPY MART TECH — Premium AI Tools & B.Sc. CSE Academic Curriculum Hub

> *Dedicated with warmth to Jannat Farhana Popy • Curated by Shah Abdul Mazid*

A modern, full-stack e-commerce marketplace and academic learning platform. Built with **FastAPI**, **React 19**, **Vite**, **Tailwind CSS**, and **SSLCommerz / DBBL NexusPay Payment Gateways**.

---

## 🌟 Recent Major Updates

- 🔐 **Pre-Checkout Auth Gating & Auto-Resumption**: Clicking "Buy Now" or Cart Checkout now intelligently checks authentication status. Unauthenticated visitors are prompted with a contextual sign-in/register modal, which automatically launches their intended purchase upon login.
- ⚡ **Auto-Filled & Verified Checkout Profiles**: Authenticated users enjoy an instant, frictionless checkout experience where their full name, email, and phone number are automatically populated and locked directly from the database to prevent typographical errors.
- 🔄 **Real-Time SSLCommerz Fulfillment & Live Dashboard Sync**: Transactions completed via the SSLCommerz gateway now trigger real-time order synchronization (`sync-ssl-order`) and automatic dashboard refreshes without requiring manual browser reloads.
- 📊 **Streamlined Admin Dashboard & Unified Payment Records**: Admin control panel features a direct "Payment History & Memos" view displaying customer name, email, transaction IDs, and verification statuses without manual review bottlenecks.
- 🛍️ **Admin Product & Price Management via Dashboard**: Admins can create new courses/tools, update titles, badges, and descriptions, adjust prices in 1 click (with quick-edit modal), toggle active status, or delete products directly from the live dashboard.
- 🌐 **8-Language Internationalization (i18n)**: Seamless language switcher supporting English (`en`), বাংলা (`bn`), हिन्दी (`hi`), Deutsch (`de`), Suomi (`fi`), Français (`fr`), Español (`es`), and العربية (`ar` with automatic RTL layout).
- 🔒 **Bcrypt Password Security**: All passwords stored securely as salted Bcrypt hashes (`$2b$12$...`).
- 👁️ **Password Visibility Toggle**: Show/Hide password toggle (`<Eye />` / `<EyeOff />`) with 1-click admin and customer demo login preset chips.
- 🎓 **Complete 4-Year B.Sc. CSE Curriculum**: All 21 core academic courses across 4 Years (1st, 2nd, 3rd Semesters) with prerequisites, credit breakdown, and dual view (Interactive Curriculum Accordion & Product Cards).
- 💳 **Dual Payment Infrastructure**:
  - **SSLCommerz Gateway**: Automated checkout session initialization, sandbox testing, IPN callbacks, and return redirects.
  - **DBBL NexusPay Generator**: Printable & PDF-ready Dutch-Bangla Bank Fund Transfer and Bill Payment memos.
- 🐳 **Docker & Cloud Deployment Ready**:
  - **Backend on Render.com**: Production Dockerfile with dynamic `$PORT` handling and auto-converted `postgresql+asyncpg://` connections.
  - **Frontend on Vercel**: Configured via `vercel.json` with SPA routing rewrites and dynamic `VITE_BACKEND_URL` environment variables.
  - **Local Docker Compose**: 1-command startup via `docker compose up --build`.
- 📱 **Full-Screen Modern Responsive Layout**: Sleek compact hero, category navigation, sticky header, and mobile/desktop optimization.

---

## 🎯 Technical Competency & Job Requirements Proof

This repository serves as a verified, production-grade technical portfolio demonstrating end-to-end competency in **Software Development, API Integration, ERP Module Automation, and Payment Systems**.

### 📋 Requirement-to-Implementation Proof Matrix

| Job Circular Requirement | Project Implementation & Proof Details | Visual Proof |
|---|---|---|
| **Education: Bachelor of Science (B.Sc.) in CSE**<br>*(Renowned University Standard)* | Built a complete 4-Year B.Sc. in Computer Science & Engineering Academic Hub (140 Credits, 21+ core accredited courses, semester breakdowns, verified lecture slides, lab codes, and solved questions). | [Curriculum Hub](#1-official-bsc-cse-academic-curriculum-hub--ai-suite-portal) (`Image 1.png`) |
| **Payment Gateway & API Integration**<br>*(SSLCommerz, Banking, SMS/Email)* | Full integration with **SSLCommerz Hosted Gateway** (Cards, Mobile Banking, Net Banking), **3D Secure OTP verification flow**, and **DBBL NexusPay / Rocket / bKash / Nagad** payment channels with IPN webhook callbacks. | [Payment Integration](#3-secure-checkout--multi-gateway-selection) (`Image 3 *.png`) |
| **ERP Modules & Automation**<br>*(Finance, Inventory, CRM, Customer Mgmt)* | Built manual-to-automation workflows: instant order processing, dynamic price calculation, automated invoice generation, and real-time subscription license token generation (`EZ-VIP-14D5D15471`). | [ERP Fulfillment](#7-automated-erp-customer-dashboard--license-issuance) (`Image 4 Subscription Complete.png`) |
| **Diagnostic Centre & Enterprise Relevance**<br>*(Billing, Invoicing, Records)* | Implemented Dutch-Bangla Bank PLC institutional billing memos with Biller Code (`8810`), Student/Patient ID tracking (`2022-1-60-019`), and printable PDF slips for diagnostic/lab accounting audit trails. | [Institutional Memo](#6-automated-verification--dbbl-nexuspay-receipt) (`Image 3 Payment Complete.png`) |
| **Scalable REST APIs & Architecture**<br>*(FastAPI / PHP & Laravel compatible)* | Architected modular RESTful services with JWT token authentication, Bcrypt password encryption, Docker containerization, and production deployment on Vercel & Render. | [System Architecture](#-architecture--technology-stack) |
| **Frontend UI/UX & Responsive Design**<br>*(Modern, Intuitive, Multilingual)* | Developed high-performance Single Page Application (SPA) with React 19, Tailwind CSS, 8-language i18n localization, Dark/Light modes, and instant cart/checkout resumption. | [Catalog & Storefront](#2-dynamic-catalog--subscription-management) (`Image 2.png`) |

---

## 📸 Live Application Visual Proofs & User Journey

The following screenshots demonstrate the live, deployed system in action on production ([ezopy-mart.vercel.app](https://ezopy-mart.vercel.app)):

### 1. Official B.Sc. CSE Academic Curriculum Hub & AI Suite Portal
> **Proof of**: B.Sc. CSE Academic Foundation, Departmental Curriculum Architecture (140 Credits total across 4 years), and Responsive UI.

![B.Sc. CSE Academic Hub & Landing Page](./Image%201.png)

*Key Highlights:*
- B.Sc. CSE 4-Year Academic Curriculum navigation (1st, 2nd, 3rd, and 4th Year tracks).
- Real-time language switcher (8 languages) and theme auto-switching.
- Direct quick-links to tuition bill memo generation and course profiles accordion.

---

### 2. Dynamic Catalog & Subscription Management
> **Proof of**: Inventory/Catalog Management, Tiered Pricing (BDT ৳), Discount Badges, and Fast Filtering.

![Dynamic Catalog & Subscriptions](./Image%202.png)

*Key Highlights:*
- 58+ verified products and curriculum packages with instant access indicators.
- Badges for *50% OFF*, *BEST SELLER*, *ENTERPRISE*, and *POPULAR* tiers.
- Integrated "Add to Cart" and "Buy Now" triggers with pre-checkout auth validation.

---

### 3. Secure Checkout & Multi-Gateway Selection
> **Proof of**: Pre-Checkout Auth Verification, Autofilled Profile Security, and Multi-Gateway Support.

![Secure Checkout Modal](./Image%203%20Payment.png)

*Key Highlights:*
- Selectable payment gateways: **SSLCommerz (Instant Sandbox)**, **DBBL NexusPay (Instant Slip)**, **bKash (Auto Verify)**, **Nagad (Fast Track)**, and **Rocket (DBBL Channel)**.
- Authenticated user profile auto-lock (Shah Abdul Mazid, email, phone) preventing typo discrepancies.
- One-click launch into SSLCommerz payment portal.

---

### 4. SSLCommerz Third-Party Gateway Integration
> **Proof of**: Third-Party Payment Gateway Redirection, Hosted Checkout API, and Omnichannel Banking.

![SSLCommerz Gateway Redirection](./Image%203%20Payment%20Gateway.png)

*Key Highlights:*
- Seamless API redirect to `sandbox.sslcommerz.com/EasyCheckOut/...` with encrypted session key.
- Multi-channel checkout handling: Debit/Credit Cards (VISA, MasterCard, AMEX), Mobile Banking, and Internet Banking.

---

### 5. 3D Secure Bank OTP Verification Lifecycle
> **Proof of**: Bank Verification Security, OTP Transaction Lifecycle, and Gateway Webhook Readiness.

![OTP Bank Verification](./Image%203%20Payment%20Varification%20Gateway.png)

*Key Highlights:*
- Direct interaction with bank gateway (`indexhtmlOTP.php`) transmitting 3D Secure / Verified by Visa / MasterCard SecureCode verification.
- Transaction amount (৳ 599.00) and automated invoice reconciliation.

---

### 6. Automated Verification & DBBL NexusPay Receipt
> **Proof of**: Instant IPN Callback Fulfillment, Institutional Billing Memos, and Diagnostic/Enterprise Billing Records.

![DBBL NexusPay Transaction Receipt](./Image%203%20Payment%20Complete.png)

*Key Highlights:*
- Real-time success toast notification: `SSLCommerz Payment Successful! Txn: TXN-7EE8D089312E`.
- Instant generation of Dutch-Bangla Bank PLC Institutional Bill Payment Memo with Biller Code `8810` and User ID `2022-1-60-019`.
- Printable & PDF-exportable receipt for diagnostic centre / institutional financial audits.

---

### 7. Automated ERP Customer Dashboard & License Issuance
> **Proof of**: Manual-to-Automation ERP Workflows, Customer Access Control, and License Key Provisioning.

![Customer Dashboard & License Activation](./Image%204%20Subscription%20Complete.png)

*Key Highlights:*
- Dynamic user profile dashboard displaying active tool entitlements.
- Automated software license issuance (`EZ-VIP-14D5D15471`) with real-time countdown (59 days left) and expiry tracking (`12/17/2026`).
- Unified view for Active Tools and Payment History & Memos without page reload.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS 4, Lucide Icons |
| **Backend** | FastAPI (Python 3.11+), Async SQLAlchemy 2.0, Pydantic v2, Uvicorn |
| **Database** | PostgreSQL (with `asyncpg`) or high-concurrency Async SQLite (`aiosqlite`) |
| **Security & Auth** | OAuth2 Bearer Tokens, JWT (`python-jose`), Salted `bcrypt` password hashing |
| **Payment Gateways**| SSLCommerz Sandbox / Live Engine + DBBL NexusPay Slip Generator |
| **Deployment** | Docker, Render (Backend), Vercel (Frontend), Docker Compose |

---

## 🔑 Accounts & Environment Configuration

All default administrator and demo accounts, database URLs, and payment gateway keys are configured strictly via environment variables (`.env`) and are never hardcoded in the repository.

### 👑 Administrators & Demo Accounts
Configure the following variables in your `.env` (or Vercel Environment Variables):
- `ADMIN_SYSTEM_EMAIL` / `ADMIN_SYSTEM_PASSWORD`
- `ADMIN_PRIMARY_NAME` / `ADMIN_PRIMARY_EMAIL` / `ADMIN_PRIMARY_PASSWORD`
- `ADMIN_SECONDARY_NAME` / `ADMIN_SECONDARY_EMAIL` / `ADMIN_SECONDARY_PASSWORD`
- `DEMO_CUSTOMER_PASSWORD` (`DEMO_CUSTOMER_1_EMAIL`, `DEMO_CUSTOMER_2_EMAIL`, `DEMO_CUSTOMER_3_EMAIL`)

---

## 📁 Project Directory Structure

```text
E-Commerce/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth.py          # /auth/register, /auth/login, /auth/me
│   │   │   ├── products.py      # /products (GET, POST admin)
│   │   │   ├── checkout.py      # /checkout/submit, /my-history, /status/{id}
│   │   │   └── memos.py         # /memos/{trx_id}, /memos/generate
│   │   ├── core/
│   │   │   ├── config.py        # Settings & dynamic asyncpg DB URL handling
│   │   │   ├── database.py      # Async SQLAlchemy engine & AsyncSessionLocal
│   │   │   ├── security.py      # Bcrypt hashing & JWT token encoder
│   │   │   └── deps.py          # get_current_user & get_current_admin guards
│   │   ├── models/
│   │   │   └── entities.py      # User, Product, Subscription, Transaction models
│   │   ├── schemas/
│   │   │   └── all_schemas.py   # Pydantic v2 schemas
│   │   └── main.py              # User seeding & router mounting
│   ├── main.py                  # SSLCommerz callback routes & unified entrypoint
│   ├── Dockerfile               # Production Dockerfile for Render ($PORT aware)
│   ├── .dockerignore            # Docker ignore file
│   ├── .env                     # Local environment variables
│   ├── .env.example             # Template with Render/Vercel settings
│   └── requirements.txt         # Backend Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.tsx         # Login/Register with password eye toggle & presets
│   │   │   ├── CheckoutModal.tsx     # SSLCommerz & manual gateway modal
│   │   │   ├── DashboardView.tsx     # Student dashboard & Admin Control Panel
│   │   │   └── NexusPayMemoModal.tsx # Printable DBBL payment memo slip
│   │   ├── translations/
│   │   │   └── index.ts              # 8-language i18n translation dictionary
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript models
│   │   ├── App.tsx                   # Main store, course catalog & language bar
│   │   └── main.tsx                  # React DOM mount point
│   ├── Dockerfile               # Multi-stage Nginx Dockerfile
│   ├── nginx.conf               # SPA routing Nginx config
│   ├── vercel.json              # Vercel deployment & rewrite rules
│   ├── .env.example             # Frontend environment variables template
│   └── package.json             # Frontend dependencies
├── docker-compose.yml           # 1-command local full-stack Docker orchestration
├── vercel.json                  # Monorepo full-stack config (Frontend Vite + Backend FastAPI)
├── DEPLOYMENT.md                # Render & Vercel deployment instructions
└── Readme.md                    # Project documentation
```

---

## 🚀 Running Locally

### Option 1: Native Terminal Run

#### 1. Start Backend (FastAPI)
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Backend Root**: [http://localhost:8000/](http://localhost:8000/)

#### 2. Start Frontend (React + Vite)
In a second terminal:
```powershell
cd frontend
npm run dev
```
- **Frontend Store**: [http://localhost:5174](http://localhost:5174) *(Fixed port `5174`)*

---

### Option 2: Docker Compose (All-in-One)

Run both the frontend and backend in isolated containers with a single command:

```powershell
docker compose up --build
```
- **Frontend**: [http://localhost:5174](http://localhost:5174)
- **Backend**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🌐 Production Deployment Options

You can deploy **EZOPY MART TECH** using either of the following production setups. For complete details, variable tables, and architecture diagrams, check the dedicated [DEPLOYMENT.md](file:///c:/Users/LENOVO/Desktop/E-Commerce/DEPLOYMENT.md) guide.

### 🌟 Option 1: All-in-One Full-Stack on Vercel (Frontend & Backend Both on Vercel)
*Recommended for simplicity: single domain, unified Git CI/CD, and 0 CORS setup.*

1. **Architecture**:
   - The root **[`vercel.json`](file:///c:/Users/LENOVO/Desktop/E-Commerce/vercel.json)** orchestrates both the Vite frontend (`root: "frontend"`) and FastAPI backend (`root: "backend"`) as microservices.
   - All `/api/(.*)` requests automatically route to the FastAPI backend service.
   - All `/(.*)` requests route to the Vite single-page application.
2. **Steps to Deploy**:
   - Push your code to GitHub.
   - Log in to [Vercel](https://vercel.com) → **Add New...** → **Project** → Import your repository.
   - Keep **Root Directory** as `./` (Root) so Vercel reads the root `vercel.json`.
   - Add Environment Variables in Vercel Project Settings:
     - `PROJECT_NAME`: `EZOPY MART TECH`
     - `SECRET_KEY`: *(32+ character random string)*
     - `APP_BASE_URL`: `https://your-domain.vercel.app`
     - `FRONTEND_URL`: `https://your-domain.vercel.app`
     - `SSL_STORE_ID`: *(Your SSLCommerz Store ID)*
     - `SSL_STORE_PASSWORD`: *(Your SSLCommerz Store Password)*
     - `SSL_IS_LIVE`: `false` (for Sandbox) or `true` (for Production)
     - `MONGODB_DATABASE`: *(Your MongoDB Atlas connection URI)*
   - Click **Deploy**. Vercel will build both services and serve them under your unified domain.

---

### 🚀 Option 2: Split Cloud Architecture (Frontend on Vercel + Backend on Render)
*Recommended for dedicated container scaling and persistent Python Docker runtime.*

1. **Step 1: Deploy Backend to Render.com**:
   - Log in to [Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service**.
   - Connect your GitHub repository.
   - Set **Root Directory** to `backend` and **Runtime** to **Docker** (Render detects `backend/Dockerfile`).
   - Add Environment Variables:
     - `PORT`: `8000`
     - `PROJECT_NAME`: `EZOPY MART TECH`
     - `SECRET_KEY`: *(32+ character random string)*
     - `APP_BASE_URL`: `https://<your-backend>.onrender.com`
     - `FRONTEND_URL`: `https://<your-frontend>.vercel.app`
     - `SSL_STORE_ID`, `SSL_STORE_PASSWORD`, `SSL_IS_LIVE`, `MONGODB_DATABASE`
   - Click **Create Web Service**. Once built, copy your public backend URL.
2. **Step 2: Deploy Frontend to Vercel.com**:
   - Log in to [Vercel](https://vercel.com) → **Add New...** → **Project** → Import repository.
   - Set **Root Directory** to `frontend`.
   - Add Environment Variable:
     - `VITE_BACKEND_URL`: `https://<your-backend>.onrender.com`
   - Click **Deploy** (Vercel uses `frontend/vercel.json` for SPA rewrites).
3. **Step 3: Connect & Sync**:
   - Update `FRONTEND_URL` on Render to your newly generated Vercel domain.

---

### 🐳 Option 3: Local 1-Command Full-Stack with Docker Compose
To run both backend and frontend together on your local machine:
```bash
docker compose up --build
```
- **Frontend Store**: [http://localhost:5174](http://localhost:5174)
- **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📄 License
Crafted with ❤️ for students, educators, and developers. All rights reserved.
