import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const Api = {
  getRides: async () => axios.get(BASE_URL + "/rides"),
  getUser: async () => axios.get(BASE_URL + "/user"),
};
