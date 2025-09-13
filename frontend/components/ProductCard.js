import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { wishlistAPI } from '../lib/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product, isWishlisted = false, onWishlistUpdate }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(isWishlisted);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistAPI.remove(product.id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.add({ productId: product.id });
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
      onWishlistUpdate && onWishlistUpdate();
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }

    // For products with size variants, redirect to product page
    if (product.size && product.size.length > 0) {
      window.location.href = `/products/${product.id}`;
      return;
    }

    await addToCart(product.id);
  };

  const calculateDiscount = () => {
    if (product.discountPrice && product.price) {
      const discount = ((product.price - product.discountPrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const getAverageRating = () => {
    if (product.reviews && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      return (totalRating / product.reviews.length).toFixed(1);
    }
    return 0;
  };

  const discount = calculateDiscount();
  const averageRating = getAverageRating();

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Product Image */}
          <div className="aspect-w-4 aspect-h-5 w-full">
            <Image
              src={product.imageUrl || product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            {isInWishlist ? (
              <FaHeart className="w-4 h-4 text-red-500" />
            ) : (
              <FiHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            )}
          </button>

          {/* Quick Add to Cart on Hover */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              className="w-full bg-pink-600 text-white py-2 px-4 rounded-md font-medium hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span>{product.size?.length > 0 ? 'View Options' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-sm font-medium text-gray-900 mb-1">{product.brand}</p>
          )}

          {/* Product Name */}
          <h3 className="text-sm text-gray-600 mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex items-center space-x-1">
                <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{averageRating}</span>
                <span className="text-xs text-gray-400">({product._count?.reviews || 0})</span>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Size Options Preview */}
          {product.size && product.size.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Sizes: {product.size.slice(0, 3).join(', ')}
                {product.size.length > 3 && '...'}
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;