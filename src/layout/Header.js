import React from 'react';
import './Header.css';
import logo from '../resources/hwasung_logo.png'

const Header = () => {
  return (
    <header>
      <div className="topBack"></div>
      <img className="Logo" src={logo} alt="logo"></img>
    </header>
  );
};

export default Header;