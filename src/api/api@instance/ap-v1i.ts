import axios from "axios";

const instanceV1 = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/v1`
});



export default instanceV1