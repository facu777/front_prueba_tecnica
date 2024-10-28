import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const API_URL_MESAS = apiUrl+'/mesas';

export const getMesas = async () => {
    const response = await axios.get(API_URL_MESAS);
    return response.data;
};