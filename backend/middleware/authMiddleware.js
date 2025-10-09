// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ status: 'error', message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}

module.exports = verifyToken;
