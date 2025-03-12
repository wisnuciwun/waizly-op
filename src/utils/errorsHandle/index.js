export const handleErrorFormMasterSku = (error, data, setError) => {

    const errorType = error.response?.data?.error?.type;

    const errorMapping = {
        NAME_IS_EXIST: { field: 'name_sku', message: 'Nama SKU sudah pernah dipakai' },
        SKU_IS_EXIST: { field: 'code_sku', message: 'Kode SKU sudah pernah dipakai' },
        ANY_FIELD_NOT_BE_EMPTY: [
            { field: 'product_width', message: 'Lebar Produk tidak boleh kosong' },
            { field: 'product_length', message: 'Panjang Produk tidak boleh kosong' },
            { field: 'product_height', message: 'Tinggi Produk tidak boleh kosong' },
        ],
    };

    if (errorType) {
        const errorInfo = errorMapping[errorType];
        console.log(errorInfo);

        if (errorInfo) {
            if (Array.isArray(errorInfo)) {
                errorInfo.forEach(({ field, message }) => {
                    if (data[field] === null) {
                        setError(field, { type: 'manual', message });
                    }
                });
            } else {
                setError(errorInfo.field, { type: 'manual', message: errorInfo.message });
            }
        }
    }
};