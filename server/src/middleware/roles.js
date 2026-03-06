// usage: authorizeRoles('admin'), authorizeRoles('admin','user')
const authorizeRoles = (...allowedRoles) => (req, res, next) => {

    const role = req.user?.role;

    // console.log(role, allowedRoles);
    if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
};

export { authorizeRoles };
