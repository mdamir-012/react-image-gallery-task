import { configureStore } from '@reduxjs/toolkit';
import { ImageState } from '../types';
import imageReducer from './reducers/imageReducer.ts';

export interface RootState {
  images: ImageState;
}

export const store = configureStore({
  reducer: {
    images: imageReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 