import './styles/style.css';
//import './styles/admin_style.css';
import './utils/script.js';
import SideBar from './components/Admin/SideBar.js';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Sport from './pages/Sport';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import ProtectedRoute from './components/ProtectedRoute';
import Admin_DashBoard from './pages/Admin/Admin_DashBoard';
import Admin_Bookings from './pages/Admin/Admin_Bookings';
import Admin_Users from './pages/Admin/Admin_Users';
import Admin_Venue from './pages/Admin/Admin_Venue';

function App() {
  return (
   <div>
    <Navbar/>
    {/* <div className="admin-layout">
    <SideBar/> */}
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='Sport' element={<Sport/>}/>
      <Route path='Dashboard' element={<Dashboard/>}/>
      <Route path='Contact' element={<Contact/>}/>
      <Route path='Login' element={<Login/>}/>
      <Route path='Register' element={<Register/>}/>
      <Route path='Forgot' element={<Forgot/>}/>

       {/* <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<SideBar />}>
            <Route index element={<Admin_DashBoard />} />
            <Route path="Admin_DashBoard" element={<Admin_DashBoard />} />
            <Route path="Admin_Bookings" element={<Admin_Bookings />} />
            <Route path="Admin_Users" element={<Admin_Users />} />
            <Route path="Admin_Venue" element={<Admin_Venue />} />
          </Route>
        </Route> */}

    </Routes>
    {/* </div> */}
    <Footer/>
   </div>
  );
}

export default App;
