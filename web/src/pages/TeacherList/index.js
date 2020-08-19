import React from "react";

import PageHeader from "../../components/PageHeader";
import TeacherItem from "../../components/TeacherItem";
import Input from "../../components/Input";

import "./styles.css";

function TeacherList() {
  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Esses são os Proffys disponíveis">
        <form id="search-teachers">
          <Input name="subject" label="Matéria" />
          <Input name="week-day" label="Dia da Semana" />
          <Input type="time" name="time" label="Horário" />
        </form>
      </PageHeader>

      <main>
        <TeacherItem />
      </main>
    </div>
  );
}

export default TeacherList;
