import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const fetchTermsAndCondition = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/terms-conditions`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
    }
};

