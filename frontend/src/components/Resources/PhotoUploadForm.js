import React, { useState } from 'react';
import axios from 'axios';

const PhotoUploadForm = ({ eventId, onUploadSuccess }) => {
  const [files, setFiles] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => setFiles(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      setError('Please select at least one file.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/events/${eventId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onUploadSuccess(res.data.photos);
      setFiles(null);
      setError('');
    } catch (err) {
      setError('Failed to upload photos.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <button type="submit" style={{ marginLeft: 10 }}>Upload Photos</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default PhotoUploadForm;