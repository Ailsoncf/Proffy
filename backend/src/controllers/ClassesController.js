const db = require('../database/connection')
const convertHoursToMinutes = require('../utils/convertHoursToMinutes')

module.exports = {
  async index(request, response) {
    const filters = request.query

    if (!filters.week_day || !filters.subject || !filters.time) {
      return response.status(400).json({
        error: 'Missing filters to search classes',
      })
    }

    const timeInMinutes = convertHoursToMinutes(filters.time)

    const classes = await db('classes')
      .whereExists(function () {
        this.from('class_schedule')
          .select('class_schedule.*')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [
            Number(filters.week_day),
          ])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
      })
      .where('classes.subject', '=', filters.subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select([
        'classes.*',
        'users.name',
        'users.email',
        'users.whatsapp',
        'users.avatar',
      ])

    return response.send(classes)
  },

  async create(request, response) {
    const { whatsapp, bio, subject, cost, schedule } = request.body

    const trx = await db.transaction()

    try {
      await trx('users').update({
        whatsapp,
        bio,
      })

      const user_id = request.userID

      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id,
      })

      const class_id = insertedClassesIds[0]

      const classSchedule = schedule.map((scheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHoursToMinutes(scheduleItem.from),
          to: convertHoursToMinutes(scheduleItem.to),
        }
      })

      await trx('class_schedule').insert(classSchedule)

      await trx.commit()

      return response.status(201).json({ classSchedule, user_id })
    } catch (err) {
      await trx.rollback()

      return response.status(400).json({
        error: `Unexpected error while creating a new class, ${err}`,
      })
    }
  },

  async showUserClasses(request, response) {
    try {
      const user_id = request.userID

      const classes = await db('classes')
        .where({ user_id })
        .select('id', 'subject', 'cost')
        .first()

      return response.json(classSchedule)
    } catch (err) {
      return response.json({ error: 'Not possible to show classes' })
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params

      await db('class_schedule').where({ id }).del()

      return response.json({ message: 'Deleted Class' })
    } catch (err) {
      return response.json({ error: `Delete Class error, ${err}` })
    }
  },
}
