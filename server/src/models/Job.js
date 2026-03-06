import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, default: 'Open' },
    experience: { type: String, required: true },
    skills: { type: [String], required: true },
    applications: { type: [mongoose.Schema.Types.ObjectId], ref: 'Application' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);
export default Job;