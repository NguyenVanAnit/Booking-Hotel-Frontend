import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Layout, Menu, Dropdown, Button } from "antd";
import { DownOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import Logout from "../auth/Logout";

const { Header } = Layout;

const NavBar = () => {
    const [showAccount, setShowAccount] = useState(false);
    const isLoggedIn = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    useEffect(() => {
        if (isLoggedIn && userRole === "ROLE_ADMIN") {
            setShowAccount(true);
        } else {
            setShowAccount(false);
        }
    }, [isLoggedIn, userRole]);

    const handleMenuClick = () => {
        setShowAccount(!showAccount);
    };

    const accountMenu = (
        <Menu
            style={{
                minWidth: 200,
                fontSize: 16,
                padding: "0.5rem",
            }}
        >
            {isLoggedIn ? (
                <Menu.Item key="logout">
                    <Logout />
                </Menu.Item>
            ) : (
                <Menu.Item key="login">
                    <Link to="/login"><LoginOutlined /> Đăng nhập</Link>
                </Menu.Item>
            )}
        </Menu>
    );

    const RoleGuessMenu = (props) => {
        return (
            <>
                <Menu.Item key="history-booking">
                    <NavLink to="/browse-all-rooms" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                        Lịch sử đặt phòng
                    </NavLink>
                </Menu.Item>
            </>
        );
    };

    const RoleAdminMenu = (props) => {
        return (
            <>
                <Menu.Item key="admin">
                    <NavLink to="/admin" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                        Quản lý
                    </NavLink>
                </Menu.Item>
            </>
        );
    };

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
                Khách sạn Bách Khoa
            </Link>

            <Menu
                mode="horizontal"
                selectable={false}
                style={{ flexGrow: 1, marginLeft: 40, fontSize: 16, backgroundColor: "#003b95" }}
            >
                {isLoggedIn && userRole === "ROLE_ADMIN" && <RoleAdminMenu />}
                <Menu.Item key="rooms">
                    <NavLink to="/browse-all-rooms" style={{ textDecoration: "none", color: "#fff", fontWeight: 600 }}>
                        Tất cả các phòng
                    </NavLink>
                </Menu.Item>
                {isLoggedIn && userRole === "ROLE_GUESS" && <RoleGuessMenu />}
            </Menu>

            <Dropdown overlay={accountMenu} trigger={["click"]} placement="bottom">
                <Button
                    type="text"
                    icon={<UserOutlined />}
                    onClick={handleMenuClick}
                    style={{ fontSize: 16, color: "#fff", fontWeight: 600, marginLeft: "auto" }}
                >
                    Tài khoản <DownOutlined />
                </Button>
            </Dropdown>
        </Header>
    );
};

export default NavBar;
