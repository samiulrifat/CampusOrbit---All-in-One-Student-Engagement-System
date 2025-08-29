import axios from 'axios';

// CRA "proxy" forwards /api to http://localhost:5000 as set in package.json
const api = axios.create({ baseURL: '' });

// attach JWT (works with your verifyToken middleware)
const token = localStorage.getItem('token');
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default api;


