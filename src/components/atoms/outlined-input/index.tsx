import React, { useState } from 'react';
import Icon from '../icon';

interface Props {
  label: string;
  size: string | number;
  id?: string;
  icon: string
}

const OutlinedInput = ({ label, size, id, icon }: Props) => {
  const [focus, setFocus] = useState(false);
  return (
    <div className={`form-control-wrap ${focus ? 'focused' : ''}`}>
      {icon && (
        <div className="form-icon form-icon-right xl">
          <Icon name={icon}></Icon>
        </div>
      )}
      <input
        type="text"
        className={`form-control-outlined form-control ${size ? `form-control-${size}` : ''}`}
        id={id}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <label className="form-label-outlined" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default OutlinedInput;
