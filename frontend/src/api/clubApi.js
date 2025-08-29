import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

export const fetchMeetings = (clubId, token) =>
  axios.get(`${API_BASE}/api/meetings/club/${encodeURIComponent(clubId)}`, { headers: authHeader(token) });

export const createMeeting = (clubId, payload, token) =>
  axios.post(`${API_BASE}/api/meetings/${encodeURIComponent(clubId)}`, payload, {
    headers: { ...authHeader(token), 'Content-Type': 'application/json' },
    timeout: 10000,
  });

export const fetchPolls = (clubId, token) =>
  axios.get(`${API_BASE}/api/polls/club/${encodeURIComponent(clubId)}`, { headers: authHeader(token) });

export const createPoll = (clubId, payload, token) =>
  axios.post(`${API_BASE}/api/polls/${encodeURIComponent(clubId)}`, payload, {
    headers: { ...authHeader(token), 'Content-Type': 'application/json' },
  });

export const votePoll = (pollId, payload, token) =>
  axios.post(`${API_BASE}/api/polls/${encodeURIComponent(pollId)}/vote`, payload, {
    headers: { ...authHeader(token), 'Content-Type': 'application/json' },
  });

export const fetchResources = (clubId, token) =>
  axios.get(`${API_BASE}/api/resources/club/${encodeURIComponent(clubId)}`, { headers: authHeader(token) });

export const createResource = (clubId, payload, token) =>
  axios.post(`${API_BASE}/api/resources/${encodeURIComponent(clubId)}`, payload, {
    headers: { ...authHeader(token), 'Content-Type': 'application/json' },
  });