import React, { useContext } from 'react';
import { AppContext } from '../../App'; // Importa el contexto global
import './footer.css'; // Importamos el archivo de estilo

const Footer = () => {
  const { currentYear, companyInfo } = useContext(AppContext);
  return (
    <footer className="footer">
      <p>© {currentYear} {companyInfo.name} - {companyInfo.address}</p>
    </footer>
  );
};

export default Footer;
