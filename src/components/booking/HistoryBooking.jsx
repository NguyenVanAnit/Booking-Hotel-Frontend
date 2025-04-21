import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { getHistoryBooking } from "../utils/booking";
import { formatDate, formatVND } from "../helpers/helpers";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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
    },
    {
        title: "Xem phòng",
        key: "action",
        align: "center",
        render: (record) => (
          <Button onClick={() => navigate("/detail-room", { state: record?.roomId })}>
            <EyeOutlined style={{ fontSize: 20 }} />
          </Button>
        ),
    }
  ];

  return (
    <div className="container mt-5">
      <h2>Lịch sử đặt phòng của bạn</h2>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default HistoryBooking;
