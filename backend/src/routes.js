const {Router} = require('express')
const db = require('./database/connection')
const ClassesController = require('./controllers/ClassesController')
const ConnectionsController = require('./controllers/ConnectionsController')

const routes = Router()

routes.post('/classes', ClassesController.create)
routes.get('/classes', ClassesController.index)
routes.post('/connections', ConnectionsController.create)
routes.get('/connections', ConnectionsController.index)

module.exports = routes