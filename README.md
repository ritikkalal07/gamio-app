---

# 🎮 Gamio — MERN Stack Venue Booking Platform

Gamio is a **full-stack MERN application** designed to automate the process of booking sports venues and game zones.
It provides a seamless experience for users to browse venues, book available slots, make secure payments, and receive digital tickets, while giving admins powerful tools to manage venues and bookings efficiently.

---

## 🚀 Project Overview

Traditional venue booking is often manual and time-consuming. Gamio solves this problem by providing an **end-to-end online booking system** with real-time availability, payment integration, and automated ticket generation.

The project is built using the **MERN stack (MongoDB, Express, React, Node.js)** and follows the **MVC architecture** on the backend for clean and maintainable code.

---

## 🧩 Key Features

### 👤 User Features

* Browse available venues and game zones
* View venue details and available time slots
* Book venues by selecting date, time, and price
* Secure online payment using **PayPal**
* Automatic **PDF ticket generation** after successful booking
* Clean, responsive UI optimized for mobile users

### 🛠 Admin Features

* Add, update, and delete venues
* Manage time slots and pricing
* Bulk upload venues or slots using **CSV/XLSX files**
* View and manage all bookings
* User-friendly admin dashboard

---

## 🏗 Architecture (MVC Pattern)

Gamio’s backend strictly follows the **MVC (Model–View–Controller)** pattern:

### **Model**

* Defined using **Mongoose schemas**
* Handles database structure for Users, Venues, and Bookings

### **View**

* Implemented using **React**
* Displays UI, forms, venue listings, and booking pages

### **Controller**

* Handles business logic
* Processes requests, communicates with models, and sends responses

This separation ensures scalability, maintainability, and cleaner code.

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS / Tailwind / Custom UI
* SweetAlert2 for notifications

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Multer (file uploads)
* CSV-Parser / XLSX (bulk uploads)
* PayPal SDK
* PDF generation libraries

### Deployment

* Frontend hosted on **Vercel**
* Backend currently runs locally (deployment planned on Render/Heroku)
* MongoDB Atlas for database

---

## 🔄 Application Flow

1. User visits the Gamio website
2. React frontend fetches venue data using Axios
3. User selects a venue and time slot
4. Booking details are sent to Express backend
5. Backend validates and stores booking in MongoDB
6. PayPal payment is initiated and verified
7. Booking status is updated to “Paid”
8. Backend generates a **PDF ticket**
9. User downloads the ticket instantly

---


## ⚙ Environment Variables

Create a `.env` file inside the backend directory and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

---

## ▶ How to Run the Project Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🚧 Deployment Status

* ✅ Frontend is successfully deployed on **Vercel**
* ⚠ Backend works locally but faces limitations on Vercel due to:

  * Serverless function restrictions
  * File upload handling
  * PDF generation
  * PayPal verification requiring a persistent server

The backend will be deployed on **Render or Heroku** for full functionality in the next phase.

---

## 🔮 Future Enhancements

* Email ticket delivery
* Role-based authentication using JWT
* Real-time slot availability
* Improved admin analytics
* Cloud storage for file uploads

---

## 👨‍💻 Author

**Ritik Kalal**
MERN Stack Developer
GitHub: [https://github.com/ritikkalal07](https://github.com/ritikkal07)

---


* Add **badges** (MERN, Vercel, MongoDB)
* Optimize README for **recruiters**
* Shorten it for **hackathon submission**

Just tell me 👍
