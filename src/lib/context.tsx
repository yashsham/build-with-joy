"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  quantity: number;
}

interface AppContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isChooseServiceOpen: boolean;
  setIsChooseServiceOpen: (open: boolean) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  user: any | null;
  setUser: (user: any | null) => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState("bareilly");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChooseServiceOpen, setIsChooseServiceOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any | null>(null);

  // Load cart from localStorage and verify session on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("hermosa_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    const savedUser = localStorage.getItem("hermosa_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    // Call server to verify if current cookie is valid & update context
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          // If server says unauthorized, clear local user state to stay in sync!
          setUser(null);
          localStorage.removeItem("hermosa_user");
        }
      })
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error("[Auth verification failed]:", err);
      });
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("hermosa_cart", JSON.stringify(cart));
  }, [cart]);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("hermosa_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hermosa_user");
    }
  }, [user]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  const logout = async () => {
    setUser(null);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("[Session] Failed to clear cookie:", e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isChooseServiceOpen,
        setIsChooseServiceOpen,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
