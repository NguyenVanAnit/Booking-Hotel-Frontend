import React, { useState } from "react"
import { registerUser } from "../utils/ApiFunctions"
import { Link } from "react-router-dom"
import { Form, Input, Button } from "antd"

const Registration = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")

	const handleRegistration = async (values) => {
		try {
			const result = await registerUser({
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email1,
				password: values.password1
			})
			setSuccessMessage(result)
			setErrorMessage("")
		} catch (error) {
			setSuccessMessage("")
			setErrorMessage(`Registration error : ${error.message}`)
		}
		setTimeout(() => {
			setErrorMessage("")
			setSuccessMessage("")
		}, 5000)
	}

	return (
		<section className="container col-6 mt-5 mb-5" style={{ width: "20%", margin: "auto", boxShadow: "0 0 10px 0 #ccc", padding: "20px", borderRadius: "10px" }}>
			{errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
			{successMessage && <p className="alert alert-success">{successMessage}</p>}

			<h2>Đăng ký</h2>
			<Form layout="vertical" onFinish={handleRegistration} initialValues={{ firstName: "", lastName: "", email: "", password: "" }}>
				<Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}>
					<Input />
				</Form.Item>
				<Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Vui lòng nhập họ của bạn!" }]}>
					<Input />
				</Form.Item>
				<Form.Item label="Email" name="email1" rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không đúng định dạng!" }]}>
					<Input type="email" defaultValue={""} />
				</Form.Item>
				<Form.Item label="Password" name="password1" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
					<Input.Password defaultValue={""} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Đăng ký
					</Button>
				</Form.Item>
			</Form>

			<p style={{ marginLeft: "10px" }}>
				Already have an account? <Link to={"/login"}>Login</Link>
			</p>

		</section>
	)
}

export default Registration
