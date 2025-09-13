import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../lib/api';

const KidsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const productsRes = await productsAPI.getAll({ 
        gender: 'KIDS',
        limit: 20
      });
      setProducts(productsRes.data.products || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const kidsCategories = [
    { name: 'Boys Clothing', slug: 'boys', age: '2-12 Years' },
    { name: 'Girls Clothing', slug: 'girls', age: '2-12 Years' },
    { name: 'Baby Boys', slug: 'baby-boys', age: '0-2 Years' },
    { name: 'Baby Girls', slug: 'baby-girls', age: '0-2 Years' },
    { name: 'Kids Shoes', slug: 'shoes', age: 'All Ages' },
    { name: 'School Supplies', slug: 'school', age: '3-15 Years' },
    { name: 'Toys & Games', slug: 'toys', age: 'All Ages' },
    { name: 'Kids Accessories', slug: 'accessories', age: 'All Ages' }
  ];

  return (
    <>
      <Head>
        <title>Kids Fashion Online Shopping - Myntra</title>
        <meta name="description" content="Shop latest kids fashion including clothing for boys, girls, babies. Best deals on kids wear and accessories." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">KIDS FASHION</h1>
            <p className="text-xl md:text-2xl mb-8">Comfortable & trendy clothes for your little ones</p>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors">
              SHOP NOW
            </button>
          </div>
        </section>

        {/* Age Categories */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">SHOP BY AGE</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years'].map((age) => (
                <div key={age} className="text-center group cursor-pointer">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                    <span className="text-xl font-bold text-orange-600">{age.split('-')[0]}</span>
                  </div>
                  <h3 className="font-medium group-hover:text-orange-600">{age}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">SHOP BY CATEGORY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {kidsCategories.map((category) => (
                <div key={category.slug} className="group cursor-pointer">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">{category.name[0]}</span>
                    </div>
                  </div>
                  <h3 className="text-center font-medium group-hover:text-orange-600">
                    {category.name}
                  </h3>
                  <p className="text-center text-sm text-gray-500">{category.age}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Kids Products</h2>
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
                    <p className="text-sm text-gray-400 mt-2">Check back soon for amazing kids fashion!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Special Features Section */}
        <section className="py-16 bg-gradient-to-r from-blue-100 to-purple-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">WHY CHOOSE MYNTRA KIDS?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-bold mb-2">Safe Materials</h3>
                <p className="text-gray-600">100% safe and certified materials for your child's sensitive skin</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="font-bold mb-2">Comfort First</h3>
                <p className="text-gray-600">Designed for maximum comfort and freedom of movement</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="font-bold mb-2">Easy Returns</h3>
                <p className="text-gray-600">Hassle-free returns if the size doesn't fit perfectly</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default KidsPage;