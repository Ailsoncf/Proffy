const { Router } = require('express')

const ClassesController = require('./controllers/ClassesController')
const ConnectionsController = require('./controllers/ConnectionsController')
const AuthController = require('./controllers/AuthController')
const UsersController = require('./controllers/UsersCotroller')
const auth = require('./middlewares/auth')

const routes = Router()

routes.post('/signup', AuthController.signUp)
routes.get('/signin', AuthController.signIn)

routes.get('/users', UsersController.indexAllUsers)
routes.get('/user', auth, UsersController.showUser)

routes.post('/classes', auth, ClassesController.create)
routes.get('/classes', ClassesController.index)
routes.get('/userclasses', auth, ClassesController.showUserClasses)
routes.delete('/classes/:id', auth, ClassesController.delete)
routes.post('/recover_pass', AuthController.passRecover)
routes.post('/reset_pass', AuthController.passReset)

routes.post('/connections', ConnectionsController.create)

routes.get('/connections', ConnectionsController.index)

module.exports = routes
