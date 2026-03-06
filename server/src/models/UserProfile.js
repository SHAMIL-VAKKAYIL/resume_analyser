import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skills: [{ type: String }],
    experience: Number,
    about: String,
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
}, { timestamps: true });

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;