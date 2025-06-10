import { useContext, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Menu, Modal } from "antd";
import { LockOutlined, LogoutOutlined, ProjectOutlined } from "@ant-design/icons";
import { postChangePassword } from "../utils/auth";
import dispatchToast from "../helpers/toast";

const Logout = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleLogout = () => {
    auth.handleLogout();
    navigate("/", { state: { message: "Bạn đã đăng xuất khỏi tài khoản!" } });
    window.location.reload();
  };

  const handleChangePassword = async (values) => {
    const res = await postChangePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    if (res.success) {
      setOpen(false);
      dispatchToast("success", "Đổi mật khẩu thành công!");
    } else {
      dispatchToast("error", res.message || "Đổi mật khẩu thất bại!");
    }
    form.resetFields();
  }

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
        key="change-password"
        style={{ backgroundColor: "white", fontSize: 16, fontWeight: 600 }}
        onClick={() => setOpen(true)}
      >
        <LockOutlined style={{ color: "black" }} /> Đổi mật khẩu
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        onClick={handleLogout}
        style={{ backgroundColor: "white", fontSize: 16, fontWeight: 600 }}
      >
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>

      <Modal 
        title="Đổi mật khẩu"
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại"/>
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password  placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password  placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="ant-btn ant-btn-primary">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Logout;
