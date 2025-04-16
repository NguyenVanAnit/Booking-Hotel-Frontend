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

export { getStaffList, postAddStaff, deleteStaff };
