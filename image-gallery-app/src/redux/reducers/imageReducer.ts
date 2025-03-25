import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Image } from '../../types';

interface ImageState {
  images: Image[];
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addImage: (state, action: PayloadAction<Image>) => {
      state.images.push(action.payload);
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter(image => image.id !== action.payload);
    },
    clearImages: (state) => {
      state.images = [];
    },
  },
});

export const { setLoading, setError, addImage, removeImage, clearImages } = imageSlice.actions;
export default imageSlice.reducer; 