/* eslint-disable no-unused-vars */
// third party
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

// utils
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

// costum placeholder
const Placeholder = (props) => {
  return <components.Placeholder {...props} />;
};

// Custom Option component
const CustomOption = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <div style={{ overflowX: 'hidden', padding: 3 }}>
        <span className="fw-bold" style={{ color: '#4C4F54' }}>
          {data.sub_district_name}
        </span>
        <p style={{ color: '#4C4F54' }}>
          {capitalizeFirstLetter(data.district_name)}, {data.city_name},{' '}
          {data.province_name}
        </p>
      </div>
    </components.Option>
  );
};

const SelectWidthAsync = ({ placeholderText, isValid, value, ...props }) => {
  // costum style react select
  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: '#b7c8e6 !important',
    }),

    noOptionsMessage: (provided) => ({
      ...provided,
      color: '#4C4F54 !important',
    }),

    control: (provided) => ({
      ...provided,
      borderColor: isValid ? 'red !important' : '#dbdfea !important',
    }),
  };

  const loadingMessage = () => {
    return 'Sedang memuat lokasi...';
  };

  return (
    <>
      <AsyncSelect
        loadingMessage={loadingMessage}
        components={{ Placeholder, Option: CustomOption }}
        placeholder={placeholderText}
        className={`react-select-container ${
          props.className ? props.className : ''
        }`}
        styles={{...customStyles}}
        classNamePrefix="react-select"
        {...props}
      />
    </>
  );
};

export default SelectWidthAsync;
