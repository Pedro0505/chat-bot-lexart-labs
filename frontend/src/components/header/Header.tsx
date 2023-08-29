import React, { ReactNode } from 'react';
import headerLogo from './assets/haederLogo.png';
import './style.css';

interface HeaderProps {
  children: ReactNode;
}

function Header({ children }: HeaderProps) {
  return (
    <header className="header-container">
      <div className="header-title-container  no-select">
        <img src={headerLogo} alt="Imagem de um robô com uma cara feliz e braços abertos" />
        <h1>Loan Helper</h1>
      </div>
      <nav className="header-navgation">{children}</nav>
    </header>
  );
}

export default Header;
