import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const fetchStates = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/states`);
        if (response?.data?.success && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching states:', error);
        return [];
    }
};

export const createCheckout = async (checkoutData) => {
    try {
        const response = await axios.post(`${BASE_URL}/checkout/create`, checkoutData);
        return response.data;
    } catch (error) {
        console.error('Error creating checkout:', error);
        throw error;
    }
};

export const getCheckoutById = async (checkoutId) => {
    try {
        const response = await axios.get(`${BASE_URL}/checkout/${checkoutId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching checkout:', error);
        throw error;
    }
}; 