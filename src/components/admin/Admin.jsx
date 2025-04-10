import { Link } from "react-router-dom";
import { FileTextOutlined, HomeOutlined, SpotifyOutlined, UserAddOutlined } from "@ant-design/icons";

const Admin = () => {
    return (
        <section className="container mt-5">
            <h2>Quản lý khách sạn</h2>
            <hr />
            {/* <Link to={"/add-room"}>Thêm phòng mới</Link> <br />
            <Link to={"/existing-rooms"}>Manage Rooms</Link> <br />
            <Link to={"/existing-bookings"}>Manage Bookings</Link> */}
            <div style={{ textAlign: "start" }}>
                <h4>Quản lý phòng</h4>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                >
                    <Link
                        to={"/existing-rooms"}
                        style={{
                            textDecoration: "none",
                            color: "black",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "1px solid black",
                            padding: "10px",
                            borderRadius: 8,
                        }}
                    >
                        <HomeOutlined style={{ marginRight: 10 }} /> Tất cả phòng
                    </Link>
                </div>
            </div>
            <div style={{ textAlign: "start", marginTop: 40 }}>
                <h4>Quản lý đặt phòng</h4>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                >
                    <Link
                        to={"/existing-bookings"}
                        style={{
                            textDecoration: "none",
                            color: "black",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "1px solid black",
                            padding: "10px",
                            borderRadius: 8,
                        }}
                    >
                        <FileTextOutlined style={{ marginRight: 10 }} /> Tất cả đơn đặt phòng
                    </Link>
                </div>
            </div>
            <div style={{ textAlign: "start", marginTop: 40 }}>
                <h4>Quản lý đặt phòng</h4>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                >
                    <Link
                        to={"/service-list "}
                        style={{
                            textDecoration: "none",
                            color: "black",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "1px solid black",
                            padding: "10px",
                            borderRadius: 8,
                        }}
                    >
                        <SpotifyOutlined style={{ marginRight: 10 }} /> Tất cả dịch vụ
                    </Link>
                </div>
            </div>
            <div style={{ textAlign: "start", marginTop: 40 }}>
                <h4>Quản lý người dùng</h4>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                >
                    <Link
                        to={"/service-list "}
                        style={{
                            textDecoration: "none",
                            color: "black",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "1px solid black",
                            padding: "10px",
                            borderRadius: 8,
                        }}
                    >
                        <UserAddOutlined style={{ marginRight: 10 }} /> Danh sách người dùng
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Admin;
