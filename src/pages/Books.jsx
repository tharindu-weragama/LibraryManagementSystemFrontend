import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/bookService";
import BookForm from "../components/BookForm";
import useRole from "../hooks/useRole";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

function Books() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [editingBook, setEditingBook] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const {
        isAdmin,
        isLibrarian,
        isMember
    } = useRole();

    const canManageBooks =
        isAdmin || isLibrarian;

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getBooks();

            setBooks(
                response.data || []
            );
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
        const confirmed =
            window.confirm(
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

    const filteredBooks = books.filter((book) => {
        const value =
            search
                .toLowerCase()
                .trim();

        if (!value) {
            return true;
        }

        const title =
            book.title?.toLowerCase() || "";

        const author =
            book.author?.toLowerCase() || "";

        const category =
            book.categoryName?.toLowerCase() || "";

        const publisher =
            book.publisherName?.toLowerCase() || "";

        return (
            title.includes(value) ||
            author.includes(value) ||
            category.includes(value) ||
            publisher.includes(value)
        );
    });

    const getAvailabilityBadge = (book) => {
        if (
            book.availableCopies > 0
        ) {
            return (
                <span className="badge bg-success">
                    Available
                </span>
            );
        }

        return (
            <span className="badge bg-danger">
                Unavailable
            </span>
        );
    };

    return (
        <div>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">

                <div>
                    <h2 className="mb-1">
                        Books
                    </h2>

                    <p className="text-muted mb-0">
                        {canManageBooks
                            ? "Manage and search the library book collection."
                            : "Search the library catalogue and check book availability."
                        }
                    </p>
                </div>

                {canManageBooks && (
                    <button
                        className="btn btn-primary px-4 py-2"
                        onClick={() => {
                            setEditingBook(null);
                            setShowForm(
                                !showForm
                            );
                        }}
                    >
                        {showForm
                            ? "Close Form"
                            : "Add Book"}
                    </button>
                )}
            </div>

            <AlertMessage
                type="danger"
                message={error}
            />

            {canManageBooks &&
                showForm && (
                    <div className="mb-4">
                        <BookForm
                            editingBook={
                                editingBook
                            }
                            onBookAdded={async () => {
                                await loadBooks();

                                setShowForm(false);
                                setEditingBook(null);
                            }}
                        />
                    </div>
                )}

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search books by title, author, category or publisher..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />
            </div>

            {loading ? (
                <LoadingSpinner
                    message="Loading books..."
                />
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">

                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle mb-0">

                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4 py-3">
                                            No.
                                        </th>

                                        <th className="px-4 py-3">
                                            Title
                                        </th>

                                        <th className="px-4 py-3">
                                            Author
                                        </th>

                                        <th className="px-4 py-3">
                                            Category
                                        </th>

                                        <th className="px-4 py-3">
                                            Publisher
                                        </th>

                                        <th className="px-4 py-3 text-center">
                                            Year
                                        </th>

                                        <th className="px-4 py-3 text-center">
                                            Copies
                                        </th>

                                        {isMember && (
                                            <th className="px-4 py-3 text-center">
                                                Availability
                                            </th>
                                        )}

                                        {canManageBooks && (
                                            <th className="px-4 py-3 text-center">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredBooks.length > 0 ? (
                                        filteredBooks.map(
                                            (
                                                book,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        book.bookId
                                                    }
                                                >
                                                    <td className="px-4 py-4">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-4 py-4 fw-semibold">
                                                        {
                                                            book.title
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {
                                                            book.author
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {
                                                            book.categoryName
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {
                                                            book.publisherName
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        {
                                                            book.publishedYear
                                                        }
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        {book.availableCopies} /{" "}
                                                        {book.totalCopies}
                                                    </td>

                                                    {isMember && (
                                                        <td className="px-4 py-4 text-center">
                                                            {getAvailabilityBadge(
                                                                book
                                                            )}
                                                        </td>
                                                    )}

                                                    {canManageBooks && (
                                                        <td className="px-4 py-4">
                                                            <div className="d-flex flex-column flex-xl-row justify-content-center gap-2">

                                                                <button
                                                                    className="btn btn-warning btn-sm px-3"
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
                                                                    className="btn btn-danger btn-sm px-3"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            book.bookId
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>

                                                            </div>
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
                                                        : "8"
                                                }
                                                className="text-center py-5 text-muted"
                                            >
                                                No books match your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Books;