import React, { useState, useEffect, useRef } from 'react';
import tileWhite from '../assets/images/tile-white.svg';
import tileBlack from '../assets/images/tile-black.svg';
import '../styles/BackgroundLine.css';

const BackgroundLine = ({ theme }) => {
  const [tileHeight, setTileHeight] = useState(0);
  const tileRef = useRef(null);
  const tileImage = theme === 'dark' ? tileWhite : tileBlack;
  
  useEffect(() => {
    if (tileRef.current) {
      // Get the natural height of the tile image
      const img = new Image();
      img.src = tileImage;
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        const tileWidth = 11.41; // Set to 11.41px width as requested
        const calculatedHeight = tileWidth * aspectRatio;
        setTileHeight(calculatedHeight);
      };
    }
  }, [tileImage]);
  
  // Calculate how many tiles we need to fill the viewport height
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const tileCount = tileHeight > 0 ? Math.ceil(viewportHeight / tileHeight) : 20; // Fallback to 20 if height not calculated yet
  
  return (
    <div className="background-line">
      <div className="tile-container">
        {Array.from({ length: tileCount }).map((_, index) => (
          <img 
            key={index} 
            ref={index === 0 ? tileRef : null}
            src={tileImage} 
            alt="" 
            className="tile"
            style={{
              display: 'block',
              width: '11.41px',
              height: 'auto'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BackgroundLine;
