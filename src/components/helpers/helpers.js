import moment from "moment/moment";

const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

const formatTime = (date) => {
  return moment(date).format("HH:mm DD/MM/YYYY");
};

const formatVND = (number) => {
  return Number(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
export { formatDate, formatTime, formatVND };
