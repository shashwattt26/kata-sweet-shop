import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Pointing to your Express backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the JWT token to every request automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // We will save the token here on login
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;