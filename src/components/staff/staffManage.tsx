import React from "react";
import { Link } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";

const StaffManage = () => {
  return (
    <div>
      <section className="container mt-5">
        <h2>Quản lý nhân sự</h2>
        <hr />
        {/* <Link to={"/add-room"}>Thêm phòng mới</Link> <br />
                        <Link to={"/existing-rooms"}>Manage Rooms</Link> <br />
                        <Link to={"/existing-bookings"}>Manage Bookings</Link> */}
        <div style={{ textAlign: "start" }}>
          {/* <h4>Quản lý phòng</h4> */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Link
              to={"/staff"}
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
              <HomeOutlined style={{ marginRight: 10 }} /> Danh sách nhân viên
            </Link>
            <Link
              to={"/staff"}
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
              <UserOutlined style={{ marginRight: 10 }} /> Thêm nhân viên mới
            </Link>
            <Link
              to={"/staff"}
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
              <UserOutlined style={{ marginRight: 10 }} /> Tìm kiếm hồ sơ nhân viên
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StaffManage;
