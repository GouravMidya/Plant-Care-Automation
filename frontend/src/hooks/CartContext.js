// frontend/src/hooks/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
  
    const addToCart = (product) => {
      const existingItemIndex = cartItems.findIndex((item) => item.product._id === product._id);
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        const updatedCartItems = [...cartItems, { product: product, quantity: 1 }];
        setCartItems(updatedCartItems);
      }
    };
  
    const increaseQuantity = (product) => {
      const updatedCartItems = cartItems.map((item) => {
        if (item.product._id === product._id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    };
  
    const decreaseQuantity = (product) => {
      const existingItemIndex = cartItems.findIndex((item) => item.product._id === product._id);
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        if (updatedCartItems[existingItemIndex].quantity > 1) {
          updatedCartItems[existingItemIndex].quantity -= 1;
        } else {
          updatedCartItems.splice(existingItemIndex, 1); // Remove the item from the cart when quantity becomes zero
        }
        setCartItems(updatedCartItems);
      }
    };
    const clearCart = () => {
      setCartItems([]); // Clear the cart items
    };
  
    return (
      <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity,clearCart }}>
        {children}
      </CartContext.Provider>
    );
  };
  