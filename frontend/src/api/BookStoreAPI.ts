import type { Book } from '../types/Book';

const API_BASE = 'https://bookstore-jalen-backend-arhnbwhjateaapdc.westus2-01.azurewebsites.net/api/Bookstore';

export async function fetchBooks(
    pageSize: number,
    pageNum: number,
    sortOrder: string,
    category?: string
): Promise<{ books: Book[]; totalNumBooks: number }> {
    const categoryParam =
        category && category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
    const response = await fetch(
        `${API_BASE}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${categoryParam}`
    );
    return response.json();
}

export async function fetchCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/GetCategories`);
    return response.json();
}

export async function fetchAllBooks(): Promise<Book[]> {
    const response = await fetch(`${API_BASE}/AllBooks?pageSize=9999&pageNum=1&sortOrder=asc`);
    const data = await response.json();
    return data.books;
}

export async function addBook(book: Omit<Book, 'bookId'>): Promise<Book> {
    const response = await fetch(`${API_BASE}/AddBook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    return response.json();
}

export async function updateBook(book: Book): Promise<Book> {
    const response = await fetch(`${API_BASE}/UpdateBook/${book.bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    return response.json();
}

export async function deleteBook(bookId: number): Promise<void> {
    await fetch(`${API_BASE}/DeleteBook/${bookId}`, {
        method: 'DELETE',
    });
}
