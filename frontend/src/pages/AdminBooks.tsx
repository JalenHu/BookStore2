import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/Book';
import { fetchAllBooks, addBook, updateBook, deleteBook } from '../api/BookStoreAPI';

const emptyForm = {
    title: '',
    author: '',
    publisher: '',
    isbn: 0,
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
};

function AdminBooks() {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        loadBooks();
    }, []);

    async function loadBooks() {
        const data = await fetchAllBooks();
        setBooks(data);
    }

    function handleAddNew() {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleEdit(book: Book) {
        setEditingId(book.bookId);
        setForm({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            isbn: book.isbn,
            classification: book.classification,
            category: book.category,
            pageCount: book.pageCount,
            price: book.price,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleCancel() {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    async function handleDelete(bookId: number) {
        if (!confirm('Are you sure you want to delete this book?')) return;
        await deleteBook(bookId);
        loadBooks();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingId !== null) {
            await updateBook({ bookId: editingId, ...form });
        } else {
            await addBook(form);
        }
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        loadBooks();
    }

    function handleChange(field: keyof typeof emptyForm, value: string | number) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <div className="container my-4">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-outline-secondary me-3" onClick={() => navigate('/')}>
                    ← Back to Store
                </button>
                <h1 className="mb-0">Manage Books</h1>
                <button className="btn btn-success ms-auto" onClick={handleAddNew}>
                    + Add Book
                </button>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="card mb-4 border-primary">
                    <div className="card-header bg-primary text-white">
                        <strong>{editingId !== null ? 'Edit Book' : 'Add New Book'}</strong>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Title</label>
                                    <input
                                        className="form-control"
                                        value={form.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Author</label>
                                    <input
                                        className="form-control"
                                        value={form.author}
                                        onChange={(e) => handleChange('author', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Publisher</label>
                                    <input
                                        className="form-control"
                                        value={form.publisher}
                                        onChange={(e) => handleChange('publisher', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">ISBN</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={form.isbn || ''}
                                        onChange={(e) => handleChange('isbn', Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Page Count</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={form.pageCount || ''}
                                        onChange={(e) => handleChange('pageCount', Number(e.target.value))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Classification</label>
                                    <input
                                        className="form-control"
                                        value={form.classification}
                                        onChange={(e) => handleChange('classification', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Category</label>
                                    <input
                                        className="form-control"
                                        value={form.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="form-control"
                                        value={form.price || ''}
                                        onChange={(e) => handleChange('price', Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <button type="submit" className="btn btn-primary me-2">
                                    {editingId !== null ? 'Save Changes' : 'Add Book'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Books Table */}
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publisher</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>ISBN</th>
                            <th>Pages</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.bookId}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{book.category}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td>{book.isbn}</td>
                                <td>{book.pageCount}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-1"
                                        onClick={() => handleEdit(book)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(book.bookId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {books.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center text-muted py-4">
                                    No books found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminBooks;
