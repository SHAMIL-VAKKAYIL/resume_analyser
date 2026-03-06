import mongoose from "mongoose";

const CompanyProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    about: String,
    website: String,
    location: String,
    mobile: String,
    jobs: { type: [mongoose.Schema.Types.ObjectId], ref: 'Job' },
    applications: { type: [mongoose.Schema.Types.ObjectId], ref: 'Application' },
    logo: String
}, { timestamps: true });

const CompanyProfile = mongoose.model('CompanyProfile', CompanyProfileSchema);

export default CompanyProfile;