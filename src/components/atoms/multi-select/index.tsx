import { MultiSelect } from 'primereact/multiselect';
import { SelectItemOptionsType } from 'primereact/selectitem';
import React from 'react';

interface Props {
  value: string;
  onChange: ()=> void;
  option: SelectItemOptionsType;
  optionLabel?: string;
  display?: 'comma' | 'chip';
  placeholder?: string;
  className?: string;
}

const MultiSelectOption = ({
  value,
  onChange,
  option,
  optionLabel,
  display,
  placeholder,
  className,
}: Props) => {
  return (
    <MultiSelect
      className={className}
      clearIcon={false}
      value={value}
      onChange={onChange}
      options={option}
      optionLabel={optionLabel}
      display={display}
      placeholder={placeholder}
    />
  );
};

export default React.memo(MultiSelectOption);
