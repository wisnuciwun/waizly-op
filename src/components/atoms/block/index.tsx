import React from 'react';
import Link from 'next/link';
import Icon from '../icon';
import classNames from 'classnames';

import { 
  BlockType,
  BlockContentType,
  BlockBetweenType,
  BlockHeadType,
  BlockHeadContentType,
  BlockTitleType,
  BlockDesType,
  BackToType
} from './type';

export const Block: React.FC<BlockType> = ({ className, size, children, style }) => {
  const blockClass = classNames({
    'nk-block': true,
    [`nk-block-${size}`]: size,
    [`${className}`]: className,
  });
  return <div className={blockClass} style={style}>{children}</div>;
};

export const BlockContent: React.FC<BlockContentType> = ({ className, children, style }) => {
  const blockContentClass = classNames({
    'nk-block-content': true,
    [`${className}`]: className,
  });
  return <div className={blockContentClass} style={style}>{children}</div>;
};

export const BlockBetween: React.FC<BlockBetweenType> = ({ className, children, style }) => {
  return (
    <div className={`nk-block-between ${className ? className : ''}`} style={style}>
      {children}
    </div>
  );
};

export const BlockHead: React.FC<BlockHeadType> = ({ className, size, wide, children, style }) => {
  const blockHeadClass = classNames({
    'nk-block-head': true,
    [`nk-block-head-${size}`]: size,
    [`wide-${wide}`]: wide,
    [`${className}`]: className,
  });
  return <div className={blockHeadClass} style={style}>{children}</div>;
};

export const BlockHeadContent: React.FC<BlockHeadContentType> = ({ className, children, style }) => {
  return (
    <div
      className={`nk-block-head-content${className ? ' ' + className : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

export const BlockTitle: React.FC<BlockTitleType> = ({ className, fontSize = 24, children , style}) => {
  const classes =  `nk-block-title page-title ${className ? ' ' + className : ''}`;

  return (
    <React.Fragment>
      {typeof children === 'string' ? (
        <h3 className={classes} style={style ? style : { fontSize: fontSize }}>
          {children}
        </h3>
      ) : (
        <p className={classes} style={style}>{children}</p>
      )}
    </React.Fragment>
  );
};


export const BlockDes: React.FC<BlockDesType>  = ({ className, children, style }) => {
  const classes = `nk-block-des${className ? ' ' + className : ''}`;
  return <div className={classes} style={style}>{children}</div>;
};

export const BackTo: React.FC<BackToType> = ({ className, link, icon, children, style }) => {
  const classes = `back-to${className ? ' ' + className : ''}`;
  return (
    <div className="nk-block-head-sub">
      <Link className={classes} href={process.env.PUBLIC_URL + link} style={style}>
        <Icon name={icon} />
        <span>{children}</span>
      </Link>
    </div>
  );
};
