import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl || 'https://api.intecomart.com';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    withCredentials: false, // Disable credentials to avoid CORS issues
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`📤 Vendor API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },  
    (error) => {
        console.error('❌ Vendor API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`📥 Vendor API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ Vendor API Response Error:', error.response?.status, error.config?.url);
        return Promise.reject(error);
    }
);

// UserAction.js

export const authRegister = async (Data) => {
    
    try {
        const response = await axiosInstance.post('/auth/register', {
            name: Data.name,
            address: Data.address,
            country: Data.country,
            state: Data.state,
            pincode: Data.pincode,
            mobile: Data.mobile,
            email: Data.email,
        });
        return response?.data;
    } catch (error) {
        console.error('Failed Process :', error?.response?.data || error.message);
        throw error;
    }
};

