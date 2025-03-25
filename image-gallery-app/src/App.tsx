import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import ImageCard from './Components/ImageCard.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { store } from './redux/store.ts';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="App">
          <ImageCard />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default App;


