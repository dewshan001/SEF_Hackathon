import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);  // [{ cylinder, quantity }]
  const [cartShopId, setCartShopId] = useState(null);
  const [cartShop, setCartShop] = useState(null);

  // Add item — enforces single-shop rule
  const addItem = useCallback((cylinder, shop, quantity = 1) => {
    if (cartShopId && cartShopId !== shop._id) {
      return { 
        success: false, 
        message: 'Your cart contains items from another shop. Please complete or clear the current order first.' 
      };
    }

    setCartShopId(shop._id);
    setCartShop(shop);
    setCartItems(prev => {
      const existing = prev.find(i => i.cylinder._id === cylinder._id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, cylinder.availableQuantity);
        return prev.map(i => i.cylinder._id === cylinder._id ? { ...i, quantity: newQty } : i);
      }
      return [...prev, { cylinder, quantity: Math.min(quantity, cylinder.availableQuantity) }];
    });
    return { success: true };
  }, [cartShopId]);

  // Update quantity for an item
  const updateQty = useCallback((cylinderId, quantity) => {
    if (quantity <= 0) {
      removeItem(cylinderId);
      return;
    }
    setCartItems(prev =>
      prev.map(i =>
        i.cylinder._id === cylinderId
          ? { ...i, quantity: Math.min(quantity, i.cylinder.availableQuantity) }
          : i
      )
    );
  }, []);

  // Remove item
  const removeItem = useCallback((cylinderId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.cylinder._id !== cylinderId);
      if (updated.length === 0) {
        setCartShopId(null);
        setCartShop(null);
      }
      return updated;
    });
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartShopId(null);
    setCartShop(null);
  }, []);

  const totalAmount = cartItems.reduce((sum, i) => sum + i.cylinder.price * i.quantity, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartShopId,
      cartShop,
      totalAmount,
      totalItems,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
