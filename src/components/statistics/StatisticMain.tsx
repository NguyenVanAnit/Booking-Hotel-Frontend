import React from "react";
import { Link } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";

const StatisticsHome = () => {
  return (
    <div>
      <section className="container mt-5">
        <h2>Thông kê số liệu</h2>
        <hr />
        {/* <Link to={"/add-room"}>Thêm phòng mới</Link> <br />
                        <Link to={"/existing-rooms"}>Manage Rooms</Link> <br />
                        <Link to={"/existing-bookings"}>Manage Bookings</Link> */}
        <div style={{ textAlign: "start" }}>
          <h4>Thống kê số liệu phòng</h4>
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Link
              to={"/statistics-room"}
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
              <HomeOutlined style={{ marginRight: 10 }} /> Lượng đặt phòng trong tháng và doanh thu của các phòng
            </Link>
            <Link
              to={"/statistics-rate"}
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
              <UserOutlined style={{ marginRight: 10 }} /> Điểm đánh giá của các phòng
            </Link>
          </div>

          <div style={{ textAlign: "start" }}>
          <h4>Thống kê số liệu nhân sự</h4>
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Link
              to={"/staff-statistics"}
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
              <HomeOutlined style={{ marginRight: 10 }} /> Số ngày làm việc của nhân viên và lương
            </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatisticsHome;
