# 🗂️ TaskManager — Scalable REST API with JWT Auth & RBAC

A full-stack web application built with **Node.js + Express + MongoDB** (backend) and **React.js** (frontend), featuring JWT authentication, role-based access control, and full CRUD for task management.

---

## 🚀 Features

### Backend
- ✅ User Registration & Login with **bcrypt** password hashing
- ✅ **JWT Authentication** (7-day token expiry)
- ✅ **Role-Based Access Control** (user vs admin)
- ✅ Full **CRUD** for Tasks (Create, Read, Update, Delete)
- ✅ **API Versioning** (`/api/v1/`)
- ✅ Input validation with `express-validator`
- ✅ Global error handling & 404 middleware
- ✅ **MongoDB** with Mongoose ODM

### Frontend
- ✅ Login & Register pages
- ✅ Protected Dashboard (JWT required)
- ✅ Create, edit, delete tasks inline
- ✅ Click-to-cycle task status (pending → in-progress → completed)
- ✅ Admin Panel to view & manage all users
- ✅ Error & success notifications

### Security
- ✅ Passwords hashed with **bcryptjs** (salt rounds: 12)
- ✅ JWT stored securely, sent via `Authorization: Bearer` header
- ✅ Input sanitization on all routes
- ✅ Role-protected admin routes

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Node.js, Express.js               |
| Database   | MongoDB, Mongoose                 |
| Auth       | JWT, bcryptjs                     |
| Frontend   | React.js, React Router v6         |
| HTTP Client| Axios                             |
| Validation | express-validator                 |
| API Docs   | Postman Collection                |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/taskmanager-internship.git
cd taskmanager-internship
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Backend runs on: `http://localhost:5000`  
Frontend runs on: `http://localhost:3000`

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api/v1`

#### Auth Endpoints
| Method | Endpoint          | Access  | Description        |
|--------|-------------------|---------|--------------------|
| POST   | /auth/register    | Public  | Register new user  |
| POST   | /auth/login       | Public  | Login & get token  |
| GET    | /auth/me          | Private | Get own profile    |

#### Task Endpoints
| Method | Endpoint     | Access  | Description                        |
|--------|--------------|---------|------------------------------------|
| GET    | /tasks       | Private | Get tasks (own / all if admin)     |
| GET    | /tasks/:id   | Private | Get single task                    |
| POST   | /tasks       | Private | Create new task                    |
| PUT    | /tasks/:id   | Private | Update task                        |
| DELETE | /tasks/:id   | Private | Delete task                        |

#### Admin Endpoints
| Method | Endpoint          | Access     | Description      |
|--------|-------------------|------------|------------------|
| GET    | /admin/users      | Admin only | Get all users    |
| DELETE | /admin/users/:id  | Admin only | Delete a user    |

### Example: Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Yochna","email":"yochna@test.com","password":"pass123","role":"user"}'
```

### Example: Create Task (authenticated)
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Details here","priority":"high"}'
```

---

## 📁 Project Structure

```
taskmanager-internship/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/     # Auth & RBAC middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── server.js      # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/         # Login, Register, Dashboard, AdminPanel
│       ├── services/      # Axios API calls
│       └── App.js         # Router & auth state
├── TaskManager-API.postman_collection.json
└── README.md
```

---

## 📈 Scalability Notes

This project is designed with scalability in mind:

- **API Versioning** (`/api/v1/`) allows backward-compatible upgrades
- **Modular structure** (controllers/routes/models separated) supports adding new modules without touching existing code
- **MongoDB** scales horizontally with sharding for large datasets
- **JWT stateless auth** means no session storage — scales across multiple server instances
- **Future enhancements:**
  - Add **Redis** caching for frequently read data (e.g., task lists)
  - Add **Docker** containerization for consistent deployments
  - Split into **microservices** (auth-service, task-service) for independent scaling
  - Add a **load balancer** (Nginx) in front of multiple Node.js instances

---

## 📬 API Documentation

Import `TaskManager-API.postman_collection.json` into Postman:
1. Open Postman → Import → Upload file
2. Set `base_url` variable to `http://localhost:5000/api/v1`
3. After login, copy the token and set `token` variable
4. All authenticated requests will work automatically

---

## 👩‍💻 Author

**Yochna Rao**  
Backend Developer Intern Candidate  
GitHub: [github.com/yourusername](https://github.com/yourusername)
