const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('en-US', {
    // style: "currency",
    // currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

export { formatCurrency };

// id-ID
const formatCurrencyId = (amount) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0, // Menghapus tanda desimal
    maximumFractionDigits: 0,
  });
  return formatter.format(amount).replace(/\./g, ''); // Menghapus pemisah ribuan
};

export { formatCurrencyId };
