import React, { useState } from "react";

const EventList = ({ events, onDelete, onEdit }) => {
  const [lightbox, setLightbox] = useState({ photo: null, index: null, photos: [] });

  if (!events.length) return <p>No events available.</p>;

  const openLightbox = (photos, index) => setLightbox({ photo: photos[index], index, photos });
  const closeLightbox = () => setLightbox({ photo: null, index: null, photos: [] });

  const prevPhoto = (e) => {
    e.stopPropagation();
    setLightbox(prev => {
      const newIndex = (prev.index - 1 + prev.photos.length) % prev.photos.length;
      return { ...prev, index: newIndex, photo: prev.photos[newIndex] };
    });
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setLightbox(prev => {
      const newIndex = (prev.index + 1) % prev.photos.length;
      return { ...prev, index: newIndex, photo: prev.photos[newIndex] };
    });
  };

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
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                {e.photos.map((url, idx) => (
                  <img key={idx} src={url} alt="" style={{ width: "100px", height: "80px", objectFit: "cover", borderRadius: "6px" }} onClick={() => openLightbox(e.photos, idx)} />
                ))}
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => onEdit(e)} className="save-button" style={{ marginRight: "5px" }}>Edit</button>
              <button onClick={() => onDelete(e._id)} className="save-button" style={{ background: "#ef5350" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {lightbox.photo && (
        <div onClick={closeLightbox} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="lightbox-btn close">✕</button>
          {lightbox.photos.length > 1 && <button onClick={prevPhoto} className="lightbox-btn left">‹</button>}
          <img src={lightbox.photo} alt="" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px" }} onClick={(e) => e.stopPropagation()} />
          {lightbox.photos.length > 1 && <button onClick={nextPhoto} className="lightbox-btn right">›</button>}
        </div>
      )}
    </>
  );
};

export default EventList;
