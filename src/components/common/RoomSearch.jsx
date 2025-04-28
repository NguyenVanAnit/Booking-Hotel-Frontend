import { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";
// import RoomTypeSelector from "./RoomTypeSelector"
import { Form, Button, DatePicker, Space, Popover } from "antd";
const { RangePicker } = DatePicker;
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';

const RoomSearch = ({ state }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({
    adults: 0,
    children: 0,
  });

  useEffect(() => {
    if (state?.quantities) {
      setQuantities(state.quantities);
    }
  }, [state]);

  const handleSearch = () => {
    const formValues = form.getFieldsValue();
    const checkInDate = dayjs(formValues.datestr[0]).format("YYYY-MM-DD");
    const checkOutDate = dayjs(formValues.datestr[1]).format("YYYY-MM-DD");

    console.log("checkInDate", checkInDate, checkOutDate);

    navigate("/browse-all-rooms", {
      state: { checkInDate, checkOutDate, quantities },
    });
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

  const updateQuantity = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const content = (
    <div>
      {Object.entries(quantities).map(([key, value]) => (
        <Space
          key={key}
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: 250,
            padding: 10,
          }}
        >
          <span style={{ textTransform: "capitalize" }}>
            {key === "adults" ? "Người lớn" : "Trẻ em"}
          </span>
          <Space>
            <Button onClick={() => updateQuantity(key, -1)} size="small">
              -
            </Button>
            <span>{value}</span>
            <Button onClick={() => updateQuantity(key, 1)} size="small">
              +
            </Button>
          </Space>
        </Space>
      ))}
    </div>
  );

  return (
    <>
      <Container className="shadow pt-5 pb-2 mt-2">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          initialValues={{
            datestr:
              state?.checkInDate && state?.checkOutDate
                ? [moment(state.checkInDate), moment(state.checkOutDate)]
                : undefined,
          }}
        >
          <Row className="justify-content-center">
            <Col xs={12} md={3}>
              <Form.Item
                name="datestr"
                label="Ngày nhận phòng - Ngày trả phòng"
                rules={[
                  {
                    required: true,
                    message: "Ngày nhận phòng và trả phòng không được để trống",
                  },
                ]}
              >
                <RangePicker format="YYYY-MM-DD" disabledDate={disabledDate} />
              </Form.Item>
            </Col>
            <Col xs={12} md={3}>
              <Form.Item name="numPeople" label="Số lượng người">
                <Popover content={content} trigger="click" placement="bottom">
                  <Button
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    {quantities.adults +
                      " người lớn và " +
                      quantities.children +
                      " trẻ em"}
                    <DownOutlined />
                  </Button>
                </Popover>
              </Form.Item>
            </Col>
            <Col xs={12} md={3}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: "30px", width: "100%" }}
                >
                  Tìm phòng <SearchOutlined />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default RoomSearch;
