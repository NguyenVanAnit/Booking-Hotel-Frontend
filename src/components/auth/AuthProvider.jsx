import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
    user: null,
    handleLogin: (token) => { },
    handleLogout: () => { }
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const handleLogin = (token) => {
        try {
            const decodedUser = jwtDecode(token); // Sử dụng jwt_decode
            console.log('decodedUser', decodedUser);
            localStorage.setItem("userId", decodedUser.sub);
            localStorage.setItem("userRole", decodedUser.roles[0]);
            localStorage.setItem("token", token);
            setUser(decodedUser);
        } catch (error) {
            console.error("Invalid token:", error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
