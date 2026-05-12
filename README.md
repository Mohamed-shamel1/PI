# 🍔 Food PI - Full-Stack Food Delivery System

A modern, high-performance food delivery platform with a robust admin dashboard, business analytics, and dual-language support (Arabic/English).

## 🚀 Getting Started

Follow these steps to set up and run the project locally after cloning the repository.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MySQL** (Running on localhost:3306 or update the connection string)
- **npm** or **yarn**

---

### 2. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` folder and copy the following template:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/electro_pi_db"
   PORT=5000
   JWT_SECRET="your_super_secret_key"
   JWT_REFRESH_SECRET="your_refresh_secret_key"
   JWT_EXPIRE="1d"
   ```
   *Note: go and make a new database for this project using phpmyadmin.*

4. **Initialize the Database:**
   Push the Prisma schema to your local MySQL instance:
   ```bash
   npx prisma db push
   ```

5. **Seed the Database:**
   Populate the database with realistic products, users, and orders:
   ```bash
   npx prisma db seed
   ```

6. **Start the Backend Server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

### 3. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

### 4. Default Credentials (After Seeding)

After running the seed command, you can use these accounts:

- **Admin Account:**
  - **Email:** `admin@foodpi.com`
  - **Password:** `password123`

- **Customer Accounts:**
  - **Email:** `customer1@example.com` to `customer10@example.com`
  - **Password:** `password123`

---

## 🛠 Features Included
- **Admin Dashboard:** Full business analytics using Recharts.
- **Product Management:** Categorization, discounts, and options.
- **Order System:** Real-time tracking and management.
- **Localization:** Full support for RTL (Arabic) and LTR (English).
- **Security:** JWT Authentication and Bcrypt password hashing.
