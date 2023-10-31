import mongoose from 'mongoose';

const temporaryUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token:{
        type: String,
        unique: true,
        required: true
    }, 
    expireAt: {
        type: Date,
        default: Date.now,
        expires: "2d"
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const TemporaryUser = mongoose.model('TemporaryUser', temporaryUserSchema);

export default TemporaryUser;