import { api } from "./ApiFunctions";

const getStaffList = async () => {
    const res = await api.get("/staff");
    return res?.data;
}

const postAddStaff = async (staff) => {
    const res = await api.post("/staff", staff);
    return res?.data;
}

const deleteStaff = async (staffId) => {
    const res = await api.delete(`/staff/${staffId}`);
    return res?.data;
}

const putUpdateStaff = async (staffId, staff) => {
    const res = await api.put(`/staff/${staffId}`, staff);
    return res?.data;
}

const postChageStatusStaff = async (staffId, params) => {
    console.log('staffId', staffId, params);
    const res = await api.post(`/staff/change-status/${staffId}`, params);
    return res?.data;
}

export { getStaffList, postAddStaff, deleteStaff, putUpdateStaff, postChageStatusStaff };
