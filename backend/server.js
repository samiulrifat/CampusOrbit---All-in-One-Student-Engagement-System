require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); 

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


// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
