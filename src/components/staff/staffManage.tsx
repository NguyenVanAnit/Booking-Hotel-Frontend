import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { render } from "react-dom";
import StaffList from "./StaffList";
import AddStaff from "./AddStaff";

const StaffManage = () => {
  const [selected, setSelected] = useState(0);

  const renderContent = (selected: number) => {
    switch (selected) {
      case 0:
        return <StaffList />;
      case 1:
        return <AddStaff />;
      case 2:
        return <h4>Tìm kiếm hồ sơ nhân viên</h4>;
      default:
        return <h4>Danh sách nhân viên</h4>;
    }
  };

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
                border: selected == 0 ? "1px solid black" : 0,
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
              }}
              onClick={() => setSelected(0)}
            >
              <HomeOutlined style={{ marginRight: 10 }} /> Danh sách nhân viên
            </div>
            <div
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "16px",
                fontWeight: "bold",
                border: selected == 1 ? "1px solid black" : 0,
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
              }}
              onClick={() => setSelected(1)}
            >
              <UserOutlined style={{ marginRight: 10 }} /> Thêm nhân viên mới
            </div>
            <div
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "16px",
                fontWeight: "bold",
                border: selected == 2 ? "1px solid black" : 0,
                padding: "10px",
                borderRadius: 8,
                cursor: "pointer",
              }}
              onClick={() => setSelected(2)}
            >
              <UserOutlined style={{ marginRight: 10 }} /> Tìm kiếm hồ sơ nhân viên
            </div>
          </Col>
          <Col span={20}>
              {renderContent(selected)}
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default StaffManage;
