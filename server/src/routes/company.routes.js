import express from 'express';
import axios from 'axios';
import CompanyProfile from '../models/CompanyProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { verifyAccessToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { logoUpload } from '../middleware/logoUpload.js';
import logger from '../config/logger.js';
import { jobRules, companyProfileRules, applicationStatusRules, validate } from '../middleware/validation.js';

const router = express.Router();

router.use(verifyAccessToken, authorizeRoles('company'));

const getCompany = async (req, res, next) => {
  try {
    const company = await CompanyProfile.findOne({ userId: req.user.userId }).populate('userId', 'name email');
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    req.company = company;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//! Get company profile
router.get('/profile', getCompany, (req, res) => {
  res.status(200).json(req.company);
});


router.put('/profile', getCompany, companyProfileRules, validate, async (req, res) => {
  const { about, mobile, website, location } = req.body;
  try {
    const updateProfile = await CompanyProfile.findOneAndUpdate(
      { userId: req.user.userId },
      { about, mobile, website, location },
      { new: true }
    ).populate('userId', 'name email');
    res.status(200).json(updateProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//! Upload company logo
router.put('/profile/logo', getCompany, logoUpload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const companyProfile = await CompanyProfile.findOneAndUpdate(
      { userId: req.user.userId },
      { logo: req.file.filename },
      { new: true }
    ).populate('userId', 'name email');

    res.status(200).json(companyProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//! creating job
router.post('/jobs', jobRules, validate, async (req, res) => {
  logger.info({ userId: req.user.userId }, 'Creating job');

  const { title, description, location, salary, type, status, experience, skills } = req.body;
  try {
    const job = new Job({
      title,
      description,
      location,
      salary,
      type,
      status,
      experience,
      skills,
      company: req.user.userId
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    logger.error({ err }, 'Create job error');
    res.status(400).json({ message: err.message });
  }
});

//! Get all jobs for the company
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.userId });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//! Update a job
router.put('/jobs/:id', async (req, res) => {
  const { title, description, location, salary, type, status, experience, skills } = req.body;
  try {
    const job = await Job.findOne({ _id: req.params.id, company: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not owned by company' });
    }
    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.type = type || job.type;
    job.status = status || job.status;
    job.experience = experience || job.experience;
    job.skills = skills || job.skills;
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//! Delete a job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, company: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not owned by company' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    logger.error({ err }, 'Delete job error');
    res.status(500).json({ message: err.message });
  }
});

//! View applications for company's jobs
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email')
      .populate({
        path: 'jobId',
        match: { company: req.user.userId },
        select: 'title description'
      }).populate({
        path: "resume",
        select: "path",
      })
      .exec();
    const filteredApplications = applications.filter(app => app.jobId);
    res.json(filteredApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//! Update application 
router.put('/applications/:id/status', applicationStatusRules, validate, async (req, res) => {
  const { status } = req.body;
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate({
        path: 'userId',
        select: 'name email'
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.jobId.company.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    application.status = status;
    await application.save();
    const response = await axios.post(
      "https://thinkersstemhub.com/gateway.php",
      new URLSearchParams({
        email: application.userId.email,
        msg: `Your application for ${application.jobId.title} has been ${status}`,
        subject: "Application Status Update",
        title: "Application Status Update"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    logger.info({ applicationId: req.params.id, status, email: application.userId.email }, 'Application status email sent');
    res.json(application);
  } catch (err) {
    logger.error({ err }, 'Update application status error');
    res.status(500).json({ message: err.message });
  }
});

export default router;
