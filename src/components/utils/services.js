import { api } from "./ApiFunctions";
// import { getHeader } from "./ApiFunctions";

const getAllServices = async () => {
  return api.get("services/all-services");
};

const postAddService = (data) => {
  return api.post("/services/add-service", data);
};

const deleteService = (id) => {
  return api.delete(`/services/delete-service/${id}`);
};

const putUpdateService = (id, data) => {
  console.log("put", id, data);
  return api.put(`/services/update-service/${id}`, data);
};

const getServicesByRoomId = (roomId) => {
  return api.get(`/services/by-room/${roomId}`);
};

const postAddServicesToRoom = (roomId, data) => {
  return api.post(`/services/add-services/${roomId}`, data);
};

const deleteRemoveServiceFromRoom = (roomId, serviceId) => {
  return api.delete(`/services/rooms/${roomId}/services/${serviceId}`);
};

export {
  postAddService,
  deleteService,
  getAllServices,
  putUpdateService,
  getServicesByRoomId,
  postAddServicesToRoom,
  deleteRemoveServiceFromRoom,
};
