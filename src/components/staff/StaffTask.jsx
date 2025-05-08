import { useEffect, useState } from "react";
import { Button, Table, Tag, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../utils/ApiFunctions";
import { EditOutlined } from "@ant-design/icons";
import { formatDate, formatDateArr } from "../helpers/helpers";

const taskTypeLabel = {
  0: "Dọn dẹp",
  1: "Bảo trì",
  2: "Kiểm định",
  3: "Dọn dẹp sau khi trả phòng"
};

export default function StaffTasksPage() {
  const location = useLocation();
  const staffId = location.state.staffId;
  const staffName = location.state.staffName;
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [staffId]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/staff/${staffId}`);
      setTasks(res.data.data.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách công việc nhân viên này!");
    }
  };

  const handleComplete = async (taskId, status) => {
    try {
      const res = await api.put(`/tasks/${taskId}/status?status=${status}`);
      if (res.data.success) {
        message.success("Công việc đã được đánh dấu hoàn thành!");
        fetchTasks();
      } else {
        message.error("Có lỗi xảy ra khi đánh dấu công việc!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đánh dấu công việc!");
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
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName",
      align: "center",
    },
    {
      title: "Loại công việc",
      dataIndex: "taskType",
      key: "taskType",
      align: "center",

      render: (taskType) => <Tag color="purple">{taskTypeLabel[taskType]}</Tag>,
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",

      render: (status) => {
        if (status === 0) return <Tag color="processing">Đang thực hiện</Tag>;
        else if (status === 1) return <Tag color="success">Đã hoàn thành</Tag>;
        else return <Tag color="error">Không xác định</Tag>;
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "assignedDate",
      key: "assignedDate",
      align: "center",
      render: (record) => (record ? formatDateArr(record) : null),
    },
    {
      title: "Thời gian hoàn thành",
      dataIndex: "completedDate",
      key: "completedDate",
      align: "center",
      render: (record) => (record ? formatDateArr(record) : null),
    },
    {
      title: "Hoàn thành",
      align: "center",
      render: (record) => {
        if (record.status === 0) {
          return (
            <Button
              color="success"
              style={{ cursor: "pointer" }}
              onClick={() => handleComplete(record.id, 1)}
            >
              Đánh dấu hoàn thành
            </Button>
          );
        } else {
          return (
            <Button
              color="success"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/room-task", {
                  state: { roomId: record.roomId, roomName: record.roomName },
                })
              }
              type="primary"
            >
              Xem phòng
            </Button>
          );
        }
      },
    },
    {
      title: "Làm lại",
      key: "redo",
      align: "center",
      render: (record) => {
        if (record.status === 1) {
          return (
            <Button
              type="primary"
              danger
              onClick={() => handleComplete(record.id, 0)}
            >
              <EditOutlined />
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        📋 Công việc của nhân viên {staffName}
      </h2>
      <Table columns={columns} dataSource={tasks} rowKey="id" bordered />
    </div>
  );
}
