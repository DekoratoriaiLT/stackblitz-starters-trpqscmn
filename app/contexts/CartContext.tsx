'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBusinessAuth } from './BusinessAuthContext';

export interface Product {
  id: string | number;
  title: string;
  images: string[];
  price?: number;
  businessDiscount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { isBusinessMode, discountRate } = useBusinessAuth();

  useEffect(() => {
    const cartKey = isBusinessMode ? 'businessCart' : 'standardCart';
    const storedCart = localStorage.getItem(cartKey);
    if (storedCart) setCart(JSON.parse(storedCart));
    else setCart([]);
  }, [isBusinessMode]);

  useEffect(() => {
    const cartKey = isBusinessMode ? 'businessCart' : 'standardCart';
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, isBusinessMode]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      const price = isBusinessMode && product.price ? product.price * (1 - discountRate / 100) : product.price || 0;
      const productWithPrice: Product = { ...product, price, businessDiscount: isBusinessMode ? discountRate : undefined };

      if (existing) return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      return [...prev, { ...productWithPrice, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string | number) => setCart((prev) => prev.filter((p) => p.id !== productId));
  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity } : p)));
  };
  const clearCart = () => {
    setCart([]);
    const cartKey = isBusinessMode ? 'businessCart' : 'standardCart';
    localStorage.removeItem(cartKey);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
