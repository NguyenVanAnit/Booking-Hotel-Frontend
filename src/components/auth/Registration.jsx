import { useState } from "react";
import { registerUser } from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Modal } from "antd";
import emailjs from "emailjs-com";
import OtpModal from "../common/OtpModal";

const Registration = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const navigate = useNavigate();
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const sendOtpToEmail = async (email, fullName) => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    console.log("otp", otp);
    const templateParams = {
      to_email: email,
      to_name: fullName,
      message: `Mã xác thực OTP của bạn là: ${otp}`,
    };

    try {
      await emailjs.send(
        "service_ro6hg6v",
        "template_kfrd1g8",
        templateParams,
        "xR7FSz5qWevMG6w_2"
      );
      message.success("Đã gửi mã OTP đến email!");
    } catch (error) {
      console.error(error);
      message.error("Gửi email thất bại!");
    }
  };

  const handleRegistration = async (values) => {
    setIsLoading(true);
    setUserData(values);
    await sendOtpToEmail(values.newEmail, values.fullName);
    setModalVisible(true);
  };

  const handleOtpConfirm = async (enteredOtp) => {
    // console.log("dad", enteredOtp, generatedOtp);
    if (enteredOtp == generatedOtp) {
      try {
        await registerUser({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          email: userData.newEmail,
          password: userData.matkhau,
        });
        message.success("Đăng ký thành công!");
        setModalVisible(false);
        setOtpInput("otpHetHan");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        console.error(error);
        message.error("Đăng ký thất bại!");
      }
    } else {
      message.error("OTP không chính xác!");
    }
  };

  return (
    <section
      className="container col-6 mt-5 mb-5"
      style={{
        width: "20%",
        margin: "auto",
        boxShadow: "0 0 10px 0 #ccc",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h2>Đăng ký</h2>
      <Form form={form} layout="vertical" onFinish={handleRegistration}>
        <Form.Item
          label="Họ tên đầy đủ"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="newEmail"
          rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="matkhau"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="matkhauagain"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("matkhau") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu không khớp!");
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item style={{ marginTop: 40 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <p style={{ marginLeft: "10px" }}>
        Đã có tài khoản?
        <Button type="link" onClick={() => navigate("/login")}>
          Đăng nhập
        </Button>
      </p>

      <OtpModal
        isModalVisible={isModalVisible}
        onConfirm={handleOtpConfirm}
        onCancel={() => {
          setModalVisible(false);
          setIsLoading(false);
          setOtpInput("otpHetHan");
        }}
        sendOtpAgain={() =>
          sendOtpToEmail(userData.newEmail, userData.fullName)
        }
      />
    </section>
  );
};

export default Registration;
