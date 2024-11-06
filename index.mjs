// index.mjs
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import db from './config/db.js';
import signupRouter from './routes/signup.js';
import loginRouter from './routes/login.js';
import userRoutes from './routes/userRoutes.js';
// Removed chatRoutes and Message import

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.json());

// Connect to the database
db.connection.once('open', () => {
    console.log('Database connected successfully!');
});

// Use the signup, login, and user routes
app.use('/api/signup', signupRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRoutes);
// Removed chat routes

// Start the server
server.listen(3001, () => {
    console.log('Listening at port 3001');
});
