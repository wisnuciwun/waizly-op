/* eslint-disable no-unused-vars */
// React & Next import
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// component
import { MultiSelect } from 'primereact/multiselect';
import { Input } from 'reactstrap';
import { Icon } from '@/components';

// data
import { getStoreLogo } from './data-filter';

interface dataSelect {
  name: string;
  channel_name: string;
}

interface Props {
  option: dataSelect[];
  className?: string;
  emptyMessage?: string;
  emptyFilterMessage?: string;
  placeholder: string;
  disabled: boolean;
  valueOption: any;
  setValueOption: any;
  optionValue?: string;
  optionLabel?: string;
}

const customHeaderTemplate = (onFilterChange: (value: string) => void) => {
  return (
    <div className="custom-header-filter">
      <Input
        className="costum-input-filter shadow-none"
        placeholder="Cari Toko"
        onChange={(e) => onFilterChange(e.target.value)}
      />
      <Icon name="search" className="custom-icon-filter"  style={{ color: '#203864', backgroundColor: '#ffffff' }}/>
    </div>
  );
};

function FilterStore({
  option,
  className,
  emptyMessage,
  emptyFilterMessage,
  placeholder,
  disabled,
  valueOption,
  setValueOption,
  optionValue,
  optionLabel,
  ...props
}: Props) {
  const [filteredOptions, setFilteredOptions] = useState(option);

  const handleFilterChange = (value: string) => {
    const filtered = option.filter((opt) =>
      opt.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleHide = () => {
    setFilteredOptions(option);
  };

  useEffect(() => {
    if (disabled) {
      setValueOption([]);
    }
  }, [disabled, setValueOption]);

  useEffect(() => {
    setFilteredOptions(option);
  }, [option]);

  return (
    <>
      <MultiSelect
        value={valueOption}
        onChange={(e) => setValueOption(e.value)}
        options={filteredOptions}
        display={'chip'}
        className={`${className}`}
        optionValue={optionValue}
        filter
        optionLabel={optionLabel}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        onHide={handleHide}
        emptyFilterMessage={emptyFilterMessage}
        panelHeaderTemplate={() => customHeaderTemplate(handleFilterChange)}
        disabled={disabled}
        itemTemplate={(option) => (
          <>
            <div className="d-flex align-items-center">
              <Image
                width={20}
                height={20}
                src={getStoreLogo(option?.channel_name).logo}
                alt={'image-list-store'}
              />
              <span style={{ paddingLeft: 10, marginRight: 10, wordWrap: 'break-word', wordBreak: 'break-word' }}>{option?.name}</span>
            </div>
          </>
        )}
        {...props}
      />
    </>
  );
}

export default FilterStore;
