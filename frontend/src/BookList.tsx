import { useEffect, useRef, useState } from 'react';
import { Toast } from 'bootstrap';
import type { Book } from './types/Book';
import { useCart } from './context/CartContext';

interface BookListProps {
    onViewCart: () => void;
}

function BookList({ onViewCart }: BookListProps) {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalNumBooks, setTotalNumBooks] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
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
        const fetchCategories = async () => {
            const response = await fetch(`https://localhost:5000/api/Bookstore/GetCategories`);
            const data = await response.json();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            const categoryParam = selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : "";
            const response = await fetch(`https://localhost:5000/api/Bookstore/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${categoryParam}`);

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Data received:", data);

            setBooks(data.books);
            setTotalNumBooks(data.totalNumBooks);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        };
        fetchBooks();
    }, [pageSize, pageNum, sortOrder, selectedCategory]);

    function handleViewCart() {
        saveBrowseState({ pageNum, pageSize, selectedCategory, sortOrder });
        onViewCart();
    }

    function handleAddToCart(book: Book) {
        addToCart({ bookId: book.bookId, title: book.title, price: book.price });
        setToastTitle(book.title);
        if (toastRef.current) {
            const toast = new Toast(toastRef.current, { delay: 2500 });
            toast.show();
        }
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
                    {/* Bootstrap Badge: shows live item count on the cart button */}
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

            {/* Filters row */}
            <div className="row mb-3">
                <div className="col-12 col-md-8">
                    <strong>Filter by Category: </strong>
                    <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => { setSelectedCategory("All"); setPageNum(1); }}
                        disabled={selectedCategory === "All"}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className="btn btn-sm btn-outline-secondary me-1"
                            onClick={() => { setSelectedCategory(cat); setPageNum(1); }}
                            disabled={selectedCategory === cat}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
                    <button className="btn btn-sm btn-outline-dark" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                        Sort by Title {sortOrder === "asc" ? "ASC▲" : "DESC▼"}
                    </button>
                </div>
            </div>

            {/* Book cards grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
                {books.map((b) => (
                    <div className="col" key={b.bookId}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{b.title}</h5>
                                <ul className="list-unstyled">
                                    <li><strong>Author:</strong> {b.author}</li>
                                    <li><strong>Publisher:</strong> {b.publisher}</li>
                                    <li><strong>ISBN:</strong> {b.isbn}</li>
                                    <li><strong>Classification:</strong> {b.classification}</li>
                                    <li><strong>Category:</strong> {b.category}</li>
                                    <li><strong>Page Count:</strong> {b.pageCount}</li>
                                    <li><strong>Price:</strong> ${b.price.toFixed(2)}</li>
                                </ul>
                            </div>
                            <div className="card-footer">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => handleAddToCart(b)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination row */}
            <div className="row align-items-center">
                <div className="col-auto">
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>Previous</button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i + 1} className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPageNum(i + 1)}>{i + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="col-auto ms-auto">
                    <label className="form-label mb-0 me-2">Results per page:</label>
                    <select
                        className="form-select form-select-sm d-inline-block w-auto"
                        value={pageSize}
                        onChange={(p) => {
                            setPageSize(Number(p.target.value));
                            setPageNum(1);
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>

            {/* Bootstrap Toast: "added to cart" notification, fixed bottom-right */}
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
