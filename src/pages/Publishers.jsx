import { useEffect, useState } from "react";
import {
    getPublishers,
    deletePublisher,
} from "../services/publisherService";
import PublisherForm from "../components/PublisherForm";
import useRole from "../hooks/useRole";

function Publishers() {
    const [publishers, setPublishers] = useState([]);
    const [editingPublisher, setEditingPublisher] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { isAdmin, isLibrarian } = useRole();

    const canManagePublishers =
        isAdmin || isLibrarian;

    useEffect(() => {
        loadPublishers();
    }, []);

    const loadPublishers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPublishers();

            setPublishers(response.data);
        } catch (error) {
            console.error(
                "Error loading publishers:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load publishers."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this publisher?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deletePublisher(id);

            await loadPublishers();
        } catch (error) {
            console.error(
                "Error deleting publisher:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete publisher."
            );
        }
    };

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h2 className="mb-0">
                    Publishers
                </h2>

                {canManagePublishers && (
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingPublisher(null);
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm
                            ? "Close"
                            : "Add Publisher"}
                    </button>
                )}

            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {canManagePublishers && showForm && (
                <PublisherForm
                    editingPublisher={editingPublisher}
                    onPublisherAdded={async () => {
                        await loadPublishers();

                        setShowForm(false);
                        setEditingPublisher(null);
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
                        Loading publishers...
                    </p>

                </div>

            ) : (

                <div className="table-responsive">

                    <table className="table table-bordered table-striped table-hover align-middle">

                        <thead>
                            <tr>

                                <th style={{ width: "80px" }}>
                                    No.
                                </th>

                                <th>
                                    Publisher Name
                                </th>

                                {canManagePublishers && (
                                    <th
                                        className="text-center"
                                        style={{ width: "180px" }}
                                    >
                                        Actions
                                    </th>
                                )}

                            </tr>
                        </thead>

                        <tbody>

                            {publishers.length > 0 ? (

                                publishers.map(
                                    (publisher, index) => (

                                        <tr
                                            key={publisher.publisherId}
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                {publisher.publisherName}
                                            </td>

                                            {canManagePublishers && (

                                                <td>

                                                    <div className="d-flex justify-content-center gap-2">

                                                        <button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => {
                                                                setEditingPublisher(
                                                                    publisher
                                                                );
                                                                setShowForm(true);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    publisher.publisherId
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
                                            canManagePublishers
                                                ? "3"
                                                : "2"
                                        }
                                        className="text-center"
                                    >
                                        No publishers found.
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

export default Publishers;