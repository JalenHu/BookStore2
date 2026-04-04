import type { Book } from '../types/Book';

interface BookCardProps {
    book: Book;
    onAddToCart: (book: Book) => void;
}

function BookCard({ book, onAddToCart }: BookCardProps) {
    return (
        <div className="card h-100">
            <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <ul className="list-unstyled">
                    <li><strong>Author:</strong> {book.author}</li>
                    <li><strong>Publisher:</strong> {book.publisher}</li>
                    <li><strong>ISBN:</strong> {book.isbn}</li>
                    <li><strong>Classification:</strong> {book.classification}</li>
                    <li><strong>Category:</strong> {book.category}</li>
                    <li><strong>Page Count:</strong> {book.pageCount}</li>
                    <li><strong>Price:</strong> ${book.price.toFixed(2)}</li>
                </ul>
            </div>
            <div className="card-footer">
                <button className="btn btn-success w-100" onClick={() => onAddToCart(book)}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default BookCard;
