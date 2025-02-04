import fleche from "../assets/images/LogoGif/fleche.png";
import texte from "../assets/images/LogoGif/texte.png";
import sac from "../assets/images/LogoGif/sac.png";
import React from "react";
import "../style/logoGif.css";

const LogoGif: React.FC = () => {
  return (
    <div className="logo-gif-container">
      <img src={texte} alt="Logo sans flèche" className="logo-principal" />
      <img src={sac} alt="Sac" className="logo-sac" />
      <img src={fleche} alt="Flèche" className="logo-fleche" />
    </div>
  );
};

export default LogoGif;
