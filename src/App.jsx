import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import { ToastContainer } from "react-toastify";
import AddRoom from "./components/room/AddRoom";
import ExistingRooms from "./components/room/ExistingRooms";
import Home from "./components/home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditRoom from "./components/room/EditRoom";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";
import RoomListing from "./components/room/RoomListing";
import Admin from "./components/admin/Admin";
import Checkout from "./components/booking/Checkout";
import BookingSuccess from "./components/booking/BookingSuccess";
import Bookings from "./components/booking/Booking";
import Login from "./components/auth/Login"
import Registration from "./components/auth/Registration"
import Profile from "./components/auth/Profile"
import { AuthProvider } from "./components/auth/AuthProvider"
import RequireAuth from "./components/auth/RequireAuth"
import ServiceList from "./components/service/ServiceList";
import AddService from "./components/service/AddService";


function App() {
  return (
    <AuthProvider>
      <main>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit-room" element={<EditRoom />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/existing-rooms" element={<ExistingRooms />} />
            <Route path="/browse-all-rooms" element={<RoomListing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="book-room" element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            } />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/existing-bookings" element={<Bookings />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/service-list" element={<ServiceList />} />
            <Route path="/add-service" element={<AddService />} />
          </Routes>
          <Footer />
        </Router>
        <ToastContainer/>
      </main>
    </AuthProvider>
  );
}

export default App;
