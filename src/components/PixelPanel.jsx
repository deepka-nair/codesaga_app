import React from 'react';

const PixelPanel = ({ children, className = '', style = {} }) => {
  return (
    <div className={`pixel-panel ${className}`} style={style}>
      {children}
    </div>
  );
};

export default PixelPanel;
