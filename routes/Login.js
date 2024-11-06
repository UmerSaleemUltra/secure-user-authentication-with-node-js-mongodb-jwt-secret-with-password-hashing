import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = 'smhau';
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 60 * 1000; // 1 minute in milliseconds

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Log user data for debugging
        console.log('Failed Attempts:', user.failedAttempts);
        console.log('Last Attempt:', user.lastAttempt);

        // Check if the user is locked due to too many failed attempts
        const currentTime = Date.now();
        if (user.failedAttempts >= MAX_ATTEMPTS && currentTime - user.lastAttempt < LOCK_TIME) {
            return res.status(429).json({ 
                message: `Too many attempts. Please try again after 1 minute.` 
            });
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Increment failed attempts and update last attempt time
            user.failedAttempts = (user.failedAttempts || 0) + 1;
            user.lastAttempt = currentTime;
            await user.save();

            console.log(`Updated Failed Attempts: ${user.failedAttempts}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Reset failed attempts if login is successful
        user.failedAttempts = 0;
        user.lastAttempt = null;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                username: user.username,
                email: user.email,
                number: user.number,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

export default router;
