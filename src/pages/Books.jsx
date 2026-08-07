import { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import BookForm from "../components/BookForm";

function Books() {
    const [books, setBooks] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const response = await getBooks();
            setBooks(response.data);
        } catch (error) {
            console.error("Error loading books:", error);
        }
    };

    return (
        <div>
            <h2>Books</h2>

            <button
                className="btn btn-primary mb-3"
                onClick={() => setShowForm(!showForm)}
            >
                Add Book
            </button>

            {showForm && <BookForm />}

            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookId}>
                            <td>{book.bookId}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Books;