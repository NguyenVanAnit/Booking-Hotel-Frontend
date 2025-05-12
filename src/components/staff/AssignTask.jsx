import { useEffect, useState } from "react";
import { Button, Select, Input, message, Segmented } from "antd";
import StaffManage from "./StaffManage";
import { api, getAllRooms } from "../utils/ApiFunctions";
import { getStaffList } from "../utils/staff";
import { getAllRoomsByCheckout } from "../utils/room";
import moment from "moment";
import emailjs from "emailjs-com";
import RoomSelectorModal from "../common/RoomSelectorModal";

const { Option } = Select;

export default function AssignTaskPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [cleaningStaffs, setCleaningStaffs] = useState([]);
  const [maintenanceStaffs, setMaintenanceStaffs] = useState([]);
  const [inspectionStaffs, setInspectionStaffs] = useState([]);
  const [selectedCleaningStaffs, setSelectedCleaningStaffs] = useState([]);
  const [selectedMaintenanceStaffs, setSelectedMaintenanceStaffs] = useState(
    []
  );
  const [selectedInspectionStaffs, setSelectedInspectionStaffs] = useState([]);
  const [notes, setNotes] = useState("");
  const [workType, setWorkType] = useState(0); // 0: Daily, 1: Checkout
  const [roomsCheckout, setRoomsCheckout] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const [showRoomModal, setShowRoomModal] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchAllStaffs();
    fetchRoomsCheckout();
  }, []);

  const fetchRooms = async () => {
    const res = await getAllRooms();
    setRooms(res || []);
  };

  const fetchRoomsCheckout = async () => {
    const res = await getAllRoomsByCheckout(moment().format("YYYY-MM-DD"));
    if (res?.success) {
      const rooms = res?.data?.data || [];
      setRoomsCheckout(rooms || []);
    } else {
      message.error("Lỗi khi tải danh sách phòng!");
    }
  };

  const fetchAllStaffs = async () => {
    try {
      const res = await getStaffList();
      if (res?.success) {
        const staffs = res?.data?.data || [];
        setStaffList(staffs || []);
        const cleaning = staffs.filter(
          (staff) => staff.department === "Dọn dẹp"
        );
        const maintenance = staffs.filter(
          (staff) => staff.department === "Bảo trì"
        );
        const inspection = staffs.filter(
          (staff) => staff.department === "Kiểm định"
        );
        setCleaningStaffs(cleaning || []);
        setMaintenanceStaffs(maintenance || []);
        setInspectionStaffs(inspection || []);
      }
    } catch (err) {
      message.error("Lỗi khi tải danh sách nhân viên!");
    }
  };

  const handleAssign = async (type) => {
    if (!selectedRooms || selectedRooms.length === 0) {
      message.error("Vui lòng chọn ít nhất 1 phòng!");
      return;
    }

    const assignList = [
      ...selectedCleaningStaffs.map((staffId) => {
        const staff = staffList.find((s) => s.id === staffId);
        return {
          staffId,
          taskType: type,
          fullName: staff?.fullName || "",
          email: staff?.email || "",
          department: staff?.department || "",
        };
      }),
      ...selectedMaintenanceStaffs.map((staffId) => {
        const staff = staffList.find((s) => s.id === staffId);
        return {
          staffId,
          taskType: 1,
          fullName: staff?.fullName || "",
          email: staff?.email || "",
          department: staff?.department || "",
        };
      }),
      ...selectedInspectionStaffs.map((staffId) => {
        const staff = staffList.find((s) => s.id === staffId);
        return {
          staffId,
          taskType: 2,
          fullName: staff?.fullName || "",
          email: staff?.email || "",
          department: staff?.department || "",
        };
      }),
    ];

    console.log(assignList);

    if (assignList.length === 0) {
      message.error("Vui lòng chọn ít nhất 1 nhân viên!");
      return;
    }

    try {
      for (const roomId of selectedRooms) {
        for (const assign of assignList) {
          await api.post("/tasks/assign", null, {
            params: {
              roomId,
              staffId: assign.staffId,
              taskType: assign.taskType,
              notes,
            },
          });
        }
      }
      message.success("Giao việc thành công!");
      for (const assign of assignList) {
        sendEmail(assign, type); // Gửi email thông báo cho nhân viên
      }
      // Reset nếu muốn
      setSelectedRooms([]);
      setSelectedCleaningStaffs([]);
      setSelectedMaintenanceStaffs([]);
      setSelectedInspectionStaffs([]);
      setNotes("");
    } catch (error) {
      message.error("Có lỗi xảy ra khi giao việc!");
    }
  };

  const sendEmail = async (record, type) => {
    try {
      // Logic duyệt đơn
      const work =
        record.department === "Dọn dẹp"
          ? type == 0
            ? "Dọn dẹp"
            : "Dọn dẹp sau khi khách trả phòng"
          : record.department;

      const roomNames =
        type == 0
          ? selectedRooms
              .map((roomId) => {
                const room = rooms.find((r) => r.id === roomId);
                return room?.name;
              })
              .filter(Boolean)
              .join(", ")
          : selectedRooms
              .map((roomId) => {
                const room = roomsCheckout.find((r) => r.roomId === roomId);
                return room?.roomName;
              })
              .filter(Boolean)
              .join(", ");

      const dayWork = moment().format("DD/MM/YYYY");

      // Thông tin email
      const templateParams = {
        to_name: record.fullName,
        to_email: record.email, // Email của người dùng
        message: `Bạn đã được giao công việc: ${work} \nDanh sách phòng: ${roomNames} \nThời gian: ${dayWork}. \nGhi chú: ${notes}`,
      };

      console.log(templateParams);

      // Gửi email qua EmailJS
      await emailjs.send(
        "service_ro6hg6v",
        "template_jkfc4qe",
        templateParams,
        "xR7FSz5qWevMG6w_2"
      );

      console.log("Duyệt đơn và gửi email thành công!");
    } catch (error) {
      console.error(error);
      console.log("Có lỗi xảy ra khi gửi email!");
      message.error("Gửi email thất bại!");
    }
  };

  return (
    <StaffManage status={3}>
      <div
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-10 p-6"
        style={{ padding: 30 }}
      >
        <h5 className="text-2xl font-bold mb-6 text-center">
          📋 Giao Việc Cho Nhân Viên
        </h5>

        <Segmented
          options={[
            { label: "Công việc hàng ngày", value: 0 },
            { label: "Công việc khi khách trả phòng", value: 1 },
          ]}
          defaultValue={0}
          style={{
            marginBottom: 10,
            marginTop: 10,
            backgroundColor: "#1677FF",
          }}
          onChange={(value) => {
            setWorkType(value);
            setSelectedRooms([]);
            setSelectedCleaningStaffs([]);
            setSelectedMaintenanceStaffs([]);
            setSelectedInspectionStaffs([]);
          }}
        />

        {workType == 0 && (
          <>
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
              {/* <Select
                mode="multiple"
                showSearch
                allowClear
                placeholder="Chọn các phòng..."
                style={{ width: "50%", marginLeft: 8 }}
                value={selectedRooms}
                onChange={setSelectedRooms}
                options={rooms.map((room) => ({
                  value: room.id,
                  label: room.name,
                }))}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              /> */}
              <Button
                type="default"
                onClick={() => setShowRoomModal(true)}
                style={{ marginLeft: 8 }}
              >
                🏨 Chọn phòng ({selectedRooms.length})
              </Button>
              <RoomSelectorModal
                visible={showRoomModal}
                onClose={() => setShowRoomModal(false)}
                rooms={
                  workType === 0
                    ? rooms
                    : roomsCheckout.map((r) => ({
                        id: r.roomId,
                        name: r.roomName,
                        floor: r.floor,
                      }))
                }
                selected={selectedRooms}
                onSelect={setSelectedRooms}
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

            <Button type="primary" block onClick={() => handleAssign(0)}>
              🚀 Giao Việc
            </Button>
          </>
        )}

        {workType == 1 && (
          <>
            <div
              className="mb-4 mt-4"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <label className="font-semibold mr-4">
                🏨 Chọn các phòng được trả phòng:{" "}
              </label>
              <Select
                mode="multiple"
                showSearch
                allowClear
                placeholder="Chọn các phòng..."
                style={{ width: "50%", marginLeft: 8 }}
                value={selectedRooms}
                onChange={setSelectedRooms}
                options={roomsCheckout.map((room) => ({
                  value: room.roomId,
                  label: room.roomName,
                }))}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            <div
              className="mb-4"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <label className="font-semibold">🧹 Nhân viên Dọn dẹp</label>
              <Select
                mode="multiple"
                placeholder="Chọn nhân viên dọn dẹp"
                value={selectedCleaningStaffs}
                onChange={setSelectedCleaningStaffs}
                style={{ width: "50%", marginTop: 8, marginLeft: 8 }}
              >
                {cleaningStaffs.map((staff) => (
                  <Option key={staff.id} value={staff.id}>
                    {staff.fullName} ({staff.department})
                  </Option>
                ))}
              </Select>
            </div>

            <Button type="primary" block onClick={() => handleAssign(3)}>
              🚀 Giao Việc
            </Button>
          </>
        )}
      </div>
    </StaffManage>
  );
}
