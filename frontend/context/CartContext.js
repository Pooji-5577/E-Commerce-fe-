import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1, size, color) => {
    try {
      const response = await cartAPI.add({ productId, quantity, size, color });
      await fetchCart();
      toast.success('Item added to cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartAPI.update(itemId, { quantity });
      await fetchCart();
      return { success: true };
    } catch (error) {
      toast.error('Failed to update quantity');
      return { success: false };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      await fetchCart();
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      toast.error('Failed to remove item');
      return { success: false };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product?.discountPrice || item.product?.price || 0);
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
    cartTotal: getCartTotal(),
    cartCount: getCartCount(),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};