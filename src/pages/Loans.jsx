import { useEffect, useState } from "react";
import LoanForm from "../components/LoanForm";

import {
    getLoans,
    returnLoan,
    updateLoan,
    deleteLoan,
    getMembersForLoan
} from "../services/loanService";

import useRole from "../hooks/useRole";

function Loans() {
    const [loans, setLoans] = useState([]);
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showLoanForm, setShowLoanForm] = useState(false);

    const { isAdmin, isLibrarian } = useRole();

    const canManageLoans =
        isAdmin || isLibrarian;

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                loansResponse,
                membersResponse
            ] = await Promise.all([
                getLoans(),
                getMembersForLoan()
            ]);

            setLoans(loansResponse.data || []);
            setMembers(membersResponse.data || []);
        } catch (error) {
            console.error(
                "Error loading loan data:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load loan data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getMemberCode = (memberId) => {
        const index = members.findIndex(
            (member) =>
                member.userId === memberId
        );

        if (index === -1) {
            return "-";
        }

        return `M${String(index + 1).padStart(3, "0")}`;
    };

    const handleLoanCreated = async () => {
        setShowLoanForm(false);
        setError("");
        setSuccess(
            "Book borrowed successfully."
        );

        await loadData();
    };

    const handleReturn = async (loan) => {
        const confirmed = window.confirm(
            `Return "${loan.bookTitle}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await returnLoan(
                loan.loanId
            );

            setSuccess(
                "Book returned successfully."
            );

            await loadData();
        } catch (error) {
            console.error(
                "Error returning book:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to return book."
            );
        }
    };

    const handleExtendDueDate = async (loan) => {
        const currentDate =
            loan.dueDate
                ? loan.dueDate.split("T")[0]
                : "";

        const newDate = window.prompt(
            "Enter new due date (YYYY-MM-DD):",
            currentDate
        );

        if (!newDate) {
            return;
        }

        const parsedDate =
            new Date(newDate);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            setError(
                "Please enter a valid due date."
            );

            return;
        }

        try {
            setError("");
            setSuccess("");

            await updateLoan(
                loan.loanId,
                `${newDate}T00:00:00`
            );

            setSuccess(
                "Due date updated successfully."
            );

            await loadData();
        } catch (error) {
            console.error(
                "Error updating due date:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update due date."
            );
        }
    };

    const handleDelete = async (loan) => {
        const confirmed = window.confirm(
            `Delete returned loan for "${loan.bookTitle}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deleteLoan(
                loan.loanId
            );

            setSuccess(
                "Loan deleted successfully."
            );

            await loadData();
        } catch (error) {
            console.error(
                "Error deleting loan:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete loan."
            );
        }
    };

    const getDisplayedStatus = (loan) => {
        const rawStatus =
            loan.status?.toLowerCase() || "";

        if (rawStatus === "returned") {
            return "returned";
        }

        if (
            rawStatus === "borrowed" &&
            loan.dueDate
        ) {
            const dueDate =
                new Date(loan.dueDate);

            const today =
                new Date();

            if (dueDate < today) {
                return "overdue";
            }
        }

        if (rawStatus === "borrowed") {
            return "borrowed";
        }

        return rawStatus;
    };

    const filteredLoans = loans.filter((loan) => {
        const value =
            search
                .toLowerCase()
                .trim();

        if (!value) {
            return true;
        }

        const bookTitle =
            loan.bookTitle
                ?.toLowerCase() || "";

        const memberName =
            loan.memberName
                ?.toLowerCase() || "";

        const memberCode =
            getMemberCode(
                loan.memberId
            ).toLowerCase();

        const displayedStatus =
            getDisplayedStatus(loan);

        return (
            bookTitle.includes(value) ||
            memberName.includes(value) ||
            memberCode.includes(value) ||
            displayedStatus.includes(value)
        );
    });

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleDateString();
    };

    const getStatusBadge = (loan) => {
        const status =
            getDisplayedStatus(loan);

        if (status === "returned") {
            return (
                <span className="badge bg-primary">
                    Returned
                </span>
            );
        }

        if (status === "overdue") {
            return (
                <span className="badge bg-danger">
                    Overdue
                </span>
            );
        }

        if (status === "borrowed") {
            return (
                <span className="badge bg-success">
                    Borrowed
                </span>
            );
        }

        return (
            <span className="badge bg-secondary">
                {loan.status || "Unknown"}
            </span>
        );
    };

    return (
        <div>
            <h2 className="mb-4">
                Loans
            </h2>

            {canManageLoans && (
                <div className="mb-3">
                    {!showLoanForm && (
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setShowLoanForm(true);
                                setError("");
                                setSuccess("");
                            }}
                        >
                            Borrow Book
                        </button>
                    )}
                </div>
            )}

            {showLoanForm &&
                canManageLoans && (
                    <LoanForm
                        onSuccess={
                            handleLoanCreated
                        }
                        onCancel={() =>
                            setShowLoanForm(false)
                        }
                    />
                )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by book, member ID, member name or status..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />
            </div>

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
                        Loading loans...
                    </p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Book</th>
                                <th>Member ID</th>
                                <th>Member Name</th>
                                <th>Borrowed</th>
                                <th>Due Date</th>
                                <th>Returned</th>
                                <th>Status</th>

                                {canManageLoans && (
                                    <th>
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLoans.length > 0 ? (
                                filteredLoans.map(
                                    (loan, index) => {
                                        const displayedStatus =
                                            getDisplayedStatus(
                                                loan
                                            );

                                        return (
                                            <tr
                                                key={
                                                    loan.loanId
                                                }
                                            >
                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    {
                                                        loan.bookTitle
                                                    }
                                                </td>

                                                <td>
                                                    {getMemberCode(
                                                        loan.memberId
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        loan.memberName
                                                    }
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        loan.borrowedDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        loan.dueDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        loan.returnedDate
                                                    )}
                                                </td>

                                                <td>
                                                    {getStatusBadge(
                                                        loan
                                                    )}
                                                </td>

                                                {canManageLoans && (
                                                    <td>
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {displayedStatus !==
                                                                "returned" && (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-success btn-sm"
                                                                            onClick={() =>
                                                                                handleReturn(
                                                                                    loan
                                                                                )
                                                                            }
                                                                        >
                                                                            Return
                                                                        </button>

                                                                        <button
                                                                            className="btn btn-warning btn-sm"
                                                                            onClick={() =>
                                                                                handleExtendDueDate(
                                                                                    loan
                                                                                )
                                                                            }
                                                                        >
                                                                            Extend
                                                                        </button>
                                                                    </>
                                                                )}

                                                            {displayedStatus ===
                                                                "returned" && (
                                                                    <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                loan
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    }
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={
                                            canManageLoans
                                                ? "9"
                                                : "8"
                                        }
                                        className="text-center"
                                    >
                                        No loans found.
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

export default Loans;