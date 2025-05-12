import { Modal, Checkbox, Divider } from "antd";
import { useState, useEffect } from "react";

export default function RoomSelectorModal({ visible, onClose, rooms, selected, onSelect }) {
  const [tempSelected, setTempSelected] = useState([]);

  useEffect(() => {
    setTempSelected(selected);
  }, [selected, visible]);

  const grouped = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {});

  const handleRoomChange = (roomId, checked) => {
    setTempSelected((prev) =>
      checked ? [...prev, roomId] : prev.filter((id) => id !== roomId)
    );
  };

  const handleFloorChange = (floor, checked) => {
    const floorRoomIds = grouped[floor].map((room) => room.id);
    setTempSelected((prev) => {
      const currentSet = new Set(prev);
      if (checked) {
        floorRoomIds.forEach((id) => currentSet.add(id));
      } else {
        floorRoomIds.forEach((id) => currentSet.delete(id));
      }
      return Array.from(currentSet);
    });
  };

  const isFloorChecked = (floor) => {
    const floorRoomIds = grouped[floor].map((room) => room.id);
    return floorRoomIds.every((id) => tempSelected.includes(id));
  };

  const isFloorIndeterminate = (floor) => {
    const floorRoomIds = grouped[floor].map((room) => room.id);
    const checkedCount = floorRoomIds.filter((id) =>
      tempSelected.includes(id)
    ).length;
    return checkedCount > 0 && checkedCount < floorRoomIds.length;
  };

  const handleOk = () => {
    onSelect(tempSelected);
    onClose();
  };

  return (
    <Modal
      title="📋 Chọn phòng theo tầng"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Xác nhận"
      cancelText="Huỷ"
      width={720}
    >
      {Object.entries(grouped).map(([floor, floorRooms]) => (
        <div key={floor} style={{ marginBottom: 16, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              indeterminate={isFloorIndeterminate(floor)}
              checked={isFloorChecked(floor)}
              onChange={(e) => handleFloorChange(floor, e.target.checked)}
              style={{ marginBottom: 8 }}
            >
              <strong>Tầng {floor}</strong>
            </Checkbox>
          </div>
          <Divider style={{ margin: "4px 0 10px" }} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              paddingLeft: 16,
            }}
          >
            {floorRooms.map((room) => (
              <Checkbox
                key={room.id}
                checked={tempSelected.includes(room.id)}
                onChange={(e) => handleRoomChange(room.id, e.target.checked)}
              >
                {room.name}
              </Checkbox>
            ))}
          </div>
        </div>
      ))}
    </Modal>
  );
}
