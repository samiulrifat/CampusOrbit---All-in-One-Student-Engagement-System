import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Resources.css';

const UploadResource = ({ onUploadSuccess }) => {
  const { clubId } = useParams();
  const [type, setType] = useState('file');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');
  const BACKEND_URL = "http://localhost:5000"; // your Express backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubId) return alert('Club not selected!');
    setUploading(true);

    try {
      if (type === 'file') {
        if (!file) {
          alert('Please select a file to upload');
          setUploading(false);
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);

        await axios.post(`${BACKEND_URL}/api/resources/upload/${clubId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        if (!title || !url) {
          alert('Please enter both title and URL');
          setUploading(false);
          return;
        }

        await axios.post(`${BACKEND_URL}/api/resources/link/${clubId}`, { title, url }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setTitle('');
      setUrl('');
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();

    } catch (error) {
      console.error('Resource upload failed:', error);
      alert('Upload failed. Please try again.');
    }

    setUploading(false);
  };

  return (
    <div className="resource-page">
      <form onSubmit={handleSubmit} className="resource-form glass-card">
        <h3>Share a Resource</h3>

        <label className="form-label">
          Share type:
          <select value={type} onChange={e => setType(e.target.value)} className="form-input">
            <option value="file">File Upload</option>
            <option value="link">External Link</option>
          </select>
        </label>

        <label className="form-label">
          Title:
          <input
            type="text"
            placeholder="Resource title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-input"
            required={type === 'link'}
          />
        </label>

        {type === 'file' ? (
          <label className="form-label">
            Select file:
            <input
              type="file"
              onChange={e => setFile(e.target.files[0])}
              className="form-input"
              required
            />
          </label>
        ) : (
          <label className="form-label">
            URL:
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="form-input"
              required
            />
          </label>
        )}

        <button type="submit" className="form-btn" disabled={uploading}>
          {uploading ? 'Sharing...' : 'Share Resource'}
        </button>
      </form>
    </div>
  );
};

export default UploadResource;
