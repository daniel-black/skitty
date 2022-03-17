const jwt = require('jsonwebtoken');

const generateToken = (type, id) => {
  let expiryTime;

  if (type === 'access') {
    expiryTime = 60 * 15;   // 15 minute lifetime for access tokens
  } else if (type === 'refresh') {
    expiryTime = '14d';
  } else {
    throw new Error('Invalid token type requested');
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: expiryTime});
}

const _idFromJWT = (token) => jwt.verify(token, process.env.JWT_SECRET).id;

const expiryDateFromJWT = (token) => jwt.verify(token, process.env.JWT_SECRET).exp;

module.exports = { 
  generateToken,
  _idFromJWT,
  expiryDateFromJWT
};