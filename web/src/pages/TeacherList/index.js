import React, { useState } from 'react'

import api from '../../services/api'

import PageHeader from '../../components/PageHeader'
import TeacherItem from '../../components/TeacherItem'
import Input from '../../components/Input'
import Select from '../../components/Select'

import './styles.css'

function TeacherList() {
  const [teachers, setTeachers] = useState([])
  const [subject, setSubject] = useState('')
  const [week_day, setWeek_day] = useState('')
  const [time, setTime] = useState('')

  async function searchTeachers(e) {
    e.preventDefault()

    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      },
    })
    console.log(response.data)
    setTeachers(response.data)
  }

  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Esses são os Proffys disponíveis">
        <form id="search-teachers" onSubmit={searchTeachers}>
          <Select
            name="subject"
            label="Matéria"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
            }}
            options={[
              { value: 'Artes', label: 'Artes' },
              { value: 'Biologia', label: 'Biologia' },
              { value: 'Ciências', label: 'Ciências' },
              { value: 'Educação Física', label: 'Educação Física' },
              { value: 'Física', label: 'Física' },
              { value: 'Geografia', label: 'Geografia' },
              { value: 'História', label: 'História' },
              { value: 'Matemática', label: 'Matemática' },
              { value: 'Português', label: 'Português' },
              { value: 'Química', label: 'Química' },
            ]}
          />
          <Select
            name="week_day"
            label="Dia da Semana"
            value={week_day}
            onChange={(e) => {
              setWeek_day(e.target.value)
            }}
            options={[
              { value: '0', label: 'Segunda' },
              { value: '1', label: 'Terça' },
              { value: '2', label: 'Quarta' },
              { value: '3', label: 'Quinta' },
              { value: '4', label: 'Sexta' },
              { value: '5', label: 'Sábado' },
              { value: '6', label: 'Domingo' },
            ]}
          />
          <Input
            type="time"
            name="time"
            label="Horário"
            value={time}
            onChange={(e) => {
              setTime(e.target.value)
            }}
          />

          <button type="submit">Buscar</button>
        </form>
      </PageHeader>

      <main>
        {teachers.map((teacher) => {
          return <TeacherItem key={teacher.id} teacher={teacher} />
        })}
      </main>
    </div>
  )
}

export default TeacherList
