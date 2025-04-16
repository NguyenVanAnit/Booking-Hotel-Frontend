import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { postAddStaff } from "../utils/staff";
import dispatchToast from "../helpers/toast";

const AddStaff = () => {
  const onFinish = async (values) => {
    try {
      const staffData = {
        ...values,
        hireDate: values.hireDate.format("YYYY-MM-DD"),
        birthDate: values.birthDate.format("YYYY-MM-DD"),
        fullName: values.fullName.trim().toUpperCase()
      };
      const res = await postAddStaff(staffData);
      console.log("staff", res);
      if (res?.success) {
        dispatchToast( "success","Thêm nhân viên thành công!");
      } else {
        dispatchToast( "error", res?.message || "Thêm nhân viên thất bại!");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  return (
    <div
      style={{ width: "90%", margin: "auto", marginTop: 40, paddingBottom: 40 }}
    >
      <h4
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        Thêm hồ sơ nhân viên
      </h4>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input type="text" placeholder="Nhập họ và tên" />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
              style={{ width: "50%" }}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value={0}>Nam</Select.Option>
                <Select.Option value={1}>Nữ</Select.Option>
                <Select.Option value={2}>Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="birthDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
              style={{ width: "50%" }}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current > Date.now()}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
              style={{ width: "90%" }}
            >
              <Input type="tel" placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input type="email" placeholder="Nhập email" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input type="text" placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Ngày vào làm"
          name="hireDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày vào làm!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="DD/MM/YYYY"
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current > Date.now()}
          />
        </Form.Item>

        <Form.Item
          label="Lương"
          name="salary"
          rules={[{ required: true, message: "Vui lòng nhập lương!" }]}
        >
          <Input
            type="number"
            placeholder="Nhập lương (VNĐ)"
            addonAfter="VNĐ"
          />
        </Form.Item>

        <Row>
          <Col span={12}>
            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              style={{ width: "50%" }}
            >
              <Select placeholder="Chọn vai trò">
                <Select.Option value={0}>Nhân viên</Select.Option>
                <Select.Option value={1}>Tổ trưởng</Select.Option>
                <Select.Option value={2}>Trưởng phòng</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phòng ban"
              name="department"
              rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
            >
              <Input type="text" placeholder="Nhập phòng ban" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Thêm hồ sơ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddStaff;
1;
