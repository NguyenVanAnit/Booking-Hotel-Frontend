import { useEffect, useState } from "react";
import { Table, Button, Alert, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { formatVND } from "../helpers/helpers";
import { getAllServices, deleteService } from "../utils/services";
import dispatchToast from "../helpers/toast";

const ServiceList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await getAllServices();
    const res = response.data.data;
    console.log(res.data);
    if (response?.data.success) {
      setData(res?.data);
    } else {
      setData([]);
      dispatchToast("error", "Lỗi khi tải danh sách dịch vụ");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDeleteService = async (id) => {
    const response = await deleteService(id);
    if (response?.data.success) {
      dispatchToast("success", "Xóa dịch vụ thành công");
      fetchData();
    } else {
      dispatchToast("error", "Xóa dịch vụ thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
      width: 10,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      width: 150,
      align: "center",
    },
    {
      title: "Giá dịch vụ (*/1)",
      dataIndex: "priceService",
      key: "priceService",
      width: 100,
      align: "center",
      render: (record) => formatVND(record) + " VNĐ",
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "active",
      key: "active",
      width: 50,
      align: "center",
      render: (record) => {
        return record ? (
          <Alert message="Đang hoạt động" type="success" />
        ) : (
          <Alert message="Dừng hoạt động" type="warning" />
        );
      },
    },
    {
      title: "Trạng thái miễn phí",
      dataIndex: "free",
      key: "free",
      width: 50,
      align: "center",
      render: (record) => {
        return record ? (
          <Alert message="Đang miễn phí" type="success" />
        ) : (
          <Alert message="Tính phí" type="info" />
        );
      },
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "serviceType",
      key: "serviceType",
      width: 100,
      align: "center",
    },
    {
      title: "Số lượng tối đa",
      dataIndex: "maxQuantity",
      key: "maxQuantity",
      width: 50,
      align: "center",
    },
    {
      title: "Chức năng",
      key: "action",
      width: 100,
      align: "center",
      render: (record) => (
        <div>
          <Button
            type="dashed"
            onClick={() => {
              navigate(`/add-service`, { state: { record: record } });
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Xác nhận xóa dịch vụ"
            description="Có chắc chắn xóa dịch vụ này?"
            onConfirm={() => onDeleteService(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger style={{ marginLeft: "5%" }}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Danh sách dịch vụ</h2>
      {/* Service list content goes here */}
      <div style={{ width: "80%", margin: "auto" }}>
        <Button
          style={{ float: "right", marginBottom: 10 }}
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            navigate("/add-service");
          }}
        >
          Thêm dịch vụ
        </Button>
        <Table
          dataSource={data}
          columns={columns}
          pagination={{
            pageSize: 10
          }}  
          loading={loading}
          rowKey={(record) => record._id}
          bordered
          style={{ marginBottom: 50 }}
          size="small"
        />
      </div>
    </div>
  );
};

export default ServiceList;
