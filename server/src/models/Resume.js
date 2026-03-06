import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String, required: true },
    path: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    suggestedJobs: { type: [String] }
}, { timestamps: true });

const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;