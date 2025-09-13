import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../lib/api';

const WomenPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const productsRes = await productsAPI.getAll({ 
        gender: 'WOMEN',
        limit: 20
      });
      setProducts(productsRes.data.products || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const womenCategories = [
    { name: 'Tops', slug: 'tops' },
    { name: 'Dresses', slug: 'dresses' },
    { name: 'Ethnic Wear', slug: 'ethnic' },
    { name: 'Jeans', slug: 'jeans' },
    { name: 'Skirts', slug: 'skirts' },
    { name: 'Shoes', slug: 'shoes' },
    { name: 'Handbags', slug: 'handbags' },
    { name: 'Jewelry', slug: 'jewelry' }
  ];

  return (
    <>
      <Head>
        <title>Women's Fashion Online Shopping - Myntra</title>
        <meta name="description" content="Shop latest women's fashion including dresses, tops, ethnic wear, shoes and more. Best deals on top brands." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">WOMEN'S FASHION</h1>
            <p className="text-xl md:text-2xl mb-8">Explore the latest trends in women's clothing</p>
            <button className="bg-white text-pink-600 px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors">
              SHOP NOW
            </button>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">SHOP BY CATEGORY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {womenCategories.map((category) => (
                <div key={category.slug} className="group cursor-pointer">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">{category.name[0]}</span>
                    </div>
                  </div>
                  <h3 className="text-center font-medium group-hover:text-pink-600">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Women's Products</h2>
              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>Sort by: Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Popularity</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="aspect-w-4 aspect-h-5 bg-gray-200 rounded-t-lg h-80"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No products found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default WomenPage;