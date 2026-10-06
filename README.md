# BuildNBuy

### "Buy. Rent. List. Build."

BuildNBuy is a MERN-stack college project for finding, listing, and managing properties and connecting customers with trusted contractors. The current working milestone intentionally focuses on the core 30-35% demonstration scope.

---

## Table of Contents

1. [Project Description](#project-description)
2. [Main Features](#main-features)
3. [User Roles](#user-roles)
4. [Complete Workflow](#complete-workflow)
5. [Tech Stack](#tech-stack)
6. [Folder Structure](#folder-structure)
7. [Installation](#installation)
8. [Environment Variables](#environment-variables)
9. [MongoDB Setup](#mongodb-setup)
10. [Cloudinary Setup](#cloudinary-setup)
11. [Run Commands](#run-commands)
12. [API Documentation](#api-documentation)
13. [Authentication Details](#authentication-details)
14. [Demo Credentials](#demo-credentials)
15. [Screenshots](#screenshots)
16. [Future Improvements](#future-improvements)

---

## Project Description

BuildNBuy lets a **Customer** buy, rent, compare, and self-list properties, book site visits, and submit construction requirements to contractors. A **Contractor** manages property/project listings, a professional portfolio (experience, services, previous projects), and communicates directly with customers. An **Admin** verifies contractors, approves/rejects every property and project before it goes public, and manages platform-wide content (blogs, cities, categories) and moderation (users, reviews).

## Main Features

- Advanced property search & filtering (location, price, type, bedrooms, amenities, sort)
- Buy / Rent property discovery and filtering
- Customer self-listing of properties with admin approval workflow
- Contractor professional profiles: experience, services, previous projects, verification badge
- Construction requirement submission to a contractor
- Basic admin dashboard for users, contractors, and property approval
- Cloudinary-backed image & video uploads
- JWT authentication with role-based access control (RBAC)

## User Roles

Exactly **three** roles — no separate Builder or Agent role:

| Role | Description |
|---|---|
| `customer` | Buys/rents/lists properties, submits construction requirements, books visits |
| `contractor` | Lists properties/projects, offers construction services, responds to inquiries |
| `admin` | Verifies contractors, approves/rejects listings, manages the whole platform |

## Current Demo Workflow

**Buy/Rent:** Home → Search → Filter → Property Details
**List Property:** Dashboard → Add Property → Submit → Pending → Admin Review → Approved/Rejected
**Build a Home:** Find Contractor → View Profile/Experience/Services → Send Construction Requirement

Every property or construction project — whether submitted by a Customer or a Contractor — is `Pending` until an Admin approves it. Every Contractor account is `pending` verification until an Admin verifies it.

## Tech Stack

**Frontend:** React.js (Vite), React Router DOM, Tailwind CSS, Framer Motion, GSAP, React Icons, Swiper.js, Axios
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Cloudinary, bcrypt, dotenv

## Folder Structure

```
buildnbuy/
├── backend/
│   ├── controllers/       # Business logic per resource
│   ├── models/             # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── middleware/       # auth, error handling, validation
│   ├── config/               # db.js, cloudinary.js
│   ├── utils/                 # ApiError, ApiResponse, JWT helper, seed script
│   ├── uploads/             # (local scratch, not used in production - Cloudinary is primary)
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── layouts/
    │   ├── hooks/
    │   ├── context/
    │   ├── services/
    │   ├── utils/
    │   ├── assets/
    │   └── routes/
    ├── package.json
    └── vite.config.js
```

## Installation

```bash
git clone <this-repo>
cd buildnbuy

# Backend
cd backend
npm install
cp .env.example .env   # then fill in your values

# Frontend
cd ../frontend
npm install
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/buildnbuy

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_DAYS=7
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=replace_with_a_secure_password
ADMIN_REGISTRATION_KEY=replace_with_a_separate_secure_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## MongoDB Setup

**Local:** install MongoDB Community Server, then run `mongod`. Use `MONGO_URI=mongodb://127.0.0.1:27017/buildnbuy`.
**Atlas (cloud):** create a free cluster at mongodb.com/atlas, create a database user, whitelist your IP, and copy the connection string into `MONGO_URI`.

## Cloudinary Setup

1. Create a free account at cloudinary.com.
2. From your dashboard, copy `Cloud Name`, `API Key`, and `API Secret` into `.env`.
3. No manual bucket/folder setup needed — folders (`buildnbuy/properties`, `buildnbuy/contractors`, etc.) are created automatically on first upload.

## Run Commands

```bash
# 1. Start MongoDB (if running locally)
mongod

# 2. Create or repair the admin account
cd backend
npm run seed:admin

# 3. Start the backend API (http://localhost:5000)
npm run dev

# 3. Start the frontend (http://localhost:5173)
cd ../frontend
npm run dev
```

## API Documentation

All routes are prefixed with `/api`. Key resource groups:

| Resource | Base Route | Notes |
|---|---|---|
| Auth | `/api/auth` | register, login, logout, me, forgot/reset password |
| Users | `/api/users` | profile update, admin user management |
| Properties | `/api/properties` | CRUD, search/filter, admin moderation |
| Contractors | `/api/contractors` | profile, public search, admin verification |
| Construction Requirements | `/api/construction-requirements` | customer submissions, contractor responses |
| Admin | `/api/admin/dashboard` | platform-wide stats |

Every list endpoint supports pagination (`page`, `limit`) and returns `{ success, message, data, meta }`.

## Authentication Details

- Passwords hashed with `bcryptjs` (10 salt rounds).
- JWT issued on register/login, returned in response body **and** set as an httpOnly cookie.
- `protect` middleware verifies the token; `authorize(...roles)` middleware enforces RBAC per route.
- Blocked users are rejected at the middleware level even with a valid token.
- Customer and contractor accounts register normally. Public admin registration requires `ADMIN_REGISTRATION_KEY`; the seed command can also create admins directly in the `Admin` collection.
- Account collections are `users` (customers), `contractor_users` (contractors), and `Admin` (administrators), in the `buildnbuy` database.

## Demo Credentials

After running `npm run seed:admin`:

| Role | Email | Password |
|---|---|---|
| Admin | Value of `ADMIN_EMAIL` (defaults to `admin@gmail.com`) | Value of `ADMIN_PASSWORD` in `backend/.env` |
| Customer | customer1@buildnbuy.com | Customer@123 |
| Contractor | contractor1@buildnbuy.com | Contractor@123 |

## Screenshots

_Add screenshots here once the frontend is running: Home page, Property listing, Property details, Contractor profile, Customer dashboard, Contractor dashboard, Admin dashboard._

## Future Improvements

- Real-time chat via WebSockets/Socket.io (currently polling-friendly REST)
- Payment gateway integration for booking deposits
- Email notifications (SendGrid/SES) alongside in-app notifications
- Mortgage/EMI calculator on property details page
- Map-based search with geolocation clustering
- Mobile apps (React Native)
#   B u i l d N B u y - P r o j e c t -  
 