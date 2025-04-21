import { api } from "./ApiFunctions";

const postBooking = async (params) => {
  const res = await api.post(`bookings/room/${params.roomId}/booking`, params);
  return res.data;
};

const getHistoryBooking = async (params) => {
  const res = await api.get(
    `/history-booking/all-history?pageNumber=${params.pageNumber}&pageSize=${params.pageSize}&userId=${params.userId}`
  );
  return res.data;
};

const postPaymentConfirm = async (params) => {
    const res = await api.post('/bookings/payment/confirm', params);
    return res.data;
}

export { postBooking, getHistoryBooking, postPaymentConfirm };
