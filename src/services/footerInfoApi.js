import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl;

/**
 * Get footer information
 * @returns {Promise} - Footer info data
 */
export const getFooterInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/footer-info`);
    return response?.data;
  } catch (error) {
    console.error('Error fetching footer info:', error);
    throw error;
  }
};

/**
 * Create or update footer information
 * @param {Object} footerData - Footer information data
 * @param {string} footerData.companyName - Company name
 * @param {string} footerData.companyAddress - Company address
 * @param {string} footerData.mobile - Mobile number
 * @param {string} footerData.email - Email address
 * @param {string} footerData.aboutUs - About us content
 * @param {string} footerData.disclaimer - Disclaimer text
 * @param {Array} footerData.socialMediaLinks - Array of social media links
 * @returns {Promise} - Created/Updated footer info data
 */
export const createOrUpdateFooterInfo = async (footerData) => {
  try {
    const response = await axios.post(`${BASE_URL}/footer-info`, footerData);
    return response?.data;
  } catch (error) {
    console.error('Error creating/updating footer info:', error);
    throw error;
  }
};

