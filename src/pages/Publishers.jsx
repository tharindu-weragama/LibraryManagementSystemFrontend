import { useEffect, useState } from "react";
import {
    getPublishers,
    deletePublisher,
} from "../services/publisherService";
import PublisherForm from "../components/PublisherForm";

function Publishers() {
    const [publishers, setPublishers] = useState([]);
    const [editingPublisher, setEditingPublisher] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadPublishers();
    }, []);

    const loadPublishers = async () => {
        try {
            const response = await getPublishers();
            setPublishers(response.data);
        } catch (error) {
            console.error("Error loading publishers:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this publisher?"
        );

        if (!confirmed) return;

        try {
            await deletePublisher(id);
            alert("Publisher deleted successfully!");
            loadPublishers();
        } catch (error) {
            console.error("Error deleting publisher:", error);
            alert("Failed to delete publisher.");
        }
    };

    return (
        <div>

            <h2>Publishers</h2>

            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setEditingPublisher(null);
                    setShowForm(!showForm);
                }}
            >
                Add Publisher
            </button>

            {showForm && (
                <PublisherForm
                    editingPublisher={editingPublisher}
                    onPublisherAdded={() => {
                        loadPublishers();
                        setShowForm(false);
                        setEditingPublisher(null);
                    }}
                />
            )}

            <table className="table table-bordered table-striped">

                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Publisher Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {publishers.map((publisher, index) => (

                        <tr key={publisher.publisherId}>

                            <td>{index + 1}</td>

                            <td>{publisher.publisherName}</td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => {
                                        setEditingPublisher(publisher);
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

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Publishers;