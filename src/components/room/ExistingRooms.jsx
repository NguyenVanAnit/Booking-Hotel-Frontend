import { useEffect, useState } from "react";
import { getAllRooms, deleteRoom } from "../utils/ApiFunctions";
import { Button, Table, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../helpers/helpers";

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const roleHR = localStorage.getItem("userRole");
  const [totalRecords, setTotalRecords] = useState(10);

  const fetchData = async (pageNumber) => {
    setIsLoading(true);
    try {
      const response = await getAllRooms({
        pageSize: 10,
        pageNumber: pageNumber,
      });
      setRooms(response?.data || []);
      setTotalRecords(response?.totalRecords || 10);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleDeleteRoom = async (roomId) => {
    console.log("delete room", roomId);
    await deleteRoom(roomId);
    fetchData(1);
  };

  const handleEditRoom = (id) => {
    navigate("/edit-room", { state: { id: id } });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "ID phòng",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
      width: 220,
      align: "center",
    },
    {
      title: "Loại phòng",
      dataIndex: "roomType",
      key: "roomType",
      width: 200,
      align: "center",
    },
    {
      title: "Giá phòng",
      dataIndex: "roomPrice",
      key: "roomPrice",
      width: 200,
      align: "center",
      render: (text) => <span>{formatVND(text)} VNĐ</span>,
    },
    {
      title: "Công việc",
      key: "work",
      align: "center",
      width: 100,
      render: (record) => (
        <Button
          onClick={() =>
            navigate("/room-task", {
              state: {
                roomId: record.id,
                roomName: record.name,
              },
            })
          }
        >
          <TagsOutlined />
        </Button>
      ),
    },
    {
      title: "Dịch vụ",
      width: 50,
      key: "services",
      align: "center",
      render: (record) => {
        return (
          <Button
            color="primary"
            variant="outlined"
            onClick={() =>
              navigate("/services-of-room", {
                state: { id: record?.id, name: record?.name },
              })
            }
          >
            Xem dịch vụ
          </Button>
        );
      },
    },
    {
      title: "Chức năng",
      dataIndex: "action",
      key: "action",
      width: 100,
      align: "center",
      render: (text, record) => (
        <div>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleEditRoom(record.id)}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Xác nhận xóa phòng"
            description="Có chắc chắn xóa phòng này?"
            onConfirm={() => handleDeleteRoom(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button style={{ marginLeft: "5%" }} danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "30px" }}>Danh sách phòng</h2>

      {
        roleHR === "ROLE_ADMIN" &&
        <Button
        onClick={() => navigate("/edit-room", { state: { id: null } })}
        style={{ float: "right", marginBottom: "20px" }}
        type="primary"
        icon={<PlusCircleOutlined />}
      >
        Thêm phòng
      </Button>}

      <Table
        columns={roleHR === "ROLE_HR"
          ? columns.filter(
              (col) => col.key !== "services" && col.key !== "action"
            )
          : columns}
        dataSource={rooms}
        loading={isLoading}
        bordered
        size="small"
        rowKey={(record) => record.id}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: totalRecords,
          onChange: (page) => {
            fetchData(page);
            setCurrentPage(page);
          },
        }}
      />
    </div>
  );
};

export default ExistingRooms;
