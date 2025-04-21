import { Table, Button, Tabs } from "antd";
import { useEffect, useState } from "react";
import {
  getStaffCheckinDay,
  getStaffCheckoutDay,
  getStaffList,
  postCheckinStaff,
  postCheckoutStaff,
} from "../utils/staff";
import dispatchToast from "../helpers/toast";
import { PoweroffOutlined } from "@ant-design/icons";
import StaffManage from "./StaffManage";

const TimeKeeping = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkinStaffIds, setCheckinStaffIds] = useState([]);
  const [checkoutStaffIds, setCheckoutStaffIds] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getStaffList();
      if (response?.success) {
        setData(response?.data?.data);
      }
    } catch (error) {
      dispatchToast("error", "Lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffCheckin = async () => {
    try {
      const res1 = await getStaffCheckinDay();
      const res2 = await getStaffCheckoutDay(); // giả định bạn có API này

      if (res1?.success) setCheckinStaffIds(res1.data.data);
      if (res2?.success) setCheckoutStaffIds(res2.data.data);
    } catch (error) {
      dispatchToast("error", "Lỗi khi tải trạng thái chấm công");
    }
  };

  useEffect(() => {
    fetchData();
    fetchStaffCheckin();
  }, []);

  const notCheckedIn = data.filter(
    (staff) => !checkinStaffIds.includes(staff.id)
  );

  const checkedInOnly = data.filter(
    (staff) =>
      checkinStaffIds.includes(staff.id) && !checkoutStaffIds.includes(staff.id)
  );

  const fullyChecked = data.filter(
    (staff) =>
      checkinStaffIds.includes(staff.id) && checkoutStaffIds.includes(staff.id)
  );

  const checkin = async (id) => {
    setLoading(true);
    try {
      const response = await postCheckinStaff(id);
      if (response?.success) {
        dispatchToast("success", "Chấm công đến thành công");
        await fetchData();
        await fetchStaffCheckin(); // <- thêm dòng này để reload trạng thái chấm công
      }
    } catch (error) {
      dispatchToast("error", "Lỗi khi chấm công");
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (id) => {
    setLoading(true);
    try {
      const response = await postCheckoutStaff(id);
      if (response?.success) {
        dispatchToast("success", "Chấm công về thành công");
        await fetchData();
        await fetchStaffCheckin(); // <- thêm dòng này
      }
    } catch (error) {
      dispatchToast("error", "Lỗi khi chấm công");
    } finally {
      setLoading(false);
    }
  };

  const baseColumns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
      align: "center",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      align: "center",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      align: "center",
      render: (record) => {
        if (record == 0) return "Nhân viên";
        if (record == 1) return "Tổ trưởng";
        if (record == 2) return "Trưởng phòng";
        return "Không xác định";
      },
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      align: "center",
    },
  ];

  const checkinColumns = [
    ...baseColumns,
    {
      title: "Chấm công đến",
      align: "center",
      render: (record) => (
        <Button type="primary" onClick={() => checkin(record.id)}>
          <PoweroffOutlined />
        </Button>
      ),
    },
  ];

  const checkoutColumns = [
    ...baseColumns,
    {
      title: "Chấm công về",
      align: "center",
      render: (record) => (
        <Button type="primary" onClick={() => checkout(record.id)}>
          <PoweroffOutlined />
        </Button>
      ),
    },
  ];

  const doneColumns = [...baseColumns]; // Không cần nút gì nữa
  // filter để loại bỏ undefined khi hide cột

  return (
    <StaffManage status={2}>
      <div style={{ paddingLeft: 30 }}>
        <h4
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Chấm công
        </h4>
        <Tabs
          defaultActiveKey="1"
          centered
          items={[
            {
              key: "1",
              label: "Chưa chấm công đến",
              children: (
                <Table
                  dataSource={notCheckedIn}
                  columns={checkinColumns}
                  loading={loading}
                  rowKey={(record) => record.id}
                  pagination={{ pageSize: 10 }}
                  bordered
                  size="small"
                />
              ),
            },
            {
              key: "2",
              label: "Đã đến - Chưa về",
              children: (
                <Table
                  dataSource={checkedInOnly}
                  columns={checkoutColumns}
                  loading={loading}
                  rowKey={(record) => record.id}
                  pagination={{ pageSize: 10 }}
                  bordered
                  size="small"
                />
              ),
            },
            {
              key: "3",
              label: "Đã chấm công đầy đủ",
              children: (
                <Table
                  dataSource={fullyChecked}
                  columns={doneColumns}
                  loading={loading}
                  rowKey={(record) => record.id}
                  pagination={{ pageSize: 10 }}
                  bordered
                  size="small"
                />
              ),
            },
          ]}
        />
      </div>
    </StaffManage>
  );
};

export default TimeKeeping;
