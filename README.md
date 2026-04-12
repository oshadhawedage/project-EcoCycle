# project-EcoCycle
E-Waste Management System

#  EcoCycle – E-Waste Management System

---

##  Project Overview

EcoCycle is a full-stack **E-Waste Management System** that enables users to manage electronic waste efficiently. The platform allows users to record e-waste items, request pickups, and track environmental impact such as CO₂ savings.

The system is **role-based**:

*  **USER** → Manage e-waste, request pickups, track impact
*  **RECYCLER** → Accept and manage pickup requests
*  **ADMIN** → Manage users, approve recyclers, configure system, and view analytics

---

##  Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* OTP Email Verification
* Nodemailer

### Database

* MongoDB (Mongoose)

---

##  Additional Libraries

### Frontend

* Recharts → Data visualization
* AOS → Animations
* Axios → API communication

### Backend / Utilities

* jsPDF + jspdf-autotable → PDF report generation

---

##  Project Structure

```
EcoCycle/
│
├── Backend/
├── Frontend/
└── README.md
```

---

#  Setup Instructions

##  Prerequisites

* Node.js (v18+)
* npm
* MongoDB (Atlas or local)
* Git

---
#  Deployment

## Live Application

Frontend: [https://project-eco-cycle.vercel.app]
Backend API: [https://project-ecocycle.onrender.com]

---

##  Clone Repository

```bash
git clone https://github.com/your-username/ecocycle.git
cd ecocycle
```
---

#  Backend Setup

```bash
cd Backend
npm install
```

### Create `.env` file

.env

PORT=5050
MONGO_URI=mongodb+srv://meghapromotacc_db_user:0F4DLtPOjgg0tZDw@cluster0.e138ci0.mongodb.net/EcoTest?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES=7d

APP_NAME=E-Waste Platform
CLIENT_URL=http://localhost:5173

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ewasteplatform01@gmail.com
EMAIL_PASS=vaxqwarmljiatdvo
EMAIL_FROM="E-Waste Platform <ewasteplatform01@gmail.com>"

OTP_EXPIRES_MIN=10

# Admin Registration Key (CHANGE THIS IN PRODUCTION!)
ADMIN_REGISTER_KEY=SecureAdminKey2024!

#public holiay api key
CALENDARIFIC_API_KEY=Uz6UeKdpeILDllnFfbr4LxiIZMyBzPji
```

### Run Backend

```bash
npm run dev
```

Backend: http://localhost:5050

---

#  Frontend Setup

```bash
cd Frontend
npm install
```

(Optional `.env`)

```env
VITE_API_BASE_URL=http://localhost:5050/api
```

Run:

```bash
npm run dev
```

Frontend: http://localhost:5173

---

#  Running the Application

* Ensure MongoDB is connected
* Run backend and frontend
* Open: http://localhost:5173

---

#  Authentication

Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

#  API Endpoint Documentation

##  Base URL

* Local: `http://localhost:5000`
* API Prefix: `/api`

---

##  General

| Method | Endpoint | Access | Description      |
| ------ | -------- | ------ | ---------------- |
| GET    | `/`      | Public | API health check |

---

##  User Authentication & Profile (`/api/users`)

| Method | Endpoint               | Access    | Description              |
| ------ | ---------------------- | --------- | ------------------------ |
| POST   | `/register`            | Public    | Register user (OTP sent) |
| POST   | `/verify-email`        | Public    | Verify email with OTP    |
| POST   | `/resend-otp`          | Public    | Resend OTP               |
| POST   | `/login`               | Public    | Login and get JWT        |
| POST   | `/forgot-password`     | Public    | Request password reset   |
| POST   | `/reset-password`      | Public    | Reset password using OTP |
| POST   | `/logout`              | Protected | Logout user              |
| GET    | `/me`                  | Protected | Get profile              |
| PATCH  | `/me`                  | Protected | Update profile           |
| PATCH  | `/change-password`     | Protected | Change password          |
| DELETE | `/me`                  | Protected | Delete account           |
| POST   | `/recycler-request`    | Protected | Request recycler role    |
| GET    | `/recycler-request/me` | Protected | Get recycler request     |

---

##  Admin (`/api/admin`)

### Public

| Method | Endpoint           | Description    |
| ------ | ------------------ | -------------- |
| POST   | `/register`        | Create admin   |
| POST   | `/verify-email`    | Verify admin   |
| POST   | `/resend-otp`      | Resend OTP     |
| POST   | `/login`           | Admin login    |
| POST   | `/forgot-password` | Reset request  |
| POST   | `/reset-password`  | Reset password |

### Protected (ADMIN)

| Method | Endpoint                 | Description    |
| ------ | ------------------------ | -------------- |
| GET    | `/me`                    | Admin profile  |
| POST   | `/logout`                | Logout         |
| GET    | `/users`                 | Get all users  |
| PATCH  | `/users/:id/role`        | Change role    |
| PATCH  | `/users/:id/block`       | Block user     |
| DELETE | `/users/:id`             | Delete user    |
| GET    | `/recycler-requests`     | View requests  |
| PATCH  | `/recycler-requests/:id` | Approve/reject |

---

##  E-Waste (`/api/ewaste`)

| Method | Endpoint | Access     | Description |
| ------ | -------- | ---------- | ----------- |
| POST   | `/`      | USER       | Create item |
| GET    | `/`      | All roles  | List items  |
| GET    | `/:id`   | All roles  | Get item    |
| PUT    | `/:id`   | Role-based | Update      |
| DELETE | `/:id`   | USER/ADMIN | Delete      |

---

##  Pickup Requests (`/api/pickups`)

| Method | Endpoint       | Access         | Description    |
| ------ | -------------- | -------------- | -------------- |
| POST   | `/`            | USER           | Create request |
| GET    | `/`            | RECYCLER/ADMIN | View all       |
| GET    | `/accepted/my` | RECYCLER       | My accepted    |
| GET    | `/:id`         | RECYCLER/ADMIN | Details        |
| PUT    | `/:id/accept`  | RECYCLER       | Accept request |
| PUT    | `/:id/status`  | RECYCLER/ADMIN | Update status  |
| DELETE | `/:id`         | ADMIN          | Delete         |

---

##  Impact Logs (`/api/impact-logs`)

| Method | Endpoint | Access    | Description |
| ------ | -------- | --------- | ----------- |
| POST   | `/`      | Protected | Create log  |
| GET    | `/`      | Protected | Get logs    |
| PUT    | `/:id`   | ADMIN     | Update      |
| DELETE | `/:id`   | ADMIN     | Delete      |

---

##  Analytics (`/api/analytics`)

| Method | Endpoint                 | Description     |
| ------ | ------------------------ | --------------- |
| GET    | `/overview`              | Summary metrics |
| GET    | `/monthly-trend`         | Monthly data    |
| GET    | `/category-distribution` | Category stats  |
| GET    | `/leaderboard`           | Top users       |

---

##  Settings (`/api/settings`)

| Method | Endpoint | Access    | Description     |
| ------ | -------- | --------- | --------------- |
| GET    | `/`      | Protected | Get settings    |
| PUT    | `/`      | ADMIN     | Update settings |

---

#  Deployment

## Backend

* Render / Railway

## Frontend

* Vercel / Netlify

## Live URLs

* Backend: (add link)
* Frontend: (add link)

---

# 🧪 Testing Instructions

### Unit Testing

```bash
npm test
```

### Integration Testing

* Postman / Thunder Client

### Performance Testing

* Artillery

---

# 📊 Features

* Role-based authentication
* OTP email verification
* E-waste tracking
* Pickup system
* Impact analytics dashboard
* PDF report generation
* Charts & visual analytics

---



#  Important Notes

* Do NOT upload `.env` file
* Replace placeholder values before submission
* Add deployed URLs

---

#  Verification

* Backend → http://localhost:5050
* Frontend → http://localhost:5173
* API working
* Database connected

---

