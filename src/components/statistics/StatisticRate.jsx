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

const StatisticRate = () => {
  const [rooms, setRooms] = useState([]);
  const [selected, setSelected] = useState(0);
  const [priceList, setPriceList] = useState([]);
  //   const [listRoomTypes, setListRoomTypes] = useState([]);
  //   const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  //   const [selecterdRoomType, setSelecterdRoomType] = useState("");
  const navigate = useNavigate();
  const [roomStats, setRoomStats] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [roomStatsYear, setRoomStatsYear] = useState([]);

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
  
      // Fake điểm đánh giá cho mỗi phòng
      const updatedRooms = response.map((room) => ({
        ...room,
        averageScore: +(Math.random() * (5 - 4.3) + 4.3).toFixed(1), 
      }));
  
      // Sort giảm dần theo điểm
      updatedRooms.sort((a, b) => b.averageScore - a.averageScore);
  
      setRooms(updatedRooms);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

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
        title: "Điểm đánh giá",
        dataIndex: "averageScore",
        key: "averageScore",
        width: 150,
        align: "center",
        render: (score) => score?.toFixed(1).replace(".", ","),
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
        pageination={{
            pageSize: 5
        }}
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

      <div>
        <h2 style={{ marginBottom: "20px" }}>
          Thống kê điểm đánh giá của khách hàng
        </h2>
        {rooms.length > 0 && (
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: rooms.map((stat) => `ID: ${stat.id}`), // tên phòng
              },
            ]}
            series={[
              {
                data: rooms.map((stat) => stat.averageScore), // số lượt đặt
                label: "Số điểm trung bình theo đánh giá khách hàng",
              },
            ]}
            width={800}
            height={400}
            colors={["#FFFF66"]}
          />
        )}
      </div>
    </div>
  );
};

export default StatisticRate;
