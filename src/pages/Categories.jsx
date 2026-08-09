import { useEffect, useState } from "react";
import {
    getCategories,
    deleteCategory
} from "../services/categoryService";
import CategoryForm from "../components/CategoryForm";
import useRole from "../hooks/useRole";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { isAdmin, isLibrarian } = useRole();

    const canManageCategories =
        isAdmin || isLibrarian;

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getCategories();

            setCategories(response.data);
        } catch (error) {
            console.error(
                "Error loading categories:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteCategory(id);

            await loadCategories();
        } catch (error) {
            console.error(
                "Error deleting category:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete category."
            );
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">
                    Categories
                </h2>

                {canManageCategories && (
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingCategory(null);
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm
                            ? "Close"
                            : "Add Category"}
                    </button>
                )}
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {canManageCategories && showForm && (
                <CategoryForm
                    editingCategory={editingCategory}
                    onCategoryAdded={async () => {
                        await loadCategories();

                        setShowForm(false);
                        setEditingCategory(null);
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
                        Loading categories...
                    </p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Category Name</th>

                                {canManageCategories && (
                                    <th>Actions</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {categories.length > 0 ? (
                                categories.map(
                                    (category, index) => (
                                        <tr
                                            key={
                                                category.categoryId
                                            }
                                        >
                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                {
                                                    category.categoryName
                                                }
                                            </td>

                                            {canManageCategories && (
                                                <td>
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() => {
                                                            setEditingCategory(
                                                                category
                                                            );

                                                            setShowForm(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.categoryId
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={
                                            canManageCategories
                                                ? "3"
                                                : "2"
                                        }
                                        className="text-center"
                                    >
                                        No categories found.
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

export default Categories;