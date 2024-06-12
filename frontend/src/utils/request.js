import axios from "axios";


const request = axios.create({
    baseURL:"http://localhost:8000"
});

request.interceptors.request.use(
    function (config) {
      // Get token from local storage
      const token = localStorage.getItem('token');
      // Add token to request headers
      if (token) {
        config.headers.Authorization = `Bearer ${ token}`;
        config.headers.token = token;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );


export default request ;