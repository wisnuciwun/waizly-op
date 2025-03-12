import React from 'react';

export const DataTableTitle = ({ ...props }) => {
  return (
    <div
      className="master-sku-table-title py-1"
      style={{ fontSize: 12, fontWeight: 'normal', color: '#4C4F54' }}
    >
      <div className="card-title-group">{props.children}</div>
    </div>
  );
};
