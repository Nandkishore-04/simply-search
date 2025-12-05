import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const productsPerPage = 50;
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCurrentPage(1);
    setShowSuggestions(false);

    try {
      const results = await window.api.searchProducts(searchQuery);
      setProducts(results);
      if (results.length === 0) {
        setError('No products found matching your search.');
      }
    } catch (err) {
      setError('Failed to search products. Make sure the backend server is running.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);

    if (value.trim().length > 0) {
      try {
        const results = await window.api.searchProducts(value);
        setSuggestions(results.slice(0, 5));
        setShowSuggestions(true);
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Escape') {
        navigate('/');
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.product_name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    navigate(`/product/${product.id}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Search Inventory</h1>
        <p className="page-subtitle">Find motorcycle parts by name, part number, brand, or category (Use arrow keys in dropdown, ESC to go back)</p>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} className="search-container" style={{ position: 'relative' }}>
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by product name, part number, brand, or category..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery && suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginTop: '4px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {suggestions.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.2s',
                    backgroundColor: index === selectedIndex ? '#e0f2fe' : 'white'
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{product.product_name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {product.part_number && `Part #: ${product.part_number}`}
                    {product.part_number && product.category && ' • '}
                    {product.category && product.category}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary mt-2">
            Search Products
          </button>
        </form>

        {error && (
          <div className="message message-error">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="loading">Searching products...</div>
        )}

        {!loading && products.length > 0 && (
          <div>
            <div className="flex-between mb-3">
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                Found {products.length} {products.length === 1 ? 'Product' : 'Products'}
                {totalPages > 1 && (
                  <span style={{ fontSize: '1rem', fontWeight: '500', color: '#64748b', marginLeft: '1rem' }}>
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </h2>
            </div>

            <table className="product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Part Number</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id} onClick={() => handleProductClick(product.id)}>
                    <td><strong>{product.product_name}</strong></td>
                    <td>{product.part_number || '-'}</td>
                    <td>{product.brand || '-'}</td>
                    <td>
                      {product.category ? (
                        <span className="product-badge">{product.category}</span>
                      ) : '-'}
                    </td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.description || '-'}
                    </td>
                    <td>{product.price ? `₹${product.price}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {getPageNumbers().map(number => (
                  <button
                    key={number}
                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !error && products.length === 0 && searchQuery && (
          <div className="empty-state">
            <h3>No Results Found</h3>
            <p>Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
