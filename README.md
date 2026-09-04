# Gasgo Lanka

## Problem

Customers often face long queues, uncertainty about gas availability, and difficulty knowing which shops have cylinders in stock. Gas shop owners also lack an efficient way to manage stock and customer orders.

## Solution

GasGo Lanka is a digital LPG ordering and token management platform that allows customers to check available cylinders, select one or more cylinders, place an order, and receive a unique token through the system and email. Shop owners can manage cylinder stock, receive orders and notifications, and update order status. Google Maps helps customers easily locate the selected gas shop, while role-based access keeps customer, owner, and admin information secure.

1. **Customer Token Ordering** - Godage S.N.

   Customers can select a gas shop and apply for a gas token/order through GasGo.

2. **Real-Time Stock Management** - Abeysinghe J.H.C.M.

   When a customer gets a token, the shop's available gas stock automatically decreases by 1. This prevents the displayed stock from becoming inaccurate.

3. **Owner Order Management** - Gunawadhana M.D.K.

   Shop owners have a dashboard where they can see customer orders/token applications, allowing them to know who has requested gas.

4. **Owner Stock Updating/Feedback** - Methasha W.V.D.S.

   When new gas cylinders arrive, the shop owner can update/increase the available stock level through their dashboard.

## Git repository link

https://github.com/dewshan001/SEF_Hackathon.git

## Deployed application link

https://sef-hackathon.vercel.app

## Two-minute demonstration video link

https://drive.google.com/drive/folders/1EvWyqNwD9REb1VQmk2LRlm8KGn4-pb-D?usp=sharing

## Team member names and student IDs

| IT Number  | Name                 |
|------------|----------------------|
| IT24102990 | Godage S.N.          |
| IT24103014 | Abeysinghe J.H.C.M.  |
| IT24103005 | Gunawadhana M.D.K.   |
| IT24102875 | Methasha W.V.D.S.    |

---

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