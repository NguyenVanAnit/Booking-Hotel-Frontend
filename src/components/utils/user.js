import { api } from "./ApiFunctions";
// import { getHeader } from "./ApiFunctions";

const getAllUsers = async () => {
  return api.get("/users");
};

const getUserByEmail = async (email) => {
  const res = await api.get(`/users/${email}`);
  return res?.data;
};

export { getAllUsers, getUserByEmail };