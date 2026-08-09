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

    const canManageLoans = isAdmin || isLibrarian;

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [loansResponse, membersResponse] =
                await Promise.all([
                    getLoans(),
                    getMembersForLoan()
                ]);

            setLoans(loansResponse.data);
            setMembers(membersResponse.data);
        } catch (error) {
            console.error(error);

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
            (member) => member.userId === memberId
        );

        if (index === -1) {
            return "-";
        }

        return `M${String(index + 1).padStart(3, "0")}`;
    };

    const handleLoanCreated = async () => {
        setShowLoanForm(false);
        setSuccess("Book borrowed successfully.");
        await loadData();
    };

    const handleReturn = async (loan) => {
        if (!window.confirm("Return this book?")) {
            return;
        }

        try {
            await returnLoan(loan.loanId);

            setSuccess("Book returned successfully.");

            await loadData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to return book."
            );
        }
    };

    const handleExtendDueDate = async (loan) => {
        const current =
            loan.dueDate?.split("T")[0] || "";

        const newDate = window.prompt(
            "Enter new due date (YYYY-MM-DD)",
            current
        );

        if (!newDate) {
            return;
        }

        try {
            await updateLoan(
                loan.loanId,
                `${newDate}T00:00:00`
            );

            setSuccess("Due date updated.");

            await loadData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update due date."
            );
        }
    };

    const handleDelete = async (loan) => {
        if (!window.confirm("Delete this loan?")) {
            return;
        }

        try {
            await deleteLoan(loan.loanId);

            setSuccess("Loan deleted.");

            await loadData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete loan."
            );
        }
    };

    const filteredLoans = loans.filter((loan) => {
        const value = search.toLowerCase();

        return (
            loan.bookTitle?.toLowerCase().includes(value) ||
            loan.memberName?.toLowerCase().includes(value) ||
            getMemberCode(loan.memberId)
                .toLowerCase()
                .includes(value) ||
            loan.status?.toLowerCase().includes(value)
        );
    });

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString()
            : "-";

    const getStatusBadge = (loan) => {
        const status =
            loan.status?.toLowerCase();

        if (status === "returned")
            return (
                <span className="badge bg-primary">
                    Returned
                </span>
            );

        const due = new Date(loan.dueDate);

        if (
            status === "borrowed" &&
            due < new Date()
        ) {
            return (
                <span className="badge bg-danger">
                    Overdue
                </span>
            );
        }

        return (
            <span className="badge bg-success">
                Borrowed
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
                            onClick={() =>
                                setShowLoanForm(true)
                            }
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
                    className="form-control"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            {loading ? (
                <div className="text-center">
                    Loading...
                </div>
            ) : (
                <div className="table-responsive">

                    <table className="table table-bordered table-striped">

                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Book</th>
                                <th>Member ID</th>
                                <th>Member</th>
                                <th>Borrowed</th>
                                <th>Due</th>
                                <th>Returned</th>
                                <th>Status</th>

                                {canManageLoans && (
                                    <th>Actions</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>

                            {filteredLoans.map(
                                (
                                    loan,
                                    index
                                ) => (
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

                                                {loan.status?.toLowerCase() ===
                                                    "borrowed" && (
                                                    <>
                                                        <button
                                                            className="btn btn-success btn-sm me-1"
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

                                                {loan.status?.toLowerCase() ===
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

                                            </td>
                                        )}

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}

export default Loans;