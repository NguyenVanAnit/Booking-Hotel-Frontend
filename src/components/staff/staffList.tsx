import { useEffect, useState } from "react";
import { Table, Button, Alert, Popconfirm, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { formatVND } from "../helpers/helpers";
import { getAllServices, deleteService } from "../utils/services";
import dispatchToast from "../helpers/toast";
import React from "react";
import { deleteStaff, getStaffList } from "../utils/staff";
import { set } from "date-fns";

const StaffList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getStaffList();
      console.log("response", response);
      if (response?.success) {
        setData(response?.data?.data);
      }
    } catch (error) {
      dispatchToast("error", "Lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onConfirmDelete = async (record) => {
    setLoading(true);
    try {
      const response = await deleteStaff(record.id);
      if (response?.success) {
        dispatchToast("success", "Xóa nhân viên thành công");
        fetchData();
      } else {
        dispatchToast("error", "Xóa nhân viên thất bại");
      }
    } catch (error) {
      dispatchToast("error", "Lỗi khi xóa nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 50,
      align: "center",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 150,
      align: "center",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      width: 150,
      align: "center",
      render: (record) => {
        if (record == 0) return "Nhân viên";
        else if (record == 1) return "Tổ trưởng";
        else if (record == 2) return "Trưởng phòng";
        else return "Không xác định";
      },
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      width: 150,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center",
      render: (record) => {
        if (record == 1) return "Đang làm việc";
        else if (record == 2) return "Nghỉ việc";
        else if (record == 3) return "Bị đuổi việc";
        else return "Không xác định";
      },
    },
    {
      title: "Chi tiết",
      key: "action",
      align: "center",
      render: (record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Button type="primary" onClick={() => setVisibleModal(true)}>
            <EyeOutlined />
          </Button>
          <Modal
            title="Thông tin nhân viên"
            visible={visibleModal}
            onCancel={() => setVisibleModal(false)}
            footer={null}
            width={800}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: 10 }}>
                <strong>Tên nhân viên:</strong> {record.fullName}
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong>Số điện thoại:</strong> {record.phoneNumber}
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong>Chức vụ:</strong>{" "}
                {record.role == 0
                  ? "Nhân viên"
                  : record.role == 1
                  ? "Tổ trưởng"
                  : record.role == 2
                  ? "Trưởng phòng"
                  : "Không xác định"}
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong>Phòng ban:</strong> {record.department}
              </div>
              <div style={{ marginBottom: 10 }}>
                <strong>Trạng thái:</strong>{" "}
                {record.status == 1
                  ? "Đang làm việc"
                  : record.status == 2
                  ? "Nghỉ việc"
                  : record.status == 3
                  ? "Bị đuổi việc"
                  : "Không xác định"}
              </div>
            </div>
          </Modal>
          <Popconfirm
            title="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa nhân viên này không?"
            onConfirm={() => onConfirmDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={() => {}}
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
      width: 70,
    },
  ];

  return (
    <div style={{ marginTop: 40 }}>
      <h4
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 20,
        }}
      >
        Danh sách nhân viên
      </h4>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        loading={loading}
        rowKey={(record) => record._id}
        bordered
        style={{ width: "90%", margin: "auto" }}
        size="small"
      />
    </div>
  );
};

export default StaffList;
