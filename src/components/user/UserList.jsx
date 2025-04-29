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
import { getAllUsers } from "../utils/user";

const UserList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await getAllUsers();
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
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 100,
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 100,
      align: "center",
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: "roleId",
      width: 50,
      align: "center",
      render: (record) => {
        switch (Number(record)) {
          case 1:
            return <Alert message="Khách hàng" type="success" />;
          case 2:
            return <Alert message="Nhân viên lễ tân" type="warning" />;
          case 3:
            return <Alert message="Quản lý" type="error" />;
          default:
            return "Người dùng";
        }
      },
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
            // onClick={() => {
            //   navigate(`/add-service`, { state: { record: record } });
            // }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Xác nhận xóa người dùng"
            description="Có chắc chắn xóa người dùng này?"
            // onConfirm={() => onDeleteService(record.id)}
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
      <h2>Danh sách tài khoản</h2>
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
          Thêm người dùng
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

export default UserList;
