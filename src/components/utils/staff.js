import { api } from "./ApiFunctions";

const getStaffList = async () => {
    const res = await api.get("/staff");
    return res?.data;
}

export { getStaffList };
