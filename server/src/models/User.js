import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'company'], default: 'user' },
}, { timestamps: true });

UserSchema.virtual('profile', {
  ref: 'CompanyProfile',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', UserSchema);

export default User;