import axios from 'axios';

// URL del backend externo

const BASE_URL = `${process.env.REACT_APP_API_URL_D}/api/menu`;

export const fetchMenuData = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};
