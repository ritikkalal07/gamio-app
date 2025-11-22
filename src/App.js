import './styles/style.css';
import './styles/admin_style.css';
import './utils/script.js';
import React from "react";
import { Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import BookingPage from './pages/BookingPage';
import Home from './pages/Home';
import Sport from './pages/Sport';
import VenueDetails from './pages/VenueDetails';
import BookSlot from './pages/BookSlot';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import ResetPassword from './pages/ResetPassword';
import VerifyOtp from './pages/VerifyOtp';
import Booking from './pages/Booking';
import BookingForm from './pages/BookingForm';
import MyBookings from "./pages/MyBookings";
import AdminSlotsPage from './pages/Admin/AdminSlotsPage';
import BulkUpload from './pages/Admin/BulkUpload';
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";

// import ManageProfile from './pages/ManageProfile';

import ProtectedRoute from './components/ProtectedRoute';

import SideBar from './components/Admin/SideBar';
import Admin_DashBoard from './pages/Admin/Admin_DashBoard';
import Admin_Bookings from './pages/Admin/Admin_Bookings';
import Admin_Venue from './pages/Admin/Admin_Venue';
import AddGame from './pages/Admin/AddGame';
import GamesList from './pages/Admin/GamesList';
import Users from './pages/Admin/Users';
import Admin_Feedback from './pages/Admin/Admin_Feedback';
import AdminPayments from "./pages/Admin/AdminPayments";

function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function AdminLayout() {
  return (
    <div className="admin-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <SideBar />
      <div className="admin-content" style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* ---------------- USER SIDE ROUTES ---------------- */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sport" element={<Sport />} />
          <Route path="/venue/:id" element={<VenueDetails />} />
          <Route path="/book/:id" element={<BookSlot />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookingpage" element={<BookingPage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/verify-signup" element={<VerifyOtp />} />
          <Route path="/confirm-booking/:id/:time/:price" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>

        {/* ---------------- ADMIN SIDE ROUTES ---------------- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin_DashBoard />} />
          <Route path="dashboard" element={<Admin_DashBoard />} />
          <Route path="venues" element={<Admin_Venue />} />
          <Route path="bookings" element={<Admin_Bookings />} />
          <Route path="users" element={<Users />} />
          <Route path="addgame" element={<AddGame />} />
          <Route path="bulkupload" element={<BulkUpload />} />
          <Route path="gameslist" element={<GamesList />} />
          <Route path="adminfeedback" element={<Admin_Feedback />} />
          <Route path="adminslotspage" element={<AdminSlotsPage />}/>
          <Route path="/admin/payments" element={<AdminPayments />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
