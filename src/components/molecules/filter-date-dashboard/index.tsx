/* eslint-disable react-hooks/exhaustive-deps */
// React & Next import
import React, { useState, useEffect } from 'react';

// component
import DatePicker from 'react-datepicker';

// redux & api
import { useSelector } from 'react-redux';

// utils
import { convertEpochToDateString } from '@/utils/epochConvert';

function FilterDate({ setStartDate, setEndDate }) {
  const [rangeDate, setRangeDate] = useState({ start: null, end: null });
  const [openDate, setOpenDate] = useState<boolean>(false);
  // redux
  const { created_at_main_account } = useSelector((state: any) => state?.auth.user);

  // format date for url
  const formatDateForURL = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // handle change date
  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start, end });

    const formattedStart = start ? formatDateForURL(start) : '';
    const formattedEnd = end ? formatDateForURL(end) : '';

    if (start && end) {
      setStartDate(formattedStart);
      setEndDate(formattedEnd);
      // onChange();
      setOpenDate(false);
    }
  };

  // Calculate the maximum selectable end date based on the selected start date
  const maxEndDate = new Date(rangeDate.start);
  maxEndDate.setDate(maxEndDate.getDate() + 90);

  // on calender close
  const handleCalendarClose = () => {
    if (rangeDate.start && !rangeDate.end) {
      const today = new Date();
      setRangeDate({ start: today, end: today });
      const formattedToday = formatDateForURL(today);
      setStartDate(formattedToday);
      setEndDate(formattedToday);
    }
  };

  useEffect(() => {
    const today = new Date();
    setRangeDate({ start: today, end: today });
    const formattedToday = formatDateForURL(today);
    setStartDate(formattedToday);
    setEndDate(formattedToday);
  }, []);

  return (
    <>
      <DatePicker
        selected={rangeDate.start}
        startDate={rangeDate.start}
        placeholderText={'Pilih Tanggal'}
        onChange={onRangeChange}
        onCalendarClose={handleCalendarClose}
        endDate={rangeDate.end}
        selectsRange
        showIcon
        onFocus={()=> setOpenDate(true)}
        onClickOutside={() => setOpenDate(false)}
        className="form-control"
        onChangeRaw={(e) => e.preventDefault()}
        maxDate={maxEndDate > new Date() ? new Date() : maxEndDate}
        minDate={convertEpochToDateString(created_at_main_account)}
        dateFormat="dd/MM/yyyy"
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        open={openDate}
        icon={
          <svg
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={()=> setOpenDate(true)}
          >
            <path
              d="M4 11.6602C4 11.4388 4.07812 11.25 4.23438 11.0938C4.40365 10.9245 4.60547 10.8398 4.83984 10.8398H7.33984C7.5612 10.8398 7.75 10.9245 7.90625 11.0938C8.07552 11.25 8.16016 11.4388 8.16016 11.6602C8.16016 11.8945 8.07552 12.0964 7.90625 12.2656C7.75 12.4219 7.5612 12.5 7.33984 12.5H4.83984C4.60547 12.5 4.40365 12.4219 4.23438 12.2656C4.07812 12.0964 4 11.8945 4 11.6602ZM10.25 12.5H13.5898C13.8112 12.5 14 12.4219 14.1562 12.2656C14.3255 12.0964 14.4102 11.8945 14.4102 11.6602C14.4102 11.4388 14.3255 11.25 14.1562 11.0938C14 10.9245 13.8112 10.8398 13.5898 10.8398H10.25C10.0156 10.8398 9.8138 10.9245 9.64453 11.0938C9.48828 11.25 9.41016 11.4388 9.41016 11.6602C9.41016 11.8945 9.48828 12.0964 9.64453 12.2656C9.8138 12.4219 10.0156 12.5 10.25 12.5ZM17.3398 5V14.1602C17.3398 14.8503 17.0924 15.4427 16.5977 15.9375C16.1159 16.4193 15.5299 16.6602 14.8398 16.6602H3.16016C2.47005 16.6602 1.8776 16.4193 1.38281 15.9375C0.901042 15.4427 0.660156 14.8503 0.660156 14.1602V5C0.660156 4.3099 0.901042 3.72396 1.38281 3.24219C1.8776 2.7474 2.47005 2.5 3.16016 2.5H4.83984V1.66016C4.83984 1.4388 4.91797 1.25 5.07422 1.09375C5.24349 0.924479 5.4388 0.839844 5.66016 0.839844C5.89453 0.839844 6.08984 0.924479 6.24609 1.09375C6.41536 1.25 6.5 1.4388 6.5 1.66016V2.5H11.5V1.66016C11.5 1.4388 11.5781 1.25 11.7344 1.09375C11.9036 0.924479 12.1055 0.839844 12.3398 0.839844C12.5612 0.839844 12.75 0.924479 12.9062 1.09375C13.0755 1.25 13.1602 1.4388 13.1602 1.66016V2.5H14.8398C15.5299 2.5 16.1159 2.7474 16.5977 3.24219C17.0924 3.72396 17.3398 4.3099 17.3398 5ZM2.33984 7.5H15.6602V5C15.6602 4.76562 15.5755 4.57031 15.4062 4.41406C15.25 4.24479 15.0612 4.16016 14.8398 4.16016H13.1602V5C13.1602 5.23438 13.0755 5.4362 12.9062 5.60547C12.75 5.76172 12.5612 5.83984 12.3398 5.83984C12.1055 5.83984 11.9036 5.76172 11.7344 5.60547C11.5781 5.4362 11.5 5.23438 11.5 5V4.16016H6.5V5C6.5 5.23438 6.41536 5.4362 6.24609 5.60547C6.08984 5.76172 5.89453 5.83984 5.66016 5.83984C5.4388 5.83984 5.24349 5.76172 5.07422 5.60547C4.91797 5.4362 4.83984 5.23438 4.83984 5V4.16016H3.16016C2.9388 4.16016 2.74349 4.24479 2.57422 4.41406C2.41797 4.57031 2.33984 4.76562 2.33984 5V7.5ZM15.6602 9.16016H2.33984V14.1602C2.33984 14.3945 2.41797 14.5964 2.57422 14.7656C2.74349 14.9219 2.9388 15 3.16016 15H14.8398C15.0612 15 15.25 14.9219 15.4062 14.7656C15.5755 14.5964 15.6602 14.3945 15.6602 14.1602V9.16016Z"
              fill="#203864"
            />
          </svg>
        }
      />
    </>
  );
}

export default FilterDate;
