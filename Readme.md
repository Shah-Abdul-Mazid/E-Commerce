# ⚡ SoftMart IT — Premium AI & Educational Tools Subscription Marketplace

A production-grade, full-stack application built for **SoftMart IT** (Bangladesh's leading AI & SEO Tools platform) featuring an automated **Dutch-Bangla Bank (NexusPay)** Transaction Memo and institutional receipt engine.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19 (Vite), TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | FastAPI (Python 3.11+), Async SQLAlchemy 2.0, Pydantic v2 |
| **Database** | PostgreSQL (with `asyncpg`) or high-concurrency Async SQLite (`aiosqlite`) |
| **Authentication** | OAuth2 Bearer Tokens, JWT (`python-jose`), Passlib & native `bcrypt` |
| **Banking Engine**| Dutch-Bangla Bank (DBBL) NexusPay Slip Generation (Fund Transfer & Bill Payment) |
| **Theme / Design** | Deep Dark Canvas (`#0d0b18`, `#16122b`), glassmorphism, purple/gold accents |

---

## 📁 Project Structure

```text
E-Commerce/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth.py          # /auth/register, /auth/login, /auth/me
│   │   │       ├── products.py      # /products (GET, POST admin)
│   │   │       ├── checkout.py      # /checkout/submit, /my-history, /status/{id}
│   │   │       └── memos.py         # /memos/{trx_id}, /memos/generate
│   │   ├── core/
│   │   │   ├── config.py        # Settings, DBBL receiver account constants
│   │   │   ├── database.py      # Async SQLAlchemy engine & AsyncSessionLocal
│   │   │   ├── security.py      # Bcrypt hashing & JWT token encoder
│   │   │   └── deps.py          # get_current_user & get_current_admin guards
│   │   ├── models/
│   │   │   └── entities.py      # User, Product, Subscription, Transaction, TransactionMemo
│   │   ├── schemas/
│   │   │   └── all_schemas.py   # Pydantic v2 request/response models
│   │   └── main.py              # FastAPI app with automated DB tables & data seeding
│   ├── .env                     # Active environment variables
│   ├── .env.example             # Template credentials & connection strings
│   └── requirements.txt         # Pinned backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NexusPayMemoModal.tsx # Pixel-perfect DBBL / NexusPay Receipt Modal (Print/PDF)
│   │   │   ├── CheckoutModal.tsx     # BD Payment modal (NexusPay, bKash, Nagad, Rocket)
│   │   │   ├── AuthModal.tsx         # JWT Login / Registration dialog with quick presets
│   │   │   └── DashboardView.tsx     # Active subscriptions, transaction history & admin panel
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript schema definitions
│   │   ├── App.tsx              # Marketplace homepage, package tiers & single tools
│   │   └── main.tsx             # React DOM root
│   ├── index.html               # Custom Tailwind dark canvas config & print styles
│   └── package.json             # Frontend dependencies
└── Readme.md
```

---

## ⚡ Key Highlights & Features

### 1. Subscription Packages
- **Standard (৳299/mo)**: ChatGPT Plus, Grammarly Premium, Quillbot Premium.
- **Premium (৳599/mo - MOST POPULAR)**: ChatGPT-4o & Canvas, Turnitin Plagiarism & AI, Perplexity Pro, Stealth Writer.
- **Advance (৳850/mo - ALL-IN-ONE MASTER)**: Coursera Plus, Udemy Business, Midjourney/Claude, VIP concierge.
- **SEO Combo Bundle (৳299/mo)**: Grammarly, Quillbot, WordHero, indexing tools.

### 2. Single Tools Marketplace
- Instant checkout for **ChatGPT Plus (৳200/mo)**, **Grammarly (৳200/mo)**, **Quillbot (৳200/mo)**, **Stealth Writer (৳399/mo)**, and **Coursera Plus (৳200/mo)**.

### 3. Pixel-Perfect Dutch-Bangla Bank (NexusPay) Receipts
- **Mode A: Fund Transfer Memo**
  - Beneficiary Info: Receiver Name (`SOFTMART IT ENTERPRISE`), Bank (`Dutch-Bangla Bank PLC`), Account (`107.110.198425`).
  - Channel Info: Card Type (`NEXUS DEBIT`), Card Number masked, NexusPay ID, Transaction ID (`LID02082191058`), Date & Time.
- **Mode B: Bill Payment Memo**
  - DBBL Red/Blue/Green accent line, Institutional Biller (e.g. `East West University`), Biller Code, Student ID, Paid From channel, Fee: BDT 0.00.
  - Print & PDF download buttons with CSS print styles.

### 4. Admin Control & Subscription Issuance
- Admin review panel to approve pending bank transactions.
- Automated subscription activation with credential distribution (login portals & access tokens).

---

## 🚀 How to Run Locally

### 1. Start the Backend (FastAPI)
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Interactive Swagger API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Database tables and initial catalog are seeded automatically on first boot!

### 2. Start the Frontend (React + Vite)
In a second terminal:
```powershell
cd frontend
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Default Credentials for Testing

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@softmart.it` | `Admin@SoftMart2026` |
| **Customer** | `customer@softmart.it` | `Customer@123` |
*(One-click demo buttons are available in the Login Panel!)*
