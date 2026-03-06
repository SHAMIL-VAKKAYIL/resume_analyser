import express from 'express';

import User from '../models/User.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Profile from '../models/UserProfile.js';
import Resume from '../models/Resume.js';

import { verifyAccessToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';
import logger from '../config/logger.js';

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';


const __dirname = path.resolve();
const filePath = path.join(__dirname, 'uploads', 'resumes');
const ML_SCRIPT = process.env.ML_SCRIPT_PATH || path.join(__dirname, '..', 'ml', 'main.py');


const router = express.Router();

router.get('/profile', verifyAccessToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        const profile = await Profile.findOne({ userId: req.user.userId }).populate('resume', 'resume path');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json({ user, profile });
    } catch (error) {
        logger.error({ err: error }, 'Get profile error');
        return res.status(500).json({ message: 'Server error' });
    }
});

// router.get('/profile/:userId', verifyAccessToken, async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const user = await User.findById(userId).select('-password');
//         const profile = await Profile.findOne({ userId });
//         if (!user) return res.status(404).json({ message: 'User not found' });
//         return res.json({ user, profile });
//     } catch (error) {
//         console.error('Get user profile error', error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// });

router.get('/alluser', verifyAccessToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }, 'id name email role');
        return res.json({ users });
    } catch (error) {

        logger.error({ err: error }, 'Get all users error');
        return res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/delete/:id', verifyAccessToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json({ message: 'User deleted' });
    } catch (error) {
        logger.error({ err: error }, 'Delete user error');
        return res.status(500).json({ message: 'Server error' });
    }
})

router.put('/update/:id', verifyAccessToken, upload.single('resume'), async (req, res) => {

    const { id } = req.params;

    const { name, email } = req.body;
    logger.debug({ name }, 'Updating user');


    const resume = req.file ? req.file.originalname : undefined;
    const filename = req.file ? req.file.filename : undefined;

    const { skills, experience, about } = req.body;

    try {
        const userUpdate = {};
        if (name) userUpdate.name = name;
        if (email) userUpdate.email = email;

        let user = null;

        if (Object.keys(userUpdate).length > 0) {
            user = await User.findByIdAndUpdate(id, userUpdate, {
                new: true,
                runValidators: true
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        } else {
            user = await User.findById(id);
        }

        const profileUpdate = {};

        if (resume) {
            const existingResume = await Resume.findOne({ owner: id });
            if (existingResume) {

                const oldResumePath = existingResume.path;

                fs.unlink(`${filePath}/${oldResumePath}`, (err) => {
                    if (err) {
                        logger.error({ err }, 'Error deleting old resume file');
                    } else {
                        logger.info('Old resume file deleted successfully');
                    }
                })
            }
            const newResume = await Resume.create({ userId: id, resume, path: filename, owner: id });
            if (!newResume) {
                return res.status(500).json({ message: 'Failed to upload resume' });
            }
            profileUpdate.resume = newResume._id;
            logger.debug({ resumeId: newResume._id }, 'New resume created');
        }
        if (skills !== undefined) {
            try {

                let skillsArray = Array.isArray(skills) ? skills : JSON.parse(skills);
                profileUpdate.skills = skillsArray;
            } catch (e) {
                profileUpdate.skills = skills.split(',').map(s => s.trim()).filter(s => s !== '');
            }
        }
        if (experience !== undefined) profileUpdate.experience = experience;
        if (about !== undefined) profileUpdate.about = about;

        let profile = null;

        if (Object.keys(profileUpdate).length > 0) {
            profile = await Profile.findOneAndUpdate(
                { userId: id },
                profileUpdate,
                { new: true, upsert: true }
            );
        } else {
            profile = await Profile.findOne({ userId: id });
        }

        return res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            profile
        });


    } catch (error) {
        logger.error({ err: error }, 'Update user error');
        return res.status(500).json({ message: 'Server error' });
    }
});

