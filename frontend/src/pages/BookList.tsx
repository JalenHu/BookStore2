import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'bootstrap';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';
import { fetchBooks, fetchCategories } from '../api/BookStoreAPI';
import BookCard from '../components/BookCard';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';

function BookList() {
    const navigate = useNavigate();

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [toastTitle, setToastTitle] = useState<string>('');
    const { cart, addToCart, saveBrowseState, lastBrowseState } = useCart();

    const toastRef = useRef<HTMLDivElement>(null);

    // Restore browse state when returning from cart
    useEffect(() => {
        if (lastBrowseState) {
            setPageNum(lastBrowseState.pageNum);
            setPageSize(lastBrowseState.pageSize);
            setSelectedCategory(lastBrowseState.selectedCategory);
            setSortOrder(lastBrowseState.sortOrder);
        }
    }, []);

    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    useEffect(() => {
        fetchBooks(pageSize, pageNum, sortOrder, selectedCategory).then((data) => {
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        });
    }, [pageSize, pageNum, sortOrder, selectedCategory]);

    function handleViewCart() {
        saveBrowseState({ pageNum, pageSize, selectedCategory, sortOrder });
        navigate('/cart');
    }

    function handleAddToCart(book: Book) {
        addToCart({ bookId: book.bookId, title: book.title, price: book.price });
        setToastTitle(book.title);
        if (toastRef.current) {
            const toast = new Toast(toastRef.current, { delay: 2500 });
            toast.show();
        }
    }

    function handleCategoryChange(category: string) {
        setSelectedCategory(category);
        setPageNum(1);
    }

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="container my-4">

            {/* Header row */}
            <div className="row align-items-center mb-3">
                <div className="col">
                    <h1 className="mb-0">Bookstore</h1>
                </div>
                <div className="col-auto text-end">
                    <span className="me-3">
                        <strong>Cart:</strong> {cartCount} {cartCount === 1 ? 'item' : 'items'} — ${cartTotal.toFixed(2)}
                    </span>
                    <button className="btn btn-primary position-relative" onClick={handleViewCart}>
                        View Cart
                        {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Category filter + sort */}
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                sortOrder={sortOrder}
                onCategoryChange={handleCategoryChange}
                onSortChange={setSortOrder}
            />

            {/* Book cards grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
                {books.map((b) => (
                    <div className="col" key={b.bookId}>
                        <BookCard book={b} onAddToCart={handleAddToCart} />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPageNum}
                onPageSizeChange={(size) => { setPageSize(size); setPageNum(1); }}
            />

            {/* Bootstrap Toast */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
                <div ref={toastRef} className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            <strong>Added to cart:</strong> {toastTitle}
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default BookList;
