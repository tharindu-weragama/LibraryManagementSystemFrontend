import { useState, useEffect } from "react";
import {
    addCategory,
    updateCategory
} from "../services/categoryService";

function CategoryForm({ onCategoryAdded, editingCategory }) {

    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        if (editingCategory) {
            setCategoryName(editingCategory.categoryName || "");
        } else {
            setCategoryName("");
        }
    }, [editingCategory]);

    const handleSave = async () => {

        const category = {
            categoryName
        };

        try {

            if (editingCategory) {

                await updateCategory(
                    editingCategory.categoryId,
                    category
                );

                alert("Category updated successfully!");

            } else {

                await addCategory(category);

                alert("Category added successfully!");

            }

            onCategoryAdded();

        } catch (error) {

            console.error(error);

            alert("Failed to save category.");
        }
    };

    return (
        <div className="card p-3 mb-3">

            <h4>
                {editingCategory ? "Edit Category" : "Add Category"}
            </h4>

            <input
                className="form-control mb-3"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) =>
                    setCategoryName(e.target.value)
                }
            />

            <button
                className="btn btn-success"
                onClick={handleSave}
            >
                Save
            </button>

        </div>
    );
}

export default CategoryForm;