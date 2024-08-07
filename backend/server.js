const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const {Server} = require('socket.io');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Connected to db, listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("Error connecting to db: ", err);
    });

app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

module.exports = {app, io};
