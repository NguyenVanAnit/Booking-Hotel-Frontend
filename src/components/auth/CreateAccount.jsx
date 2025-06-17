import { Button, Form, Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { getAllRole, postCreateAccount } from "../utils/auth";
import dispatchToast from "../helpers/toast";
import { CopyOutlined } from "@ant-design/icons";

const CreateAccount = () => {
  const [roleList, setRoleList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Simulate fetching roles from an API
    const fetchRoles = async () => {
      const res = await getAllRole();
      console.log("object", res);
      if (res?.success) {
        setRoleList(res?.data?.data || []);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (values) => {
    console.log("values", values);
    try {
      const res = await postCreateAccount({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        roleId: values.roleId,
      });
      console.log("object", res);
      if (res?.success) {
        setPassword(res?.data?.data || "");
        setIsModalOpen(true);
      } else {
        dispatchToast("error", res?.message || "Tạo tài khoản thất bại!");
      }
    } catch (error) {
      dispatchToast("error", error?.response?.data?.message || "Lỗi hệ thống!");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        width: 500,
        margin: "auto",
      }}
    >
      <h1>Tạo tài khoản</h1>
      <Form style={{ maxWidth: 500 }} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[
            { required: true, message: "Vui lòng nhập đầy đủ họ và tên!" },
          ]}
        >
          <Input type="text" placeholder="Nhập họ và tên người dùng" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input type="email" placeholder="Nhập email người dùng" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input type="number" placeholder="Nhập số điện thoại người dùng" />
        </Form.Item>
        <Form.Item
          label="Vai trò"
          name="roleId"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select
            placeholder="Chọn vai trò người dùng"
            options={roleList.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Mật khẩu tài khoản"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
          <p style={{ fontSize: 20, marginTop: 10 }}>{password}</p>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(password);
              message.success("Đã sao chép mật khẩu vào clipboard!");
            }}
          >
            <CopyOutlined />
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CreateAccount;
