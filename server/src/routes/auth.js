import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import CompanyProfile from '../models/CompanyProfile.js';
import Profile from '../models/UserProfile.js';
import logger from '../config/logger.js';
import { registerRules, loginRules, validate } from '../middleware/validation.js';


const router = express.Router();

const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
  );
};

//! Helper to set cookies
const setTokensCookies = (res, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d 
  });
};

//! register
router.post('/register', registerRules, validate, async (req, res) => {

  const { name, email, password, role } = req.body;

  try {


    if (!(name && email && password)) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role: role || 'user' });


    if (user.role === 'company') {
      const company = await CompanyProfile.create({ userId: user._id });
    }

    if (user.role === 'user') {
      const userProf = await Profile.create({ userId: user._id });
    }
    //? creating tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    setTokensCookies(res, refreshToken);
    logger.info({ userId: user._id, role: user.role }, 'User registered');

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
  } catch (error) {
    logger.error({ err: error }, 'Register error');
    res.status(500).json({ message: 'Server error' });
  }
});

//! login
router.post('/login', loginRules, validate, async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) return res.status(400).json({ message: 'Missing email or password' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  setTokensCookies(res, refreshToken);

  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, accessToken });
});

//! create new access token when refresh token valid

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    //?  check token generated user exists in DB.
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = createAccessToken(user);
    return res.json({ ok: true, accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

//! logout - clear cookies
router.post('/logout', (req, res) => {
  res.clearCookie('refresh_token');
  res.json({ ok: true });
});

export default router;
