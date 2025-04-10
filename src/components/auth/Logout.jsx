import React, { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { LogoutOutlined, ProjectOutlined } from "@ant-design/icons";

const Logout = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.handleLogout();
    navigate("/", { state: { message: "Bạn đã đăng xuất khỏi tài khoản!" } });
    window.location.reload();
  };

  return (
    <>
      <Menu.Item
        key="profile"
        style={{ backgroundColor: "white", fontSize: 16, fontWeight: 600 }}
      >
        <Link to="/profile" style={{ textDecoration: "none" }}>
            <ProjectOutlined /> Thông tin cá nhân
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        onClick={handleLogout}
        style={{ backgroundColor: "white", fontSize: 16, fontWeight: 600 }}
      >
         <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </>
  );
};

export default Logout;
