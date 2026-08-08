import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/bookService";
import BookForm from "../components/BookForm";

function Books() {
    const [books, setBooks] = useState([]);
    const [editingBook, setEditingBook] = useState(null);
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

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteBook(id);
            alert("Book deleted successfully!");

            loadBooks();
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Failed to delete book.");
        }
    };

    return (
        <div>
            <h2>Books</h2>

            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setEditingBook(null);
                    setShowForm(!showForm);
                }}
            >
                Add Book
            </button>

            {showForm && (
                <BookForm
                    editingBook={editingBook}
                    onBookAdded={() => {
                        loadBooks();
                        setShowForm(false);
                        setEditingBook(null);
                    }}
                />
            )}

            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map((book) => (
                        <tr key={book.bookId}>
                            <td>{book.bookId}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>

                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => {
                                        setEditingBook(book);
                                        setShowForm(true);
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(book.bookId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Books;