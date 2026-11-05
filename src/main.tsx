import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for Progressive Web App (PWA) offline caching and instant updates
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('PWA: New update available, updating service worker...');
  },
  onOfflineReady() {
    console.log('PWA: SharkPay 2.0 ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
