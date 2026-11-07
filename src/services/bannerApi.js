import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const fetchBanner = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/banner/all`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
    }
};

export const LogoList = () => async () => {
    try {
        const response = await axios.get(`${BASE_URL}/logo`);
        return response.data;
    } catch (error) {
        console.error('Error fetching logo:', error);
        return null;
    }
};

