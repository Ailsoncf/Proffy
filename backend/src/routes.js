const {Router} = require('express')
const db = require('./database/connection')
const convertTimeInMinutes = require('./utils/convertHoursToMinutes')
const convertHoursToMinutes = require('./utils/convertHoursToMinutes')

const routes = Router()

routes.post('/classes', async (request, response) =>{
    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body

    const insertedUsersIds =  await db('users').insert({
        name,
        avatar,
        whatsapp,
        bio
    })

    const user_id = insertedUsersIds[0]

    const insertedClassesIds = await db('classes').insert({
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

    await db('class_schedule').insert(classSchedule)

    return response.send()
})

module.exports = routes