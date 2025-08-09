# VoucherRedeem — MERN Voucher Redemption App

A full-stack voucher redemption platform built with the MERN stack. Users can browse and redeem vouchers; Admins can manage vouchers and view analytics. The app features curated high-quality voucher images, modern PrimeReact UI, and an integrated Gemini chatbot.

## Features

### User
- Browse vouchers by category with image thumbnails and detail views
- Redeem vouchers (respecting limits/expiry)
- Google OAuth sign-in

### Admin
- Email/password login (seeded admin user)
- Voucher CRUD (create, edit, delete) with live image preview
- Analytics dashboard with category stats, top performers, and improved Chart visuals

### UI/UX
- PrimeReact (Sakai theme), responsive layouts
- Consistent voucher images: curated URLs with category fallbacks on error

### Extras
- Gemini chatbot via backend proxy
- Secure cookies/sessions and JWT checks on protected routes

## Tech Stack
- *Frontend*: React 19, PrimeReact 10, PrimeIcons, PrimeFlex, Redux Toolkit, React Router
- *Backend*: Node.js, Express 5, Mongoose, Passport (Google OAuth + JWT), express-session
- *Database*: MongoDB (Atlas or local)
- *AI*: Gemini (gemini-2.0-flash) via backend proxy route

## Environment Variables

Create .env files in *backend/* and *frontend/* (do not commit).

### backend/.env
- MONGODB_URI — Mongo connection string  
- PORT — API port (default: 5000)  
- CLIENT_URL — Frontend origin (e.g., http://localhost:3000)  
- SESSION_SECRET — Random string  
- JWT_SECRET — Random string  
- GEMINI_API_KEY — Google AI Studio API key  
- NODE_ENV — development | production

### frontend/.env
- REACT_APP_API_URL — e.g., http://localhost:5000/api

*Note:*  
CORS allows CLIENT_URL and common local dev ports (3000, 5173, etc). See backend/server.js.


## Installation

*Prerequisites:*  
- Node.js 18+  
- npm  
- MongoDB (local or Atlas)  

---

### 1. Clone the repository
```bash
git clone <your-repo-url>


### 2. Backend Setup
cd backend
npm install
Create backend/.env (see Environment Variables section).

Seed the database with curated images:


### 3. Frontend Setup
cd frontend
npm install
Create frontend/.env with:
REACT_APP_API_URL=http://localhost:5000/api


### 4. Run locally
Backend (from backend/):
# Development
npm run dev

# Production
npm start
Health check:
GET /api/health
npm start
Open in browser:
http://localhost:3000

## Authentication

Admin (seeded):
- *Email:* admin@voucherapp.com  
- *Password:* admin123  

Google OAuth for Users:
1. Configure OAuth Client ID and Secret in Google Cloud.  
2. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env  
   (referenced in backend/config/passport.js).  
3. OAuth endpoints:  
   - GET /api/auth/google  
   - Callback: /api/auth/google/callback  
4. JWT is used for protected routes, verified via the Authorization header and/or secure cookies.



## Voucher Images

- Each voucher stores an image URL in MongoDB.  
- Admin can create/edit vouchers with an *Image URL* field.  
- Frontend renders images and uses category-based fallbacks if the image is missing or broken:  
  - User catalog: frontend/src/pages/VoucherCatalog.js  
  - Voucher detail: frontend/src/pages/VoucherDetail.js  
  - Admin list + dialog preview: frontend/src/pages/Admin/AdminVouchers.js  
- Curated images are pre-seeded for all sample vouchers in backend/seeders/seedVouchers.js.


## Analytics

- Admin Dashboard and Analytics pages use PrimeReact Chart with improved Chart.js options including:  
  - Better tooltips  
  - Number formatting  
  - Color palette  
  - Gridlines  
  - Animations  
- Category labels are normalized.  
- Dashboard stats include totals and average redemptions per voucher computed from analytics data.

## Key API Routes

- GET /api/health — health check  
- POST /api/auth/login — admin email/password login  
- GET /api/auth/google — Google OAuth start  
- GET /api/auth/google/callback — OAuth callback  
- GET /api/vouchers — list vouchers  
- GET /api/vouchers/:id — voucher detail  
- POST /api/vouchers — create voucher (admin only)  
- PUT /api/vouchers/:id — update voucher (admin only)  
- DELETE /api/vouchers/:id — delete voucher (admin only)  
- POST /api/vouchers/:id/redeem — redeem voucher (protected)  
- POST /api/gemini/chat — Gemini chatbot proxy (requires GEMINI_API_KEY)  

*Note:* Some routes require authentication and proper user roles.


## Scripts

### Backend (backend/package.json)
- start: node server.js  
- dev: nodemon server.js  

### Frontend (frontend/package.json)
- start: react-scripts start  
- build: react-scripts build  

---
