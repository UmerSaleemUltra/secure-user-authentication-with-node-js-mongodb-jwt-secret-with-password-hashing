import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    number: { type: String },
    failedAttempts: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: null }
});

export default mongoose.model('User', userSchema);
