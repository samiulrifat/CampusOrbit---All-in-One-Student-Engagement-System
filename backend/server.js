require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); 
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const path = require('path');
const achievementRoutes = require('./routes/achievements');
const announcementsRoutes = require('./routes/announcements');
const notificationsRouter = require('./routes/notifications');
const sponsorshipRouter = require('./routes/sponsorships');
const clubsRoutes = require('./routes/clubs');

// app.use(express.json({ limit: '20mb' })); // Increase limit for base64 images
// app.use(express.urlencoded({ extended: true }));

const app = express();

// ====== MIDDLEWARE ======
app.use(express.json());

app.use(cors());



// ====== CONNECT TO DATABASE ======
connectDB(); 

// ====== ROUTES ======
app.get('/', (req, res) => {
  res.send('CampusOrbit API is running...');
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/polls', require('./routes/polls'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/events', require('./routes/events'));
app.use('/api/resources', resourceRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/notifications', notificationsRouter);
app.use('/uploads/resources', express.static(path.join(__dirname, 'uploads/resources')));
app.use('/api/sponsorships', sponsorshipRouter);
app.use('/uploads/eventphotos', express.static(path.join(__dirname, 'uploads/eventphotos')));


// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});