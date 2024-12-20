import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9192",
});

export const addRoom = (params) => {
  const formData = new FormData();
  formData.append("photo", params.photo);
  formData.append("roomType", params.roomType);
  formData.append("roomPrice", params.roomPrice);

  // console.log("photo", photo);
  // console.log("type", roomType);
  // console.log("price", roomPrice);
  const response = api.post("/rooms/add/new-room", formData);
  console.log("add room", response);
  if (response.status === 201) {
    return true;
  } else {
    return false;
  }
};

export const getRoomTypes = async () => {
  try {
    const response = await api.get("/rooms/room/types");
    console.log("room types", response);
    return response.data;
  } catch (error) {
    // console.log(error);
    throw new Error("Error fetching room types");
  }
};

export const getAllRooms = async () => {
  try {
    const response = await api.get("/rooms/all-rooms");
    console.log("all rooms", response);
    return response.data;
  } catch (error) {
    // console.log(error);
    throw new Error("Error fetching all rooms");
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const response = await api.delete(`/rooms/delete/room/${roomId}`);
    console.log("delete room", response);
    return response;
  } catch (error) {
    // console.log(error);
    throw new Error("Error deleting room");
  }
};

export const updateRoom = async (roomId, roomData) => {
  const formData = new FormData();
  formData.append("photo", roomData.photo);
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);

  try {
    const response = await api.put(`/rooms/update/room/${roomId}`, formData);
    console.log("update room", response);
    return response;
  } catch (error) {
    // console.log(error);
    throw new Error("Error updating room");
  }
};

export const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/room/${roomId}`);
    console.log("room by id", response);
    return response.data;
  } catch (error) {
    // console.log(error);
    throw new Error("Error fetching room by id");
  }
};
