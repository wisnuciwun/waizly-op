import classNames from 'classnames';
import React from 'react';

interface Props {
  name?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  props?: any;
}
const Icon = ({ name, id, className, style, ...props }: Props ) => {
  const iconClass = classNames({
    [`${className}`]: className,
    icon: true,
    ni: true,
    [`ni-${name}`]: true,
  });
  return <em className={iconClass} id={id} style={style} {...props}></em>;
};
export default Icon;
