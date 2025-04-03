import { useState } from "react";
import { Button, Form, Input, Switch, Row, Col, InputNumber } from "antd";
import { postAddService, putUpdateService } from "../utils/services";
import dispatchToast from "../helpers/toast";
const { TextArea } = Input;
import { useLocation, useNavigate } from "react-router-dom";
import { use } from "react";

const AddService = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { record } = location.state || {};
  console.log("record", record);

  const onFinish = async (values) => {
    console.log("Received values:", values);
    if (!record) {
        try{
            const response = await postAddService(values);
            console.log("response", response);
            if (response?.data.success) {
                dispatchToast("success", "Thêm dịch vụ thành công");
                navigate(-1);
            }else{
                dispatchToast("error", "Thêm dịch vụ thất bại");
            }
        }catch(e){
            console.log(e);
        }
    }else{
        try {
            console.log("update", values);
            const response = await putUpdateService(record.id, values);
            console.log("response", response);
            if (response?.data.success) {
                dispatchToast("success", "Cập nhật dịch vụ thành công");
                navigate(-1);
            } else {
                dispatchToast("error", "Cập nhật dịch vụ thất bại");
            }
        }catch(e){
            console.log(e);
        }
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
      <h1>{record ? 'Chỉnh sửa dịch vụ' : "Thêm dịch vụ"}</h1>
      <Form
        form={form}
        style={{ maxWidth: 500 }}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{...record, isActive: record?.active, isFree: record?.free}}
      >
        <Form.Item
          label="Tên dịch vụ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
        >
          <Input type="text" placeholder="Nhập tên dịch vụ" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Trạng thái hoạt động"
              name="isActive"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              layout="horizontal"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Trạng thái miễn phí"
              name="isFree"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              layout="horizontal"
              initialValue={false}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={15}>
            <Form.Item
              label="Giá dịch vụ"
              name="priceService"
              rules={[
                { required: true, message: "Vui lòng nhập giá dịch vụ!" },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập giá dịch vụ"
                addonAfter="VNĐ"
              />
            </Form.Item>
          </Col>

          <Col span={9}>
            <Form.Item
              label="Số lượng tối đa"
              name="maxQuantity"
            //   initialValue={1}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng tối đa dịch vụ!",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập giá dịch vụ"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Loại dịch vụ"
          name="serviceType"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
        >
          <Input type="text" placeholder="Nhập loại dịch vụ" />
        </Form.Item>

        <Form.Item
          label="Mô tả dịch vụ"
          name="description"
        >
          <TextArea rows={4} placeholder="Nhập mô tả dịch vụ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {record ? "Chỉnh sửa dịch vụ" : 'Thêm dịch vụ'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddService;
