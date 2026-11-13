import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastHost } from './ToastHost';
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
    <ToastHost />
  </React.StrictMode>,
);

import './ai-quick-panel.css';
