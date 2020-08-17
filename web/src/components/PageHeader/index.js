import React from "react";

import { Link } from "react-router-dom";

import backIcon from "../../assets/images/icons/back.svg";
import logo from "../../assets/images/logo.svg";

function PageHeader(props) {
  return (
    <header className="page-header">
      <div className="top-bar-container">
        <Link to="/">
          <img src={backIcon} alt="Voltar" />
        </Link>
        <img src={logo} alt="Proffy" />
      </div>
      <div className="header-content">
        <strong>{props.title}</strong>
      </div>
    </header>
  );
}

export default PageHeader;