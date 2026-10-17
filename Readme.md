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

## 🌐 Production Deployment Summary

For full details, see the dedicated [DEPLOYMENT.md](file:///c:/Users/LENOVO/Desktop/E-Commerce/DEPLOYMENT.md) guide.

1. **Backend on Render.com**:
   - Web Service pointing to `backend/` directory.
   - Environment: Docker (`backend/Dockerfile`).
   - Env vars: `APP_BASE_URL`, `FRONTEND_URL`, `SSL_STORE_ID`, `SSL_STORE_PASSWORD`, `DATABASE_URL`.
2. **Frontend on Vercel.com**:
   - Vite project pointing to `frontend/` directory.
   - `vercel.json` rewrites all paths to `/index.html`.
   - Env var: `VITE_BACKEND_URL=https://<your-render-backend-url>.onrender.com`.

---

## 📄 License
Crafted with ❤️ for students, educators, and developers. All rights reserved.
