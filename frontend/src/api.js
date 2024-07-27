import axios from 'axios';

const api = axios.create({
    baseURL: `https://project-23-moai-qux1.onrender.com/api`,
});

export default api;
