import React from 'react';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppRouter } from './Pages/AppRouter';
import { NavBar } from './libs/core/NavBar/NavBar';
import { PageBackground } from './libs/core/PageBackground';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <PageBackground />
        <NavBar>
          <AppRouter />
        </NavBar>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
