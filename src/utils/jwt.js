const jwt = require('jsonwebtoken');

const generateToken = (data) => {
  const payload = { data };
  const secretKey = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };

  const token = jwt.sign(payload, secretKey, options);
  
  return token;
};

module.exports = { generateToken };
