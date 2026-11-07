import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const fetchAboutUs = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/about-us`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching about us:', error);
        throw error;
    }
};

