import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';


const UploadResource = ({ clubId, onUploadSuccess }) => {
  const { user } = useAuth();
  const [type, setType] = useState('file'); // 'file' or 'link'
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (type === 'file') {
        if (!file) {
          alert('Please select a file to upload');
          setUploading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title || file.name);

        await axios.post(`/api/resources/upload/${clubId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        if (!title || !url) {
          alert('Please enter both title and URL');
          setUploading(false);
          return;
        }

        await axios.post(`/api/resources/link/${clubId}`, { title, url }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Reset inputs
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
    <form onSubmit={handleSubmit} style={{ marginBottom: '2em' }}>
      <label>
        Share type:
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="file">File Upload</option>
          <option value="link">External Link</option>
        </select>
      </label>

      <div style={{ marginTop: '1em' }}>
        <label>
          Title:
          <input
            type="text"
            placeholder="Resource title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required={type === 'link'}
          />
        </label>
      </div>

      {type === 'file' ? (
        <div style={{ marginTop: '1em' }}>
          <label>
            Select file:
            <input
              type="file"
              onChange={e => setFile(e.target.files[0])}
              required={type === 'file'}
            />
          </label>
        </div>
      ) : (
        <div style={{ marginTop: '1em' }}>
          <label>
            URL:
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required={type === 'link'}
            />
          </label>
        </div>
      )}

      <div style={{ marginTop: '1em' }}>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Sharing...' : 'Share Resource'}
        </button>
      </div>
    </form>
  );
};

export default UploadResource;
