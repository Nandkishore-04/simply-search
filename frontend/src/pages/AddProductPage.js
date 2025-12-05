import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    part_number: '',
    product_name: '',
    category: '',
    brand: '',
    price: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC to go back
      if (e.key === 'Escape') {
        navigate('/');
      }
      // Enter acts as Tab (move to next field)
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
        e.preventDefault();
        const form = e.target.form;
        const index = Array.prototype.indexOf.call(form, e.target);
        const nextElement = form.elements[index + 1];
        if (nextElement && nextElement.type !== 'submit') {
          nextElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const productData = {
        ...formData,
        stock_quantity: 0, // Default to 0
        price: formData.price ? parseFloat(formData.price) : null,
        part_number: formData.part_number || null,
        category: formData.category || null,
        brand: formData.brand || null,
        description: formData.description || null,
        bike_models: null, // Removed field
        shelf_location: null, // Removed field
      };

      const result = await window.api.createProduct(productData);
      setSuccess('Product created successfully!');

      // Reset form
      setFormData({
        part_number: '',
        product_name: '',
        category: '',
        brand: '',
        price: '',
        description: '',
      });

      // Navigate to product detail page after 1 second
      setTimeout(() => {
        navigate(`/product/${result.id}`);
      }, 1000);
    } catch (err) {
      setError('Failed to create product. Please check your input and try again.');
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Add New Product</h1>
        <p className="page-subtitle">Add a new motorcycle part to your inventory (Press ESC to go back, Enter to move to next field)</p>
      </div>

      <div className="card">
        {error && <div className="message message-error">⚠️ {error}</div>}
        {success && <div className="message message-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Part Number *</label>
            <input
              type="text"
              name="part_number"
              className="form-input"
              value={formData.part_number}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="product_name"
              className="form-input"
              value={formData.product_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              className="form-input"
              placeholder="e.g., Electrical, Brake, Engine"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand</label>
            <input
              type="text"
              name="brand"
              className="form-input"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              name="price"
              className="form-input"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel (ESC)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;
