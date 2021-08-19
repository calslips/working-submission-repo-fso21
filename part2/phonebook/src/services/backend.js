import axios from "axios";

const baseURL = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseURL).then((response) => response.data);
}

const create = (newPerson) => {
  return axios.post(baseURL, newPerson).then((response) => response.data);
}

const requests = { getAll, create };

export default requests;