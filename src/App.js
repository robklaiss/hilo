import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Removed BrowserRouter as Router
import Header from './components/Header'; 
import IndexPage from './components/IndexPage';
import SliderSet from './components/SliderSet';
import './styles.css'; 

function App() {
  const [theme, setTheme] = useState('light'); 

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('hilo-theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hilo-theme', theme);
    document.body.className = ''; 
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const tapaData = [
    { id: 'set1', title: 'Conjunto de Sliders 1', description: 'Una breve descripción del primer conjunto.', path: '/sliders/set1', sliderCount: 5 },
    { id: 'set2', title: 'Conjunto de Sliders 2', description: 'Explora el segundo carrusel de imágenes.', path: '/sliders/set2', sliderCount: 8 },
    { id: 'set3', title: 'Conjunto de Sliders 3', description: 'El tercer y último conjunto de demostración.', path: '/sliders/set3', sliderCount: 3 },
  ];

  return (
    <>
      <div className={`app-container app-theme-${theme}`}> 
        <Header theme={theme} onThemeToggle={toggleTheme} />
        <Routes>
          <Route path="/" element={<IndexPage tapas={tapaData} />} />
          <Route path="/sliders/:setId" element={<SliderSet />} />
        </Routes>
      </div>
      <footer style={{ textAlign: 'center', marginTop: '40px', padding: '20px', borderTop: '0px solid #eee' }}>
        <p>&copy; 2025 HILO Sliders. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default App;
