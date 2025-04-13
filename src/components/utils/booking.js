import { api } from "./ApiFunctions";

const postBooking = async (params) => {
    const res = await api.post(`bookings/room/${params.roomId}/booking`, params);
    return res.data;
}

export { postBooking };