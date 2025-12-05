import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function InventoryPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const results = await window.api.getAllProducts();
            setProducts(results);
        } catch (err) {
            setError('Failed to load inventory.');
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await window.api.deleteProduct(id);
            // Remove from local state immediately
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete product: ' + err.message);
        }
    };

    const handleEdit = (id) => {
        navigate(`/product/${id}`);
    };

    // Filter products locally for quick lookup
    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.part_number && product.part_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Full Inventory</h1>
                <p className="page-subtitle">Manage all {products.length} products in your inventory</p>
            </div>

            <div className="card">
                <div className="flex-between mb-3">
                    <input
                        type="text"
                        className="search-input"
                        style={{ maxWidth: '400px' }}
                        placeholder="Filter list..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={loadProducts}>
                        Refresh List
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading inventory...</div>
                ) : error ? (
                    <div className="message message-error">{error}</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Part No.</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>#{product.id}</td>
                                        <td><strong>{product.product_name}</strong></td>
                                        <td>{product.part_number || '-'}</td>
                                        <td>{product.category || '-'}</td>
                                        <td>
                                            <span style={{
                                                color: product.stock_quantity < 5 ? 'red' : 'inherit',
                                                fontWeight: product.stock_quantity < 5 ? 'bold' : 'normal'
                                            }}>
                                                {product.stock_quantity}
                                            </span>
                                        </td>
                                        <td>₹{product.price}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleEdit(product.id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(product.id, product.product_name)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                            No products found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InventoryPage;
