import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';

// Componente para un conjunto de sliders
// Utiliza el hook useParams para obtener el ID del conjunto de la URL
const MOBILE_BREAKPOINT = 768;

function SliderSet() {
  let { setId } = useParams(); // setId corresponderá a 'set1', 'set2', etc.
  const navigate = useNavigate(); // Hook for navigation
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  // Simulación de carga de datos para el slider
  // En una aplicación real, aquí harías una petición a tu API basada en setId
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulación de una API call
    const fetchSliderData = async () => {
      try {
        // Ejemplo: si tuvieras una API como /api/sliders/:setId
        // const response = await axios.get(`/api/sliders/${setId}`);
        // setSliderData(response.data.slides);

        // Datos de ejemplo hardcodeados por ahora
        let exampleSlides = [];
        const numSlides = setId === 'set1' ? 5 : setId === 'set2' ? 8 : 3;
        for (let i = 1; i <= numSlides; i++) {
          exampleSlides.push({
            id: `slide-${setId}-${i}`,
            content: `Contenido del Slide ${i} para el Conjunto ${setId}`,
            // Podrías tener una URL de imagen aquí
            // imageUrl: `https://picsum.photos/seed/${setId}-${i}/800/400` 
          });
        }
        setSliderData(exampleSlides);
        
      } catch (err) {
        setError('Error al cargar los datos del slider. Inténtalo de nuevo más tarde.');
        console.error("Error fetching slider data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderData();
  }, [setId]); // Se vuelve a ejecutar si setId cambia

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    // Call handler right away so state is set correctly on initial load
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <p>Cargando sliders para el conjunto "{setId}"...</p>;
  }

  if (error) {
    return <p style={{color: 'red'}}>{error}</p>;
  }

  if (sliderData.length === 0) {
    return <p>No hay slides disponibles para este conjunto.</p>;
  }

  return (
    <div className={`slider-set-page ${isMobileView ? 'fullscreen-mobile' : ''}`}>
      {/* This button will be styled to only be prominent in fullscreen mobile view */}
      <button 
        className="close-fullscreen-slider-btn"
        onClick={() => navigate('/')} 
        aria-label="Close slider view"
      >
        &times; {/* HTML entity for X */}
      </button>
      {/* Conditionally render based on mobile view or use CSS to hide */}
      {!isMobileView && (
        <>
          <nav style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
            <Link to="/">&larr; Volver al Índice</Link>
          </nav>
        </>
      )}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={30} // Espacio entre slides
        slidesPerView={1} // Cuántos slides mostrar a la vez (puedes cambiarlo a 2, 3, 'auto', etc.)
        navigation // Habilita flechas de navegación
        pagination={{ clickable: true }} // Habilita paginación con bullets clickeables
        scrollbar={{ draggable: true }} // Habilita scrollbar
        loop={true} // Permite que el slider sea infinito
        autoplay={{
          delay: 3000, // Tiempo en ms entre cada slide automático
          disableOnInteraction: false, // No detener autoplay con interacción manual
        }}
        // breakpoints={{ // Ejemplo de configuración responsiva para slidesPerView
        //   // cuando el ancho de la ventana es >= 640px
        //   640: {
        //     slidesPerView: 2,
        //     spaceBetween: 20
        //   },
        //   // cuando el ancho de la ventana es >= 768px
        //   768: {
        //     slidesPerView: 3,
        //     spaceBetween: 30
        //   }
        // }}
        className="swiper-container" // Clase para estilos personalizados si es necesario
      >
        {sliderData.map(slide => (
          <SwiperSlide key={slide.id}>
            {/* Aquí puedes poner el contenido de tu slide, por ejemplo una imagen y texto */}
            {/* <img src={slide.imageUrl} alt={slide.content} /> */}
            <div style={{ padding: '20px', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {slide.content}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SliderSet;
