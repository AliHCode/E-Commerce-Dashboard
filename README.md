<div align="center">

  <!-- Logo -->
  <br />
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 20h4l2.5-4.5h7L18 20h4L12 2z" fill="#0d9488" fill-opacity="0.2"/>
    <path d="M12 4.5L5.5 16h3.5L12 9l3 7h3.5L12 4.5z" fill="#0d9488"/>
    <path d="M12 11l-2 3h4l-2-3z" fill="#0d9488"/>
  </svg>
  <br />

  # Aether Dashboard

  **A production-ready, full-stack E-Commerce admin dashboard with JWT authentication, server-side pagination, and a sleek glassmorphic UI.**

  [![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white)](https://e-commerce-dashboard-jade.vercel.app)
  [![GitHub](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AliHCode/E-Commerce-Dashboard)

  <br />

  [Features](#-features) •
  [Screenshots](#-screenshots) •
  [Tech Stack](#-tech-stack) •
  [Architecture](#-architecture) •
  [Getting Started](#-getting-started) •
  [API Reference](#-api-reference) •
  [Environment Variables](#-environment-variables) •
  [Deployment](#-deployment) •
  [Project Structure](#-project-structure)

</div>

<br />

---

<br />

## ✨ Features

### Core Functionality
- **🔐 JWT Authentication** — Secure registration & login with `bcryptjs` password hashing and JSON Web Token authorization
- **📊 Real-Time Analytics** — Dashboard stats (revenue, orders, customers, products) computed dynamically from live database data
- **📦 Full CRUD Operations** — Create, Read, Update, and Delete for Products, Orders, and Customers
- **📄 Server-Side Pagination** — Scalable order fetching with `LIMIT`/`OFFSET` and pagination metadata
- **🔍 Search & Filter** — Client-side search and status filtering across all data tables

### UI/UX
- **🌗 Dark/Light Mode** — Fully functional theme toggling with class-based dark mode and localStorage persistence
- **🎨 Glassmorphic Design** — Premium frosted-glass UI with ambient glow effects, smooth gradients, and custom color palette
- **⚡ Animated Interactions** — Fluid page transitions, modal pop-ups, and hover effects powered by Framer Motion
- **📱 Responsive Layout** — Mobile-first design with collapsible sidebar navigation
- **📈 Data Visualization** — Dynamic revenue charts with Recharts, aggregated from real order data

### Security & Production
- **🛡️ Protected Routes** — All data endpoints secured behind JWT middleware
- **🔒 Password Hashing** — Industry-standard bcrypt with salt rounds
- **☁️ Cloud Database** — Neon Serverless PostgreSQL for persistent, scalable storage
- **🚀 Vercel Deployment** — Serverless API functions with automatic CI/CD from GitHub

<br />

## 📸 Screenshots

<div align="center">

### Login & Authentication
<!-- Replace with your actual screenshot -->
> 📌 *Add screenshot: `./screenshots/login.png`*

### Dashboard Overview
<!-- Replace with your actual screenshot -->
> 📌 *Add screenshot: `./screenshots/dashboard.png`*

### Orders Management (with Pagination)
<!-- Replace with your actual screenshot -->
> 📌 *Add screenshot: `./screenshots/orders.png`*

### Products Inventory
<!-- Replace with your actual screenshot -->
> 📌 *Add screenshot: `./screenshots/products.png`*

### Customer Management
<!-- Replace with your actual screenshot -->
> 📌 *Add screenshot: `./screenshots/customers.png`*

### Dark Mode
<!-- Replace with your actual screenshot -->
> 📌 *Add screenshot: `./screenshots/dark-mode.png`*

### Settings & Profile
<!-- Replace with your actual screenshot -->
> 📌 *Add screenshot: `./screenshots/settings.png`*

</div>

<br />

## 🛠 Tech Stack

<table>
  <tr>
    <td align="center" width="140"><strong>Category</strong></td>
    <td><strong>Technologies</strong></td>
  </tr>
  <tr>
    <td align="center"><strong>Frontend</strong></td>
    <td>React 19 · Vite 6 · TypeScript · Tailwind CSS v4 · React Router v7 · Framer Motion · Recharts · Lucide Icons</td>
  </tr>
  <tr>
    <td align="center"><strong>Backend</strong></td>
    <td>Node.js · Express.js · JSON Web Tokens · bcryptjs · PostgreSQL (pg)</td>
  </tr>
  <tr>
    <td align="center"><strong>Database</strong></td>
    <td>Neon Serverless PostgreSQL (Cloud) · SSL Connection Pooling</td>
  </tr>
  <tr>
    <td align="center"><strong>Deployment</strong></td>
    <td>Vercel · Serverless Functions · GitHub CI/CD</td>
  </tr>
  <tr>
    <td align="center"><strong>Dev Tools</strong></td>
    <td>tsx · npm-run-all · ESLint · TypeScript ~5.8</td>
  </tr>
</table>

<br />

## 🏗 Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         VERCEL CLOUD                           │
├──────────────────────┬─────────────────────────────────────────┤
│   Static Frontend    │         Serverless API                  │
│   (Vite Build)       │       (api/index.ts)                    │
│                      │                                         │
│  React SPA ──────────┤──► Express.js App                       │
│  Tailwind CSS        │    ├── POST /api/register               │
│  Framer Motion       │    ├── POST /api/login                  │
│  Recharts            │    ├── GET  /api/customers  🔒          │
│                      │    ├── GET  /api/products   🔒          │
│                      │    ├── GET  /api/orders     🔒 (paged)  │
│                      │    └── CRUD endpoints       🔒          │
├──────────────────────┴──────────────┬──────────────────────────┤
│                                     │                          │
│              JWT Auth Middleware     │    Neon PostgreSQL       │
│          (Bearer Token Validation)  │    (Cloud Database)      │
│                                     │                          │
└─────────────────────────────────────┴──────────────────────────┘

🔒 = Protected by authenticateToken middleware
```

<br />

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed ([download](https://nodejs.org))
- **Neon Account** for cloud PostgreSQL ([sign up free](https://neon.tech))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AliHCode/E-Commerce-Dashboard.git
cd E-Commerce-Dashboard

# 2. Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://your_user:your_password@your_host/your_db?sslmode=require
JWT_SECRET=your_secret_key_here
```

### Running Locally

```bash
# Seed the database with sample data (first time only)
npm run seed

# Start both frontend + backend concurrently
npm run dev
```

This runs:
- **Frontend** → `http://localhost:3000` (Vite dev server)
- **Backend** → `http://localhost:5000` (Express API server)

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run dev:client` | Start only the Vite frontend |
| `npm run dev:server` | Start only the Express backend |
| `npm run build` | Build the frontend for production |
| `npm run seed` | Populate the database with sample data |
| `npm run lint` | Run TypeScript type checking |

<br />

## 📡 API Reference

All data endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register a new admin user |
| `POST` | `/api/login` | Authenticate and receive JWT |
| `GET` | `/api/health` | Server health check |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Products 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Retrieve all products |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE` | `/api/products/:id` | Delete a product |

### Orders 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders?page=1&limit=10` | Retrieve paginated orders |
| `POST` | `/api/orders` | Create a new order |
| `PUT` | `/api/orders/:id` | Update an existing order |
| `DELETE` | `/api/orders/:id` | Delete an order |

**Paginated Response:**
```json
{
  "data": [...],
  "meta": {
    "totalItems": 50,
    "currentPage": 1,
    "totalPages": 5,
    "limit": 10
  }
}
```

### Customers 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/customers` | Retrieve all customers |
| `POST` | `/api/customers` | Create a new customer |
| `DELETE` | `/api/customers/:id` | Delete a customer |

<br />

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | ✅ Yes |

> **Note:** For local development, `tsx` automatically loads variables from `.env`. On Vercel, set these in **Settings → Environment Variables**.

<br />

## 🌐 Deployment

This project is optimized for **Vercel** deployment:

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add `DATABASE_URL` and `JWT_SECRET` as Environment Variables
4. Deploy — Vercel auto-detects the Vite frontend and the `api/` serverless function

The `vercel.json` configuration handles:
- Building the Vite SPA to `dist/`
- Routing `/api/*` requests to the serverless Express function
- SPA fallback routing for client-side navigation

<br />

## 📂 Project Structure

```
E-Commerce-Dashboard/
├── api/
│   └── index.ts                # Vercel Serverless Function (Express app)
├── server/
│   ├── index.ts                # Express server for local development
│   ├── db.ts                   # PostgreSQL connection pool & schema
│   └── seed.ts                 # Database seeding script
├── src/
│   ├── components/
│   │   ├── ui/                 # Base UI components (Card, Modal)
│   │   ├── InventoryList.tsx   # Dashboard inventory widget
│   │   ├── LogoIcon.tsx        # Custom "A" SVG logo
│   │   ├── ProtectedRoute.tsx  # Auth route guard
│   │   ├── RecentOrders.tsx    # Dashboard recent orders widget
│   │   └── SalesChart.tsx      # Revenue bar chart (Recharts)
│   ├── contexts/
│   │   ├── AuthContext.tsx     # JWT auth state management
│   │   ├── DataContext.tsx     # API data fetching & CRUD
│   │   └── ThemeContext.tsx    # Dark/Light mode toggling
│   ├── pages/
│   │   ├── Dashboard.tsx       # Analytics overview
│   │   ├── Login.tsx           # Authentication (Login/Register)
│   │   ├── Orders.tsx          # Paginated orders table
│   │   ├── OrderDetails.tsx    # Individual order view
│   │   ├── Products.tsx        # Product inventory CRUD
│   │   ├── Customers.tsx       # Customer management CRUD
│   │   └── Settings.tsx        # Profile & appearance config
│   ├── App.tsx                 # Root layout, sidebar, routing
│   └── index.css               # Tailwind config & glassmorphism utilities
├── vercel.json                 # Vercel deployment configuration
├── package.json                # Dependencies & scripts
└── tsconfig.json               # TypeScript configuration
```

<br />

## 🗄️ Database Schema

```sql
-- Users (Authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Active',
  avatar TEXT
);

-- Products
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) UNIQUE NOT NULL,
  stock INTEGER DEFAULT 0,
  price VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'In Stock'
);

-- Orders
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  amount VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  date VARCHAR(50) NOT NULL
);
```

<br />

---

<div align="center">

  **Built with ❤️ by [Ali H](https://github.com/AliHCode)**

  <sub>Designed with precision. Built for scale. Deployed for production.</sub>

</div>
