import React from 'react'

import api from '../../services/api'

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'

import './styles.css'

function TeacherItem({ teacher }) {
  function createNewconnection() {
    api.post('connections', {
      user_id: teacher.id,
    })
  }

  return (
    <article className="teacher-item">
      <header>
        <img src={teacher.avatar} alt={teacher.name} />
        <div>
          <strong>{teacher.name}</strong>
          <span>{teacher.subject}</span>
        </div>
      </header>

      <p>{teacher.bio}</p>
      <footer>
        <p>
          Preço/hora
          <strong>R$ {teacher.cost}</strong>
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={createNewconnection}
          href={`http://wa.me/${teacher.whatsapp}`}
        >
          <img src={whatsappIcon} alt="Whatsapp" />
          Entrar em contato.
        </a>
      </footer>
    </article>
  )
}

export default TeacherItem
