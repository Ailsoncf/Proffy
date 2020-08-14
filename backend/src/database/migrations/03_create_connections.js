const Knex = require("knex");

exports.up = async function(knex){
    return knex.schema.createTable('connections', table => {
        table.increments('id').primary();
    
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')

        table.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable()
      })
}
exports.down = async function(knex){
    return knex.schema.dropTable('connections')
}