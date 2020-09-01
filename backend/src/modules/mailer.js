const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const { host, pass, port, user } = require('../config/mail.json')

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass,
  },
})

transport.use(
  'compile',
  hbs({
    viewEngine: {
      partialsDir: path.resolve('./src/resources/mail'),
      defaultLayout: undefined,
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html',
  })
)

module.exports = transport
