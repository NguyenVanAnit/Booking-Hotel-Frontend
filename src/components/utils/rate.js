import { api } from "./ApiFunctions";
// import { getHeader } from "./ApiFunctions";

const postAddRate = async (params) => {
  const res = api.post("/rate/add-rate", params);
  return res?.data;
};

const getRateByRoomId = async (params) => {
  const res = await api.get(`/rate/get-by-room-id?roomId=${params.roomId}&pageNumber=${params.pageNumber}&pageSize=${params.pageSize}`);
  return res?.data;
};

export { postAddRate, getRateByRoomId }