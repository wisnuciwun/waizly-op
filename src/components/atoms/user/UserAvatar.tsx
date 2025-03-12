import React from 'react';
import classNames from 'classnames';
import { Icon } from '@/components';
import Image from 'next/image';

interface Props {
  className?: string;
  size?: string | number;
  theme?: string;
  icon: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}
const UserAvatar: React.FC<Props> = ({
  className,
  size,
  theme,
  icon,
  text,
  image,
  imageAlt,
  children
}) => {
  const classes = classNames({
    'user-avatar': true,
    [`${className}`]: className,
    [`user-avatar-${size}`]: size,
    [`bg-${theme}`]: theme,
  });
  return (
    <div className={classes}>
      {icon ? <Icon name={icon} className="text-white"/> : null}
      {image && <Image src={image} alt={imageAlt} />}
      {text && !image && <span>{text}</span>}
      {children}
    </div>
  );
};

export default UserAvatar;
