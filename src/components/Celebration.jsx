import React, { useEffect } from 'react';

const Celebration = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate 25 colorful celebratory sparkle particles
  const sparkles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 90 + 5}%`,
    top: `${Math.random() * 40 + 20}%`,
    color: ['#E6A93D', '#22c55e', '#0ea5e9', '#a855f7', '#ef4444', '#f59e0b'][i % 6],
    delay: `${(Math.random() * 0.4).toFixed(2)}s`,
    size: `${Math.floor(Math.random() * 12 + 10)}px`
  }));

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            fontSize: s.size,
            color: s.color,
            animation: `sparklePop 1.8s ease-out ${s.delay} forwards`,
            textShadow: `0 0 8px ${s.color}`
          }}
        >
          {['✨', '🎉', '⭐', '⚡', '🏆', '🌟'][s.id % 6]}
        </div>
      ))}

      <style>{`
        @keyframes sparklePop {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(0);
          }
          40% {
            opacity: 1;
            transform: scale(1.4) translateY(-25px);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(-60px);
          }
        }
      `}</style>
    </div>
  );
};

export default Celebration;
