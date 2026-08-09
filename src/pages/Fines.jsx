import { useEffect, useState } from "react";

import {
    getFines,
    calculateFine,
    payFine,
    deleteFine
} from "../services/fineService";

import {
    getLoans,
    getMembersForLoan
} from "../services/loanService";

import useRole from "../hooks/useRole";

function Fines() {
    const [fines, setFines] = useState([]);
    const [loans, setLoans] = useState([]);
    const [members, setMembers] = useState([]);

    const [selectedLoanId, setSelectedLoanId] = useState("");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { isAdmin, isLibrarian } = useRole();

    const canManageFines =
        isAdmin || isLibrarian;

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                finesResponse,
                loansResponse,
                membersResponse
            ] = await Promise.all([
                getFines(),
                getLoans(),
                getMembersForLoan()
            ]);

            setFines(finesResponse.data);
            setLoans(loansResponse.data);
            setMembers(membersResponse.data);
        } catch (error) {
            console.error(
                "Error loading fines:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load fines."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getLoan = (loanId) => {
        return loans.find(
            (loan) => loan.loanId === loanId
        );
    };

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

    const getFineCode = (fineId) => {
        return `F${String(fineId).padStart(3, "0")}`;
    };

    const getLoanCode = (loanId) => {
        return `L${String(loanId).padStart(3, "0")}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString();
    };

    const isLateLoan = (loan) => {
        if (!loan.dueDate) {
            return false;
        }

        const dueDate =
            new Date(loan.dueDate);

        if (loan.returnedDate) {
            return (
                new Date(loan.returnedDate) >
                dueDate
            );
        }

        return new Date() > dueDate;
    };

    const fineLoanIds = new Set(
        fines.map((fine) => fine.loanId)
    );

    const eligibleLoans = loans.filter(
        (loan) =>
            isLateLoan(loan) &&
            !fineLoanIds.has(loan.loanId)
    );

    const handleCalculateFine = async (e) => {
        e.preventDefault();

        if (!selectedLoanId) {
            setError(
                "Please select an overdue loan."
            );

            return;
        }

        try {
            setCalculating(true);
            setError("");
            setSuccess("");

            await calculateFine(
                Number(selectedLoanId)
            );

            setSuccess(
                "Fine calculated successfully."
            );

            setSelectedLoanId("");

            await loadData();
        } catch (error) {
            console.error(
                "Error calculating fine:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to calculate fine."
            );
        } finally {
            setCalculating(false);
        }
    };

    const handlePayFine = async (fine) => {
        const loan =
            getLoan(fine.loanId);

        const confirmed = window.confirm(
            `Mark ${getFineCode(
                fine.fineId
            )} as paid for ${
                loan?.memberName ||
                "this member"
            }?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await payFine(
                fine.fineId
            );

            setSuccess(
                "Fine marked as paid successfully."
            );

            await loadData();
        } catch (error) {
            console.error(
                "Error paying fine:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to mark fine as paid."
            );
        }
    };

    const handleDeleteFine = async (fine) => {
        const confirmed = window.confirm(
            `Delete ${getFineCode(
                fine.fineId
            )}? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await deleteFine(
                fine.fineId
            );

            setSuccess(
                "Fine deleted successfully."
            );

            await loadData();
        } catch (error) {
            console.error(
                "Error deleting fine:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete fine."
            );
        }
    };

    const filteredFines =
        fines.filter((fine) => {
            const value =
                search
                    .toLowerCase()
                    .trim();

            if (!value) {
                return true;
            }

            const loan =
                getLoan(fine.loanId);

            const fineCode =
                getFineCode(
                    fine.fineId
                ).toLowerCase();

            const loanCode =
                getLoanCode(
                    fine.loanId
                ).toLowerCase();

            const bookTitle =
                loan?.bookTitle
                    ?.toLowerCase() || "";

            const memberName =
                loan?.memberName
                    ?.toLowerCase() || "";

            const memberCode =
                getMemberCode(
                    loan?.memberId
                ).toLowerCase();

            const status =
                fine.paidStatus
                    ? "paid"
                    : "unpaid";

            return (
                fineCode.includes(value) ||
                loanCode.includes(value) ||
                bookTitle.includes(value) ||
                memberName.includes(value) ||
                memberCode.includes(value) ||
                status.includes(value)
            );
        });

    return (
        <div>
            <h2 className="mb-4">
                Fines
            </h2>

            {canManageFines && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">
                            Calculate Fine
                        </h5>
                    </div>

                    <div className="card-body">
                        <form
                            onSubmit={
                                handleCalculateFine
                            }
                        >
                            <div className="mb-3">
                                <label
                                    htmlFor="loanId"
                                    className="form-label"
                                >
                                    Overdue Loan
                                </label>

                                <select
                                    id="loanId"
                                    className="form-select"
                                    value={
                                        selectedLoanId
                                    }
                                    onChange={(e) =>
                                        setSelectedLoanId(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select overdue loan
                                    </option>

                                    {eligibleLoans.map(
                                        (loan) => (
                                            <option
                                                key={
                                                    loan.loanId
                                                }
                                                value={
                                                    loan.loanId
                                                }
                                            >
                                                {getLoanCode(
                                                    loan.loanId
                                                )}{" "}
                                                -{" "}
                                                {getMemberCode(
                                                    loan.memberId
                                                )}{" "}
                                                -{" "}
                                                {
                                                    loan.memberName
                                                }{" "}
                                                -{" "}
                                                {
                                                    loan.bookTitle
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                {eligibleLoans.length ===
                                    0 && (
                                    <small className="text-muted">
                                        No overdue loans currently require a fine calculation.
                                    </small>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    calculating ||
                                    eligibleLoans.length ===
                                        0
                                }
                            >
                                {calculating
                                    ? "Calculating..."
                                    : "Calculate Fine"}
                            </button>
                        </form>
                    </div>
                </div>
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
                    placeholder="Search by fine ID, loan ID, member, book or status..."
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
                        Loading fines...
                    </p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Fine ID</th>
                                <th>Loan ID</th>
                                <th>Member ID</th>
                                <th>Member Name</th>
                                <th>Book</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Paid Date</th>

                                {canManageFines && (
                                    <th>
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredFines.length >
                            0 ? (
                                filteredFines.map(
                                    (
                                        fine,
                                        index
                                    ) => {
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
                                                <td>
                                                    {index +
                                                        1}
                                                </td>

                                                <td>
                                                    {getFineCode(
                                                        fine.fineId
                                                    )}
                                                </td>

                                                <td>
                                                    {getLoanCode(
                                                        fine.loanId
                                                    )}
                                                </td>

                                                <td>
                                                    {getMemberCode(
                                                        loan?.memberId
                                                    )}
                                                </td>

                                                <td>
                                                    {loan?.memberName ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {loan?.bookTitle ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {Number(
                                                        fine.amount
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                                <td>
                                                    {fine.paidStatus ? (
                                                        <span className="badge bg-success">
                                                            Paid
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-danger">
                                                            Unpaid
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        fine.paidDate
                                                    )}
                                                </td>

                                                {canManageFines && (
                                                    <td>
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {!fine.paidStatus && (
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() =>
                                                                        handlePayFine(
                                                                            fine
                                                                        )
                                                                    }
                                                                >
                                                                    Pay
                                                                </button>
                                                            )}

                                                            {fine.paidStatus && (
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleDeleteFine(
                                                                            fine
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
                                            canManageFines
                                                ? "10"
                                                : "9"
                                        }
                                        className="text-center"
                                    >
                                        No fines found.
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

export default Fines;