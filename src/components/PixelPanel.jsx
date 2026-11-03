import React from 'react';

const PixelPanel = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div {...props} className={`pixel-panel ${className}`} style={style}>
      {children}
    </div>
  );
};

export default PixelPanel;
