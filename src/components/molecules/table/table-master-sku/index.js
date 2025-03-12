/* eslint-disable no-unused-vars */
import classNames from 'classnames';
import React from 'react';
import { Card } from 'reactstrap';

export const DataTable = ({ className, bodyClassName, title, ...props }) => {
  return (
    <Card className={`card-bordered ${className ? className : ''}`}>
      <div className="card-inner-group">{props.children}</div>
    </Card>
  );
};

export const DataTableTitle = ({ ...props }) => {
  return (
    <div className="master-sku-table-title py-1" style={{ fontSize: 13 }}>
      <div className="card-title-group">{props.children}</div>
    </div>
  );
};

export const DataTableBody = ({ compact, className, bodyclass, ...props }) => {
  return (
    <div className={`p-0 ${className ? className : ''}`}>
      <div
        className={`master-sku-nk-tb-list ${bodyclass ? bodyclass : ''} ${compact ? 'is-compact' : ''
          }`}
      >
        {props.children}
      </div>
    </div>
  );
};

export const DataTableHead = ({ ...props }) => {
  return <div className="nk-tb-item">{props.children}</div>;
};

export const DataTableRow = ({ className, ...props }) => {
  const rowClass = classNames({
    'master-sku-nk-tb-col': true,
    [`${className}`]: className,
  });
  <br />;
  return <div className={rowClass} {...props}>{props.children}</div>;
};

export const DataTableRowChild = ({ className, ...props }) => {
  const rowClass = classNames({
    'master-sku-nk-tb-col-v2': true,
    [`${className}`]: className,
  });
  <br />;
  return <div className={rowClass} {...props}>{props.children}</div>;
};

export const DataTableItem = ({ className, ...props }) => {
  return (
    <div className={`nk-tb-item ${className ? className : ''}`}>
      {props.children}
    </div>
  );
};
