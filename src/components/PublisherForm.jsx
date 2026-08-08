import { useEffect, useState } from "react";
import {
  addPublisher,
  updatePublisher,
} from "../services/publisherService";

function PublisherForm({ onPublisherAdded, editingPublisher }) {
  const [publisherName, setPublisherName] = useState("");

  useEffect(() => {
    if (editingPublisher) {
      setPublisherName(editingPublisher.publisherName || "");
    } else {
      setPublisherName("");
    }
  }, [editingPublisher]);

  const handleSave = async () => {
    const publisher = {
      publisherName,
    };

    try {
      if (editingPublisher) {
        await updatePublisher(
          editingPublisher.publisherId,
          publisher
        );

        alert("Publisher updated successfully!");
      } else {
        await addPublisher(publisher);

        alert("Publisher added successfully!");
      }

      onPublisherAdded();

    } catch (error) {
      console.error("Error saving publisher:", error);
      alert("Failed to save publisher.");
    }
  };

  return (
    <div className="card p-3 mb-3">

      <h4>
        {editingPublisher
          ? "Edit Publisher"
          : "Add Publisher"}
      </h4>

      <input
        className="form-control mb-3"
        placeholder="Publisher Name"
        value={publisherName}
        onChange={(e) =>
          setPublisherName(e.target.value)
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

export default PublisherForm;