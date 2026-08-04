'use client';

import React, { memo, useMemo } from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

const AppLogo = memo(function AppLogo({
  size = 36,
  className = '',
  onClick,
}: AppLogoProps) {
  const containerClassName = useMemo(() => {
    const classes = ['inline-flex items-center justify-center flex-shrink-0'];
    if (onClick) classes.push('cursor-pointer hover:opacity-80 transition-opacity');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [onClick, className]);

  return (
    <div className={containerClassName} onClick={onClick} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect
          width="40"
          height="40"
          rx="10"
          fill="url(#logo_grad)"
          stroke="rgba(200, 150, 90, 0.4)"
          strokeWidth="1.5"
        />
        <path
          d="M12 12V28M12 20L20 12M12 20L20 28"
          stroke="#E8D5B7"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 12V28M24 20L31 12M24 20L31 28"
          stroke="#C8965A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="logo_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A1815" />
            <stop offset="1" stopColor="#080705" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
});

export default AppLogo;
