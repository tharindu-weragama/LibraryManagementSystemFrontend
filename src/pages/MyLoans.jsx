import { useEffect, useState } from "react";
import { getMyLoans } from "../services/loanService";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

function MyLoans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadMyLoans();
    }, []);

    const loadMyLoans = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyLoans();

            setLoans(response.data || []);
        } catch (error) {
            console.error(
                "Error loading member loans:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your loan history."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleDateString();
    };

    const getDisplayedStatus = (loan) => {
        const status =
            loan.status?.toLowerCase() || "";

        if (status === "returned") {
            return "returned";
        }

        if (
            status === "borrowed" &&
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

        if (status === "borrowed") {
            return "borrowed";
        }

        return status;
    };

    const getStatusBadge = (loan) => {
        const status =
            getDisplayedStatus(loan);

        if (status === "returned") {
            return (
                <span className="badge bg-primary px-3 py-2">
                    Returned
                </span>
            );
        }

        if (status === "overdue") {
            return (
                <span className="badge bg-danger px-3 py-2">
                    Overdue
                </span>
            );
        }

        if (status === "borrowed") {
            return (
                <span className="badge bg-success px-3 py-2">
                    Borrowed
                </span>
            );
        }

        return (
            <span className="badge bg-secondary px-3 py-2">
                {loan.status || "Unknown"}
            </span>
        );
    };

    const activeLoans = loans.filter(
        (loan) =>
            getDisplayedStatus(loan) !== "returned"
    ).length;

    const overdueLoans = loans.filter(
        (loan) =>
            getDisplayedStatus(loan) === "overdue"
    ).length;

    if (loading) {
        return (
            <LoadingSpinner message="Loading your loans..." />
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="mb-1">
                    My Loans
                </h2>

                <p className="text-muted mb-0">
                    View your current and previous borrowing records.
                </p>
            </div>

            <AlertMessage
                type="danger"
                message={error}
            />

            <div className="row g-3 mb-4">
                <div className="col-sm-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="text-muted mb-1">
                                Total Loans
                            </div>

                            <div className="fs-3 fw-bold">
                                {loans.length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="text-muted mb-1">
                                Current Loans
                            </div>

                            <div className="fs-3 fw-bold">
                                {activeLoans}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="text-muted mb-1">
                                Overdue
                            </div>

                            <div className="fs-3 fw-bold">
                                {overdueLoans}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                        Book
                                    </th>

                                    <th className="px-4 py-3">
                                        Borrowed Date
                                    </th>

                                    <th className="px-4 py-3">
                                        Due Date
                                    </th>

                                    <th className="px-4 py-3">
                                        Returned Date
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loans.length > 0 ? (
                                    loans.map(
                                        (loan, index) => (
                                            <tr
                                                key={loan.loanId}
                                            >
                                                <td className="px-4 py-4">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-4 fw-semibold">
                                                    {loan.bookTitle}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {formatDate(
                                                        loan.borrowedDate
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {formatDate(
                                                        loan.dueDate
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {formatDate(
                                                        loan.returnedDate
                                                    )}
                                                </td>

                                                <td className="px-4 py-4 text-center">
                                                    {getStatusBadge(
                                                        loan
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-5 text-muted"
                                        >
                                            You do not have any loan records yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyLoans;