export interface Image {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
}

export interface ImageState {
  images: Image[];
  loading: boolean;
  error: string | null;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface NasaImageResponse {
  collection: {
    items: Array<{
      data: Array<{
        nasa_id: string;
        title: string;
        description: string;
        date_created: string;
      }>;
      links: Array<{
        href: string;
      }>;
    }>;
    metadata: {
      total_hits: number;
    };
  };
}

export interface AddImageFormData {
  title: string;
  description: string;
  url: string;
  date: string;
}

export interface ImageCardProps {
  image: Image;
  onRemove: (id: string) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface AddImageAction {
  type: 'ADD_IMAGE';
  payload: Image;
}

export interface RemoveImageAction {
  type: 'REMOVE_IMAGE';
  payload: string;
}

export interface SetLoadingAction {
  type: 'SET_LOADING';
  payload: boolean;
}

export interface SetErrorAction {
  type: 'SET_ERROR';
  payload: string;
}

export interface ClearImagesAction {
  type: 'CLEAR_IMAGES';
}

export type ImageActionTypes = 
  | AddImageAction 
  | RemoveImageAction 
  | SetLoadingAction 
  | SetErrorAction 
  | ClearImagesAction; 