import React from 'react';
import classnames from 'classnames';
import { ColType, RowType } from './type';

export const Col: React.FC<ColType> = ({ sm, lg, md, xxl, size, className, children, style }) => {
  var classNames = classnames({
    [`col-sm-${sm}`]: sm,
    [`col-lg-${lg}`]: lg,
    [`col-md-${md}`]: md,
    [`col-xxl-${xxl}`]: xxl,
    [`col-${size}`]: size,
    [`${className}`]: className,
  });
  return <div className={classNames} style={style}>{children}</div>;
};

export const Row: React.FC<RowType> = ({ className, children, style }) => {
  const rowClass = classnames({
    row: true,
    [`${className}`]: className,
  });
  return <div className={rowClass} style={style}>{children}</div>;
};
