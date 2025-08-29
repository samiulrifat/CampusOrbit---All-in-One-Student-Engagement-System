// src/components/EventList.js

import React, { useState } from "react";
import "./EventList.css";

const EventList = ({ events, onDelete, onEdit }) => {
  const [lightbox, setLightbox] = useState({
    photos: [],
    index: 0,
    photo: null,
  });

  const openLightbox = (photos, idx) => {
    setLightbox({ photos, index: idx, photo: photos[idx] });
  };

  const closeLightbox = () => {
    setLightbox({ photos: [], index: 0, photo: null });
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setLightbox(({ photos, index }) => {
      const newIndex = (index - 1 + photos.length) % photos.length;
      return { photos, index: newIndex, photo: photos[newIndex] };
    });
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setLightbox(({ photos, index }) => {
      const newIndex = (index + 1) % photos.length;
      return { photos, index: newIndex, photo: photos[newIndex] };
    });
  };

  if (!events.length) {
    return <p className="empty-text">No events available.</p>;
  }

  return (
    <>
      <div className="event-list">
        {events.map((evt) => (
          <div key={evt._id} className="event-card">
            <h3>{evt.title}</h3>
            <p>
              <b>Date:</b> {new Date(evt.date).toLocaleDateString()}
            </p>
            <p>
              <b>Location:</b> {evt.location}
            </p>
            <p>
              <b>Description:</b> {evt.description || "-"}
            </p>

            {Array.isArray(evt.photos) && evt.photos.length > 0 && (
              <div className="photo-grid">
                {evt.photos.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={evt.title}
                    onClick={() => openLightbox(evt.photos, idx)}
                  />
                ))}
              </div>
            )}

            <div className="event-buttons">
              <button
                className="save-button"
                onClick={() => onEdit(evt)}
              >
                Edit
              </button>
              <button
                className="save-button delete"
                onClick={() => onDelete(evt._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {lightbox.photo && (
        <div className="lightbox" onClick={closeLightbox}>
          <button
            className="lightbox-btn close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
          >
            ✕
          </button>

          {lightbox.photos.length > 1 && (
            <button className="lightbox-btn left" onClick={prevPhoto}>
              ‹
            </button>
          )}

          <img
            className="lightbox-img"
            src={lightbox.photo}
            alt={`Slide ${lightbox.index + 1} of ${lightbox.photos.length}`}
            onClick={(e) => e.stopPropagation()}
          />

          {lightbox.photos.length > 1 && (
            <button className="lightbox-btn right" onClick={nextPhoto}>
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default EventList;
