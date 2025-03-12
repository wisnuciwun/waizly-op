import React from 'react';
import ReactSelect, { components } from 'react-select';

const Placeholder = (props) => {
  return <components.Placeholder {...props} />;
};

const Select = ({ placeholderText, isValid, ...props }) => {
  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: '#b7c8e6 !important',
    }),

    NoOptionsMessage: (provided) => ({
      ...provided,
      color: 'red !important',
    }),

    control: (provided) => ({
      ...provided,
      borderColor: isValid ? 'red !important' : '#dbdfea !important',
    }),

    option: (provided) => ({
      ...provided,
      color: '#4C4F54 !important',
    }),
  };

  const noOptionsMessage = () => {
    return 'Tidak ada pilihan';
  };

  return (
    <div className="form-control-select">
      <ReactSelect
        components={{ Placeholder }}
        placeholder={placeholderText}
        className={`react-select-container ${props.className ? props.className : ''
          }`}
        styles={customStyles}
        classNamePrefix="react-select"
        noOptionsMessage={noOptionsMessage}
        {...props}
      />
    </div>
  );
};

export default Select;
