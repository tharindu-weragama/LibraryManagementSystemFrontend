import { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import { getUsers } from "../services/userService";
import { getLoans } from "../services/loanService";
import { getFines } from "../services/fineService";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";
import StatCard from "../components/StatCard";

function Dashboard() {
    const [stats, setStats] = useState({
        books: 0,
        users: 0,
        loans: 0,
        fines: 0,
        availableCopies: 0,
        activeLoans: 0,
        overdueLoans: 0,
        unpaidFines: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                booksResponse,
                usersResponse,
                loansResponse,
                finesResponse,
            ] = await Promise.all([
                getBooks(),
                getUsers(),
                getLoans(),
                getFines(),
            ]);

            const books = booksResponse.data || [];
            const users = usersResponse.data || [];
            const loans = loansResponse.data || [];
            const fines = finesResponse.data || [];

            const availableCopies = books.reduce(
                (total, book) =>
                    total + (book.availableCopies || 0),
                0
            );

            const activeLoans = loans.filter((loan) => {
                const status =
                    loan.status?.toLowerCase();

                return (
                    status === "borrowed" ||
                    status === "overdue"
                );
            }).length;

            const overdueLoans = loans.filter(
                (loan) =>
                    loan.status?.toLowerCase() === "overdue"
            ).length;

            const unpaidFines = fines.filter(
                (fine) => !fine.paidStatus
            ).length;

            setStats({
                books: books.length,
                users: users.length,
                loans: loans.length,
                fines: fines.length,
                availableCopies,
                activeLoans,
                overdueLoans,
                unpaidFines,
            });
        } catch (error) {
            console.error(
                "Error loading dashboard:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard information."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <LoadingSpinner message="Loading dashboard..." />
        );
    }

    return (
        <div>
            <h2 className="mb-4">
                Dashboard
            </h2>

            <AlertMessage
                type="danger"
                message={error}
            />

            <div className="row g-4">
                <div className="col-sm-6 col-lg-3">
                    <StatCard
                        title="Books"
                        value={stats.books}
                        subtitle={`${stats.availableCopies} copies available`}
                    />
                </div>

                <div className="col-sm-6 col-lg-3">
                    <StatCard
                        title="Users"
                        value={stats.users}
                        subtitle="Registered accounts"
                    />
                </div>

                <div className="col-sm-6 col-lg-3">
                    <StatCard
                        title="Active Loans"
                        value={stats.activeLoans}
                        subtitle={`${stats.overdueLoans} overdue`}
                    />
                </div>

                <div className="col-sm-6 col-lg-3">
                    <StatCard
                        title="Fines"
                        value={stats.fines}
                        subtitle={`${stats.unpaidFines} unpaid`}
                    />
                </div>
            </div>

            <div className="row g-4 mt-1">
                <div className="col-md-4">
                    <StatCard
                        title="Total Loan Records"
                        value={stats.loans}
                    />
                </div>

                <div className="col-md-4">
                    <StatCard
                        title="Overdue Loans"
                        value={stats.overdueLoans}
                    />
                </div>

                <div className="col-md-4">
                    <StatCard
                        title="Available Copies"
                        value={stats.availableCopies}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;