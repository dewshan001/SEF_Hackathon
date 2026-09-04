# MERN Stack Project

A full-stack web application built with **MongoDB**, **Express.js**, **React** (Vite), and **Node.js**.

## 📁 Project Structure

```
SEF_Hackathon/
├── client/          # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/          # Node.js + Express backend
    ├── config/
    │   └── db.js            # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   └── userController.js
    ├── middleware/
    │   └── authMiddleware.js # JWT protect & admin middleware
    ├── models/
    │   └── userModel.js      # Mongoose User schema
    ├── routes/
    │   ├── authRoutes.js
    │   └── userRoutes.js
    ├── utils/
    │   └── generateToken.js  # JWT token helper
    ├── .env                  # Environment variables
    ├── index.js              # Express entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Configure Environment Variables

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers

```bash
# Terminal 1 - Start the backend
cd server && npm run dev

# Terminal 2 - Start the frontend
cd client && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔗 API Endpoints

| Method | Endpoint               | Access        | Description           |
|--------|------------------------|---------------|-----------------------|
| POST   | `/api/auth/register`   | Public        | Register new user     |
| POST   | `/api/auth/login`      | Public        | Login & get JWT       |
| GET    | `/api/auth/me`         | Private       | Get current user      |
| GET    | `/api/users`           | Admin only    | Get all users         |
| GET    | `/api/users/:id`       | Admin only    | Get user by ID        |
| PUT    | `/api/users/profile`   | Private       | Update user profile   |
| DELETE | `/api/users/:id`       | Admin only    | Delete user           |
| GET    | `/api/health`          | Public        | Server health check   |

## 🛠 Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 19, Vite 8, React Router |
| Backend   | Node.js, Express 4             |
| Database  | MongoDB, Mongoose              |
| Auth      | JWT, bcryptjs                  |