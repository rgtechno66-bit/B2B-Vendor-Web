import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const fetchContactInfo = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/contact-info`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching contact info:', error);
        throw error;
    }
};

