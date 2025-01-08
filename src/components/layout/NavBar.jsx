import React, { useContext, useState, useEffect } from "react"
import { NavLink, Link } from "react-router-dom"
import Logout from "../auth/Logout"

const NavBar = () => {
    const [showAccount, setShowAccount] = useState(false)

    const handleAccountClick = () => {
        setShowAccount(!showAccount)
    }

    const isLoggedIn = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")
    console.log(isLoggedIn, userRole)

    // Cập nhật lại trạng thái khi isLoggedIn hoặc userRole thay đổi
    useEffect(() => {
        if (isLoggedIn && userRole === "ROLE_ADMIN") {
            setShowAccount(true);  // tự động hiển thị khi thỏa mãn điều kiện
        }
    }, [isLoggedIn, userRole]) // Mỗi khi isLoggedIn hoặc userRole thay đổi

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow mb-5 sticky-top">
            <div className="container-fluid">
                <Link to={"/"} className="navbar-brand">
                    <span className="hotel-color">Khách sạn Bách Khoa</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarScroll"
                    aria-controls="navbarScroll"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        {isLoggedIn && userRole === "ROLE_ADMIN" && (
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to={"/admin"} style={{ fontWeight: 500 }}>
                                    Admin
                                </NavLink>
                            </li>
                        )}

                        <li className="nav-item">
                            <NavLink className="nav-link" aria-current="page" to={"/browse-all-rooms"} style={{ fontWeight: 500 }}>
                                Danh sách phòng
                            </NavLink>
                        </li>
                    </ul>

                    <ul className="d-flex navbar-nav">
                        <li className="nav-item dropdown">
                            <a
                                className={`nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                onClick={handleAccountClick}
                                style={{ fontWeight: 500 }}>
                                {" "}
                                Account
                            </a>

                            <ul
                                className={`dropdown-menu ${showAccount ? "show" : ""}`}
                                aria-labelledby="navbarDropdown">
                                {isLoggedIn ? (
                                    <Logout />
                                ) : (
                                    <li>
                                        <Link className="dropdown-item" to={"/login"} style={{ fontWeight: 500 }}>
                                            Login
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
