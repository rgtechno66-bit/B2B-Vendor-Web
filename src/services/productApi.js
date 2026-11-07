import axios from 'axios';
import { CONFIG } from 'src/config-global';

const BASE_URL = CONFIG.site.serverUrl || 'https://api.intecomart.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: false, // Disable credentials to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const DEFAULT_ITEMS_PER_PAGE = 20;

export const fetchItems = async (params = {}) => {
    try {
        const response = await axiosInstance.get('/items', { params });
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

/** Backend pagination — always sends page & limit (default 20 per page). */
export const fetchItemsPaginated = async ({
    page = 1,
    limit = DEFAULT_ITEMS_PER_PAGE,
    search,
    subGroup1,
    subGroup2,
    sortBy,
    signal,
} = {}) => {
    try {
        const params = { page, limit };
        if (search?.trim()) params.search = search.trim();
        if (subGroup1) params.subGroup1 = subGroup1;
        if (subGroup2) params.subGroup2 = subGroup2;
        if (sortBy) params.sortBy = sortBy;

        const response = await axiosInstance.get('/items', { params, signal });
        const body = response?.data;

        if (body?.data && body?.total !== undefined) {
            return body;
        }

        const data = Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []);
        return {
            success: true,
            data,
            total: data.length,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(data.length / limit)),
        };
    } catch (error) {
        console.error('Error fetching paginated items:', error);
        throw error;
    }
};

/** Latest products for home (paginated, sorted by newest). */
export const fetchLatestProducts = async (page = 1, limit = 12, signal = undefined) =>
    fetchItemsPaginated({
        page,
        limit,
        sortBy: 'newest',
        signal,
    });

export const fetchCategoryListing = async () => {
    try {
        const response = await axiosInstance.get('/items/category-listing');
        return response?.data;
    } catch (error) {
        console.error('Error fetching category listing:', error);
        throw error;
    }
};

export const fetchPopularityItems = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/items/popularity`);
        return response?.data;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
};

/** Top selling products by Items.totalSalesAmount (for B2B Vendor Web home) */
export const fetchTopSellingProducts = async (limit = 20) => {
    try {
        const response = await axiosInstance.get('/dashboard/top-selling-products', {
            params: { limit },
        });
        return response?.data;
    } catch (error) {
        console.error('Error fetching top selling products:', error);
        throw error;
    }
};

/**
 * Bulk update totalSalesAmount (Top Hot ranking).
 * @param {Array<{ masterID?: string, itemName?: string, totalSalesAmount: number }>} items
 */
export const updateTotalSalesAmount = async (items) => {
    try {
        const data = Array.isArray(items) ? items : [items];
        const response = await axiosInstance.post('/items/update-total-sales-amount', { data });
        return response?.data;
    } catch (error) {
        console.error('Error updating totalSalesAmount:', error);
        throw error;
    }
};

// Fetch a single item by ID
export const fetchItemById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/items/get/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching item with ID ${id}:`, error);
        throw error;
    }
};

// Fetch items based on a search query (backend search + pagination)
export const fetchItemsSearch = async (query, { page = 1, limit = DEFAULT_ITEMS_PER_PAGE, sortBy, subGroup1, subGroup2 } = {}) => {
    try {
        return await fetchItemsPaginated({
            page,
            limit,
            search: query,
            sortBy,
            subGroup1,
            subGroup2,
        });
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
    }
};

