import React, { useEffect, useState } from "react";
import { getAllRooms, deleteRoom } from "../utils/ApiFunctions";
import { Button, Table, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage, setRoomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selecterdRoomType, setSelecterdRoomType] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selecterdRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      const filteredRooms = rooms.filter((room) => {
        room.roomType.toLowerCase().includes(selecterdRoomType.toLowerCase());
      });
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
      title: "Loại phòng",
      dataIndex: "roomType",
      key: "roomType",
      width: 300,
      align: "center",
    },
    {
      title: "Giá phòng",
      dataIndex: "roomPrice",
      key: "roomPrice",
      width: 200,
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 200,
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
    <div>
      <h2>Danh sách phòng đang được thuê</h2>
      <Table
        columns={columns}
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
