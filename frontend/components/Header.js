import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-pink-600">Clothsy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/men" className="text-gray-700 hover:text-pink-600 font-medium">
              MEN
            </Link>
            <Link href="/women" className="text-gray-700 hover:text-pink-600 font-medium">
              WOMEN
            </Link>
            <Link href="/kids" className="text-gray-700 hover:text-pink-600 font-medium">
              KIDS
            </Link>
            <Link href="/sellers" className="text-gray-700 hover:text-pink-600 font-medium">
              SELLERS
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 text-gray-700 hover:text-pink-600"
              >
                <FiUser className="w-5 h-5" />
                <span className="hidden md:block text-sm font-medium">
                  {isAuthenticated ? user?.name : 'Profile'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Orders
                      </Link>
                      <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Wishlist
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Login
                      </Link>
                      <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="text-gray-700 hover:text-pink-600">
              <FiHeart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-700 hover:text-pink-600">
              <FiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-700 hover:text-pink-600"
            >
              {showMobileMenu ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/men" className="block px-3 py-2 text-gray-700 hover:text-pink-600 font-medium">
                MEN
              </Link>
              <Link href="/women" className="block px-3 py-2 text-gray-700 hover:text-pink-600 font-medium">
                WOMEN
              </Link>
              <Link href="/kids" className="block px-3 py-2 text-gray-700 hover:text-pink-600 font-medium">
                KIDS
              </Link>
              <Link href="/sellers" className="block px-3 py-2 text-gray-700 hover:text-pink-600 font-medium">
                SELLERS
              </Link>
            </div>
            
            {/* Mobile Search */}
            <div className="px-2 pt-2">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;