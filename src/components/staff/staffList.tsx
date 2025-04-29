import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Alert,
  Popconfirm,
  Modal,
  Descriptions,
  Tag,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { formatDate, formatVND } from "../helpers/helpers";
import {
  getAllServices,
  deleteService,
  putUpdateService,
} from "../utils/services";
import dispatchToast from "../helpers/toast";
import React from "react";
import {
  deleteStaff,
  getStaffList,
  getWorkAndAbsenDayInMonth,
  postChageStatusStaff,
} from "../utils/staff";
import { set } from "date-fns";
import StaffManage from "./StaffManage";
import { width } from "@mui/system";
import { render } from "react-dom";

const StaffList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [abenseData, setAbenseData] = useState([]);
  const navigate = useNavigate();

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

  const changeStatus = async (record, status) => {
    setLoading(true);
    try {
      const formData = {
        status: status,
      };
      const response = await postChageStatusStaff(record.id, formData);
      if (response?.success) {
        dispatchToast("success", "Nhân viên đã nghỉ việc thành công");
        fetchData();
      } else {
        dispatchToast("error", "Thay đổi trạng thái nhân viên thất bại");
      }
    } catch (error) {
      dispatchToast("error", "Lỗi khi thay đổi trạng thái nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (record) => {
    setVisibleModal(true);
    try {
      const response = await getWorkAndAbsenDayInMonth(record.id, 4, 2025);
      if (response?.success) {
        setAbenseData(response?.data?.data.absentDates);
      } else {
        dispatchToast("error", "Lỗi khi tải thông tin nhân viên");
      }
    } catch (error) {
      dispatchToast("error", "Lỗi khi tải thông tin nhân viên");
    }

  }

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
          <Button type="primary" onClick={() => openModal(record)}>
            <EyeOutlined />
          </Button>
          <Modal
            title="Thông tin nhân viên"
            visible={visibleModal}
            onCancel={() => setVisibleModal(false)}
            footer={null}
            width={1000}
          >
            <Descriptions
              bordered
              column={2}
              size="middle"
              labelStyle={{ fontWeight: "bold", width: "30%" }}
            >
              <Descriptions.Item label="Tên nhân viên" span={2}>
                {record.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {record.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {record.email || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {record.gender === 1
                  ? "Nam"
                  : record.gender === 2
                  ? "Nữ"
                  : "Không xác định"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {formatDate(record.birthDate) || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {record.address || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban">
                {record.department}
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ">
                {record.role === 0
                  ? "Nhân viên"
                  : record.role === 1
                  ? "Tổ trưởng"
                  : record.role === 2
                  ? "Trưởng phòng"
                  : "Không xác định"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày vào làm">
                {formatDate(record.hireDate) || "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Lương">
                {record.salary ? formatVND(record.salary) + " VNĐ" : "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {record.status === 1 ? (
                  <Tag color="green">Đang làm việc</Tag>
                ) : record.status === 2 ? (
                  <Tag color="orange">Nghỉ việc</Tag>
                ) : record.status === 3 ? (
                  <Tag color="red">Bị đuổi việc</Tag>
                ) : (
                  "Không xác định"
                )}
              </Descriptions.Item>
            </Descriptions>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Popconfirm
                title="Xác nhận nhân viên này đã nghỉ việc?"
                onConfirm={() => changeStatus(record, 2)}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button type="primary" style={{ marginTop: 20 }}>
                  Đã nghỉ việc
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Xác nhận nhân viên này đã bị đuổi việc?"
                onConfirm={() => changeStatus(record, 3)}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button
                  type="primary"
                  style={{ marginLeft: 10, marginTop: 20 }}
                  danger
                >
                  Đuổi việc
                </Button>
              </Popconfirm>
            </div>

            <div>
              <h4 style={{ marginTop: 20, fontWeight: "bold" }}>
                Thông tin ngày đi làm trong tháng
              </h4>
              <Table
                dataSource={abenseData}
                columns={[
                  {
                    title: "STT",
                    key: "index",
                    render: (text, record, index) => index + 1,
                    width: 50,
                    align: "center",
                  },
                  {
                    title: "Ngày",
                    key: "date",
                    width: 150,
                    align: "center",
                    render: (record) => {
                      return formatDate(record);
                    }
                  },
                  {
                    title: "Trạng thái",
                    key: "date",
                    width: 150,
                    align: "center",
                    render: (record) => {
                      return "Cả ngày";
                    }
                  },
                ]}
                pagination={{
                  pageSize: 5,
                }}
                // loading={loading}
                rowKey={(record) => record}
                bordered
                size="small"
              />
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
    {
      title: "Công việc",
      key: "work",
      align: "center",
      width: 70,
      render: (record) => {
        return (
            <Button
              type="primary"
              onClick={() => {
                navigate("/staff-task", {
                  state: {
                    staffId: record.id,
                    staffName: record.fullName,
                  },
                });
              }}
            >
              <EditOutlined />
            </Button>
        )
      }
    }
  ];

  return (
    <StaffManage status={0}>
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
    </StaffManage>
  );
};

export default StaffList;
