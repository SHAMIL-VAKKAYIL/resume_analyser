import jwt from 'jsonwebtoken';

const verifyAccessToken = (req, res, next) => {
  // token is expected in Authorization header as Bearer token

  // const token = req.cookies?.access_token;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // payload should contain userId and role
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
};

export { verifyAccessToken };
