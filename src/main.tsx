import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
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
      staleTime: 5 * 60 * 1000,  // 5 минут - данные свежие
      gcTime: 10 * 60 * 1000,    // 10 минут - данные в кэше
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});


const isGitHubPages = window.location.hostname.includes('github.io');
const Router = isGitHubPages ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

// регистрация 
if ('serviceWorker' in navigator && !isGitHubPages) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.log('Service Worker registration error:', err));
  });
}