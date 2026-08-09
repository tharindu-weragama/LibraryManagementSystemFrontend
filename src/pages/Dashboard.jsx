import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getBooks } from "../services/bookService";
import { getUsers } from "../services/userService";
import { getLoans } from "../services/loanService";
import { getFines } from "../services/fineService";

import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

import "../App.css";

function Dashboard() {
    const [stats, setStats] = useState({
        books: 0,
        users: 0,
        loans: 0,
        fines: 0,
        availableCopies: 0,
        activeLoans: 0,
        overdueLoans: 0,
        unpaidFines: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const getDisplayedLoanStatus = (loan) => {
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

            if (dueDate < new Date()) {
                return "overdue";
            }
        }

        if (status === "borrowed") {
            return "borrowed";
        }

        return status;
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                booksResponse,
                usersResponse,
                loansResponse,
                finesResponse
            ] = await Promise.all([
                getBooks(),
                getUsers(),
                getLoans(),
                getFines()
            ]);

            const books =
                booksResponse.data || [];

            const users =
                usersResponse.data || [];

            const loans =
                loansResponse.data || [];

            const fines =
                finesResponse.data || [];

            const availableCopies =
                books.reduce(
                    (total, book) =>
                        total +
                        Number(
                            book.availableCopies || 0
                        ),
                    0
                );

            const activeLoans =
                loans.filter((loan) => {
                    const status =
                        getDisplayedLoanStatus(
                            loan
                        );

                    return (
                        status === "borrowed" ||
                        status === "overdue"
                    );
                }).length;

            const overdueLoans =
                loans.filter(
                    (loan) =>
                        getDisplayedLoanStatus(
                            loan
                        ) === "overdue"
                ).length;

            const unpaidFines =
                fines.filter(
                    (fine) =>
                        !fine.paidStatus
                ).length;

            setStats({
                books: books.length,
                users: users.length,
                loans: loans.length,
                fines: fines.length,
                availableCopies,
                activeLoans,
                overdueLoans,
                unpaidFines
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

    const topCards = [
        {
            title: "Books",
            value: stats.books,
            subtitle:
                `${stats.availableCopies} copies available`,
            action: "View Books →",
            link: "/books"
        },
        {
            title: "Users",
            value: stats.users,
            subtitle:
                "Registered accounts",
            action: "View Users →",
            link: "/users"
        },
        {
            title: "Active Loans",
            value: stats.activeLoans,
            subtitle:
                `${stats.overdueLoans} overdue`,
            action: "View Active Loans →",
            link: "/loans?status=active"
        },
        {
            title: "Fines",
            value: stats.fines,
            subtitle:
                `${stats.unpaidFines} unpaid`,
            action: "View Unpaid Fines →",
            link: "/fines?status=unpaid"
        }
    ];

    const bottomCards = [
        {
            title: "Total Loan Records",
            value: stats.loans,
            subtitle: "",
            action: "View All Loans →",
            link: "/loans"
        },
        {
            title: "Overdue Loans",
            value: stats.overdueLoans,
            subtitle: "",
            action: "View Overdue Loans →",
            link: "/loans?status=overdue"
        },
        {
            title: "Available Copies",
            value: stats.availableCopies,
            subtitle: "",
            action: "Browse Books →",
            link: "/books"
        }
    ];

    const DashboardCard = ({ card }) => {
        return (
            <Link
                to={card.link}
                className="text-dark h-100 d-block"
            >
                <div className="card dashboard-card shadow-sm h-100">

                    <div className="card-body text-center p-4 d-flex flex-column">

                        <h5 className="dashboard-card-title">
                            {card.title}
                        </h5>

                        <div className="dashboard-card-value my-4">
                            {card.value}
                        </div>

                        <div className="dashboard-card-subtitle">
                            {card.subtitle}
                        </div>

                        <div className="dashboard-card-action text-primary mt-auto pt-3">
                            {card.action}
                        </div>

                    </div>

                </div>
            </Link>
        );
    };

    if (loading) {
        return (
            <LoadingSpinner message="Loading dashboard..." />
        );
    }

    return (
        <div>

            <div className="mb-4">
                <h2 className="mb-1">
                    Dashboard
                </h2>

                <p className="text-muted mb-0">
                    Overview of the current library status.
                </p>
            </div>

            <AlertMessage
                type="danger"
                message={error}
            />

            <div className="row g-4">

                {topCards.map((card) => (
                    <div
                        className="col-sm-6 col-lg-3"
                        key={card.title}
                    >
                        <DashboardCard
                            card={card}
                        />
                    </div>
                ))}

            </div>

            <div className="row g-4 mt-1">

                {bottomCards.map((card) => (
                    <div
                        className="col-md-4"
                        key={card.title}
                    >
                        <DashboardCard
                            card={card}
                        />
                    </div>
                ))}

            </div>

        </div>
    );
}

export default Dashboard;