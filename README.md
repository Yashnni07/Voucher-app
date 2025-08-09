VoucherRedeem — MERN Voucher Redemption App
A full‑stack voucher redemption platform built with the MERN stack. Users can browse and redeem vouchers; Admins can manage vouchers and view analytics. The app features curated high‑quality voucher images, modern PrimeReact UI, and an integrated Gemini chatbot.

Features
User
Browse vouchers by category with image thumbnails and detail views
Redeem vouchers (respecting limits/expiry)
Google OAuth sign‑in
Admin
Email/password login (seeded admin user)
Voucher CRUD (create, edit, delete) with live image preview
Analytics dashboard with category stats, top performers, and improved Chart visuals
UI/UX
PrimeReact (Sakai theme), responsive layouts
Consistent voucher images: curated URLs with category fallbacks on error
Extras
Gemini chatbot via backend proxy
Secure cookies/sessions and JWT checks on protected routes
Tech Stack
Frontend: React 19, PrimeReact 10, PrimeIcons, PrimeFlex, Redux Toolkit, React Router
Backend: Node.js, Express 5, Mongoose, Passport (Google OAuth + JWT), express‑session
Database: MongoDB (Atlas or local)
AI: Gemini (gemini-2.0-flash) via backend proxy route
Monorepo Structure
backend/
server.js
 main server
routes/ 
auth.js
, 
vouchers.js
, 
gemini.js
models/ 
User.js
, 
Voucher.js
config/ 
passport.js
seeders/ 
seedVouchers.js
frontend/
src/pages/ user and admin pages (catalog, detail, dashboard, analytics, vouchers)
src/store/ Redux slices (
authSlice.js
, 
voucherSlice.js
)
src/components/ shared components (e.g., 
GeminiChatbot.js
)
Environment Variables
Create .env files in backend/ and frontend/ (do not commit).

backend/.env
MONGODB_URI Mongo connection string
PORT API port (default 5000)
CLIENT_URL frontend origin (e.g., http://localhost:3000)
SESSION_SECRET random string
JWT_SECRET random string
GEMINI_API_KEY Google AI Studio API key
NODE_ENV development | production
frontend/.env
REACT_APP_API_URL e.g., http://localhost:5000/api
CORS allows CLIENT_URL and common local dev ports (3000, 5173, etc). See 
backend/server.js
.

Installation
Prereqs: Node 18+, npm, MongoDB (local or Atlas).

Clone the repo
Backend setup
cd backend
npm install
Create backend/.env (see above)
Seed database with curated images:
node seeders/seedVouchers.js
This creates an admin and sample vouchers with curated image URLs
Frontend setup
cd frontend
npm install
Create frontend/.env with REACT_APP_API_URL=http://localhost:5000/api
Run Locally
Backend: from backend/
Dev: npm run dev
Prod: npm start
Health check: GET /api/health
Frontend: from frontend/
npm start (CRA dev server on 3000)
Open http://localhost:3000

Authentication
Admin email/password (seeded):
Email: admin@voucherapp.com
Password: admin123
Google OAuth for users:
Configure OAuth Client ID/Secret in Google Cloud
Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend env (referenced in 
backend/config/passport.js
)
OAuth endpoints: GET /api/auth/google and callback at /api/auth/google/callback
JWT is used for protected routes, checked via Authorization header and/or cookie as implemented in the backend.

Voucher Images
Each voucher stores an 
image
 URL in MongoDB.
Admin creates/edits vouchers with an Image URL field.
Frontend renders images and uses category‑based fallbacks if missing/broken:
User catalog: 
frontend/src/pages/VoucherCatalog.js
Voucher detail: 
frontend/src/pages/VoucherDetail.js
Admin list + dialog preview: 
frontend/src/pages/Admin/AdminVouchers.js
Curated images are pre‑seeded for all sample vouchers in 
backend/seeders/seedVouchers.js
.

Analytics
Admin Dashboard/Analytics pages use PrimeReact Chart with improved Chart.js options:
Better tooltips, number formatting, color palette, gridlines, and animations
Category labels normalized
Dashboard stats: totals and average redemptions per voucher computed from analytics data
Key API Routes
GET /api/health health check
POST /api/auth/login admin email/password login
GET /api/auth/google Google OAuth start
GET /api/auth/google/callback OAuth callback
GET /api/vouchers list vouchers
GET /api/vouchers/:id voucher detail
POST /api/vouchers create (admin)
PUT /api/vouchers/:id update (admin)
DELETE /api/vouchers/:id delete (admin)
POST /api/vouchers/:id/redeem redeem (protected)
POST /api/gemini/chat Gemini proxy (requires GEMINI_API_KEY)
Note: Some routes require authentication/roles.

Scripts
Backend (
backend/package.json
)
start: node server.js
dev: nodemon server.js
Frontend (
frontend/package.json
)
start: react-scripts start
build: react-scripts build
Deployment
Backend: Render/Heroku
Frontend: Netlify/Vercel
Database: MongoDB Atlas
Configure env variables on each platform (never commit .env).
Troubleshooting
Blank page: verify REACT_APP_API_URL and the backend is running.
CORS/cookies: ensure CLIENT_URL matches your frontend origin and credentials: true is respected by the client.
Google OAuth: update authorized origins/redirect URIs in Google Cloud Console.
Roadmap
Mobile polish and accessible design
Enhanced redemption history and trend charts
Image upload (Cloudinary/S3) and moderation
Optional features: referrals, email notifications, QR codes, multi‑language
License
MIT (or your preferred license)

Acknowledgements
PrimeReact (Sakai theme)
Unsplash curated images for voucher visuals
Google AI Studio for Gemini API
