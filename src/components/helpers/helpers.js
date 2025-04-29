import moment from "moment/moment";

const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

const formatTime = (date) => {
  return moment(date).format("HH:mm DD/MM/YYYY");
};

const formatVND = (number) => {
  return Number(number)
    .toFixed(0) // Làm tròn đến 0 chữ số thập phân
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatDateArr = (dateArr) => {
  const [year, month, day] = dateArr;
  return moment([year, month - 1, day]).format("DD/MM/YYYY");
};

export { formatDate, formatTime, formatVND, formatDateArr };
