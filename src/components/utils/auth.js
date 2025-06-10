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

export { postChangePassword}