import { Descriptions, Table, Tag, Button, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { getDetailBookingById, updateBookingChecked } from "../utils/booking";
import { useLocation, useSearchParams } from "react-router-dom";
import { formatDate, formatVND } from "../helpers/helpers";
import dispatchToast from "../helpers/toast";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const BookingDetail = () => {
  //   const location = useLocation();
  //   const bookingId = location.state.bookingId;
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [data, setData] = useState({});
  const [services, setServices] = useState([]);

  const fetchData = async (bookingId) => {
    try {
      const res = await getDetailBookingById(bookingId);
      if (res?.success) {
        setData(res?.data?.data);
        setServices(res?.data?.data?.serviceBookedDtos);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  useEffect(() => {
    fetchData(bookingId);
  }, [bookingId]);

  const confirmCheckIn = async (bookingId, isChecked) => {
    const res = await updateBookingChecked(bookingId, isChecked);
    if (res?.success) {
      if (isChecked == 1) {
        dispatchToast("success", "Đã xác nhận nhận phòng thành công!");
      } else if (isChecked == 2) {
        dispatchToast("success", "Đã xác nhận trả phòng thành công!");
      }
      fetchData(bookingId);
    } else {
      console.error("Có lỗi xảy ra khi xác nhận nhận phòng!");
    }
  };

  const showStatus = (status) => {
    if (status == 0) return "Chưa thanh toán";
    if (status == 1) return "Đã thanh toán thành công";
    if (status == 2) return "Thanh toán thành công";
    if (status == 3) return "Đã hủy";
    if (status == 4) return "Đã từ chối";
    return "Không xác định";
  };

  const showChecked = (status) => {
    if (status == 0) return "Chưa nhận phòng";
    if (status == 1) return "Đã nhận phòng";
    if (status == 2) return "Đã trả phòng";
    return "Không xác định";
  };

  const showAction = (isChecked) => {
    if (isChecked == 0) {
      return (
        <div>
          <Tag color="blue" style={{ marginRight: 10, padding: "5px 10px" }}>
            Khách hàng chưa nhận phòng
          </Tag>
          <Popconfirm
            title="Xác nhận nhận phòng"
            description="Khách đã xác nhận nhận phòng này?"
            onConfirm={() => confirmCheckIn(bookingId, 1)}
            okText="Đồng ý"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: "yellow" }} />}
            placement="topRight"
          >
            <Button
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              type="primary"
            >
              Nhận phòng
            </Button>
          </Popconfirm>
        </div>
      );
    } else if (isChecked == 1) {
      return (
        <Popconfirm
          title="Xác nhận trả phòng"
          description="Khách đã xác nhận trả phòng này?"
          onConfirm={() => confirmCheckIn(bookingId, 2)}
          okText="Đồng ý"
          cancelText="Hủy"
          icon={<ExclamationCircleOutlined style={{ color: "yellow" }} />}
          placement="topRight"
        >
          <Tag color="success" style={{ marginRight: 10, padding: "5px 10px" }}>
            Khách hàng đã nhận phòng
          </Tag>
          <Button
            style={{
              backgroundColor: "#33CC33",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
            }}
            type="primary"
          >
            Trả phòng
          </Button>
        </Popconfirm>
      );
    } else if (isChecked == 2) {
      return (
        <Tag color="warning" style={{ marginRight: 10, padding: "10px 20px", fontSize: 16 }}>
            Khách hàng đã trả phòng
        </Tag>
      );
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      align: "center",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      align: "center",
      width: 200,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 100,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (text) => formatVND(text) + " VNĐ",
      width: 150,
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "40px auto",
      }}
    >
      <h3>Chi tiết đơn đặt phòng</h3>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <h5 style={{ textAlign: "left", marginBottom: 10 }}>
          Thông tin đơn đặt phòng
        </h5>
        <Descriptions
          bordered
          column={2}
          size="small"
          layout="horizontal"
          labelStyle={{ fontSize: 18 }}
          contentStyle={{ fontSize: 18, fontWeight: 550 }}
        >
          <Descriptions.Item label="Mã đơn đặt phòng">
            {data?.bookingConfirmationCode}
          </Descriptions.Item>
          <Descriptions.Item label="Mã thanh toán">
            {data?.txnRef}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày nhận phòng">
            {formatDate(data?.checkInDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày trả phòng">
            {formatDate(data?.checkOutDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng người lớn">2</Descriptions.Item>
          <Descriptions.Item label="Số lượng trẻ em">1</Descriptions.Item>
          <Descriptions.Item label="Thời gian tạo đơn đặt phòng">
            {formatDate(data?.bookingTime)}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {formatVND(data?.totalPrice) + " VNĐ"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {showStatus(data?.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái nhận phòng">
            {showChecked(data?.isChecked)}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            Không có ghi chú
          </Descriptions.Item>
        </Descriptions>
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <h5 style={{ textAlign: "left", marginBottom: 10 }}>
          Thông tin người đặt phòng
        </h5>
        <Descriptions
          bordered
          column={2}
          size="small"
          layout="horizontal"
          labelStyle={{ fontSize: 18 }}
          contentStyle={{ fontSize: 18, fontWeight: 550 }}
        >
          <Descriptions.Item label="Tên người đặt phòng" span={2}>
            {data?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={2}>
            {data?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {data?.phoneNumberUser}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại (khác)">
            {data?.phoneNumber}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <h5 style={{ textAlign: "left", marginBottom: 10 }}>
          Thông tin các dịch vụ
        </h5>
        <Table
          bordered
          dataSource={services}
          columns={columns}
          pagination={{
            pageSize: 5,
          }}
          rowKey={(record) => record?.id}
        />
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        {showAction(data?.isChecked)}
      </div>
    </div>
  );
};

export default BookingDetail;
