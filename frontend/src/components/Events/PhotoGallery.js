import React from 'react';

const PhotoGallery = ({ photos }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
    {photos && photos.length > 0 ? (
      photos.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Event photo ${index + 1}`}
          style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 8 }}
        />
      ))
    ) : (
      <p>No photos uploaded for this event.</p>
    )}
  </div>
);

export default PhotoGallery;
