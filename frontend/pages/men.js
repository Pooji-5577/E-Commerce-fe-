import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import { productsAPI, categoriesAPI } from '../lib/api';

const MenPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: '',
    sortBy: 'createdAt',
    page: 1
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ 
          gender: 'MEN',
          ...filters,
          limit: 20
        }),
        categoriesAPI.getAll({ gender: 'MEN' })
      ]);
      
      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const menCategories = [
    { name: 'T-Shirts', slug: 'tshirts', image: '/men-tshirts.jpg' },
    { name: 'Shirts', slug: 'shirts', image: '/men-shirts.jpg' },
    { name: 'Jeans', slug: 'jeans', image: '/men-jeans.jpg' },
    { name: 'Trousers', slug: 'trousers', image: '/men-trousers.jpg' },
    { name: 'Ethnic Wear', slug: 'ethnic', image: '/men-ethnic.jpg' },
    { name: 'Shoes', slug: 'shoes', image: '/men-shoes.jpg' },
    { name: 'Watches', slug: 'watches', image: '/men-watches.jpg' },
    { name: 'Accessories', slug: 'accessories', image: '/men-accessories.jpg' }
  ];

  return (
    <>
      <Head>
        <title>Men's Fashion Online Shopping - Myntra</title>
        <meta name="description" content="Shop latest men's fashion including shirts, t-shirts, jeans, ethnic wear and more. Best deals on top brands." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">MEN'S FASHION</h1>
            <p className="text-xl md:text-2xl mb-8">Discover the latest trends in men's clothing</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors">
              SHOP NOW
            </button>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">SHOP BY CATEGORY</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {menCategories.map((category) => (
                <div key={category.slug} className="group cursor-pointer">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">{category.name[0]}</span>
                    </div>
                  </div>
                  <h3 className="text-center font-medium group-hover:text-blue-600">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Filters Sidebar */}
              <div className="lg:w-1/4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold mb-4">FILTERS</h3>
                  
                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Category</h4>
                    <div className="space-y-2">
                      {menCategories.map((cat) => (
                        <label key={cat.slug} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Brand</h4>
                    <div className="space-y-2">
                      {['Nike', 'Adidas', 'Puma', 'H&M', 'Zara'].map((brand) => (
                        <label key={brand} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Price</h4>
                    <div className="space-y-2">
                      {['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'].map((price) => (
                        <label key={price} className="flex items-center">
                          <input type="radio" name="price" className="mr-2" />
                          <span className="text-sm">{price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="lg:w-3/4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Men's Products</h2>
                  <select className="border border-gray-300 rounded-md px-3 py-2">
                    <option>Sort by: Latest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Popularity</option>
                  </select>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, index) => (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MenPage;