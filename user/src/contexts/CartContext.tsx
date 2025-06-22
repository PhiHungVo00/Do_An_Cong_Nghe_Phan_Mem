import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';
import { orderAPI } from '../services/api';

export interface CartItem extends Product {
  quantity: number;
  id: number;
  price: number;
  discount?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  date: Date;
  customer: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  orderHistory: Order[];
  placeOrder: (shippingAddress: string, paymentMethod: string) => Promise<void>;
  loadOrderHistory: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load order history from API
  const loadOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const orders = await orderAPI.getUserOrders();
        setOrderHistory(orders);
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  };

  // Load order history on mount if user is logged in
  useEffect(() => {
    loadOrderHistory();
  }, []);

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

  const placeOrder = async (shippingAddress: string, paymentMethod: string) => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id.toString(),
          quantity: item.quantity,
          price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
          name: item.name,
          image: item.image,
          brand: item.brand
        })),
        shippingAddress,
        paymentMethod,
        totalAmount: getCartTotal()
      };

      await orderAPI.create(orderData);
      setCartItems([]);
      await loadOrderHistory(); // Reload order history
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
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
        placeOrder,
        loadOrderHistory
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