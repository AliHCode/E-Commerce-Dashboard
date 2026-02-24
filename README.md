<div align="center">
  <img src="https://picsum.photos/seed/aether/800/250" alt="Aether Dashboard Banner" width="100%" />
</div>

<h1 align="center">Aether Dashboard</h1>

<p align="center">
  <strong>A premium, glassmorphic React admin dashboard backed by a local Express & SQLite REST API.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#project-structure">Project Structure</a>
</p>

---

## ✨ Features

- **Premium Aesthetics**: Fully custom glassmorphic UI overlaying a modern grid, utilizing a custom teal-to-violet `primary` palette and refined ambient glows.
- **Dynamic Theming**: Seamlesly toggle between a crisp Light Mode and a deep, immersive Dark Mode (`bg-slate-900`/`bg-slate-950`).
- **Full-Stack Architecture**: A fully integrated frontend (React/Vite) and backend (Node.js/Express) within a unified workspace.
- **Local SQLite Database**: Includes `better-sqlite3` for lightning-fast, persistent local data storage. No complex database servers required.
- **Complete CRUD Operations**: Add, Edit, and Delete **Products**, **Orders**, and **Customers** in real-time.
- **Optimistic UI Updates**: Network fetches are seamlessly synchronized with React State for instant user feedback.
- **Interactive Animations**: Powered by `framer-motion` for fluid page transitions, modal pop-ups, and hover interactions.
- **Data Visualization**: Integrated with `recharts` for dynamic, beautiful analytical charts.

<br/>

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 + Custom Utility Classes
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Components**: Custom, accessible UI components (Radix UI inspired)

### Backend
- **Server**: Node.js + Express
- **Database**: SQLite (`better-sqlite3`)
- **Development**: `tsx` (TypeScript Execution)
- **Middleware**: CORS, Express JSON Parser

<br/>

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/AliHCode/E-Commerce-Dashboard.git
   ```
2. Navigate into the project directory:
   ```sh
   cd E-Commerce-Dashboard
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application

This project requires both the Backend Server and the Frontend Development Server to be running simultaneously.

**1. Seed the Database (First time only)**
Populates the empty SQLite database with initial mock data.
```sh
npm run seed
```

**2. Start the Backend API Server**
Runs the Express server on `http://localhost:5000`. It will watch for file changes.
```sh
npm run server
```

**3. Start the Frontend Development Server**
Open a **new terminal tab/window**, and run:
```sh
npm run dev
```

Visit `http://localhost:3000` (or the port provided by Vite) in your browser to view the dashboard!

<br/>

## 📡 API Reference

The local Express server exposes the following RESTful endpoints:

### Products
- `GET /api/products` - Retrieve all inventory
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update an existing product
- `DELETE /api/products/:id` - Delete a product

### Orders
- `GET /api/orders` - Retrieve all orders (Joined with Customer names)
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an existing order
- `DELETE /api/orders/:id` - Delete an order

### Customers
- `GET /api/customers` - Retrieve all customers
- `POST /api/customers` - Create a new customer
- `DELETE /api/customers/:id` - Delete a customer

<br/>

## 📂 Project Structure

```text
├── server/                 # Express Backend
│   ├── index.ts            # Entry point & API Routes
│   ├── db.ts               # SQLite configuration & Schema
│   └── seed.ts             # Database population script
├── src/                    # React Frontend
│   ├── components/         # Reusable UI components (Cards, Modals, etc.)
│   ├── contexts/           # React Context (Auth, Theme, Data fetching)
│   ├── pages/              # Main view components (Dashboard, Orders, etc.)
│   ├── data/               # Static mock data (now migrated to SQLite)
│   ├── lib/                # Utility functions (Tailwind class merger)
│   ├── App.tsx             # Main layout and routing
│   └── index.css           # Global Tailwind and custom glassmorphism styles
└── package.json            # Project dependencies and scripts
```

---
<p align="center">Designed with precision. Built for scale.</p>
