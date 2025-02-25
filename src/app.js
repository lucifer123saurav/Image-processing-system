const express = require('express');
const mongoose = require('mongoose');
const { mongoURI } = require('./config/config');
const uploadRouter = require('./routes/upload');
const statusRouter = require('./routes/status');
const webhookRouter = require('./routes/webhook');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

app.use('/upload', uploadRouter);
app.use('/status', statusRouter);
app.use('/webhook', webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;