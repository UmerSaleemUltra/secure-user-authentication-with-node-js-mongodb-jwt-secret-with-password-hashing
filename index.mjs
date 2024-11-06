import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import signupRouter from './routes/signup.js';
import loginRouter from './routes/login.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
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

// Export the Express app as the handler for Vercel
export default app;
