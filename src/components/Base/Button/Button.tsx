import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  name?: string;
  color?: string; // secondary, success, error, primary
  variant?: string; // text, contained, outlined
  onClick?: () => void | Promise<void>;
}

const Button: React.FC<Props> = ({ children, variant, className, onClick }) => {
  return (
    <button className={`text-sm py-3 px-5 rounded-2xl btn-${variant} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
