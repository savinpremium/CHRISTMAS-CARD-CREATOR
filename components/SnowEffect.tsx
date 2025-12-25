
import React, { useEffect, useState } from 'react';
import { SnowflakeProps } from '../types';

const SnowEffect: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<SnowflakeProps[]>([]);

  useEffect(() => {
    const createFlake = () => {
      const id = Math.random();
      const newFlake: SnowflakeProps = {
        id,
        size: Math.random() * 5 + 2,
        left: Math.random() * 100,
        duration: Math.random() * 5 + 5,
        opacity: Math.random() * 0.6 + 0.2,
        blur: Math.random() * 1.5,
      };

      setSnowflakes((prev) => [...prev.slice(-40), newFlake]);
    };

    const interval = setInterval(createFlake, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            left: `${flake.left}vw`,
            animationDuration: `${flake.duration}s`,
            opacity: flake.opacity,
            filter: `blur(${flake.blur}px)`,
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
