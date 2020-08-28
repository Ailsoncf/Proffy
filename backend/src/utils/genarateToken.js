const jwt = require('jsonwebtoken')
const { secret } = require('../config/auth.json')

const generateToken = (id) => {
  const token = jwt.sign({ id }, secret, {
    expiresIn: 86400,
  })
  return token
}

module.exports = generateToken
