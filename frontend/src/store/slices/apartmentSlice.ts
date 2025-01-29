import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface Apartment {
  id: string;
  title: string;
  description: string;
  price: number;
  rooms: number;
  photos?: string[];
}

interface ApartmentState {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
}

const initialState: ApartmentState = {
  apartments: [],
  loading: false,
  error: null,
};

// Fetch apartments
export const fetchApartments = createAsyncThunk('apartments/fetchAll', async () => {
  const response = await api.get('/apartments');
  return response.data;
});

// Add new apartment
export const addApartment = createAsyncThunk('apartments/add', async (apartment: Partial<Apartment>) => {
  const response = await api.post('/apartments', apartment);
  return response.data;
});

// Update apartment
export const updateApartment = createAsyncThunk('apartments/update', async (apartment: Apartment) => {
  const response = await api.put(`/apartments/${apartment.id}`, apartment);
  return response.data;
});

// Delete apartment
export const deleteApartment = createAsyncThunk('apartments/delete', async (id: string) => {
  await api.delete(`/apartments/${id}`);
  return id;
});

const apartmentSlice = createSlice({
  name: 'apartments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApartments.fulfilled, (state, action) => {
        state.loading = false;
        state.apartments = action.payload;
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching apartments';
      });
    // Add handlers for add, update, delete...
  },
});

const apartmentReducer = apartmentSlice.reducer;
export { apartmentReducer };
