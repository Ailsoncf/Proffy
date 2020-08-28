const db = require('../database/connection')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/genarateToken')

module.exports = {
  async signUp(request, response) {
    const { name, email, password } = request.body

    const emailExists = await db('users').where({ email }).first()

    try {
      if (emailExists)
        return response
          .status(409)
          .json({ error: 'This user already exists, try another one!' })

      const hash = await bcrypt.hash(password, 10)

      const user = {
        name,
        email,
        password: hash,
      }

      const [id] = await db('users').insert(user)

      user.password = undefined

      const token = generateToken(user.id)

      return response.status(201).json({ user, token })
    } catch (err) {
      console.log(err)
      return response.status(406).json({ error: 'Registration Failed' })
    }
  },

  async signIn(request, response) {
    const [, hash] = request.headers.authorization.split(' ')
    const [email, password] = Buffer.from(hash, 'base64').toString().split(':')

    const user = await db('users').where({ email }).first()

    try {
      if (!user) return response.status(404).send({ error: 'User not found!' })

      const comparePass = await bcrypt.compare(password, user.password)

      if (!comparePass)
        return response
          .status(401)
          .send({ error: 'Invalid Password, try again!' })

      user.password = undefined

      const token = generateToken(user.id)

      return response.json({ ...user, token })
    } catch (err) {
      console.log(err)
      return response
        .status(409)
        .send({ error: 'Authentication error! Please, try again' })
    }
  },
}
