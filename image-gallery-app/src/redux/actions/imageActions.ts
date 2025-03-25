import { AddImageAction, ClearImagesAction, Image, RemoveImageAction, SetErrorAction, SetLoadingAction } from '../../types';

export const ADD_IMAGE = 'ADD_IMAGE';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const CLEAR_IMAGES = 'CLEAR_IMAGES';

export const addImage = (image: Image): AddImageAction => ({
  type: ADD_IMAGE,
  payload: image
});

export const removeImage = (imageId: string): RemoveImageAction => ({
  type: REMOVE_IMAGE,
  payload: imageId
});

export const setLoading = (isLoading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  payload: isLoading
});

export const setError = (error: string): SetErrorAction => ({
  type: SET_ERROR,
  payload: error
});

export const clearImages = (): ClearImagesAction => ({
  type: CLEAR_IMAGES
}); 