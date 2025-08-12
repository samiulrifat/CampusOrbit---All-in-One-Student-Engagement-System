const express = require('express');
const mongoose = require('mongoose');
const events = require('./routes/events');
const event = require('./routes/event');
const app = express();

app.use(express.json());
app.use('/api/events', events);

// connect to Mongo and start server…
