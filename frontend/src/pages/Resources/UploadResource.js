import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import './Resources.css';

const UploadResource = ({ onUploadSuccess }) => {
  const { clubId } = useParams();
  const [type, setType] = useState('file');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

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

        await api.post(`/resources/upload/${clubId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        if (!title || !url) {
          alert('Please enter both title and URL');
          setUploading(false);
          return;
        }

        await api.post(`/resources/link/${clubId}`, { title, url });
      }

      setTitle('');
      setUrl('');
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();

    } catch (error) {
      console.error('Resource upload failed:', error);
      alert(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
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
