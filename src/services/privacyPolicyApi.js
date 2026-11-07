import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const fetchPrivacyPolicy = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/privacy-policies`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching privacy policy:', error);
        throw error;
    }
};
