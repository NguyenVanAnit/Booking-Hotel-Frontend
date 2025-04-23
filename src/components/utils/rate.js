import { api } from "./ApiFunctions";
// import { getHeader } from "./ApiFunctions";

const postAddRate = async (params) => {
  const res = api.post("/rate/add-rate", params);
  return res?.data;
};

export { postAddRate }