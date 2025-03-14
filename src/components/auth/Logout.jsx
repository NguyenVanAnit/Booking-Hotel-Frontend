import React, { useContext } from "react"
import { AuthContext } from "./AuthProvider"
import { Link, useNavigate } from "react-router-dom"

const Logout = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        auth.handleLogout()
        navigate("/", { state: { message: " Bạn đã đăng xuất khỏi tài khoản!" } })
        window.location.reload()
    }

    return (
        <>
            <li>
                <Link className="dropdown-item" to={"/profile"}>
                    Profile
                </Link>
            </li>
            <li>
                <hr className="dropdown-divider" />
            </li>
            <button className="dropdown-item" onClick={handleLogout}>
                Logout
            </button>
        </>
    )
}

export default Logout