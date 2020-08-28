const db = require('../database/connection')

module.exports = {
  async indexAllUsers(request, response) {
    const users = await db('users').select('*')

    return response.json(users)
  },

  async showUser(request, response) {
    try {
      const id = request.userID

      const user = await db('users').where('id', id).first()

      user.password = undefined

      return response.json(user)
    } catch (err) {
      return response.status(404).json({ error: `Erro no servidor. ${err}` })
    }
  },
}
