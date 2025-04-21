import { api } from "./ApiFunctions";
// import { getHeader } from "./ApiFunctions";

const getAllUsers = async () => {
  return api.get("/users");
};

export { getAllUsers}