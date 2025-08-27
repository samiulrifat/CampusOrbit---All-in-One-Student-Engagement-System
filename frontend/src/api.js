import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/* ------- Clubs (already had some) ------- */
export const getClubs       = () => api.get('/clubs').then(r => r.data);
export const getMyClubs     = () => api.get('/clubs/user').then(r => r.data);
export const createClub     = (payload) => api.post('/clubs', payload).then(r => r.data);
export const inviteToClub   = (clubId, payload) => api.post(`/clubs/${clubId}/invite`, payload).then(r => r.data);
export const removeFromClub = (clubId, userId) =>
  api.delete(`/clubs/${clubId}/remove`, { data: { userId } }).then(r => r.data);
export const deleteClub     = (clubId) => api.delete(`/clubs/${clubId}`).then(r => r.data);

/* ------- Announcements ------- */
export const getAnnouncements = (clubId) =>
  api.get(`/announcements/${clubId}`).then(r => r.data);

/* ------- Invitations ------- */
export const getInvitations = () => api.get('/clubs/invitations/user').then(r => r.data);
export const acceptInvite   = (id) => api.patch(`/clubs/invitations/${id}/accept`).then(r => r.data);

/* ------- Events (ADD THESE) ------- */
// Your backend has both "/" (list all) and "/filter" endpoints.
// Use "/filter" when params are provided (e.g., { clubId })
export const getEvents = (params = {}) => {
  const hasParams = Object.keys(params).length > 0;
  const path = hasParams ? '/events/filter' : '/events';
  return api.get(path, { params }).then(r => r.data);
};

export const getEvent = (id) =>
  api.get(`/events/${id}`).then(r => r.data);

export const createEvent = (payload) =>
  api.post('/events', payload).then(r => r.data);

export const updateEvent = (id, payload) =>
  api.put(`/events/${id}`, payload).then(r => r.data);

export const deleteEvent = (id) =>
  api.delete(`/events/${id}`).then(r => r.data);

export default api;
