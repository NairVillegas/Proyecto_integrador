import React from 'react';
import { useLocation } from 'react-router-dom';
import Router from './Router';
import Header from './components/Header';
import Footer from './components/footer';  

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminRoute && <Header />}
      <Router />
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
