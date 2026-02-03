import React from 'react'

const Logo = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={`
        w-8 h-8
        transition-all duration-300
        hover:scale-110 hover:-rotate-6
        drop-shadow-[0_0_20px_rgba(251,113,133,0.7)]
        ${className}
      `}
      fill="none"
    >
      <defs>
        <linearGradient id="playfulBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        <linearGradient id="highlight" x1="0" y1="0" x2="0" y2="48">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="14" fill="url(#playfulBg)" />
      <rect width="48" height="48" rx="14" fill="url(#highlight)" />

      <path
        d="m25.6029 11.2749c-2.3431-2.34311-6.1421-2.34311-8.4853 0l-8.48524 8.4853c-2.34315 2.3432-2.34315 6.1422 0 8.4853l8.48524 8.4853c2.3432 2.3431 6.1422 2.3431 8.4853 0l4.0487-4.0487c-3.3704-1.3003-5.7615-4.5708-5.7615-8.3998 0-3.9816 2.5854-7.3592 6.169-8.5457-.07-.0737-.1412-.1467-.2135-.219z"
        fill="rgba(255,255,255,0.9)"
      />

      <path
        d="m29.6523 32.6848c1.0048.3876 2.0966.6001 3.2381.6001 4.9705 0 9-4.0294 9-9s-4.0295-9-9-9c-.9889 0-1.9405.1595-2.8305.4541 4.4717 4.7011 4.4006 12.1377-.2135 16.7517z"
        fill="rgba(255,255,255,0.55)"
      />
    </svg>
  )
}

export default Logo
