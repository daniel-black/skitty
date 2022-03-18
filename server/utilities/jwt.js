const jwt = require('jsonwebtoken');

const generateToken = (type, id) => {
  let expiryTime;

  if (type === 'access') {
    expiryTime = 60 * 15;   // 15 minute lifetime for access tokens
  } else if (type === 'refresh') {
    expiryTime = '17';     // 7 day lifetime for refresh tokens
  } else {
    throw new Error('Invalid token type requested');
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: expiryTime});
}

const _idFromJWT = (token) => jwt.verify(token, process.env.JWT_SECRET).id;

// use synchronous version of jwt.verify()
const checkTokenValidity = (token) => {
  let decoded = undefined;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        console.log('token expired');
        return false;
      } 
      throw new Error(err.message);
    }
  }
  return decoded !== undefined; 
}


module.exports = { 
  generateToken,
  _idFromJWT,
  checkTokenValidity
};