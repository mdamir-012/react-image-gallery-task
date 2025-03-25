import { ImageActionTypes, ImageState } from '../../types';
import {
  ADD_IMAGE,
  CLEAR_IMAGES,
  REMOVE_IMAGE,
  SET_ERROR,
  SET_LOADING
} from '../actions/imageActions.ts';

const initialState: ImageState = {
  images: [],
  loading: false,
  error: null
};

const imageReducer = (state: ImageState = initialState, action: ImageActionTypes): ImageState => {
  switch (action.type) {
    case ADD_IMAGE:
      if (state.images.some(img => img.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        images: [...state.images, action.payload],
        error: null
      };
    case REMOVE_IMAGE:
      return {
        ...state,
        images: state.images.filter(image => image.id !== action.payload)
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case CLEAR_IMAGES:
      return {
        ...state,
        images: []
      };
    default:
      return state;
  }
};

export default imageReducer; 