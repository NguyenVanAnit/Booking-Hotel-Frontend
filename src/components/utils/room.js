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
      `/rooms/available-rooms?checkInDate=${params.checkInDate}&checkOutDate=${params.checkOutDate}&numberAdult=${params.numberAdult}&numberChildren=${params.numberChildren}
      &serviceIds=${params.serviceIds}&minPrice=${params.minPrice}&maxPrice=${params.maxPrice}&hasHighFloor=${params.hasHighFloor}&hasHighRating=${params.hasHighRating}&hasTwoOrMoreBeds=${params.hasTwoOrMoreBeds}&pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error searching available room");
  }
};

const getAvailebleDay = async (params) => {
  const res = api.get(
    `/rooms/available-day-in-month?roomId=${params.roomId}&year=${params.year}&month=${params.month}`
  );
  return res;
};

const getAllRoomsByCheckout = async (checkout) => {
  try {
    const response = await api.get(
      `/history-booking/by-checkout?date=${checkout}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error searching available room");
  }
}

export {
  getDetailRoomById,
  postAddNewRoom,
  getRoomById,
  putUpdateRoom,
  getSearchAvailableRoom,
  getAvailebleDay,
  getAllRoomsByCheckout
};
