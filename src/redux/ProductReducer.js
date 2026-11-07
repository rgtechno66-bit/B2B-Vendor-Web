import { createSlice } from "@reduxjs/toolkit";

export const ProductSlice = createSlice({
  name: "product",
  initialState: {
    items: [], // Array to hold product items
    loading: false, // Indicates loading state
    error: null, // To hold any error messages
  },
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true; // Set loading to true when fetching products starts
      state.error = null; // Reset error on new fetch
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false; // Set loading to false when products are fetched successfully
      state.items = action.payload; // Set fetched products to items
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false; // Set loading to false when fetch fails
      state.error = action.payload; // Set error message
    },
  },
});

// Export actions for use in components
export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} = ProductSlice.actions;

// Export the reducer to be used in the store
export default ProductSlice.reducer;
