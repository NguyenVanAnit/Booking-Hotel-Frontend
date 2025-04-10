import { api } from "./ApiFunctions";

const getDetailRoomById = (roomId) => {
  return api.get(`/rooms/room/${roomId}`);
};

const postAddNewRoom = (params) => {
  return api.post("/rooms/add/new-room", params);
};

const getRoomById = async (roomId) => {
  try {
    const response = await api.get(`/rooms/room/${roomId}`);
    return response.data.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching room by id");
  }
};

const putUpdateRoom = async (roomId, roomData) => {
  try {
    const response = await api.put(`/rooms/update/room/${roomId}`, roomData);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating room");
  }
};

const getSearchAvailableRoom = async (params) => {
  try {
    const response = await api.get(
      `/rooms/available-rooms?checkInDate=2025-04-10&checkOutDate=2025-04-12&numberAdult=2&numberChildren=1
      &serviceIds=1,5&minPrice=0&maxPrice=10000000&hasHighFloor=false&hasHighRating=false&hasTwoOrMoreBeds=true`);
    return response.data.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error searching available room");
  }
};

export { getDetailRoomById, postAddNewRoom, getRoomById, putUpdateRoom, getSearchAvailableRoom };
