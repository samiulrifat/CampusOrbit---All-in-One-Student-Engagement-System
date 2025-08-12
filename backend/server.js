const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// connect to database
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/camp_orbit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// routes
app.use('/api/auth', require('./routes/auth'));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
