import React from "react";
import { useState } from "react";

const RoomFilters = ({ data, setFilterData }) => {
  const [filter, setFilter] = useState("");

  const handleSelectChange = (e) => {
    const selecterdRoomType = e.target.value;
    setFilter(selecterdRoomType);
    const filteredRooms = data.filter((room) => {
      room.roomType.toLowerCase().includes(selecterdRoomType.toLowerCase());
    });
    setFilterData(filteredRooms);
  };

  const clearFilter = () => {
    setFilter("");
    setFilterData(data);
  };

  const roomTypes = ["", ...new Set(data.map((room) => room.roomType))];

  return (
    <div>
      <div>Filter Room by Type:</div>
      <select name="" id="" value={filter} onChange={handleSelectChange}>
        <option value="">Select a room type to filter...</option>
        {roomTypes.map((roomType, index) => (
          <option key={index} value={roomType}>
            {roomType}
          </option>
        ))}
      </select>
      <button onClick={clearFilter}>Clear filter</button>
    </div>
  );
};

export default RoomFilters;
