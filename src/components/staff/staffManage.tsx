import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { render } from "react-dom";
import StaffList from "./StaffList";
import AddStaff from "./AddStaff";
import TimeKeeping from "./TimeKeeping";

const StaffManage = ({ status, children }) => {
  const navigate = useNavigate();

  return (
    <div>
      <section className="container mt-5">
        <h2>Quản lý nhân sự</h2>
        <hr />
        {/* <Link to={"/add-room"}>Thêm phòng mới</Link> <br />
                        <Link to={"/existing-rooms"}>Manage Rooms</Link> <br />
                        <Link to={"/existing-bookings"}>Manage Bookings</Link> */}
        <Row>
          {/* <h4>Quản lý phòng</h4> */}
          <Col
            style={{
              display: "flex",
              gap: "30px",
              marginBottom: "20px",
              marginTop: "20px",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "flex-start",
            }}
            span={4}
          >
            <div
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "16px",
                fontWeight: "bold",
                border: status == 0 ? "1px solid black" : 0,
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => navigate("/staff-list")}
            >
              <HomeOutlined style={{ marginRight: 10 }} /> Danh sách nhân viên
            </div>
            <div
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "16px",
                fontWeight: "bold",
                border: status == 1 ? "1px solid black" : 0,
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => navigate("/add-staff")}
            >
              <UserOutlined style={{ marginRight: 10 }} /> Thêm nhân viên mới
            </div>
            <div
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "16px",
                fontWeight: "bold",
                border: status == 2 ? "1px solid black" : 0,
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => navigate("/time-keeping")}
            >
              <UserOutlined style={{ marginRight: 10 }} /> Chấm công hôm nay
            </div>
            <div
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "16px",
                fontWeight: "bold",
                border: status == 3 ? "1px solid black" : 0,
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => navigate("/assign-work")}
            >
              <UserOutlined style={{ marginRight: 10 }} /> Giao việc
            </div>
          </Col>
          <Col span={20} style={{ paddingTop: 30 }}>
              {children}
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default StaffManage;
