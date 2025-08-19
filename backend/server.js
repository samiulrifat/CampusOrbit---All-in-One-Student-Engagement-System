require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); 
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const path = require('path');
const achievementRoutes = require('./routes/achievements');



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
app.use('/api/achievements', achievementRoutes);

app.use('/uploads/resources', express.static(path.join(__dirname, 'uploads/resources')));


// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
