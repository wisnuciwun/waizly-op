import React from 'react';
import classNames from 'classnames';

interface Props {
  color?: string;
  hidden?: boolean;
  size?: string;
  className?: string;
  onClick?: () => void;
  outline?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'button' | 'reset' | 'submit';
}

const Button: React.FC<Props> = ({
  color,
  size,
  className,
  onClick,
  outline,
  disabled,
  children,
  type,
  style,
  hidden = false,
}) => {
  const buttonClass = classNames({
    btn: true,
    [`btn-${color}`]: !outline,
    [`btn-outline-${color}`]: outline,
    [`btn-${size}`]: size,
    disabled: disabled,
    [`${className}`]: className,
  });
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClass}
      style={style}
      hidden={hidden}
    >
      {children}
    </button>
  );
};
export default Button;
