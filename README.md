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
