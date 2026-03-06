import express from 'express';
import User from '../models/User.js';
import CompanyProfile from '../models/CompanyProfile.js';
import Job from '../models/Job.js';
import { verifyAccessToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

router.use(verifyAccessToken, authorizeRoles('admin'));

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a company
router.delete('/companies/:id', async (req, res) => {
  try {
    const company = await CompanyProfile.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await CompanyProfile.find().populate('userId', 'name email');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new job
// router.post('/jobs', async (req, res) => {
//   const { title, description, location, salary, type, status, experience, skills, company } = req.body;
//   try {
//     const job = new Job({
//       title,
//       description,
//       location,
//       salary,
//       type,
//       status,
//       experience,
//       skills,
//       company
//     });
//     await job.save();
//     res.status(201).json(job);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });



// // Update a job
// router.put('/jobs/:id', async (req, res) => {
//   const { title, description, location, salary, type, status, experience, skills, company } = req.body;
//   try {
//     const job = await Job.findByIdAndUpdate(
//       req.params.id,
//       { title, description, location, salary, type, status, experience, skills, company },
//       { new: true }
//     );
//     if (!job) {
//       return res.status(404).json({ message: 'Job not found' });
//     }
//     res.json(job);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// Delete a job
router.delete('/jobs/:id', async (req, res) => {
  
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
