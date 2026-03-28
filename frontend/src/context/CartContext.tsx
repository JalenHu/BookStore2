import { createContext, useContext, useState } from 'react';
import type { CartItem } from '../types/CartItem';

export interface BrowseState {
    pageNum: number;
    pageSize: number;
    selectedCategory: string;
    sortOrder: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (bookId: number) => void;
    clearCart: () => void;
    lastBrowseState: BrowseState | null;
    saveBrowseState: (state: BrowseState) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [lastBrowseState, setLastBrowseState] = useState<BrowseState | null>(null);

    function addToCart(item: Omit<CartItem, 'quantity'>) {
        setCart((prev) => {
            const existing = prev.find((c) => c.bookId === item.bookId);
            if (existing) {
                return prev.map((c) =>
                    c.bookId === item.bookId ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    }

    function removeFromCart(bookId: number) {
        setCart((prev) => prev.filter((c) => c.bookId !== bookId));
    }

    function clearCart() {
        setCart([]);
    }

    function saveBrowseState(state: BrowseState) {
        setLastBrowseState(state);
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, lastBrowseState, saveBrowseState }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used inside CartProvider');
    return context;
}
