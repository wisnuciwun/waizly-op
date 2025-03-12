// const UseCurrencyInput = (event, setValue, key) => {
//     const rawValue = event.target.value.replace(/[^0-9]/g, '');
//     const parsedValue = parseFloat(rawValue);
//     const formattedValue = !isNaN(parsedValue)
//         ? parsedValue.toLocaleString('id-ID', { minimumFractionDigits: 0 })
//         : '';
//     setValue(key, !isNaN(parsedValue) ? rawValue : '');
//     event.target.value = formattedValue;
// };

// export default UseCurrencyInput;

const UseCurrencyInput = (event, setValue, key, maxLength) => {
  const rawValue = event.target.value.replace(/[^0-9]/g, '');
  const truncatedValue = rawValue.substring(0, maxLength);
  const parsedValue = parseFloat(truncatedValue);
  const formattedValue = !isNaN(parsedValue)
    ? parsedValue.toLocaleString('id-ID', { minimumFractionDigits: 0 })
    : '';
  setValue(key, !isNaN(parsedValue) ? truncatedValue : '');

  event.target.value = formattedValue;
};

export default UseCurrencyInput;
