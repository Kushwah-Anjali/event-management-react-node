// backend/middleware/adminKey.js
require('dotenv').config();

module.exports = function requireAdminKey(req, res, next) {
  const adminKey = req.body.admin_key || req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ status: 'error', message: 'Access denied!' });
  }
  next();
};
