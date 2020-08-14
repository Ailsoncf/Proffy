const db = require('../database/connection')
const convertHoursToMinutes = require('../utils/convertHoursToMinutes')

module.exports = {
    async index (request, response){
        const filters = request.query

        console.log(filters)

        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHoursToMinutes(filters.time)

        const classes = await db('classes')
            .whereExists(function() {
                this.from('class_schedule')
                .select('class_schedule.*')
                .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                .whereRaw('`class_schedule`.`week_day` = ??', [Number(filters.week_day)])
                .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', filters.subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])

        return response.send(classes)
    },

    async create (request, response) {

    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body

    const trx = await db.transaction()

    try {
    
        const insertedUsersIds =  await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio
        })
    
        const user_id = insertedUsersIds[0]
    
        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id
        })
    
        const class_id = insertedClassesIds[0]
    
        const classSchedule = schedule.map(scheduleItem => {
            return {
                class_id,
                week_day: scheduleItem.week_day,
                from: convertHoursToMinutes(scheduleItem.from),
                to: convertHoursToMinutes(scheduleItem.to)
            }
        })
    
        await trx('class_schedule').insert(classSchedule)
    
        await trx.commit()
    
        return response.status(201).json()

    } catch (err) {
        await trx.rollback()

        return response.status(400).json({
            error: 'Unexpected error while creating a new class'
        })
    }
}
}