import { useEffect, useState } from "react";
import { Segmented, Select, Table } from "antd";
import { BarChart } from "@mui/x-charts";
import { getAbbentDayInMonth, getNumberWorkedInMonth } from "../utils/staff";
import { formatVND } from "../helpers/helpers";
import { use } from "react";

const StatisticStaffAttendance = () => {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [numberWorked, setNumberWorked] = useState([]);
  const [workedOrPending, setWorkedOrPending] = useState(0);
  const [mergeData, setMergeData] = useState([]);

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

  const fetchNumberWorked = async () => {
    setIsLoading(true);
    try {
      const response = await getNumberWorkedInMonth(
        selectedMonth,
        selectedYear
      );
      setNumberWorked(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch staff attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
    fetchNumberWorked();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const mergedStaffList = staffList.map((staff) => {
      const matchedWork =
        numberWorked.find((w) => w.staffId === staff.staffId) || {};

      const completed = matchedWork.completedTaskCount || 0;
      const pending = matchedWork.pendingTaskCount || 0;

      const baseSalary = staff.totalSalary || 0;
      const totalFinalSalary =
        baseSalary / 26 + completed * 200000 - pending * 100000;

      return {
        ...staff,
        completedTaskCount: completed,
        pendingTaskCount: pending,
        totalFinalSalary, // 👈 Thêm dòng này
      };
    });

    setMergeData(mergedStaffList);
  }, [staffList, numberWorked]);

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
      sorter: (a, b) => b.daysPresent - a.daysPresent,
    },
    {
      title: "Số ngày nghỉ",
      dataIndex: "daysAbsent",
      key: "daysAbsent",
      width: 100,
      align: "center",
    },
    {
      title: "Số công việc hoàn thành",
      dataIndex: "completedTaskCount",
      key: "completedTaskCount",
      width: 150,
      align: "center",
      sorter: (a, b) => b.completedTaskCount - a.completedTaskCount,
    },
    {
      title: "Số công việc chưa hoàn thành",
      dataIndex: "pendingTaskCount",
      key: "pendingTaskCount",
      width: 150,
      align: "center",
      sorter: (a, b) => b.pendingTaskCount - a.pendingTaskCount,
    },
    {
      title: "Lương cơ bản",
      dataIndex: "totalSalary",
      key: "totalSalary",
      width: 100,
      align: "center",
      render: (record) => formatVND(record / 26) + " VNĐ",
      sorter: (a, b) => b.totalSalary - a.totalSalary,
    },
    {
      title: "Tổng lương",
      dataIndex: "totalFinalSalary",
      key: "totalFinalSalary",
      width: 120,
      align: "center",
      render: (record) => formatVND(record) + " VNĐ",
      sorter: (a, b) => b.totalFinalSalary - a.totalFinalSalary,
    },
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
        dataSource={mergeData}
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

      {numberWorked.length > 0 && (
        <>
          <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>
            Biểu đồ số công việc hoàn thành của nhân viên
          </h3>
          <Segmented
            options={[
              {
                label: "Số công việc hoàn thành",
                value: 0,
              },
              {
                label: "Số công việc chưa hoàn thành",
                value: 1,
              },
            ]}
            defaultValue={0}
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              backgroundColor: "#16AAFF",
            }}
            onChange={(value) => {
              setWorkedOrPending(value);
            }}
          />
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: numberWorked.map((s) => s.staffId),
              },
            ]}
            series={[
              {
                data:
                  workedOrPending == 0
                    ? numberWorked.map((s) => s.completedTaskCount)
                    : numberWorked.map((s) => s.pendingTaskCount),
                label: workedOrPending == 0 ? "Số công việc hoàn thành" : "Số công việc chưa hoàn thành",
                color: workedOrPending == 0 ? "#66FF66" : "#FF6666",
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
