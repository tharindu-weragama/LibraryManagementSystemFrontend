import { useEffect, useState } from "react";
import {
    addBook,
    updateBook
} from "../services/bookService";
import {
    getCategories
} from "../services/categoryService";
import {
    getPublishers
} from "../services/publisherService";

function BookFormFields({
    onBookAdded,
    editingBook
}) {
    const [title, setTitle] =
        useState(
            editingBook?.title || ""
        );

    const [isbn, setIsbn] =
        useState(
            editingBook?.isbn || ""
        );

    const [author, setAuthor] =
        useState(
            editingBook?.author || ""
        );

    const [
        publishedYear,
        setPublishedYear
    ] = useState(
        editingBook?.publishedYear || ""
    );

    const [
        totalCopies,
        setTotalCopies
    ] = useState(
        editingBook?.totalCopies || ""
    );

    const [
        categoryId,
        setCategoryId
    ] = useState(
        editingBook?.categoryId || ""
    );

    const [
        publisherId,
        setPublisherId
    ] = useState(
        editingBook?.publisherId || ""
    );

    const [categories, setCategories] =
        useState([]);

    const [publishers, setPublishers] =
        useState([]);

    const [saving, setSaving] =
        useState(false);

    useEffect(() => {
        const loadFormData = async () => {
            try {
                const [
                    categoriesResponse,
                    publishersResponse
                ] = await Promise.all([
                    getCategories(),
                    getPublishers()
                ]);

                setCategories(
                    categoriesResponse.data || []
                );

                setPublishers(
                    publishersResponse.data || []
                );
            } catch (error) {
                console.error(
                    "Error loading book form data:",
                    error
                );
            }
        };

        loadFormData();
    }, []);

    const handleSave = async () => {
        if (
            !title.trim() ||
            !isbn.trim() ||
            !author.trim() ||
            !publishedYear ||
            !totalCopies ||
            !categoryId ||
            !publisherId
        ) {
            alert(
                "Please complete all book fields."
            );
            return;
        }

        const book = {
            title: title.trim(),
            isbn: isbn.trim(),
            author: author.trim(),
            publishedYear:
                Number(publishedYear),
            totalCopies:
                Number(totalCopies),
            categoryId:
                Number(categoryId),
            publisherId:
                Number(publisherId)
        };

        try {
            setSaving(true);

            if (editingBook) {
                await updateBook(
                    editingBook.bookId,
                    book
                );

                alert(
                    "Book updated successfully!"
                );
            } else {
                await addBook(book);

                alert(
                    "Book added successfully!"
                );
            }

            await onBookAdded();
        } catch (error) {
            console.error(
                "Error saving book:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save book."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card p-3 mb-3">

            <h4 className="mb-3">
                {editingBook
                    ? "Edit Book"
                    : "Add Book"}
            </h4>

            <input
                className="form-control mb-2"
                placeholder="Title"
                value={title}
                onChange={(e) =>
                    setTitle(
                        e.target.value
                    )
                }
            />

            <input
                className="form-control mb-2"
                placeholder="ISBN"
                value={isbn}
                onChange={(e) =>
                    setIsbn(
                        e.target.value
                    )
                }
            />

            <input
                className="form-control mb-2"
                placeholder="Author"
                value={author}
                onChange={(e) =>
                    setAuthor(
                        e.target.value
                    )
                }
            />

            <input
                type="number"
                className="form-control mb-2"
                placeholder="Published Year"
                value={publishedYear}
                onChange={(e) =>
                    setPublishedYear(
                        e.target.value
                    )
                }
            />

            <input
                type="number"
                className="form-control mb-2"
                placeholder="Total Copies"
                min="1"
                value={totalCopies}
                onChange={(e) =>
                    setTotalCopies(
                        e.target.value
                    )
                }
            />

            <select
                className="form-select mb-2"
                value={categoryId}
                onChange={(e) =>
                    setCategoryId(
                        e.target.value
                    )
                }
            >
                <option value="">
                    Select Category
                </option>

                {categories.map(
                    (category) => (
                        <option
                            key={
                                category.categoryId
                            }
                            value={
                                category.categoryId
                            }
                        >
                            {
                                category.categoryName
                            }
                        </option>
                    )
                )}
            </select>

            <select
                className="form-select mb-3"
                value={publisherId}
                onChange={(e) =>
                    setPublisherId(
                        e.target.value
                    )
                }
            >
                <option value="">
                    Select Publisher
                </option>

                {publishers.map(
                    (publisher) => (
                        <option
                            key={
                                publisher.publisherId
                            }
                            value={
                                publisher.publisherId
                            }
                        >
                            {
                                publisher.publisherName
                            }
                        </option>
                    )
                )}
            </select>

            <button
                type="button"
                className="btn btn-success"
                onClick={handleSave}
                disabled={saving}
            >
                {saving
                    ? "Saving..."
                    : editingBook
                        ? "Update Book"
                        : "Save Book"}
            </button>

        </div>
    );
}

function BookForm({
    onBookAdded,
    editingBook
}) {
    return (
        <BookFormFields
            key={
                editingBook?.bookId ||
                "new-book"
            }
            editingBook={
                editingBook
            }
            onBookAdded={
                onBookAdded
            }
        />
    );
}

export default BookForm;