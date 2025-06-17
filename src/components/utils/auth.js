import { api, getHeader } from "./ApiFunctions";

const postChangePassword = async (params) => {
    try {
        const res = await api.post("/auth/change-password", params, {
            headers: getHeader()
        });
        return res.data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};

const getAllRole = async () => {
    try {
        const res = await api.get("/roles/all-roles");
        return res.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
};

const postCreateAccount = async (params) => {
    try {
        const res = await api.post("/auth/create-user", params);
        return res.data;
    } catch (error) {
        console.error("Error creating account:", error);
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/auth/delete/${id}`, {
            headers: getHeader()
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export { postChangePassword, getAllRole, postCreateAccount, deleteUser };