import React, { useState } from "react";

const EventList = ({ events, onDelete, onEdit }) => {
  const [lightbox, setLightbox] = useState({ photo: null, index: null, photos: [] });
  if (!events.length) return <p className="empty-text">No events available.</p>;

  const openLightbox = (photos, index) => setLightbox({ photo: photos[index], index, photos });
  const closeLightbox = () => setLightbox({ photo: null, index: null, photos: [] });

  const prevPhoto = e => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length, photo: prev.photos[(prev.index - 1 + prev.photos.length) % prev.photos.length] })); };
  const nextPhoto = e => { e.stopPropagation(); setLightbox(prev => ({ ...prev, index: (prev.index + 1) % prev.photos.length, photo: prev.photos[(prev.index + 1) % prev.photos.length] })); };

  return (
    <>
      <div className="event-list">
        {events.map(e => (
          <div key={e._id} className="event-card">
            <h3>{e.title}</h3>
            <p><b>Date:</b> {new Date(e.date).toLocaleDateString()}</p>
            <p><b>Location:</b> {e.location}</p>
            <p><b>Description:</b> {e.description || "-"}</p>

            {e.photos?.length > 0 && (
              <div className="photo-grid">
                {e.photos.map((url, idx) => (
                  <img key={idx} src={url} alt={`Event ${idx}`} onClick={() => openLightbox(e.photos, idx)} />
                ))}
              </div>
            )}

            <div className="event-buttons">
              <button className="save-button" onClick={() => onEdit(e)}>Edit</button>
              <button className="save-button delete" onClick={() => onDelete(e._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {lightbox.photo && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-btn close" onClick={e => { e.stopPropagation(); closeLightbox(); }}>✕</button>
          {lightbox.photos.length > 1 && <button className="lightbox-btn left" onClick={prevPhoto}>‹</button>}
          <img className="lightbox-img" src={lightbox.photo} alt="Event Zoomed" onClick={e => e.stopPropagation()} />
          {lightbox.photos.length > 1 && <button className="lightbox-btn right" onClick={nextPhoto}>›</button>}
        </div>
      )}
    </>
  );
};

export default EventList;
