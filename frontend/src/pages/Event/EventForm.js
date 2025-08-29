import React, { useState, useEffect } from "react";
import "./EventForm.css";

const EventForm = ({ onSubmit, event, onCancel }) => {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    _id: null
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        date: event.date ? event.date.substring(0, 10) : "",
        location: event.location || "",
        description: event.description || "",
        _id: event._id || null
      });
    } else {
      setForm({ title: "", date: "", location: "", description: "", _id: null });
      setPhotos([]);
    }
  }, [event]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setPhotos([...e.target.files]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      alert("Please fill in Title, Date, and Location.");
      return;
    }
    onSubmit(form, photos);
  };

  return (
    <form className="event-form glass-card" onSubmit={handleSubmit}>
      <h3 className="form-title">{form._id ? "Edit Event" : "Add Event"}</h3>

      <input
        className="input-field"
        type="text"
        name="title"
        placeholder="Event Title"
        value={form.title}
        onChange={handleChange}
      />
      <input
        className="input-field"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
      <input
        className="input-field"
        type="text"
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
      />
      <textarea
        className="input-field"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        className="input-field"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="form-buttons">
        <button className="save-button" type="submit">
          {form._id ? "Update Event" : "Add Event"}
        </button>
        {form._id && (
          <button
            type="button"
            onClick={onCancel}
            className="save-button cancel"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
