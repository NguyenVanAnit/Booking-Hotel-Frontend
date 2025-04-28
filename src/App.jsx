import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import { ToastContainer } from "react-toastify";
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
import Bookings from "./components/booking/BookingList";
import Login from "./components/auth/Login"
import Registration from "./components/auth/Registration"
import Profile from "./components/auth/Profile"
import { AuthProvider } from "./components/auth/AuthProvider"
import RequireAuth from "./components/auth/RequireAuth"
import ServiceList from "./components/service/ServiceList";
import AddService from "./components/service/AddService";
import ServiceOfRoom from "./components/room/ServicesOfRoom";
import DetailRoom from "./components/room/DetailRoom";
import PaymentResult from "./components/booking/Payment";
import StatisticsHome from "./components/statistics/StatisticMain";
import StaffList from "./components/staff/StaffList";
import HistoryBooking from "./components/booking/HistoryBooking";
import VNPayReturn from "./components/booking/Payment";
import AddStaff from "./components/staff/AddStaff";
import TimeKeeping from "./components/staff/TimeKeeping";
import AssignWork from "./components/staff/AssignWork";
import UserList from "./components/user/UserList";
import StatisticRoom from "./components/statistics/StatisticRoom";
import BookingDetail from "./components/booking/BookingDetail";
import SearchBooking from "./components/booking/SearchBooking";

function App() {
  return (
    <AuthProvider>
      <main>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit-room" element={<EditRoom />} />
            <Route path="/add-room" element={<EditRoom />} />
            <Route path="/existing-rooms" element={<ExistingRooms />} />
            <Route path="/browse-all-rooms" element={<RoomListing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/detail-room" element={<DetailRoom />} />
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
            <Route path="services-of-room" element={<ServiceOfRoom />} />
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/staff-list" element={<StaffList />} />
            <Route path="/add-staff" element={<AddStaff />} />
            <Route path="/time-keeping" element={<TimeKeeping />} />
            <Route path="/statistics-home" element={<StatisticsHome />} />
            <Route path="/history-booking" element={<HistoryBooking />} />
            <Route path="/vnpay-return" element={<VNPayReturn />} />
            <Route path="/assign-work" element={<AssignWork />} />
            <Route path="/all-users" element={<UserList />} />
            <Route path="/statistics-room" element={<StatisticRoom />} />
            <Route path="/booking-detail" element={<BookingDetail />} />
            <Route path="/search-booking" element={<SearchBooking />} />
          </Routes>
          {/* <Footer /> */}
        </Router>
        <ToastContainer/>
      </main>
    </AuthProvider>
  );
}

export default App;
