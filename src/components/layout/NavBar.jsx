import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Layout, Menu, Dropdown, Button } from "antd";
import { DownOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import Logout from "../auth/Logout";

const { Header } = Layout;

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
    console.log('userRole', userRole);

    useEffect(() => {
        // Đồng bộ trạng thái với localStorage
        const syncAuthState = () => {
            setIsLoggedIn(localStorage.getItem("token"));
            setUserRole(localStorage.getItem("userRole"));
        };
    
        // Lắng nghe sự thay đổi trong localStorage
        window.addEventListener("storage", syncAuthState);
        window.addEventListener("authChanged", syncAuthState);
    
        // Cleanup event listeners khi component unmount
        return () => {
            window.removeEventListener("storage", syncAuthState);
            window.removeEventListener("authChanged", syncAuthState);
        };
    }, []);
    

    const triggerAuthChange = () => {
        window.dispatchEvent(new Event("authChanged"));
    };    

    const accountMenu = (
        <Menu style={{ minWidth: 200, fontSize: 16, padding: "0.5rem" }}>
            {isLoggedIn ? (
                <Menu.Item key="logout" onClick={triggerAuthChange}>
                    <Logout />
                </Menu.Item>
            ) : (
                <Menu.Item key="login">
                    <Link to="/login"><LoginOutlined /> Đăng nhập</Link>
                </Menu.Item>
            )}
        </Menu>
    );

    const RoleGuessMenu = () => (
        <>
            <Menu.Item key="history-booking">
                <NavLink to="/history-booking" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                    Lịch sử đặt phòng
                </NavLink>
            </Menu.Item>
        </>
    );

    const RoleAdminMenu = () => (
        <>
            <Menu.Item key="admin">
                <NavLink to="/admin" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                    Quản lý phòng và dịch vụ
                </NavLink>
            </Menu.Item>
            <Menu.Item key="manage-staff">
                <NavLink to="/staff-list" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                    Quản lý nhân viên
                </NavLink>
            </Menu.Item>
            <Menu.Item key="statistics-home">
                <NavLink to="/statistics-home" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                    Thống kê số liệu
                </NavLink>
            </Menu.Item>
        </>
    );

    const RoleReceptionistMenu = () => (
        <>
            <Menu.Item key="existing-bookings">
                <NavLink to="/existing-bookings" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                    Quản lý đơn đặt phòng
                </NavLink>
            </Menu.Item>
            <Menu.Item key="search-booking">
                <NavLink to="/search-booking" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                    Quét mã đặt phòng
                </NavLink>
            </Menu.Item>
        </>
    );

    const RoleHRMenu = () => (
        <>
            <Menu.Item key="hr">
                <NavLink to="/staff-list" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                    Quản lý nhân sự
                </NavLink>
            </Menu.Item>
            <Menu.Item key="hr-room">
                <NavLink to="/existing-rooms" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                    Quản lý phòng
                </NavLink>
            </Menu.Item>
        </>
    );

    return (
        <Header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#003b95",
                boxShadow: "0 2px 8px #f0f1f2",
                padding: "0 2rem",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                height: 100,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }}
        >
            <Link
                to="/"
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#fff",
                    textDecoration: "none",
                }}
            >
                Khách sạn An An
            </Link>

            <Menu
                mode="horizontal"
                selectable={false}
                style={{ flexGrow: 1, marginLeft: 40, fontSize: 16, backgroundColor: "#003b95" }}
            >
                {isLoggedIn && userRole === "ROLE_ADMIN" && <RoleAdminMenu />}
                {isLoggedIn && userRole === "ROLE_RECEPTIONIST" && <RoleReceptionistMenu />}
                <Menu.Item key="rooms">
                    <NavLink to="/browse-all-rooms" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                        Tất cả các phòng
                    </NavLink>
                </Menu.Item>
                {isLoggedIn && userRole === "ROLE_USER" && <RoleGuessMenu />}
                {isLoggedIn && userRole === "ROLE_HR" && <RoleHRMenu />}
            </Menu>

            <Dropdown overlay={accountMenu} trigger={["click"]} placement="bottom">
                <Button
                    type="text"
                    icon={<UserOutlined />}
                    style={{ fontSize: 16, color: "#fff", fontWeight: 600, marginLeft: "auto" }}
                >
                    Tài khoản <DownOutlined />
                </Button>
            </Dropdown>
        </Header>
    );
};

export default NavBar;
