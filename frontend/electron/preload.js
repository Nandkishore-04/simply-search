const { contextBridge } = require('electron');

const API_BASE_URL = 'http://127.0.0.1:8000';

contextBridge.exposeInMainWorld('api', {
  // Product search
  searchProducts: async (query) => {
    try {
      console.log('Searching for:', query);
      const url = `${API_BASE_URL}/products/search?query=${encodeURIComponent(query)}`;
      console.log('URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error(`Search failed with status ${response.status}`);
      const data = await response.json();
      console.log('Data received:', data);
      return data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error(`Failed to fetch products with status ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  // Get product by ID
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  // Search by bike model
  searchByBike: async (model) => {
    const response = await fetch(`${API_BASE_URL}/products/by-bike?model=${encodeURIComponent(model)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  // Search by part number
  searchByPartNumber: async (partNumber) => {
    const response = await fetch(`${API_BASE_URL}/products/by-part-number?part_number=${encodeURIComponent(partNumber)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  // Create product
  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return true;
  },
});
