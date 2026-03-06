import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected'] },
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;