const db = require('../database/connection')
const convertHoursToMinutes = require('../utils/convertHoursToMinutes')

module.exports = {
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