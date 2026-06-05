<div align="center">

# ⭐ StoreRate

### A full-stack MERN store rating platform with role-based access control

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)

🎨 [Frontend Live](https://store-rating-frontend-chi.vercel.app) &nbsp;|&nbsp; ⚙️ [Backend API](https://store-rating-backend-87wl.onrender.com/health)

</div>

---

## 📌 Overview

StoreRate is a full-stack MERN application where users can discover and rate stores, admins can manage the entire platform, and store owners can track their store's performance — all secured with JWT-based role authentication.

---

## 🚀 Features

### 🔐 Authentication & Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control (Admin / User / Owner)

### 🛠 Admin

- Dashboard with platform statistics
- Add and manage users & stores
- Assign store owners
- View all ratings

### 👤 User

- Register & login
- Browse and search stores
- Submit and update ratings
- Change password

### 🏪 Store Owner

- View assigned store
- View received ratings
- View average rating
- Change password

---

## 🛠 Tech Stack

| Layer    | Technology                                                   |
| -------- | ------------------------------------------------------------ |
| Frontend | React.js, React Router DOM, Axios, Context API, Tailwind CSS |
| Backend  | Node.js, Express.js                                          |
| Auth     | JWT, bcrypt.js                                               |
| Database | MongoDB Atlas, Mongoose                                      |

---

## 📁 Project Structure

```text
StoreRate/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── owner/
│   │   │   └── user/
│   │   └── App.js
│
└── README.md
```

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint                    | Access  | Description       |
| ------ | --------------------------- | ------- | ----------------- |
| POST   | `/api/auth/signup`          | Public  | Register new user |
| POST   | `/api/auth/login`           | Public  | Login user        |
| PUT    | `/api/auth/update-password` | Private | Change password   |

### Admin

| Method | Endpoint               | Access | Description         |
| ------ | ---------------------- | ------ | ------------------- |
| GET    | `/api/admin/dashboard` | Admin  | Platform statistics |
| POST   | `/api/admin/users`     | Admin  | Add new user        |
| GET    | `/api/admin/users`     | Admin  | Get all users       |
| GET    | `/api/admin/users/:id` | Admin  | Get user by ID      |
| POST   | `/api/admin/stores`    | Admin  | Add new store       |
| GET    | `/api/admin/stores`    | Admin  | Get all stores      |

### User

| Method | Endpoint           | Access | Description             |
| ------ | ------------------ | ------ | ----------------------- |
| GET    | `/api/user/stores` | User   | Browse & search stores  |
| POST   | `/api/user/rating` | User   | Submit or update rating |

### Owner

| Method | Endpoint               | Access | Description          |
| ------ | ---------------------- | ------ | -------------------- |
| GET    | `/api/owner/dashboard` | Owner  | View store & ratings |

---

## 📋 Validation Rules

| Field    | Rule                                         |
| -------- | -------------------------------------------- |
| Name     | 8–60 characters                              |
| Address  | Max 400 characters                           |
| Password | 8–16 chars, 1 uppercase, 1 special character |
| Email    | Valid email format                           |

---

## 🔐 User Roles

| Role        | Permissions                    |
| ----------- | ------------------------------ |
| Admin       | Manage users, stores, platform |
| User        | Browse stores, submit ratings  |
| Store Owner | View store analytics & ratings |

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

ADMIN_NAME=System Administrator Account
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
ADMIN_ADDRESS=Platform HQ
```

Also create a `.env.example` and commit it:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_ADDRESS=
```

> ⚠️ Never commit your actual `.env` file.

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/vijayptl0106/storerate.git
cd storerate
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

Runs on: `http://localhost:5000`

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

Runs on: `http://localhost:3000`

---

## 👨‍💼 Seed Admin Account

Admins cannot self-register. Use the seed script to create the first admin.

```bash
cd backend
node seed.js
```

Then login with the credentials set in your `.env`.

---

## 💡 Design Decisions

- **JWT in localStorage** — kept simple for assessment scope; httpOnly cookies would be used in production
- **One rating per user per store** — ratings are upserted, not duplicated
- **Role-based routing on both client and server** — frontend redirects by role, backend enforces via middleware
- **Single store per owner** — owners are assigned one store by admin
- **Seed script for admin** — avoids exposing an open admin registration endpoint

---

## ⚠️ Known Limitations

- No email verification
- No forgot password flow
- Ratings are integers only (1–5)
- No pagination on store/user lists

---

## 🚀 Future Enhancements

- Email verification & forgot password
- Store reviews and comments
- Advanced search and filters
- Analytics dashboard
- Store image uploads
- Notifications

---

## 👨‍💻 Author

**Vijay Satish Patil**

- 📧 [vijayptl0106@gmail.com](mailto:vijayptl0106@gmail.com)
- 🐙 [github.com/vijayptl0106](https://github.com/vijayptl0106)
- 💼 [linkedin.com/in/vijay-patil-518872254](https://www.linkedin.com/in/vijay-patil-518872254)

---

<div align="center">
⭐ If you found this project useful, consider giving it a star.
</div>

<!-- # StoreRate — Store Rating Platform

A full-stack web app where users can rate stores. Built with MERN stack.

## Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt

## Project Structure

```
/backend
  /models         → User, Store, Rating schemas
  /routes         → Auth, Admin, User, Owner routes
  /controllers    → Business logic
  /middleware     → JWT auth + role guards
  server.js
  .env

/frontend
  /src
    /pages
      /admin      → Dashboard, Users, Stores, AddUser, AddStore, UserDetail
      /user       → Stores, ChangePassword
      /owner      → Dashboard, ChangePassword
    /components   → Navbar, StarRating
    /context      → AuthContext (JWT + role)
    App.js
```

## Setup & Run

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

The `"proxy": "http://localhost:5000"` in frontend/package.json handles API calls.

## User Roles

| Role        | Access                                   |
| ----------- | ---------------------------------------- |
| Admin       | Dashboard stats, add/view users & stores |
| Normal User | Browse stores, submit/update ratings     |
| Store Owner | View own store ratings and average       |

## Form Validation Rules

- **Name:** 8–60 characters
- **Address:** Max 400 characters
- **Password:** 8–16 chars, must have 1 uppercase + 1 special character
- **Email:** Standard email format

## Default Admin Setup

Since admins can't self-register, create the first admin directly in MongoDB:

```js
// In MongoDB shell or Compass
db.users.insertOne({
  name: "Administrator Account Name",
  email: "admin@example.com",
  password: "<bcrypt hash of your password>",
  role: "admin",
  address: "Admin Office Address",
});
```

Or use a seed script — create `backend/seed.js`:

```js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hash = await bcrypt.hash("Admin@123", 10);
  await User.create({
    name: "System Administrator Account",
    email: "admin@storerate.com",
    password: hash,
    role: "admin",
    address: "Platform HQ",
  });
  console.log(
    "Admin created — email: admin@storerate.com, password: Admin@123",
  );
  process.exit();
});
```

Run with: `node seed.js` -->
