import { Button, Modal, Table, Form, Rate, Input, Tag } from "antd";
import { useEffect, useState } from "react";
import { getHistoryBooking } from "../utils/booking";
import { formatDate, formatVND } from "../helpers/helpers";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { postAddRate } from "../utils/rate";
import dispatchToast from "../helpers/toast";
import { render } from "react-dom";

const HistoryBooking = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("Id");
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      console.log("object", {
        pageNumber: page,
        pageSize: pageSize,
        userId: userId,
      });
      const res = await getHistoryBooking({
        pageNumber: page,
        pageSize: pageSize,
        userId: userId,
      });
      console.log("res", res);
      setData(res.data.data);
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: res.data.total,
      }));
    } catch (err) {
      console.error("Lỗi khi fetch lịch sử đặt phòng: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [userId]);

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: "STT",
      key: "id",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
      align: "center",
    },
    {
      title: "Check-in",
      dataIndex: "checkin",
      key: "checkin",
      align: "center",
      render: (record) => formatDate(record),
    },
    {
      title: "Check-out",
      dataIndex: "checkout",
      key: "checkout",
      align: "center",
      render: (record) => formatDate(record),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (record) => formatVND(record) + " VNĐ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (record) =>
        record == 1 ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chưa thanh toán</Tag>
        ),
    },
    {
      title: "Đánh giá",
      key: "review",
      align: "center",
      render: (record) => {
        const handleSubmit = async () => {
          try {
            const values = await form.validateFields();
            console.log({
              score: values.score,
              comment: values.comment,
              roomId: record.userId,
              userId: record.userId,
              bookingId: record.bookingId,
            });
            // Gửi đánh giá lên backend
            const res = await postAddRate({
              score: values.score,
              comment: values.comment,
              roomId: record.roomId,
              userid: record.userId,
              bookingId: record.bookingId,
            });
            if (res?.success)
             dispatchToast("success", "Đánh giá thành công!");

            setIsModalOpen(false);
            form.resetFields();
          } catch (err) {
            console.error(err);
            dispatchToast("error", "Đánh giá thất bại!");
          }
        };
        if (record?.status == 1)
          return (
            <div>
              <Button onClick={showModal}>
                <EditOutlined style={{ fontSize: 20 }} />
              </Button>
              <Modal
                title="Đánh giá phòng"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleSubmit}
                okText="Gửi đánh giá"
                cancelText="Hủy"
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="score"
                    label="Số sao"
                    rules={[
                      { required: true, message: "Vui lòng chọn số sao" },
                    ]}
                  >
                    <Rate />
                  </Form.Item>

                  <Form.Item
                    name="comment"
                    label="Bình luận"
                    rules={[
                      { required: true, message: "Vui lòng nhập bình luận" },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Cảm nhận của bạn về phòng..."
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          );
        else return "";
      },
    },
    {
      title: "Xem phòng",
      key: "action",
      align: "center",
      render: (record) => (
        <Button
          onClick={() => navigate("/detail-room", { state: record?.roomId })}
        >
          <EyeOutlined style={{ fontSize: 20 }} />
        </Button>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <h2>Lịch sử đặt phòng của bạn</h2>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default HistoryBooking;
