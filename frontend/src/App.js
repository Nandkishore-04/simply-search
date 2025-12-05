import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import InventoryPage from './pages/InventoryPage';
import AddProductPage from './pages/AddProductPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-content">
            <div className="nav-title">
              <div className="nav-logo">M</div>
              <span>Mathaji Pro</span>
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Search</Link>
              <Link to="/inventory" className="nav-link">Inventory</Link>
              <Link to="/add" className="nav-link">Add Product</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/add" element={<AddProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
