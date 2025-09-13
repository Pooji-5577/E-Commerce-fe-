import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { FiHeart } from 'react-icons/fi';

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      setWishlistItems(response.data || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your wishlist</p>
          <Link href="/login" className="btn-primary">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Wishlist - Myntra</title>
        <meta name="description" content="View and manage your wishlist items" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
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
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <FiHeart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">
                Save items you love so you can find them easily later
              </p>
              <Link href="/" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item.product}
                    isWishlisted={true}
                    onWishlistUpdate={loadWishlist}
                  />
                ))}
              </div>

              {/* Wishlist Actions */}
              <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Wishlist Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-outline">
                    Share Wishlist
                  </button>
                  <button className="btn-secondary">
                    Move All to Cart
                  </button>
                  <Link href="/" className="btn-primary text-center">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;