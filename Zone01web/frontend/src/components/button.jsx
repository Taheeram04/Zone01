import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: disabled
      ? 'bg-primary/40 text-white'
      : 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
    secondary: disabled
      ? 'bg-secondary/40 text-white'
      : 'bg-secondary text-white hover:bg-secondary/90 active:bg-secondary/80',
    accent: disabled
      ? 'bg-accent/40 text-black-900'
      : 'bg-accent text-black-900 hover:bg-accent/90 active:bg-accent/80',
    outline: disabled
      ? 'bg-white border border-primary/30 text-primary/30'
      : 'bg-white border border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <button
      className={`
        ${variantStyles[variant] || variantStyles.primary}
        ${className}
        font-mono font-medium
        px-6 py-3
        rounded-md
        flex items-center justify-center
        transition-all duration-200
        disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary/50
      `.replace(/\s+/g, ' ').trim()}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;