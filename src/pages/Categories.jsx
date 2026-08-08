import { useEffect, useState } from "react";
import {
    getCategories,
    deleteCategory
} from "../services/categoryService";
import CategoryForm from "../components/CategoryForm";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) return;

        try {
            await deleteCategory(id);
            alert("Category deleted successfully!");
            loadCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category.");
        }
    };

    return (
        <div>
            <h2>Categories</h2>

            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setEditingCategory(null);
                    setShowForm(!showForm);
                }}
            >
                Add Category
            </button>

            {showForm && (
                <CategoryForm
                    editingCategory={editingCategory}
                    onCategoryAdded={() => {
                        loadCategories();
                        setShowForm(false);
                        setEditingCategory(null);
                    }}
                />
            )}

            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((category, index) => (
                        <tr key={category.categoryId}>
                            <td>{index + 1}</td>
                            <td>{category.categoryName}</td>

                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => {
                                        setEditingCategory(category);
                                        setShowForm(true);
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                        handleDelete(category.categoryId)
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

export default Categories;