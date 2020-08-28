exports.up = async function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.string('avatar')
    table.string('whatsapp')
    table.string('bio')
  })
}
exports.down = async function (knex) {
  return knex.schema.dropTable('users')
}
