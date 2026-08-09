import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/bookService";
import BookForm from "../components/BookForm";
import useRole from "../hooks/useRole";

function Books() {
    const [books, setBooks] = useState([]);
    const [editingBook, setEditingBook] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { isAdmin, isLibrarian } = useRole();

    const canManageBooks =
        isAdmin || isLibrarian;

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getBooks();

            setBooks(response.data);
        } catch (error) {
            console.error(
                "Error loading books:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load books."
            );
        } finally {
            setLoading(false);
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
            setError("");

            await deleteBook(id);

            await loadBooks();
        } catch (error) {
            console.error(
                "Error deleting book:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete book."
            );
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">
                    Books
                </h2>

                {canManageBooks && (
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingBook(null);
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm
                            ? "Close"
                            : "Add Book"}
                    </button>
                )}
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {canManageBooks && showForm && (
                <BookForm
                    editingBook={editingBook}
                    onBookAdded={async () => {
                        await loadBooks();

                        setShowForm(false);
                        setEditingBook(null);
                    }}
                />
            )}

            {loading ? (
                <div className="text-center mt-4">
                    <div
                        className="spinner-border"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-2">
                        Loading books...
                    </p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Publisher</th>
                                <th>Year</th>
                                <th>Copies</th>

                                {canManageBooks && (
                                    <th>Actions</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {books.length > 0 ? (
                                books.map(
                                    (book, index) => (
                                        <tr
                                            key={book.bookId}
                                        >
                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                {book.title}
                                            </td>

                                            <td>
                                                {book.author}
                                            </td>

                                            <td>
                                                {book.categoryName}
                                            </td>

                                            <td>
                                                {book.publisherName}
                                            </td>

                                            <td>
                                                {book.publishedYear}
                                            </td>

                                            <td>
                                                {book.availableCopies} /{" "}
                                                {book.totalCopies}
                                            </td>

                                            {canManageBooks && (
                                                <td>
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => {
                                                            setEditingBook(
                                                                book
                                                            );

                                                            setShowForm(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                book.bookId
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={
                                            canManageBooks
                                                ? "8"
                                                : "7"
                                        }
                                        className="text-center"
                                    >
                                        No books found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Books;