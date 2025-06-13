import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
  id: number;
  price: number;
  discount?: number;
}

interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: string;
  date: Date;
  customerId: string;
  shippingAddress: string;
  paymentMethod: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  orderHistory: Order[];
  placeOrder: (shippingAddress: string, paymentMethod: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // Load cart and order history from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedOrders = localStorage.getItem('orderHistory');
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedOrders) {
      setOrderHistory(JSON.parse(savedOrders));
    }
  }, []);

  // Save cart and order history to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    const newOrder: Order = {
      id: Date.now(),
      items: [...cartItems],
      total: getCartTotal(),
      status: 'completed',
      date: new Date(),
      customerId: 'user123', // Replace with actual user ID
      shippingAddress: 'Default Address', // Replace with actual address
      paymentMethod: 'Credit Card' // Replace with actual payment method
    };
    setOrderHistory(prev => [...prev, newOrder]);
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const placeOrder = (shippingAddress: string, paymentMethod: string) => {
    const newOrder: Order = {
      id: Date.now(),
      items: [...cartItems],
      total: getCartTotal(),
      status: 'pending',
      date: new Date(),
      customerId: 'user123', // Replace with actual user ID
      shippingAddress,
      paymentMethod
    };
    setOrderHistory(prev => [...prev, newOrder]);
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        orderHistory,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 