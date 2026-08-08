import { addBook, updateBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { getPublishers } from "../services/publisherService";
import { useEffect, useState } from "react";

function BookForm({ onBookAdded, editingBook }) {
    const [title, setTitle] = useState("");
    const [isbn, setIsbn] = useState("");
    const [author, setAuthor] = useState("");
    const [publishedYear, setPublishedYear] = useState("");
    const [totalCopies, setTotalCopies] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [publisherId, setPublisherId] = useState("");

    const [categories, setCategories] = useState([]);
    const [publishers, setPublishers] = useState([]);

    useEffect(() => {
        loadCategories();
        loadPublishers();
    }, []);

    useEffect(() => {
        if (editingBook) {
            setTitle(editingBook.title || "");
            setIsbn(editingBook.isbn || "");
            setAuthor(editingBook.author || "");
            setPublishedYear(editingBook.publishedYear || "");
            setTotalCopies(editingBook.totalCopies || "");
            setCategoryId(editingBook.categoryId || "");
            setPublisherId(editingBook.publisherId || "");
        } else {
            setTitle("");
            setIsbn("");
            setAuthor("");
            setPublishedYear("");
            setTotalCopies("");
            setCategoryId("");
            setPublisherId("");
        }
    }, [editingBook]);

    const loadCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const loadPublishers = async () => {
        try {
            const response = await getPublishers();
            setPublishers(response.data);
        } catch (error) {
            console.error("Error loading publishers:", error);
        }
    };

    const handleSave = async () => {
        const book = {
            title,
            isbn,
            author,
            publishedYear: Number(publishedYear),
            totalCopies: Number(totalCopies),
            categoryId: Number(categoryId),
            publisherId: Number(publisherId),
        };

        try {
            if (editingBook) {
                await updateBook(editingBook.bookId, book);
                alert("Book updated successfully!");
            } else {
                await addBook(book);
                alert("Book added successfully!");
            }

            onBookAdded();
        } catch (error) {
            console.error("Error saving book:", error);
            alert("Failed to save book.");
        }
    };

    return (
        <div className="card p-3 mb-3">
            <h4>{editingBook ? "Edit Book" : "Add Book"}</h4>

            <input
                className="form-control mb-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                className="form-control mb-2"
                placeholder="ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
            />

            <input
                className="form-control mb-2"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />

            <input
                type="number"
                className="form-control mb-2"
                placeholder="Published Year"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
            />

            <input
                type="number"
                className="form-control mb-2"
                placeholder="Total Copies"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
            />

            <select
                className="form-select mb-2"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            >
                <option value="">Select Category</option>

                {categories.map((category) => (
                    <option
                        key={category.categoryId}
                        value={category.categoryId}
                    >
                        {category.categoryName}
                    </option>
                ))}
            </select>

            <select
                className="form-select mb-3"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
            >
                <option value="">Select Publisher</option>

                {publishers.map((publisher) => (
                    <option
                        key={publisher.publisherId}
                        value={publisher.publisherId}
                    >
                        {publisher.publisherName}
                    </option>
                ))}
            </select>

            <button
                className="btn btn-success"
                onClick={handleSave}
            >
                Save
            </button>
        </div>
    );
}

export default BookForm;