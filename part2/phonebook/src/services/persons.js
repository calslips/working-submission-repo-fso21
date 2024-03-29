import axios from "axios";

// const baseURL = "http://localhost:3001/persons";
const baseURL = "/api/persons";

const getAll = () => {
  return axios.get(baseURL).then((response) => response.data);
};

const create = (newPerson) => {
  return axios.post(baseURL, newPerson).then((response) => response.data);
};

const update = (id, updatedPerson) => {
  return axios
    .put(`${baseURL}/${id}`, updatedPerson)
    .then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseURL}/${id}`).then((response) => response);
};

const requests = { getAll, create, update, remove };

export default requests;
