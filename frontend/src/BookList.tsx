import { useEffect, useState } from 'react';
import type { Book } from './types/Book';

function BookList () {

    const [books, setBooks] = useState<Book[]>([])
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalNumBooks, setTotalNumBooks] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<string>("asc");

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`https://localhost:5000/api/Bookstore/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`);
            
            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Data received:", data); 

            setBooks(data.books);
            setTotalNumBooks(data.totalNumBooks);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        };
        fetchBooks();
    }, [pageSize, pageNum, sortOrder]);

    return (
        <>
            <h1>Bookstore</h1>
            <br/>
            <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                Sort by Title {sortOrder === "asc" ? "ASC▲" : "DESC▼"}
            </button>

            <br/>
            {books.map((b) => (
                <div id="bookCard" className="card" key={b.bookId}>
                    <h3 className="card-title">{b.title}</h3>
                    <div className="card-body">
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
                </div>
                ))}

                <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum -1)}>
                    Previous</button>

                {[...Array(totalPages)].map((_, i) => (
                    <button key={i+1} onClick={() => setPageNum(i+1)} disabled={pageNum === (i+1)}>
                        {i+1}
                    </button>
                ))}
                <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum +1)}>
                    Next</button>

                <br />
                <label>
                    Result per page:
                    <select value={pageSize} onChange={(p) => {
                        setPageSize(Number(p.target.value));
                        setPageNum(1);
                        }}
                    >

                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </label>
        </>
    );
    }

export default BookList;
