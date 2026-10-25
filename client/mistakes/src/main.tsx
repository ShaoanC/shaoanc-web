import React from 'react';
import ReactDOM from 'react-dom/client';
import { Slide, ToastContainer } from 'react-toastify';
import App from './App';
import '@fontsource/noto-serif-sc/400.css';
import '../../../public/styles/scrollbars.css';
import './number-fonts.css';
import './body-fonts.css';
import './fonts/sarasa/sarasa.css';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ToastContainer className="mistakes-toast-container" position="top-right" autoClose={4500} transition={Slide} theme="light" limit={3} newestOnTop closeOnClick={false} draggablePercent={15} />
  </React.StrictMode>,
);
