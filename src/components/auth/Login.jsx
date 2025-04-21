import { useState } from "react"
import { loginUser } from "../utils/ApiFunctions"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import { Form, Input, Button } from "antd"

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const auth = useAuth()
    const location = useLocation()
    const redirectUrl = location.state?.path || "/"

    const handleSubmit = async (e) => {
        console.log(e)
        const success = await loginUser({ email: e?.email ?? '', password: e?.password ?? "" })
        console.log('success', success);
        if (success) {
            const token = success.token
            auth.handleLogin(token)
            localStorage.setItem("email", e?.email ?? '')
            localStorage.setItem("Id", success?.id ?? '')
            navigate(redirectUrl, { replace: true })
        } else {
            setErrorMessage("Invalid username or password. Please try again.")
        }
        setTimeout(() => {
            setErrorMessage("")
        }, 4000)
    }

    return (
        <section className="container col-6 mt-5 mb-5" style={{ width: "20%", margin: "auto", boxShadow: "0 0 10px 0 #ccc", padding: "20px", borderRadius: "10px" }}>
            {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
            <h2>Đăng nhập</h2>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' }]} >
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]} >
                    <Input.Password />
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit" color="primary" style={{ backgroundColor: "#1890ff", color: "white" }}>
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
            <p>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
        </section>
    )
}

export default Login