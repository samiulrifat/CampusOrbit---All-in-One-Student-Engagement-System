import React, { useEffect, useState } from 'react';
import api from '../../api';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      const list = res.data || [];
      setItems(list);
      setUnread(list.filter(n => !n.read).length);
    } catch (e) {
      console.error('notifications load failed', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 20000);
    return () => clearInterval(id);
  }, []);

  const markOne = async (id) => {
    await api.patch(`/api/notifications/${id}/read`);
    fetchNotifications();
  };

  const markAll = async () => {
    await api.patch('/api/notifications/read-all');
    fetchNotifications();
  };

  return (
    <div className="notif-wrapper">
      <button className="bell" onClick={() => setOpen(o => !o)} aria-label="Notifications">
        🔔 {unread > 0 && <span className="badge">{unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-head">
            <span>Notifications</span>
            <button className="link" onClick={markAll}>Mark all read</button>
          </div>
          <ul className="notif-list">
            {items.length === 0 && <li className="empty">No notifications</li>}
            {items.map(n => (
              <li key={n._id} className={n.read ? 'read' : 'unread'}>
                <div className="title">{n.title}</div>
                <div className="msg">{n.message}</div>
                <div className="actions">
                  {n.link ? <a href={n.link}>Open</a> : <span />}
                  {!n.read && <button className="link" onClick={() => markOne(n._id)}>Mark read</button>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