//! Get all jobs
router.get('/jobs', async (req, res) => {
    const { title, experience } = req.query;

    try {
        let query = {};
        if (title) {
            const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.$or = [
                { title: { $regex: escaped, $options: 'i' } },
                // { description: { $regex: escaped, $options: 'i' } }
            ]
        }
        if (experience && experience !== 'all') {
            query.experience = experience;
        }

        const jobs = await Job.find(query).populate({
            path: 'company',
            select: 'name email',
            populate: {
                path: 'profile',
                select: 'logo'
            }
        });

        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//! Get job details
router.get('/job/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        const job = await Job.findById(jobId).populate('company', 'name email');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//! Apply for a job
router.post('/apply/:jobId', verifyAccessToken, authorizeRoles('user'), async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.userId;
    try {
        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Check if already applied
        const existingApplication = await Application.findOne({ userId, jobId });
        if (existingApplication) {
            return res.status(400).json({ message: 'Already applied for this job' });
        }

        const user = await Profile.findOne({ userId });

        const application = new Application({ userId, jobId, resume: user.resume });
        await application.save();

        job.applications.push(application._id);
        await job.save();
        return res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        logger.error({ err: error }, 'Apply for job error');
        return res.status(500).json({ message: 'Server error' });
    }
})

//! get applications 
router.get('/applications', verifyAccessToken, authorizeRoles('user'), async (req, res) => {

    const userId = req.user.userId;
    try {

        const applications = await Application.find({ userId: userId }, "-userId").populate({
            path: 'jobId',
            populate: {
                path: 'company',
                select: 'name email',
                populate: {
                    path: 'profile',
                    select: 'logo'
                }
            },
        })




        res.status(200).json(applications);
    } catch (error) {
        logger.error({ err: error }, 'Get applications error');
        return res.status(500).json({ message: 'Server error' });
    }
})

//! Resume analysis 
router.post('/analyze-resume', verifyAccessToken, authorizeRoles('user'), upload.single('resume'), async (req, res) => {
    try {
        const pythonCommand = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
        const py = spawn(pythonCommand, [ML_SCRIPT, req.file.path, "--mode", "roast"]);

        let output = null;
        let error = "";

        py.stdout.on('data', function (data) {
            output = data.toString();
        });

        py.stderr.on('data', function (data) {
            error += data.toString();
        });

        py.on('close', (code) => {
            if (code !== 0) {
                logger.error({ code, error }, 'Python script exited with error (analyze)');
                return res.status(500).json({ message: 'Resume analysis failed', error: error });
            }
            try {
                const analysisResult = JSON.parse(output);
                return res.status(200).json({ analysis: analysisResult });
            } catch (parseError) {
                logger.error({ err: parseError }, 'Error parsing Python output (analyze)');
                return res.status(500).json({ message: 'Resume analysis failed', error: 'Invalid analysis result format' });
            }
        });
    } catch (error) {
        logger.error({ err: error }, 'Resume analysis error');
        return res.status(500).json({ message: 'Resume analysis failed' });
    }
});

router.post('/recommend-jobs', verifyAccessToken, authorizeRoles('user'), upload.single('resume'), async (req, res) => {
    try {
        const pythonCommand = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
        const py = spawn(pythonCommand, [ML_SCRIPT, req.file.path, "--mode", "recommend"]);

        let output = null;
        let error = "";

        py.stdout.on('data', function (data) {
            output = data.toString();

        });

        py.stderr.on('data', function (data) {
            error += data.toString();
        });

        py.on('close', (code) => {
            if (code !== 0) {
                logger.error({ code, error }, 'Python script exited with error (recommend)');
                return res.status(500).json({ message: 'Job recommendation failed', error: error });
            }
            try {
                const result = JSON.parse(output);
                return res.status(200).json({ recommendations: result.recommendations });
            } catch (parseError) {
                logger.error({ err: parseError }, 'Error parsing Python output (recommend)');
                return res.status(500).json({ message: 'Job recommendation failed', error: 'Invalid result format' });
            }
        });
    } catch (error) {
        logger.error({ err: error }, 'Job recommendation error');
        return res.status(500).json({ message: 'Job recommendation failed' });
    }
});

router.post('/match-resume', verifyAccessToken, authorizeRoles('user'), upload.single('resume'), async (req, res) => {
    const { jobDescription } = req.body;

    if (!jobDescription) {
        return res.status(400).json({ message: 'Job description is required' });
    }

    // Create a temp file for JD to avoid command line length issues and escaping hell
    const tempJdPath = path.join(__dirname, `jd_${Date.now()}.txt`);

    try {
        fs.writeFileSync(tempJdPath, jobDescription);

        const pythonCommand = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
        const py = spawn(pythonCommand, [ML_SCRIPT, req.file.path, "--mode", "match", "--jd", tempJdPath]);

        let output = null;
        let error = "";

        py.stdout.on('data', function (data) {
            output = data.toString();
        });

        py.stderr.on('data', function (data) {
            error += data.toString();
        });

        py.on('close', (code) => {
            // Clean up temp file
            try {
                fs.unlinkSync(tempJdPath);
            } catch (e) {
                logger.error({ err: e }, 'Failed to delete temp JD file');
            }

            if (code !== 0) {
                logger.error({ code, error }, 'Python script exited with error (match)');
                return res.status(500).json({ message: 'Resume match failed', error: error });
            }
            try {
                const result = JSON.parse(output);
                return res.status(200).json({ match: result.match });
            } catch (parseError) {
                logger.error({ err: parseError }, 'Error parsing Python output (match)');
                return res.status(500).json({ message: 'Resume match failed', error: 'Invalid result format' });
            }
        });
    } catch (error) {
        // Clean up temp file in case of error
        if (fs.existsSync(tempJdPath)) {
            fs.unlinkSync(tempJdPath);
        }
        logger.error({ err: error }, 'Resume match error');
        return res.status(500).json({ message: 'Resume match failed' });
    }
});


router.get('/checkstatus/:jobId', verifyAccessToken, authorizeRoles('user'), async (req, res) => {
    const userId = req.user.userId;
    const { jobId } = req.params;

    try {
        const application = await Application.findOne({ userId, jobId });
        if (application) {
            return res.status(200).json({ applied: true });
        }
        return res.status(200).json({ applied: false });
    } catch (error) {
        logger.error({ err: error }, 'Error checking job application status');
        return res.status(500).json({ message: 'Server error' });
    }
})


//! Delete a job
router.delete('/jobs/:id', verifyAccessToken, async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id });

        if (!job) {
            return res.status(404).json({ message: 'Job not found or not owned by company' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        logger.error({ err }, 'Delete job error');
        res.status(500).json({ message: err.message });
    }
});

export default router