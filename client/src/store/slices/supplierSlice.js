import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSupplierDashboard,
  getSupplierProfile,
  getSupplierProducts,
  getSupplierProductStats,
  createSupplierProduct,
  updateSupplierProduct,
  deleteSupplierProduct,
} from '../../services/operations/supplierDashboardAPI';

// Initial state
const initialState = {
  // Dashboard
  dashboard: {
    stats: null,
    recentProducts: [],
    recentOrders: [],
    loading: false,
    error: null, 
  },
  // Profile
  profile: {
    data: null,
    loading: false,
    error: null,
  },
  // Products
  products: {
    items: [],
    stats: {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
    },
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
    },
    loading: false,
    error: null,
  },
  // Current Product (for editing)
  currentProduct: {
    data: null,
    loading: false,
    error: null,
  },
};

// Async Thunks

// Fetch supplier dashboard
export const fetchSupplierDashboard = createAsyncThunk(
  'supplier/fetchDashboard',
  async (token, { rejectWithValue }) => {
    try {
      const response = await getSupplierDashboard(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

// Fetch supplier profile
export const fetchSupplierProfile = createAsyncThunk(
  'supplier/fetchProfile',
  async (token, { rejectWithValue }) => {
    try {
      const response = await getSupplierProfile(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Fetch supplier products
export const fetchSupplierProducts = createAsyncThunk(
  'supplier/fetchProducts',
  async ({ token, params }, { rejectWithValue }) => {
    try {
      const response = await getSupplierProducts(token, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Fetch product stats
export const fetchSupplierProductStats = createAsyncThunk(
  'supplier/fetchProductStats',
  async (token, { rejectWithValue }) => {
    try {
      const response = await getSupplierProductStats(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  'supplier/createProduct',
  async ({ productData, token }, { rejectWithValue }) => {
    try {
      const response = await createSupplierProduct(productData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'supplier/updateProduct',
  async ({ id, productData, token }, { rejectWithValue }) => {
    try {
      const response = await updateSupplierProduct(id, productData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'supplier/deleteProduct',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await deleteSupplierProduct(id, token);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Slice
const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    clearSupplierError: (state) => {
      state.dashboard.error = null;
      state.profile.error = null;
      state.products.error = null;
      state.currentProduct.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct.data = null;
      state.currentProduct.loading = false;
      state.currentProduct.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct.data = action.payload;
    },
    resetSupplierState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchSupplierDashboard.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchSupplierDashboard.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.stats = action.payload.stats;
        state.dashboard.recentProducts = action.payload.recentProducts || [];
        state.dashboard.recentOrders = action.payload.recentOrders || [];
      })
      .addCase(fetchSupplierDashboard.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.payload;
      })
      // Profile
      .addCase(fetchSupplierProfile.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
      })
      .addCase(fetchSupplierProfile.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.data = action.payload;
      })
      .addCase(fetchSupplierProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error = action.payload;
      })
      // Products
      .addCase(fetchSupplierProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchSupplierProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.items = action.payload.data || [];
        state.products.pagination = {
          page: action.payload.page || 1,
          pages: action.payload.pages || 1,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchSupplierProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })
      // Product Stats
      .addCase(fetchSupplierProductStats.pending, (state) => {
        state.products.loading = true;
      })
      .addCase(fetchSupplierProductStats.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.stats = action.payload;
      })
      .addCase(fetchSupplierProductStats.rejected, (state, action) => {
        state.products.loading = false;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.currentProduct.loading = true;
        state.currentProduct.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.currentProduct.loading = false;
        state.products.items.unshift(action.payload);
        state.products.stats.total += 1;
        state.products.stats.pending += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.currentProduct.loading = false;
        state.currentProduct.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.currentProduct.loading = true;
        state.currentProduct.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.currentProduct.loading = false;
        const index = state.products.items.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.currentProduct.loading = false;
        state.currentProduct.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.products.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products.loading = false;
        const deletedProduct = state.products.items.find(p => p._id === action.payload);
        state.products.items = state.products.items.filter(p => p._id !== action.payload);
        state.products.stats.total -= 1;
        if (deletedProduct) {
          if (deletedProduct.isApproved === 'approved') state.products.stats.approved -= 1;
          else if (deletedProduct.isApproved === 'pending') state.products.stats.pending -= 1;
          else if (deletedProduct.isApproved === 'rejected') state.products.stats.rejected -= 1;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      });
  },
});

export const {
  clearSupplierError,
  clearCurrentProduct,
  setCurrentProduct,
  resetSupplierState,
} = supplierSlice.actions;

export default supplierSlice.reducer;
