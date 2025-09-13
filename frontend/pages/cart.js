import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';

const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your cart</p>
          <Link href="/login" className="btn-primary">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    await updateQuantity(itemId, newQuantity);
    setLoading(false);
  };

  const handleRemoveItem = async (itemId) => {
    setLoading(true);
    await removeFromCart(itemId);
    setLoading(false);
  };

  const calculateSavings = () => {
    return cartItems.reduce((savings, item) => {
      if (item.product.discountPrice && item.product.price) {
        const itemSavings = (item.product.price - item.product.discountPrice) * item.quantity;
        return savings + itemSavings;
      }
      return savings;
    }, 0);
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - Myntra</title>
        <meta name="description" content="Review items in your shopping cart" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <FiShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
              <Link href="/" className="btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cartItems.length} items)</h1>
                  
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4 border-b border-gray-200 pb-6">
                        <div className="flex-shrink-0">
                          <Image
                            src={item.product.imageUrl || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            width={120}
                            height={150}
                            className="rounded-md object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {item.product.name}
                          </h3>
                          {item.product.brand && (
                            <p className="text-sm text-gray-600 mb-2">by {item.product.brand}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 mb-3">
                            {item.size && (
                              <span className="text-sm text-gray-600">Size: {item.size}</span>
                            )}
                            {item.color && (
                              <span className="text-sm text-gray-600">Color: {item.color}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{item.product.discountPrice || item.product.price}
                            </span>
                            {item.product.discountPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.product.price}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                disabled={loading || item.quantity <= 1}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                disabled={loading}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-700 disabled:opacity-50"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    
                    {calculateSavings() > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{calculateSavings().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link href="/checkout" className="w-full btn-primary block text-center mb-4">
                    Proceed to Checkout
                  </Link>
                  
                  <Link href="/" className="w-full btn-secondary block text-center">
                    Continue Shopping
                  </Link>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      🔒 Secure checkout with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;