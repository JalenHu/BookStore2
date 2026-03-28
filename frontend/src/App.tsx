import { useState } from 'react';
import './App.css';
import BookList from './BookList';
import Cart from './Cart';
import { CartProvider } from './context/CartContext';

function App() {
    const [view, setView] = useState<'books' | 'cart'>('books');

    return (
        <CartProvider>
            {view === 'books' ? (
                <BookList onViewCart={() => setView('cart')} />
            ) : (
                <Cart onContinueShopping={() => setView('books')} />
            )}
        </CartProvider>
    );
}

export default App;
