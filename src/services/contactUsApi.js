// src/services/contactUsApi.js

import axios from 'axios';

import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

export const addContactMessage = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/contact/create`, data);
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

export const getContactMessage = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/contact`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};
