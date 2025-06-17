import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import { ToastContainer } from "react-toastify";
import ExistingRooms from "./components/room/ExistingRooms";
import Home from "./components/home/Home";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import EditRoom from "./components/room/EditRoom";
import NavBar from "./components/layout/NavBar";
// import Footer from "./components/layout/Footer";
import RoomListing from "./components/room/RoomListing";
import Admin from "./components/admin/Admin";
import Checkout from "./components/booking/Checkout";
import BookingSuccess from "./components/booking/BookingSuccess";
import Bookings from "./components/booking/BookingList";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Profile from "./components/auth/Profile";
import { AuthProvider } from "./components/auth/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
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
import AssignTaskPage from "./components/staff/AssignTask";
import RoomTasksPage from "./components/staff/RoomTask";
import StaffTasksPage from "./components/staff/StaffTask";
import StatisticRate from "./components/statistics/StatisticRate";
import StatisticStaffAttendance from "./components/statistics/StatisticStaff";
import CreateAccount from "./components/auth/CreateAccount";

// import PropTypes from "prop-types";
// ProtectedRoute.propTypes = {
//   children: PropTypes.node.isRequired,
//   allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
// };

const ProtectedRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem("userRole"); // ví dụ: 'ROLE_HR'

  if (!userRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

import PropTypes from "prop-types";
ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function App() {
  return (
    <AuthProvider>
      <main>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
            <Route
              path="/unauthorized"
              element={<h1>403 - Không đủ quyền</h1>}
            />
            <Route path="/browse-all-rooms" element={<RoomListing />} />
            <Route path="/detail-room" element={<DetailRoom />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />

            <Route element={<RequireAuth />}>
              {/* admin */}
              <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
                <Route path="/edit-room" element={<EditRoom />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/add-room" element={<EditRoom />} />
                <Route path="/service-list" element={<ServiceList />} />
                <Route path="/add-service" element={<AddService />} />
                <Route path="services-of-room" element={<ServiceOfRoom />} />
                <Route path="/statistics-home" element={<StatisticsHome />} />
                <Route path="/all-users" element={<UserList />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/statistics-room" element={<StatisticRoom />} />
                <Route path="/statistics-rate" element={<StatisticRate />} />
                <Route
                  path="/staff-statistics"
                  element={<StatisticStaffAttendance />}
                />
              </Route>

              {/* admin, hr */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_HR"]} />
                }
              >
                <Route path="/existing-rooms" element={<ExistingRooms />} />
                <Route path="/staff-list" element={<StaffList />} />
                <Route path="/add-staff" element={<AddStaff />} />
                <Route path="/time-keeping" element={<TimeKeeping />} />
                <Route path="/assign-work" element={<AssignWork />} />
                <Route path="/assign-task" element={<AssignTaskPage />} />
                <Route path="/room-task" element={<RoomTasksPage />} />
                <Route path="/staff-task" element={<StaffTasksPage />} />
              </Route>

              {/* login */}

              <Route path="book-room" element={<Checkout />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/vnpay-return" element={<VNPayReturn />} />
              <Route path="/history-booking" element={<HistoryBooking />} />

              {/* admin, receptionist */}

              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["ROLE_ADMIN", "ROLE_RECEPTIONIST"]}
                  />
                }
              >
                <Route path="/existing-bookings" element={<Bookings />} />
                <Route path="/booking-detail" element={<BookingDetail />} />
                <Route path="/search-booking" element={<SearchBooking />} />
              </Route>
            </Route>
          </Routes>
          {/* <Footer /> */}
        </BrowserRouter>
        <ToastContainer />
      </main>
    </AuthProvider>
  );
}

export default App;
