import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const fetchGallery = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/gallery/all`);

        return response?.data;
    } catch (error) {
        console.error('Error fetching gallery:', error);
        throw error;
    }
};

