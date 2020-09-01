const db = require('../database/connection')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/genarateToken')
const crypto = require('crypto')
const mailer = require('../modules/mailer')

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
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined

      const token = generateToken(user.id)

      return response.json({ ...user, token })
    } catch (err) {
      console.log(err)
      return response
        .status(409)
        .send({ error: 'Authentication error! Please, try again' })
    }
  },
  async passRecover(request, response) {
    const { email } = request.body

    const user = await db('users').where({ email }).first()

    try {
      if (!user) return response.status(404).send({ error: 'User not found' })

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()

      now.setHours(now.getHours() + 1)

      await db('users').where('users.id', '=', user.id).update({
        passwordResetToken: token,
        passwordResetExpires: now,
      })

      mailer.sendMail(
        {
          to: email,
          from: 'ailson_cf@yahoo.com.br',
          template: 'auth/forgotPass',
          context: { token },
        },
        (err) => {
          if (err)
            return response
              .status(400)
              .send({ error: 'Cannot send recover email' })

          return response.send({ message: 'Email sent' })
        }
      )
    } catch (err) {
      response.status(400).send({ error: 'Error on forgot password' })
    }
  },
  async passReset(request, response) {
    const { email, token, password } = request.body

    try {
      const user = await db('users')
        .where({ email })
        .first()
        .select('passwordResetToken', 'passwordResetExpires')

      console.log(user)

      if (!user) return response.status(400).send({ error: 'User not found' })

      if (token !== user.passwordResetToken)
        return response.status(400).send({ error: 'Token invalid' })

      const now = new Date()

      if (now > user.passwordResetExpires)
        return response
          .status(400)
          .send({ error: 'Token expired, generate a new one' })

      user.password = await bcrypt.hash(password, 10)

      await db('users').update(user)

      response.send()
    } catch (err) {
      console.log(err)
      return response.status(400).send({ error: 'Error on reset password' })
    }
  },
}
