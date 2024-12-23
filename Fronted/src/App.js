import React from 'react';
import Router from './Router';
import Header from './components/Header';
import Footer from './components/Login';
import Login from './components/Login';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <div className="app">
      <Header />
      <Router />
      <Footer />
    </div>
  );
}

export default App;