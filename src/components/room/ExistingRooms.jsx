import { useEffect, useState } from "react";
import { getAllRooms, deleteRoom, getRoomTypes } from "../utils/ApiFunctions";
import { Button, Table, Popconfirm, Select } from "antd";
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
  const [listRoomTypes, setListRoomTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selecterdRoomType, setSelecterdRoomType] = useState("");
  const navigate = useNavigate();
  const roleHR = localStorage.getItem("userRole");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getAllRooms();
      setRooms(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    const response = await getRoomTypes();
    setListRoomTypes(response);
  };

  useEffect(() => {
    fetchData();
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (selecterdRoomType == undefined) {
      setFilteredRooms(rooms);
    } else {
      const filteredRooms = rooms.filter((room) =>
        room.roomType.includes(selecterdRoomType)
      );
      console.log(filteredRooms);
      setFilteredRooms(filteredRooms);
    }
    setCurrentPage(1);
  }, [selecterdRoomType, rooms]);

  const handleDeleteRoom = async (roomId) => {
    console.log("delete room", roomId);
    await deleteRoom(roomId);
    fetchData();
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

      <div style={{ paddingBottom: "20px" }}>
        <Select
          // defaultValue="lucy"
          style={{
            width: "20%",
          }}
          allowClear
          options={listRoomTypes.map((roomType) => ({
            label: roomType,
            value: roomType,
          }))}
          placeholder="Tìm kiếm loại phòng"
          onChange={(value) => {
            console.log(value);
            setSelecterdRoomType(value);
          }}
        />
      </div>

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
        dataSource={filteredRooms}
        loading={isLoading}
        bordered
        size="small"
        rowKey={(record) => record.id}
        // pagination={{
        //   current: currentPage,
        //   pageSize: roomsPerPage,
        //   total: filteredRooms.length,
        //   showTotal: (total) => `Total ${total} rooms`,
        //   onChange: (page, pageSize) => {
        //     setCurrentPage(page);
        //     setRoomsPerPage(pageSize);
        //   },
        // }}
      />
    </div>
  );
};

export default ExistingRooms;
