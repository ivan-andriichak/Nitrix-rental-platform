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

// 📌 Отримання всіх квартир
export const fetchApartments = createAsyncThunk('apartments/fetchAll', async () => {
  const response = await api.get('/apartments');
  return response.data.map((apt: any) => ({
    ...apt,
    id: apt._id, // додати поле id з _id
  }));
});

// 📌 Додавання нової квартири
export const addApartment = createAsyncThunk(
  'apartments/add',
  async (apartment: FormData) => {
    const response = await api.post('/apartments', apartment, {
      headers: { 'Content-Type': 'multipart/form-data' }, // Вказуємо, що передаємо файли
    });
    return response.data;
  }
);

// 📌 Оновлення квартири
export const updateApartment = createAsyncThunk(
  'apartments/update',
  async ({ id, formData }: { id: string; formData: FormData }) => {
    const response = await api.put(`/apartments/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
);

// 📌 Видалення квартири
export const deleteApartment = createAsyncThunk('apartments', async (id: string) => {
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
      })

      // ✅ Додавання квартири
     .addCase(addApartment.fulfilled, (state, action) => {
        state.apartments.push(action.payload);
      })

      // ✅ Оновлення квартири
      .addCase(updateApartment.fulfilled, (state, action) => {
        const updatedApartment = action.payload;
        const index = state.apartments.findIndex(apartment => apartment.id === updatedApartment.id);
        if (index !== -1) {
          state.apartments[index] = updatedApartment;
        }
      })

      // ✅ Видалення квартири
      .addCase(deleteApartment.fulfilled, (state, action) => {
        console.log('Apartment deleted:', action.payload); // Логування для перевірки
        state.apartments = state.apartments.filter((apt) => apt.id !== action.payload);
      });
  },
});

const apartmentReducer = apartmentSlice.reducer;
export { apartmentReducer };
