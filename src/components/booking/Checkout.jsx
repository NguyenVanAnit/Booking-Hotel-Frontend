import {
  DatePicker,
  Form,
  Row,
  Col,
  InputNumber,
  Input,
  Checkbox,
  Collapse,
  Card,
  Tooltip,
  Button,
} from "antd";
const { Panel } = Collapse;
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getServicesByRoomId } from "../utils/services";
import { formatVND } from "../helpers/helpers";
import { postBooking, postBookingByReceptionist } from "../utils/booking";
import dispatchToast from "../helpers/toast";
import { getUserByEmail } from "../utils/user";

const Checkout = () => {
  const userId = localStorage.getItem("Id");
  const email = localStorage.getItem("email");
  const roleLetan = localStorage.getItem("userRole");
  const location = useLocation();
  const room = location?.state?.record;
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    phoneNumberOther: "",
    numOfAdults: 1,
    numOfChildren: 0,
    // serviceQuantities: {},
  });
  const currentEmail = localStorage.getItem("email") || "";
  // const currentId = localStorage.getItem("userId") || "";
  const [disabledSubmit, setDisabledSubmit] = useState(false);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchData = async () => {
    try {
      const res = await getServicesByRoomId(room?.id);
      if (res?.data.success) {
        setServices(res?.data.data.data);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await getUserByEmail(email);
      if (res?.success) {
        const data = res?.data?.data;
        setFormData((prev) => ({
          ...prev,
          fullName: res?.data?.data?.fullName || "",
          phoneNumber: res?.data?.data?.phoneNumber || "",
        }));

        form.setFieldsValue({
          fullName: data?.fullName || "",
          phoneNumber: data?.phoneNumber || "",
          email: email,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  useEffect(() => {
    const freeServices = services
      .filter((s) => s.free && s.active !== false)
      .map((s) => s.id);

    setSelectedServices(freeServices);
  }, [services]);

  const handleServiceChange = (checkedValues) => {
    setSelectedServices(checkedValues);
    form
      .validateFields()
      .then((values) => {
        calculateTotalPrice(values);
      })
      .catch(() => {});
  };

  const onSubmit = async (values) => {
    try {
      setDisabledSubmit(true);
      const payload = selectedServices.map((serviceId) => ({
        serviceId,
        quantity: values.serviceQuantities?.[serviceId] || 1,
      }));

      const formRequest = {
        checkInDate: values.checkin_checkout[0].format("YYYY-MM-DD"),
        checkOutDate: values.checkin_checkout[1].format("YYYY-MM-DD"),
        guestEmail: currentEmail,
        numOfAdults: values.numOfAdults,
        numOfChildren: values.numOfChildren,
        phoneNumberOther: values.phoneNumberOther || "",
        roomId: room?.id,
        userId: userId,
        serviceBookedRequests: payload,
      };
      console.log("formRequest", formRequest);

      const res =
        roleLetan == "ROLE_RECEPTIONIST"
          ? await postBookingByReceptionist(formRequest)
          : await postBooking(formRequest);
      setDisabledSubmit(false);

      if (res?.success) {
        if (roleLetan == "ROLE_RECEPTIONIST") {
          dispatchToast("success", "Lễ tân đặt phòng thành công!");
        } else {
        window.location.href = res?.data?.data; // ← Chuyển hướng
        }
      } else {
        dispatchToast("error", res?.message || "Đặt phòng thất bại!");
      }
    } catch (error) {
      setDisabledSubmit(false);
      dispatchToast(
        "error",
        error?.response?.data?.message || "Đặt phòng thất bại!"
      );
    }
  };

  console.log("formData", formData);

  const calculateTotalPrice = (values) => {
    let roomPrice = room?.roomPrice || 0;
    let nights = numberOfNights || 0;

    let roomTotal = roomPrice * nights;

    let servicesTotal = 0;
    if (values?.serviceQuantities) {
      for (let serviceId of selectedServices) {
        const quantity = values.serviceQuantities[serviceId] || 1;
        const service = services.find((s) => s.id === serviceId);
        if (service) {
          servicesTotal += service.priceService * quantity;
        }
      }
    }

    const total = roomTotal + servicesTotal;
    setTotalPrice(total);
  };

  return (
    <div style={{ paddingTop: 40 }}>
      <section className="container">
        <h3>Đơn đặt phòng</h3>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Row gutter={24} align="start">
            <Col
              span={16}
              style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  textAlign: "left",
                  marginBottom: 10,
                }}
              >
                Thông tin người đặt phòng
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    initialValue={formData.fullName}
                  >
                    <Input placeholder="Họ và tên" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    initialValue={formData.phoneNumber}
                  >
                    <Input placeholder="Số điện thoại" disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Email" name="email" initialValue={email}>
                    <Input placeholder="Email" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại khác (nếu có)"
                    name="phoneNumberOther"
                    rules={[
                      {
                        pattern: /^0\d{9}$/,
                        message:
                          "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0",
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <InputNumber
                      placeholder="Số điện thoại khác"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  textAlign: "left",
                  marginBottom: 10,
                }}
              >
                Thông tin đơn đặt Phòng
              </div>
              <Form.Item
                label="Ngày nhận phòng - Ngày trả phòng"
                name="checkin_checkout"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày nhận phòng và trả phòng!",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder={["Ngày nhận phòng", "Ngày trả phòng"]}
                  disabledDate={(current) => current && current < Date.now()}
                  onChange={(dates, dateStrings) => {
                    if (dates && dates.length === 2) {
                      const checkInDate = dates[0];
                      const checkOutDate = dates[1];
                      const nights = checkOutDate.diff(checkInDate, "days");
                      setNumberOfNights(nights);

                      // Khi chọn ngày mới thì tính lại tổng tiền
                      form
                        .validateFields()
                        .then((values) => {
                          calculateTotalPrice(values);
                        })
                        .catch(() => {});
                    } else {
                      setNumberOfNights(0);
                      setTotalPrice(0);
                    }
                  }}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Số lượng người lớn"
                    name="numOfAdults"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lượng người lớn!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: "100%" }}
                      placeholder="Số lượng người lớn"
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          numOfAdults: value,
                        }));
                        form
                          .validateFields()
                          .then((values) => {
                            calculateTotalPrice(values);
                          })
                          .catch(() => {});
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số lượng trẻ em"
                    name="numOfChildren"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lượng trẻ em!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="Số lượng trẻ em"
                      onChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          numOfChildren: value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 5,
                  textAlign: "left",
                }}
              >
                Dịch vụ thêm
              </div>
              <div style={{ marginBottom: 10, textAlign: "left" }}>
                <span style={{ color: "red" }}>*</span>Tự động chọn dịch vụ miễn
                phí đi kèm với phòng.
              </div>
              <Collapse defaultActiveKey={["1"]}>
                <Panel header="Chọn dịch vụ đi kèm" key="1">
                  <Checkbox.Group
                    style={{ width: "100%" }}
                    onChange={handleServiceChange}
                    value={selectedServices}
                  >
                    <Row gutter={[16, 16]}>
                      {services.map((service) => {
                        const isSelected = selectedServices.includes(
                          service.id
                        );
                        const isFree = service.free === true;
                        const isDisabled = service.active === false;

                        return (
                          <Col span={24} key={service.id}>
                            <Tooltip
                              title={service.description}
                              placement="left"
                              color="blue"
                              overlayInnerStyle={{ maxWidth: 200 }}
                            >
                              <Card>
                                <Row align="middle" justify="space-between">
                                  <Col
                                    style={{
                                      alignContent: "start",
                                      justifyContent: "start",
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Checkbox
                                      value={service.id}
                                      checked={isSelected}
                                      disabled={isDisabled}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        if (checked) {
                                          setSelectedServices((prev) => [
                                            ...prev,
                                            service.id,
                                          ]);
                                        } else {
                                          setSelectedServices((prev) =>
                                            prev.filter(
                                              (id) => id !== service.id
                                            )
                                          );
                                        }
                                      }}
                                    >
                                      {service.name}
                                    </Checkbox>
                                    <div
                                      style={{
                                        fontSize: 12,
                                        color: "#888",
                                        marginTop: 4,
                                        textAlign: "left",
                                      }}
                                    >
                                      <b style={{ color: "#1890ff" }}>
                                        {formatVND(service.priceService) +
                                          " VND / số lượng 1"}
                                      </b>
                                      {isFree && (
                                        <span
                                          style={{
                                            marginLeft: 8,
                                            color: "green",
                                          }}
                                        >
                                          (Miễn phí)
                                        </span>
                                      )}
                                    </div>
                                  </Col>
                                  <Col>
                                    <Form.Item
                                      name={["serviceQuantities", service.id]}
                                      initialValue={1}
                                      style={{ marginBottom: 0 }}
                                      rules={[
                                        {
                                          required: isSelected,
                                          message: "Nhập số lượng!",
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        min={1}
                                        max={service.maxQuantity}
                                        disabled={!isSelected}
                                        onChange={() => form.validateFields()} // cập nhật lại hiển thị giá
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            </Tooltip>
                          </Col>
                        );
                      })}
                    </Row>
                  </Checkbox.Group>
                </Panel>
              </Collapse>
            </Col>
            <Col span={8}>
              <div
                style={{
                  position: "sticky",
                  top: 100,
                  zIndex: 999,
                }}
              >
                <Card title="Tóm tắt đơn đặt phòng" bordered>
                  <p>
                    <b>Giá phòng:</b> {formatVND(room?.roomPrice || 0)} / ngày
                  </p>
                  <p>{/* <b>Số đêm:</b> {numberOfNights} đêm */}</p>
                  <p>
                    <b>Người lớn:</b> {formData.numOfAdults || 0}
                  </p>
                  <p>
                    <b>Trẻ em:</b> {formData.numOfChildren || 0}
                  </p>
                  <p>
                    {/* <b>Dịch vụ thêm:</b> {formatVND(serviceTotal)} VND */}
                  </p>
                  <hr />
                  <p>
                    <b>Tổng thanh toán:</b>{" "}
                    <span style={{ color: "red", fontSize: 18 }}>
                      {formatVND(totalPrice)}
                    </span>
                  </p>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={disabledSubmit}
                    >
                      Xác nhận đặt phòng
                    </Button>
                  </Form.Item>
                </Card>
              </div>
            </Col>
          </Row>
        </Form>
      </section>
      <div className="container"></div>
    </div>
  );
};
export default Checkout;
