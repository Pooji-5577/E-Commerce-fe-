import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { productsAPI, categoriesAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function SellerDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: 1,
    categoryId: '',
    brand: '',
    gender: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [sellerProducts, setSellerProducts] = useState([]);

  useEffect(() => {
    // Wait for auth check to finish
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // If logged in but not a seller, redirect to home
    if (user && user.role !== 'SELLER') {
      router.replace('/');
      return;
    }

    loadCategories();
    loadSellerProducts();
  }, [authLoading, isAuthenticated, user]);

  const loadCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data || []);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  };

  const loadSellerProducts = async () => {
    if (!user) return;
    try {
      const res = await productsAPI.getAll({ limit: 50 });
      const products = res.data.products || [];
      const mine = products.filter(p => p.sellerId === user.id);
      setSellerProducts(mine);
    } catch (error) {
      console.error('Failed to load seller products', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      alert('Please fill required fields (name, price, category)');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        categoryId: form.categoryId,
        imageUrl: imageDataUrl, // send base64 data URL
        brand: form.brand,
        gender: form.gender
      };

      await productsAPI.create(payload);
      alert('Product uploaded successfully');
      setForm({ name: '', description: '', price: '', stock: 1, categoryId: '', brand: '', gender: '' });
      setImagePreview(null);
      setImageDataUrl('');
      loadSellerProducts();
    } catch (error) {
      console.error('Error creating product', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Seller Dashboard</title>
      </Head>

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>

        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Upload a new product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <button type="submit" disabled={loading} className="px-4 py-2 bg-pink-600 text-white rounded-md">
                  {loading ? 'Uploading...' : 'Upload Product'}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">My Products</h2>
          {sellerProducts.length === 0 ? (
            <p className="text-gray-500">You haven't uploaded any products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sellerProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
