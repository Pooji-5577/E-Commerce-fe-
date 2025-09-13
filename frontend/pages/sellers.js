import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../lib/api';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function SellersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, becomeSeller, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: 1, categoryId: '', brand: '', gender: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getAll({ limit: 50 }).catch(err => {
        console.error('productsAPI.getAll failed:', err.response?.data || err.message || err);
        return { data: { products: [] } };
      });
      const all = (res && res.data && res.data.products) ? res.data.products : [];
      const sellerProducts = all.filter(p => !!p.sellerId);
      setProducts(sellerProducts);
    } catch (error) {
      console.error('Error loading seller products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImageDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setForm({ name: '', description: '', price: '', stock: 1, categoryId: '', brand: '', gender: '' });
    setImagePreview(null);
    setImageDataUrl('');
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return router.push('/login');
    if (!form.name || !form.price || !form.categoryId) {
      alert('Please fill required fields (name, price, category)');
      return;
    }
    setSubmitting(true);
    try {
      // First upgrade user to SELLER
      const becomeRes = await becomeSeller();
      if (!becomeRes.success) {
        throw new Error(becomeRes.error || 'Failed to become seller');
      }
      // Create product (backend will set sellerId for SELLER role)
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        categoryId: form.categoryId,
        imageUrl: imageDataUrl, // base64
        brand: form.brand,
        gender: form.gender
      };
      await productsAPI.create(payload);
      alert('Product uploaded successfully');
      closeModal();
      router.push('/seller-dashboard');
    } catch (error) {
      console.error('Failed to become seller', error.response?.data || error.message || error);
      alert('Failed to complete action: ' + (error.response?.data?.error || error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>Sellers Marketplace</title>
      </Head>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Sellers Marketplace</h1>
          <div className="flex items-center space-x-3">
            {isAuthenticated && user?.role !== 'SELLER' ? (
              <button
                onClick={openModal}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Become a Seller
              </button>
            ) : (
              <Link href="/seller-dashboard" className="px-4 py-2 bg-pink-600 text-white rounded-md">
                Sell on Platform
              </Link>
            )}
            {!isAuthenticated && (
              <Link href="/login" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                Login to Sell
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No seller products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="border rounded-md bg-white">
                <ProductCard product={p} />
                <div className="p-3 border-t bg-gray-50">
                  <p className="text-sm text-gray-600">Sold by: {p.seller?.name || 'Seller'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Become a Seller & Upload Product</h2>
                <button onClick={closeModal} className="text-gray-500">Close</button>
              </div>
              <form onSubmit={handleModalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" />
                  <label className="block text-sm font-medium text-gray-700 mt-3">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="mt-1 block w-full border rounded-md p-2" />
                  <label className="block text-sm font-medium text-gray-700 mt-3">Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" />
                  <label className="block text-sm font-medium text-gray-700 mt-3">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
                    <option value="">Select</option>
                    <option value="MEN">Men</option>
                    <option value="WOMEN">Women</option>
                    <option value="KIDS">Kids</option>
                    <option value="UNISEX">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price *</label>
                      <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input name="stock" type="number" value={form.stock} onChange={e => setForm(prev => ({ ...prev, stock: parseInt(e.target.value || 0) }))} className="mt-1 block w-full border rounded-md p-2" />
                    </div>
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mt-3">Product Image</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" />
                  {imagePreview && (
                    <div className="mt-3">
                      <img src={imagePreview} alt="preview" className="max-h-48 object-contain" />
                    </div>
                  )}
                  <div className="mt-4">
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-pink-600 text-white rounded-md">
                      {submitting ? 'Processing...' : 'Become Seller & Upload'}
                    </button>
                    <button type="button" onClick={closeModal} className="ml-3 px-4 py-2 border rounded-md">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
