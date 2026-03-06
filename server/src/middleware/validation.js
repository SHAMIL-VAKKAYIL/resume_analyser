import { body, validationResult } from 'express-validator';

// Reusable validation error handler
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
};

// Auth validation rules
export const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['user', 'company']).withMessage('Invalid role'),
];

export const loginRules = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

// Job validation rules
export const jobRules = [
    body('title').trim().notEmpty().withMessage('Title is required').escape(),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required').escape(),
    body('salary').trim().notEmpty().withMessage('Salary is required').escape(),
    body('type').trim().notEmpty().withMessage('Type is required').escape(),
    body('experience').trim().notEmpty().withMessage('Experience is required').escape(),
    body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
];

// Profile validation rules
export const companyProfileRules = [
    body('about').optional().trim().escape(),
    body('mobile').optional().trim().escape(),
    body('website').optional().trim().isURL().withMessage('Invalid website URL'),
    body('location').optional().trim().escape(),
];

// Application status validation
export const applicationStatusRules = [
    body('status').isIn(['Pending', 'Accepted', 'Rejected']).withMessage('Invalid status'),
];
