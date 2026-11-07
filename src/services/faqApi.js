// src/services/faqApi.js

import axios from 'axios';

import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const addFaqData = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/faq/create`, data);
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

export const getFaqData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/faq`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};
