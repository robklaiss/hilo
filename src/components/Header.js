import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logoLight from '../assets/images/hilo-logo-light-background.svg';
import logoDark from '../assets/images/hilo-logo-dark-background.svg';
import { ReactComponent as LightModeIcon } from '../assets/images/light-mode.svg';
import { ReactComponent as DarkModeIcon } from '../assets/images/dark-mode.svg';
import { ReactComponent as MenuLight } from '../assets/images/menu-light-mode.svg';
import { ReactComponent as MenuDark } from '../assets/images/menu-dark-mode.svg';
import { ReactComponent as CloseLight } from '../assets/images/close-light-mode.svg';
import { ReactComponent as CloseDark } from '../assets/images/close-dark-mode.svg';
import BackgroundLine from './BackgroundLine';

const Header = ({ theme, onThemeToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use dark-background logo for dark theme and light-background logo for light theme
  const currentLogo = theme === 'dark' ? logoDark : logoLight;
  const MenuIcon = theme === 'dark' ? MenuDark : MenuLight;
  const CloseIcon = theme === 'dark' ? CloseDark : CloseLight;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={`${styles.appHeader} ${isMenuOpen ? styles.menuOpen : ''}`}>
        <div className={styles.menuContainer}>
          <button 
            onClick={toggleMenu} 
            className={`${styles.menuButton} ${styles.themeSwitcher}`}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        <div className={styles.logoContainer}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src={currentLogo} alt="Hilo Logo" className={styles.logo} />
          </Link>
        </div>
        <div className={styles.controlsContainer}>
          <button 
            onClick={onThemeToggle} 
            className={styles.themeSwitcher}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </button>
        </div>
      </header>
      <BackgroundLine theme={theme} />
      {isMenuOpen && (
        <div className={styles.menuOverlay}>
          <nav className={styles.navMenu}>
            <Link to="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Inicio</Link>
            <Link to="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Acerca de</Link>
            <Link to="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
