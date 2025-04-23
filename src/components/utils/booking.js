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
  const res = await api.post("/bookings/payment/confirm", params);
  return res.data;
};

const getMonthlyBookingCount = async (params) => {
  const res = await api.get(
    `/bookings/count/month?roomId=${params.id}&year=${params.year}&month=${params.month}`
  );
  return res.data;
};

const getYearlyBookingCount = async (params) => {
  const res = await api.get(
    `/bookings/count/year?roomId=${params.id}&year=${params.year}`
  );
  return res.data;
};

const getAllTotalPriceBookingCount = async (params) => {
  const res = await api.get(
    `/bookings/statistics/room-revenue?month=${params.month}&year=${params.year}`
  );
  return res.data;
};

export {
  postBooking,
  getHistoryBooking,
  postPaymentConfirm,
  getMonthlyBookingCount,
  getYearlyBookingCount,
  getAllTotalPriceBookingCount,
};
