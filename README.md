🎟️ VoucherRedeem — MERN Voucher Redemption App
A full-stack voucher redemption platform built with the MERN stack.
Users can browse and redeem vouchers, while Admins can manage vouchers and view analytics.
The app features curated high-quality voucher images, a modern PrimeReact UI, and an integrated Gemini chatbot.

✨ Features
👤 User
Browse vouchers by category with image thumbnails and detail views.

Redeem vouchers (with limits & expiry checks).

Google OAuth sign-in.

🛠 Admin
Email/password login (seeded admin user).

Voucher CRUD (create, edit, delete) with live image preview.

Analytics dashboard: category stats, top performers, and improved Chart visuals.

🎨 UI/UX
PrimeReact (Sakai theme), fully responsive layouts.

Consistent voucher images: curated URLs with category fallbacks.

🌟 Extras
Gemini chatbot via backend proxy.

Secure cookies/sessions and JWT checks on protected routes.

🛠 Tech Stack
Frontend:
React 19, PrimeReact 10, PrimeIcons, PrimeFlex, Redux Toolkit, React Router

Backend:
Node.js, Express 5, Mongoose, Passport (Google OAuth + JWT), express-session

Database:
MongoDB (Atlas or local)

AI:
Gemini (gemini-2.0-flash) via backend proxy route

📂 Monorepo Structure

bash
Copy
Edit
backend/
  server.js           # Main server
  routes/             # API routes
    auth.js
    vouchers.js
    gemini.js
  models/             # Mongoose models
    User.js
    Voucher.js
  config/
    passport.js       # Google OAuth config
  seeders/
    seedVouchers.js   # Seed admin & vouchers

frontend/
  src/pages/          # User & Admin pages
  src/store/          # Redux slices
    authSlice.js
    voucherSlice.js
  src/components/     # Shared components
    GeminiChatbot.js
⚙️ Environment Variables
backend/.env

ini
Copy
Edit
MONGODB_URI=your_mongo_connection_string
PORT=5000
CLIENT_URL=http://localhost:3000
SESSION_SECRET=your_random_string
JWT_SECRET=your_random_string
GEMINI_API_KEY=your_google_ai_studio_key
NODE_ENV=development
frontend/.env

bash
Copy
Edit
REACT_APP_API_URL=http://localhost:5000/api
CORS allows CLIENT_URL and common local dev ports (3000, 5173, etc).
See backend/server.js for details.

🚀 Installation
1. Prerequisites
Node.js 18+

npm

MongoDB (local or Atlas)

2. Clone the repo
bash
Copy
Edit
git clone https://github.com/Yashnni07/Voucher-app.git
cd Voucher-app
3. Backend setup
bash
Copy
Edit
cd backend
npm install
Create .env as per the variables above.

Seed the database with curated images:

bash
Copy
Edit
node seeders/seedVouchers.js
This creates:

Admin user

Sample vouchers with curated image URLs

4. Frontend setup
bash
Copy
Edit
cd ../frontend
npm install
Create .env:

bash
Copy
Edit
REACT_APP_API_URL=http://localhost:5000/api
💻 Running Locally
Backend:

bash
Copy
Edit
cd backend
npm run dev   # Development
npm start     # Production
Health check:

bash
Copy
Edit
GET /api/health
Frontend:

bash
Copy
Edit
cd frontend
npm start
Access at: http://localhost:3000

🔑 Authentication
Admin credentials (seeded):

makefile
Copy
Edit
Email: admin@voucherapp.com
Password: admin123
Google OAuth for users:

Set up OAuth Client ID/Secret in Google Cloud Console.

Add to backend/.env:

ini
Copy
Edit
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
OAuth endpoints:

GET /api/auth/google

GET /api/auth/google/callback

JWT is used for protected routes.

🖼 Voucher Images
Stored in MongoDB under image field.

Admin sets Image URL on voucher creation/edit.

Fallback images are used if missing/broken.

Pre-seeded curated images in backend/seeders/seedVouchers.js.

📊 Analytics
Admin Dashboard & Analytics pages:

PrimeReact Chart with improved Chart.js configs.

Enhanced tooltips, number formatting, color palette, gridlines, animations.

Dashboard stats: totals and average redemptions per voucher.

📡 Key API Routes
Method	Endpoint	Description
GET	/api/health	Health check
POST	/api/auth/login	Admin login
GET	/api/auth/google	Google OAuth start
GET	/api/auth/google/callback	OAuth callback
GET	/api/vouchers	List vouchers
GET	/api/vouchers/:id	Voucher detail
POST	/api/vouchers	Create (admin)
PUT	/api/vouchers/:id	Update (admin)
DELETE	/api/vouchers/:id	Delete (admin)
POST	/api/vouchers/:id/redeem	Redeem voucher
POST	/api/gemini/chat	Gemini chatbot proxy

📜 Scripts
Backend (backend/package.json):

json
Copy
Edit
"start": "node server.js",
"dev": "nodemon server.js"
Frontend (frontend/package.json):

json
Copy
Edit
"start": "react-scripts start",
"build": "react-scripts build"
☁️ Deployment
Backend: Render / Heroku

Frontend: Netlify / Vercel

Database: MongoDB Atlas

Ensure environment variables are configured for each platform.

🛠 Troubleshooting
Blank page: Check REACT_APP_API_URL and backend status.

CORS issues: Verify CLIENT_URL in backend .env.

Google OAuth: Update authorized origins/redirect URIs in Google Cloud Console.

🗺 Roadmap
Mobile polish & accessibility improvements.

Redemption history & trend charts.

Image uploads (Cloudinary/S3) with moderation.

Optional: referrals, email notifications, QR codes, multi-language.

📄 License
MIT (or your preferred license).

🙏 Acknowledgements
PrimeReact (Sakai theme)

Unsplash for curated voucher images.

Google AI Studio for Gemini API.

# Voucher Redemption App

A full-stack MERN application for voucher redemption with admin and user roles.

## Features

- **Authentication**: Google OAuth integration
- **User Roles**: Admin (manage vouchers, analytics) & User (redeem vouchers)
- **Voucher System**: Points-based redemption with categories
- **Mobile Responsive**: PrimeReact with Sakai theme
- **Analytics Dashboard**: Track redemption patterns

## Tech Stack

- **Frontend**: React, PrimeReact (Sakai Theme), Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js, JWT
- **Styling**: PrimeFlex, PrimeIcons

## Project Structure

```
VoucherRedeem/
├── backend/          # Node.js + Express API
├── frontend/         # React application
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Google OAuth credentials

### Installation

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Configure environment variables
5. Start development servers

## Environment Variables

Create `.env` files in both backend and frontend directories with required configurations.

## Deployment

- Backend: Heroku/Render
- Frontend: Netlify/Vercel
- Database: MongoDB Atlas
