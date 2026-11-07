import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoryListing } from 'src/services/productApi';

// Call category-listing API and store result in reducer; used by Nav and category section
export const fetchCategoryListingThunk = createAsyncThunk(
  'categoryListing/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchCategoryListing();
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      return list;
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Failed to load categories');
    }
  }
);

export const CategoryListingSlice = createSlice({
  name: 'categoryListing',
  initialState: {
    data: [], // [{ id, name, subcategories: [{ id, name, image? }], images: string[] }]
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryListingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryListingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload ?? [];
        state.error = null;
      })
      .addCase(fetchCategoryListingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load categories';
      });
  },
});

export default CategoryListingSlice.reducer;
