const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }
};

module.exports = { protect };