import { api } from "./ApiFunctions";

const getStaffList = async () => {
  const res = await api.get("/staff");
  return res?.data;
};

const postAddStaff = async (staff) => {
  const res = await api.post("/staff", staff);
  return res?.data;
};

const deleteStaff = async (staffId) => {
  const res = await api.delete(`/staff/${staffId}`);
  return res?.data;
};

const putUpdateStaff = async (staffId, staff) => {
  const res = await api.put(`/staff/${staffId}`, staff);
  return res?.data;
};

const postChageStatusStaff = async (staffId, params) => {
  console.log("staffId", staffId, params);
  const res = await api.post(`/staff/change-status/${staffId}`, params);
  return res?.data;
};

const postCheckinStaff = async (staffId) => {
  const res = await api.post(`/attendance/check-in/${staffId}`);
  return res?.data;
};

const postCheckoutStaff = async (staffId) => {
  const res = await api.post(`/attendance/check-out/${staffId}`);
  return res?.data;
};

const getStaffCheckinDay = async () => {
  const res = await api.get(`/attendance/checked-in-today`);
  return res?.data;
};

const getStaffCheckoutDay = async () => {
  const res = await api.get(`/attendance/checked-out-today`);
  return res?.data;
};

const getWorkAndAbsenDayInMonth = async (staffId, month, year) => {
  const res = await api.get(
    `/attendance/work-absent-days/${staffId}?month=${month}&year=${year}`
  );
  return res?.data;
}

const getAbbentDayInMonth = async ( month, year) => {
  const res = await api.get(
    `/attendance/summary?month=${month}&year=${year}`
  );
  return res?.data;
}

const getNumberWorkedInMonth = async (month, year) => {
  const res = await api.get(
    `/tasks/staff?month=${month}&year=${year}`
  );
  return res?.data;
}

export {
  getStaffList,
  postAddStaff,
  deleteStaff,
  putUpdateStaff,
  postChageStatusStaff,
  postCheckinStaff,
  postCheckoutStaff,
  getStaffCheckinDay,
  getStaffCheckoutDay,
  getWorkAndAbsenDayInMonth,
  getAbbentDayInMonth,
  getNumberWorkedInMonth
};
