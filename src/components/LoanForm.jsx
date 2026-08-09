import { useEffect, useState } from "react";

import {
    createLoan,
    getAvailableBooksForLoan,
    getMembersForLoan
} from "../services/loanService";

function LoanForm({ onSuccess, onCancel }) {
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);

    const [bookId, setBookId] = useState("");
    const [memberId, setMemberId] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");

    const getDefaultDueDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 14);

        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        const loadFormData = async () => {
            try {
                setLoadingData(true);
                setError("");

                const [booksResponse, membersResponse] = await Promise.all([
                    getAvailableBooksForLoan(),
                    getMembersForLoan()
                ]);

                setBooks(booksResponse.data);
                setMembers(membersResponse.data);
                setDueDate(getDefaultDueDate());
            } catch (error) {
                console.error("Error loading loan form data:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load books or members."
                );
            } finally {
                setLoadingData(false);
            }
        };

        loadFormData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bookId) {
            setError("Please select a book.");
            return;
        }

        if (!memberId) {
            setError("Please select a member.");
            return;
        }

        if (!dueDate) {
            setError("Please select a due date.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const loanData = {
                bookId: Number(bookId),
                memberId: memberId,
                dueDate: `${dueDate}T00:00:00`
            };

            await createLoan(loanData);

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating loan:", error);

            setError(
                error.response?.data?.message ||
                "Failed to create loan."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="text-center p-4">
                <div
                    className="spinner-border"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p className="mt-2">
                    Loading books and members...
                </p>
            </div>
        );
    }

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5 className="mb-0">
                    Borrow Book
                </h5>
            </div>

            <div className="card-body">
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label
                            className="form-label"
                            htmlFor="bookId"
                        >
                            Book
                        </label>

                        <select
                            id="bookId"
                            className="form-select"
                            value={bookId}
                            onChange={(e) =>
                                setBookId(e.target.value)
                            }
                            required
                        >
                            <option value="">
                                Select available book
                            </option>

                            {books.map((book) => (
                                <option
                                    key={book.bookId}
                                    value={book.bookId}
                                >
                                    {book.title} ({book.availableCopies} available)
                                </option>
                            ))}
                        </select>

                        {books.length === 0 && (
                            <small className="text-danger">
                                No books are currently available.
                            </small>
                        )}
                    </div>

                    <div className="mb-3">
                        <label
                            className="form-label"
                            htmlFor="memberId"
                        >
                            Member
                        </label>

                        <select
                            id="memberId"
                            className="form-select"
                            value={memberId}
                            onChange={(e) =>
                                setMemberId(e.target.value)
                            }
                            required
                        >
                            <option value="">
                                Select member
                            </option>

                            {members.map((member, index) => {
                                const memberCode =
                                    `M${String(index + 1).padStart(3, "0")}`;

                                return (
                                    <option
                                        key={member.userId}
                                        value={member.userId}
                                    >
                                        {memberCode} - {member.fullName} - {member.email}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label
                            className="form-label"
                            htmlFor="dueDate"
                        >
                            Due Date
                        </label>

                        <input
                            id="dueDate"
                            type="date"
                            className="form-control"
                            value={dueDate}
                            min={
                                new Date()
                                    .toISOString()
                                    .split("T")[0]
                            }
                            onChange={(e) =>
                                setDueDate(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                loading ||
                                books.length === 0
                            }
                        >
                            {loading
                                ? "Borrowing..."
                                : "Borrow Book"
                            }
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoanForm;