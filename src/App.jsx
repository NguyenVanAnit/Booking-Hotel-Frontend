import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import AddRoom from "./components/room/AddRoom";
import ExistingRooms from "./components/room/ExistingRooms";
import { Home } from "./components/home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditRoom from "./components/room/EditRoom";
import NavBar from "./components/layout/NavBar";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <main>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit-room" element={<EditRoom />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/existing-rooms" element={<ExistingRooms />} />
          </Routes>
          <Footer />
        </Router>
      </main>
    </>
  );
}

export default App;
