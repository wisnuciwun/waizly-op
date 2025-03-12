/* eslint-disable no-unused-vars */
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { SelectItemOptionsType } from 'primereact/selectitem';
import { DropdownProps } from 'primereact/dropdown'; // Import the DropdownProps interface

interface Props extends DropdownProps {
  value: string;
  onChange: (e: any) => void;
  options: SelectItemOptionsType;
  optionLabel?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const DropdownOption = ({
  value,
  onChange,
  options,
  optionLabel,
  placeholder,
  disabled,
  style,
  className,
  ...rest
}: Props) => {
  return (
    <Dropdown
      className={className}
      style={style}
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={options}
      optionLabel={optionLabel}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export default DropdownOption;
