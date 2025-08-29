import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import './Resources.css';

const ResourceList = ({ clubId }) => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`/api/resources/${clubId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setResources(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch resources:', err);
      setLoading(false);
    });
  }, [clubId]);

  const deleteResource = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`/api/resources/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setResources(resources.filter(r => r._id !== id));
    })
    .catch(err => {
      console.error('Failed to delete resource:', err);
    });
  };

  if (loading) return <p>Loading resources...</p>;
  if (resources.length === 0) return <p>No resources shared yet.</p>;

  return (
    <div className="resource-list glass-card">
      <h3>Shared Resources</h3>
      <ul>
        {resources.map(resource => (
          <li key={resource._id} className="resource-item">
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
              {resource.type === 'link'
                ? resource.title
                : (resource.fileName || resource.title)}
            </a>
            {user && user._id === resource.uploader && (
              <button
                onClick={() => deleteResource(resource._id)}
                className="delete-btn"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceList;
