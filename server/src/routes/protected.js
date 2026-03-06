import express from 'express';
import { verifyAccessToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

router.get('/me', verifyAccessToken, async (req, res) => {
  res.json({ user: req.user });
});

//! admin-only
router.get('/admin/stats', verifyAccessToken, authorizeRoles('admin'), (req, res) => {
  res.json({ secret: 'only admins see this' });
});

export default router;

