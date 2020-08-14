const {Router} = require('express')
const db = require('./database/connection')
const ClassesController = require('./controllers/ClassesController')

const routes = Router()

routes.post('/classes', ClassesController.create)

module.exports = routes