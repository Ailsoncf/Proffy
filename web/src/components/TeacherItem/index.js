import React from "react";

import whatsappIcon from "../../assets/images/icons/whatsapp.svg";

import "./styles.css";

function TeacherItem() {
  return (
    <article className="teacher-item">
      <header>
        <img
          src="https://avatars3.githubusercontent.com/u/61307843?s=460&u=16a6d7a3aac7ecda47c15fc6cdb857cd605361af&v=4"
          alt="Foto Perfil"
        />
        <div>
          <strong>Ailson de Carvalho</strong>
          <span>Coding</span>
        </div>
      </header>

      <p>Descrição do Proffy</p>
      <footer>
        <p>
          Preço/hora
          <strong>R$ 100,00</strong>
        </p>
        <button type="button">
          <img src={whatsappIcon} alt="Whatsapp" />
          Entrar em contato.
        </button>
      </footer>
    </article>
  );
}

export default TeacherItem;
