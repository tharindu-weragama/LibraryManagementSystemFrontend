import { useEffect, useState } from "react";
import { getMyFines } from "../services/fineService";
import { getMyLoans } from "../services/loanService";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

function MyFines() {
    const [fines, setFines] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                finesResponse,
                loansResponse
            ] = await Promise.all([
                getMyFines(),
                getMyLoans()
            ]);

            setFines(finesResponse.data || []);
            setLoans(loansResponse.data || []);
        } catch (error) {
            console.error(
                "Error loading member fines:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your fines."
            );
        } finally {
            setLoading(false);
        }
    };

    const getLoan = (loanId) => {
        return loans.find(
            (loan) => loan.loanId === loanId
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleDateString();
    };

    const getFineCode = (fineId) => {
        return `F${String(fineId).padStart(3, "0")}`;
    };

    const getLoanCode = (loanId) => {
        return `L${String(loanId).padStart(3, "0")}`;
    };

    const totalFineAmount = fines.reduce(
        (total, fine) =>
            total + Number(fine.amount || 0),
        0
    );

    const unpaidFines = fines.filter(
        (fine) => !fine.paidStatus
    );

    const unpaidAmount = unpaidFines.reduce(
        (total, fine) =>
            total + Number(fine.amount || 0),
        0
    );

    if (loading) {
        return (
            <LoadingSpinner message="Loading your fines..." />
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="mb-1">
                    My Fines
                </h2>

                <p className="text-muted mb-0">
                    View fines related to your borrowing history.
                </p>
            </div>

            <AlertMessage
                type="danger"
                message={error}
            />

            <div className="row g-3 mb-4">
                <div className="col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="text-muted mb-1">
                                Total Fines
                            </div>

                            <div className="fs-3 fw-bold">
                                {fines.length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="text-muted mb-1">
                                Unpaid Fines
                            </div>

                            <div className="fs-3 fw-bold">
                                {unpaidFines.length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="text-muted mb-1">
                                Total Amount
                            </div>

                            <div className="fs-3 fw-bold">
                                {totalFineAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <div className="text-muted mb-1">
                                Amount Due
                            </div>

                            <div className="fs-3 fw-bold">
                                {unpaidAmount.toFixed(2)}
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
                                        Fine ID
                                    </th>

                                    <th className="px-4 py-3">
                                        Loan ID
                                    </th>

                                    <th className="px-4 py-3">
                                        Book
                                    </th>

                                    <th className="px-4 py-3 text-end">
                                        Amount
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Status
                                    </th>

                                    <th className="px-4 py-3">
                                        Paid Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {fines.length > 0 ? (
                                    fines.map(
                                        (fine, index) => {
                                            const loan =
                                                getLoan(
                                                    fine.loanId
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        fine.fineId
                                                    }
                                                >
                                                    <td className="px-4 py-4">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {getFineCode(
                                                            fine.fineId
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {getLoanCode(
                                                            fine.loanId
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4 fw-semibold">
                                                        {loan?.bookTitle ||
                                                            "-"}
                                                    </td>

                                                    <td className="px-4 py-4 text-end">
                                                        {Number(
                                                            fine.amount
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td className="px-4 py-4 text-center">
                                                        {fine.paidStatus ? (
                                                            <span className="badge bg-success px-3 py-2">
                                                                Paid
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-danger px-3 py-2">
                                                                Unpaid
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        {formatDate(
                                                            fine.paidDate
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-5 text-muted"
                                        >
                                            You do not have any fines.
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

export default MyFines;