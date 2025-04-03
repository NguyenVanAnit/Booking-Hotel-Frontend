import { api } from "./ApiFunctions";
// import { getHeader } from "./ApiFunctions";


const getAllServices = async () => {
    return api.get("services/all-services");
  }

const postAddService = (data) => {
    return api.post("/services/add-service", data)
}

const deleteService = (id) => {
    return api.delete(`/services/delete-service/${id}`)
}

const putUpdateService = (id, data) => {
    console.log("put", id, data);
    return api.put(`/services/update-service/${id}`, data)
}

export { postAddService, deleteService, getAllServices, putUpdateService };