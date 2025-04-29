import { useEffect, useState } from "react";
import { Select, Table } from "antd";
import { BarChart } from "@mui/x-charts";
import { getAbbentDayInMonth } from "../utils/staff";
import { formatVND } from "../helpers/helpers";

const StatisticStaffAttendance = () => {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const response = await getAbbentDayInMonth(selectedMonth, selectedYear);
      setStaffList(response);
    } catch (error) {
      console.error("Failed to fetch staff attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [selectedMonth, selectedYear]);

  const columns = [
    {
      title: "ID Nhân Viên",
      dataIndex: "staffId",
      key: "staffId",
      width: 100,
      align: "center",
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      align: "center",
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      width: 150,
      align: "center",
    },
    {
      title: "Số ngày đi làm",
      dataIndex: "daysPresent",
      key: "daysPresent",
      width: 100,
      align: "center",
    },
    {
      title: "Số ngày nghỉ",
      dataIndex: "daysAbsent",
      key: "daysAbsent",
      width: 100,
      align: "center",
    },
    {
        title: "Lương",
        dataIndex: "totalSalary",
        key: "totalSalary",
        width: 100,
        align: "center",
        render: (record) => formatVND(record / 30) + " VNĐ",
    }
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "30px" }}>Thống kê chấm công nhân viên</h2>

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

      <Table
        columns={columns}
        dataSource={staffList}
        loading={isLoading}
        bordered
        size="small"
        rowKey={(record) => record.staffId}
      />

      {staffList.length > 0 && (
        <>
          <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>
            Biểu đồ số ngày nghỉ nhân viên
          </h3>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: staffList.map((s) => s.staffId),
              },
            ]}
            series={[
              {
                data: staffList.map((s) => s.daysAbsent),
                label: "Số ngày nghỉ",
                color: "#FF6666",
              },
            ]}
            width={1000}
            height={400}
          />
        </>
      )}
    </div>
  );
};

export default StatisticStaffAttendance;