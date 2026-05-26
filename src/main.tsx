import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 минут — данные считаются свежими
      gcTime: 10 * 60 * 1000,    // 10 минут — данные в кэше
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

// Регистрация Service Worker ТОЛЬКО в режиме разработки/локально, но не на GitHub Pages
// VITE_IS_GITHUB_PAGES будет true при production сборке для GitHub Pages
const isGitHubPages = import.meta.env.VITE_IS_GITHUB_PAGES === true;

if ('serviceWorker' in navigator && !isGitHubPages) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.log('Service Worker registration error:', err));
  });
}