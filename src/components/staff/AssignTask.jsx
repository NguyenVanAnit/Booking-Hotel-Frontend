import { useEffect, useState } from "react";
import { Button, Select, Input, message, AutoComplete } from "antd";
import axios from "axios";
import StaffManage from "./StaffManage";
import { api, getAllRooms } from "../utils/ApiFunctions";
import { getStaffList } from "../utils/staff";

const { Option } = Select;

export default function AssignTaskPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState();
  const [cleaningStaffs, setCleaningStaffs] = useState([]);
  const [maintenanceStaffs, setMaintenanceStaffs] = useState([]);
  const [inspectionStaffs, setInspectionStaffs] = useState([]);
  const [selectedCleaningStaffs, setSelectedCleaningStaffs] = useState([]);
  const [selectedMaintenanceStaffs, setSelectedMaintenanceStaffs] = useState(
    []
  );
  const [selectedInspectionStaffs, setSelectedInspectionStaffs] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchAllStaffs();
  }, []);

  const fetchRooms = async () => {
    const res = await getAllRooms();
    setRooms(res || []);
  };

  const fetchAllStaffs = async () => {
    try {
        const res = await getStaffList();
        if (res?.success) {
            const staffs = res?.data?.data || [];
            const cleaning = staffs.filter(staff => staff.department === "Dọn dẹp");
            const maintenance = staffs.filter(staff => staff.department === "Bảo trì");
            const inspection = staffs.filter(staff => staff.department === "Kiểm định");
            setCleaningStaffs(cleaning || []);
            setMaintenanceStaffs(maintenance || []);
            setInspectionStaffs(inspection|| []);
        } 
    } catch (err) {
      message.error("Lỗi khi tải danh sách nhân viên!");
    }
  };

  const handleAssign = async () => {
    if (!selectedRoom) {
      message.error("Vui lòng chọn phòng!");
      return;
    }

    const assignList = [
      ...selectedCleaningStaffs.map((staffId) => ({ staffId, taskType: 0 })),
      ...selectedMaintenanceStaffs.map((staffId) => ({ staffId, taskType: 1 })),
      ...selectedInspectionStaffs.map((staffId) => ({ staffId, taskType: 2 })),
    ];

    if (assignList.length === 0) {
      message.error("Vui lòng chọn ít nhất 1 nhân viên!");
      return;
    }

    try {
      for (const assign of assignList) {
        await api.post("/tasks/assign", null, {
          params: {
            roomId: selectedRoom,
            staffId: assign.staffId,
            taskType: assign.taskType,
            notes: notes,
          },
        });
      }
      message.success("Giao việc thành công!");
      // Reset nếu muốn
      setSelectedRoom(undefined);
      setSelectedCleaningStaffs([]);
      setSelectedMaintenanceStaffs([]);
      setSelectedInspectionStaffs([]);
      setNotes("");
    } catch (error) {
      message.error("Có lỗi xảy ra khi giao việc!");
    }
  };

  return (
    <StaffManage status={3}>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-10 p-6" style={{ padding: 30 }}>
        <h5 className="text-2xl font-bold mb-6 text-center">
          📋 Giao Việc Cho Nhân Viên
        </h5>

        <div
          className="mb-4 mt-4"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <label className="font-semibold mr-4">🏨 Chọn Phòng:</label>
          <AutoComplete
            placeholder="Nhập tên phòng..."
            value={selectedRoom}
            onChange={setSelectedRoom}
            onSelect={(value) => setSelectedRoom(value)}
            options={rooms.map((room) => ({
              value: room.id,
              label: room.name,
            }))}
            filterOption={(inputValue, option) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            style={{ width: "50%" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="mb-4" style={{ width: "30%" }}>
            <label className="font-semibold">🧹 Nhân viên Dọn dẹp</label>
            <Select
              mode="multiple"
              placeholder="Chọn nhân viên dọn dẹp"
              value={selectedCleaningStaffs}
              onChange={setSelectedCleaningStaffs}
              style={{ width: "100%", marginTop: 8 }}
            >
              {cleaningStaffs.map((staff) => (
                <Option key={staff.id} value={staff.id}>
                  {staff.fullName} ({staff.department})
                </Option>
              ))}
            </Select>
          </div>

          <div className="mb-4" style={{ width: "30%" }}>
            <label className="font-semibold">🛠️ Nhân viên Bảo trì</label>
            <Select
              mode="multiple"
              placeholder="Chọn nhân viên bảo trì"
              value={selectedMaintenanceStaffs}
              onChange={setSelectedMaintenanceStaffs}
              style={{ width: "100%", marginTop: 8 }}
            >
              {maintenanceStaffs.map((staff) => (
                <Option key={staff.id} value={staff.id}>
                  {staff.fullName} ({staff.department})
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-4" style={{ width: "30%" }}>
            <label className="font-semibold">🔍 Nhân viên Kiểm định</label>
            <Select
              mode="multiple"
              placeholder="Chọn nhân viên kiểm định"
              value={selectedInspectionStaffs}
              onChange={setSelectedInspectionStaffs}
              style={{ width: "100%", marginTop: 8 }}
            >
              {inspectionStaffs.map((staff) => (
                <Option key={staff.id} value={staff.id}>
                  {staff.fullName} ({staff.department})
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Input.TextArea
          placeholder="Ghi chú thêm (nếu có)"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mb-4"
        />

        <Button type="primary" block onClick={handleAssign}>
          🚀 Giao Việc
        </Button>
      </div>
    </StaffManage>
  );
}
