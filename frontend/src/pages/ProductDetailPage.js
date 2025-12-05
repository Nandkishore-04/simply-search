import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC to go back
      if (e.key === 'Escape' && !isEditing) {
        navigate('/');
      } else if (e.key === 'Escape' && isEditing) {
        handleCancel();
      }
      // Enter acts as Tab (move to next field)
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
        e.preventDefault();
        const form = e.target.form;
        if (form) {
          const index = Array.prototype.indexOf.call(form, e.target);
          const nextElement = form.elements[index + 1];
          if (nextElement && nextElement.type !== 'submit') {
            nextElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, isEditing]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await window.api.getProduct(id);
      setProduct(data);
      setFormData(data);
    } catch (err) {
      setError('Failed to load product details.');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        product_name: formData.product_name,
        part_number: formData.part_number || null,
        category: formData.category || null,
        brand: formData.brand || null,
        price: formData.price ? parseFloat(formData.price) : null,
        description: formData.description || null,
        stock_quantity: formData.stock_quantity || 0,
        bike_models: null,
        shelf_location: null,
      };

      const updated = await window.api.updateProduct(id, updateData);
      setProduct(updated);
      setFormData(updated);
      setIsEditing(false);
      setSuccess('Product updated successfully!');
    } catch (err) {
      setError('Failed to update product.');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await window.api.deleteProduct(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete product.');
      console.error('Delete error:', err);
    }
  };

  const handleCancel = () => {
    setFormData(product);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container">
        <div className="message message-error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex-between mb-3">
          <h1>Product Details</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Search
          </button>
        </div>

        {error && <div className="message message-error">{error}</div>}
        {success && <div className="message message-success">{success}</div>}

        {!isEditing ? (
          <div>
            <div className="mb-3">
              <h2>{product.product_name}</h2>
              <p className="product-card-info">Product ID: {product.id}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p className="form-label">Part Number</p>
                <p>{product.part_number || '-'}</p>
              </div>

              <div>
                <p className="form-label">Brand</p>
                <p>{product.brand || '-'}</p>
              </div>

              <div>
                <p className="form-label">Category</p>
                <p>{product.category || '-'}</p>
              </div>

              <div>
                <p className="form-label">Stock Quantity</p>
                <p>{product.stock_quantity}</p>
              </div>

              <div>
                <p className="form-label">Price</p>
                <p>{product.price ? `₹${product.price}` : '-'}</p>
              </div>

              <div>
                <p className="form-label">Shelf Location</p>
                <p>{product.shelf_location || '-'}</p>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <p className="form-label">Compatible Bike Models</p>
                <p>{product.bike_models || '-'}</p>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <p className="form-label">Description</p>
                <p>{product.description || '-'}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Edit Product
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete Product
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Part Number *</label>
                <input
                  type="text"
                  name="part_number"
                  className="form-input"
                  value={formData.part_number || ''}
                  onChange={handleChange}
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
                  value={formData.category || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  className="form-input"
                  value={formData.brand || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  value={formData.price || ''}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button type="submit" className="btn btn-success" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel (ESC)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
