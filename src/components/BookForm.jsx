import { useState } from "react";
import { addBook } from "../services/bookService";

function BookForm() {
    const [title, setTitle] = useState("");
    const [isbn, setIsbn] = useState("");
    const [author, setAuthor] = useState("");
    const [publishedYear, setPublishedYear] = useState("");
    const [totalCopies, setTotalCopies] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [publisherId, setPublisherId] = useState("");

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
            await addBook(book);
            alert("Book added successfully!");
        } catch (error) {
            console.error("Error adding book:", error);
            alert("Failed to add book.");
        }
    };

    return (
        <div className="card p-3 mb-3">
            <h4>Add Book</h4>

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

            <input
                type="number"
                className="form-control mb-2"
                placeholder="Category ID"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            />

            <input
                type="number"
                className="form-control mb-3"
                placeholder="Publisher ID"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
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

export default BookForm;