import { useEffect, useState } from "react";
import { getAllRooms, deleteRoom, getRoomTypes } from "../utils/ApiFunctions";
import { Button, Table, Popconfirm, Select, Segmented } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { data, useNavigate } from "react-router-dom";
import { formatVND } from "../helpers/helpers";
import {
  getAllTotalPriceBookingCount,
  getMonthlyBookingCount,
  getYearlyBookingCount,
} from "../utils/booking";
import { BarChart } from "@mui/x-charts";

const StatisticRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [selected, setSelected] = useState(0);
  const [priceList, setPriceList] = useState([]);
  //   const [listRoomTypes, setListRoomTypes] = useState([]);
  //   const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  //   const [selecterdRoomType, setSelecterdRoomType] = useState("");
  const navigate = useNavigate();
  const [roomStats, setRoomStats] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [roomStatsYear, setRoomStatsYear] = useState([]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `Tháng ${i + 1}`,
    value: i + 1,
  }));

  const years = Array.from({ length: 6 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    return {
      label: currentYear - i,
      value: currentYear - i,
    };
  });

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

  //   const fetchRoomTypes = async () => {
  //     const response = await getRoomTypes();
  //     setListRoomTypes(response);
  //   }
  const fetchRoomStats = async () => {
    const results = await Promise.all(
      rooms.map(async (room) => {
        try {
          const response = await getMonthlyBookingCount({
            id: room.id,
            year: selectedYear,
            month: selectedMonth,
          });
          const count = response.data.data;
          const id = room.id.toString();
          return { roomId: id, count };
        } catch (err) {
          console.error("Failed to fetch for roomId", room.id);
          return { roomId: room.id.toString(), count: 0 };
        }
      })
    );
    return results;
  };

  const fetchRoomStatsYear = async () => {
    const results = await Promise.all(
      rooms.map(async (room) => {
        try {
          const response = await getYearlyBookingCount({
            id: room.id,
            year: selectedYear,
          });
          const count = response.data.data;
          const id = room.id.toString();
          return { roomId: id, count };
        } catch (err) {
          console.error("Failed to fetch for roomId", room.id);
          return { roomId: room.id.toString(), count: 0 };
        }
      })
    );
    return results;
  };

  const fetchAllTotalPriceBookingCount = async () => {
    const res = await getAllTotalPriceBookingCount({
      month: selectedMonth,
      year: selectedYear,
    });
    if (res?.success) {
      setPriceList(res?.data.data);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllTotalPriceBookingCount();
    // fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      fetchRoomStats().then((stats) => setRoomStats(stats));
    }
  }, [rooms, selectedMonth, selectedYear]);

  useEffect(() => {
    if (rooms.length > 0) {
      fetchRoomStatsYear().then((stats) => setRoomStatsYear(stats));
    }
  }, [rooms, selectedYear]);

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
      title: "Thống kê",
      key: "action",
      width: 100,
      align: "center",
      render: (record) => (
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
      <h2 style={{ marginBottom: "30px" }}>Danh sách phòng </h2>

      <Table
        columns={columns}
        dataSource={rooms}
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

      <Segmented
        options={[
          { label: "Thống kê số lượng đơn đặt phòng", value: 0 },
          { label: "Thống kê doanh thu phòng", value: 1 },
        ]}
        value={selected}
        onChange={(val) => setSelected(val)}
        style={{ marginBottom: 40 }}
      />

      {selected == 0 ? (
        <div>
          <h2 style={{ marginBottom: "20px" }}>
            Thống kê số lượng đơn đặt phòng theo tháng
          </h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <Select
              style={{ width: 150 }}
              options={months}
              value={selectedMonth}
              onChange={(val) => setSelectedMonth(val)}
              placeholder="Chọn tháng"
            />
            <Select
              style={{ width: 150 }}
              options={years}
              value={selectedYear}
              onChange={(val) => setSelectedYear(val)}
              placeholder="Chọn năm"
            />
          </div>
          {roomStats.length > 0 && (
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: roomStats.map((stat) => `ID: ${stat.roomId}`), // tên phòng
                },
              ]}
              series={[
                {
                  data: roomStats.map((stat) => stat.count), // số lượt đặt
                  label: "Số lượt đơn đặt phòng theo tháng",
                },
              ]}
              width={800}
              height={400}
            />
          )}

          <h2 style={{ marginBottom: "20px" }}>
            Thống kê số lượng đơn đặt phòng theo năm
          </h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <Select
              style={{ width: 150 }}
              options={years}
              value={selectedYear}
              onChange={(val) => setSelectedYear(val)}
              placeholder="Chọn năm"
            />
          </div>
          {roomStatsYear.length > 0 && (
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: roomStatsYear.map((stat) => `ID: ${stat.roomId}`), // tên phòng
                },
              ]}
              series={[
                {
                  data: roomStatsYear.map((stat) => stat.count), // số lượt đặt
                  label: "Số lượt đơn đặt phòng theo năm",
                  color: "#66CC99",
                },
              ]}
              width={800}
              height={400}
            />
          )}
        </div>
      ) : (
        <Table
          dataSource={priceList}
          columns={[
            {
              title: "ID phòng",
              dataIndex: "roomId",
              key: "roomId",
              width: 100,
              align: "center",
            },
            {
              title: "Tên phòng",
              dataIndex: "roomName",
              key: "roomName",
              width: 220,
              align: "center",
            },
            {
              title: "Tổng tiền",
              dataIndex: "revenue",
              key: "revenue",
              width: 220,
              align: "center",
              render: (text) => formatVND(text) + " VNĐ",
            },
          ]}
          style={{ width: 600, margin: "auto" }}
        />
      )}
    </div>
  );
};

export default StatisticRoom;
