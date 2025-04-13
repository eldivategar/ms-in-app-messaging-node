const express = require('express');
const cors = require('cors');
const http = require('http');
const { initializeSocket } = require('./websocket');
const routes = require('./routes');
const db = require('./models');

const app = express();
const server = http.createServer(app);

// Initialize database connection and sync
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    // Force sync all models
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Database models synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Initialize Socket.IO
initializeSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
    res.send('pong');
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;

// Use server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
