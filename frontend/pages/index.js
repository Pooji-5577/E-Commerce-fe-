import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../lib/api';
import { useRouter } from 'next/router';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [featuredRes, recentRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ limit: 8, isFeatured: true }),
        productsAPI.getAll({ limit: 8 }),
        categoriesAPI.getAll()
      ]);

      const featured = featuredRes.data.products || [];
      const recent = recentRes.data.products || [];

      const featuredIds = new Set(featured.map(p => p.id));
      const merged = featured.concat(recent.filter(p => !featuredIds.has(p.id))).slice(0, 8);

      setFeaturedProducts(merged);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err.response?.data || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const categoryData = [
    { name: "Men", image: "/category-men.jpg", link: "/men" },
    { name: "Women", image: "/category-women.jpg", link: "/women" },
    { name: "Kids", image: "/category-kids.jpg", link: "/kids" },
    { name: "Home & Living", image: "/category-home.jpg", link: "/home-living" },
    { name: "Beauty", image: "/category-beauty.jpg", link: "/beauty" },
    { name: "Studio", image: "/category-studio.jpg", link: "/studio" }
  ];

  return (
    <>
      <Head>
        <title>Clothsy - Fashion Shopping App | Clothes, Lifestyle, Fashion & More</title>
        <meta name="description" content="India's leading fashion destination for men, women & kids. Shop online for latest clothing, footwear, accessories & more from top brands." />
      </Head>

      <div className="min-h-screen">
        {/* Hero Banner */}
        <section className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-lg group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white h-64">
                <div className="text-center">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">BIGGEST DEALS ON TOP BRANDS</h2>
                  <p className="text-lg md:text-xl">MIN 50-80% OFF</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white h-64">
                <div className="text-center">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">TRENDING NOW</h2>
                  <p className="text-lg md:text-xl">ETHNIC WEAR COLLECTION</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              SHOP BY CATEGORY
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoryData.map((category) => {
                const isCurrent = router.pathname === category.link;
                return isCurrent ? (
                  <div key={category.name} className="group cursor-default opacity-60">
                    <div className="aspect-square bg-gray-100 rounded-full overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
                      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">{category.name[0]}</span>
                      </div>
                    </div>
                    <h3 className="text-center font-medium text-gray-900 group-hover:text-pink-600">
                      {category.name}
                    </h3>
                  </div>
                ) : (
                  <Link key={category.name} href={category.link}>
                    <div className="group cursor-pointer">
                      <div className="aspect-square bg-gray-100 rounded-full overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
                        <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-600">{category.name[0]}</span>
                        </div>
                      </div>
                      <h3 className="text-center font-medium text-gray-900 group-hover:text-pink-600">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">TRENDING NOW</h2>
              <Link href="/products" className="text-pink-600 hover:text-pink-700 font-medium">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No featured products available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-pink-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-4">
              STAY IN THE LOOP
            </h2>
            <p className="text-pink-100 mb-8 text-lg">
              Subscribe to our newsletter for exclusive deals and the latest fashion trends
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button className="bg-white text-pink-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;