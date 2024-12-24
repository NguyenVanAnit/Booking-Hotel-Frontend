import { Link } from "react-router-dom"

const Admin = () => {
    return (
        <section className="container mt-5">
            <h2>Trang quản lý của ADMIN</h2>
            <hr />
            <Link to={"/add-room"}>Thêm phòng mới</Link> <br />
            <Link to={"/existing-rooms"}>Manage Rooms</Link> <br />
            <Link to={"/existing-bookings"}>Manage Bookings</Link>
        </section>
    )
}

export default Admin