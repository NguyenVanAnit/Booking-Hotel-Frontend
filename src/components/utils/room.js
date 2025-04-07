import { api } from "./ApiFunctions";

const getDetailRoomById = (roomId) => {
    return api.get(`/rooms/room/${roomId}`);
}

export { getDetailRoomById };