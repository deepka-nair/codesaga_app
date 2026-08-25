import React from 'react';

// Using inline SVG with shape-rendering="crispEdges" to guarantee perfectly sharp pixel art
const icons = {
  heart: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M2 4h2v-2h4v2h2v2h2v4h-2v2h-2v2h-4v-2h-2v-2h-2v-4h2v-2z" fill="#ef4444" />
      <path d="M4 2h2v2h-2zM10 2h2v2h-2z" fill="#fca5a5" />
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M6 0h4v4h4v4h-2v2h2v4h-4v-2h-4v2h-4v-4h2v-2h-2v-4h4v-4z" fill="#f59e0b" />
      <path d="M8 2h2v2h-2z" fill="#fde68a" />
    </svg>
  ),
  flame: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M6 2h4v4h2v6h-8v-6h2v-4z" fill="#ea580c" />
      <path d="M8 6h2v6h-4v-4h2v-2z" fill="#facc15" />
    </svg>
  ),
  trophy: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M2 2h12v4h-2v2h-2v2h-2v4h4v2h-8v-2h4v-4h-2v-2h-2v-2h-2v-4z" fill="#eab308" />
    </svg>
  ),
  sound: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M2 6h4v4h-4zM6 4h2v8h-2zM8 2h2v12h-2zM12 4h2v8h-2zM14 6h2v4h-2z" fill="#94a3b8" />
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M4 2h8v6h2v6h-12v-6h2v-6z" fill="#cbd5e1" />
      <path d="M6 4h4v4h-4z" fill="#0a0e17" />
    </svg>
  ),
  // Placeholders for world icons (replacing emojis)
  detective: (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M2 6h12v2h-12zM4 2h8v4h-8zM4 8h2v4h-2zM10 8h2v4h-2z" fill="#06b6d4" />
    </svg>
  ),
  python: (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M4 2h8v4h-4v2h4v6h-8v-4h4v-2h-4z" fill="#22c55e" />
    </svg>
  ),
  java: (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M2 10h12v4h-12zM4 2h2v6h-2zM8 4h2v6h-2z" fill="#f59e0b" />
    </svg>
  ),
  cpp: (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M8 2h2v12h-2zM4 6h10v2h-10zM12 6h2v6h-2z" fill="#a855f7" />
    </svg>
  ),
  frontend: (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M2 2h12v10h-12zM4 4h8v6h-8z" fill="#0ea5e9" />
    </svg>
  ),
  backend: (
    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
      <path d="M4 2h8v4h-8zM4 10h8v4h-8zM6 4h2v2h-2zM6 12h2v2h-2z" fill="#ef4444" />
    </svg>
  ),
};

const PixelIcon = ({ name, size = 16, style = {} }) => {
  const icon = icons[name];
  if (!icon) return null;
  
  return (
    <div style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      {React.cloneElement(icon, { width: size, height: size })}
    </div>
  );
};

export default PixelIcon;
