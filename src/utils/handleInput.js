export const handleInputNumeric = (event, setValue, key) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.startsWith('0') ? '' : inputValue.replace(/[^0-9]/g, '');

    setValue(key, numericValue);
};
