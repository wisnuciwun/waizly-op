
export const getMessageError = (type: string) => {
    switch(type) {
        case 'NAME_IS_EXIST':
            return 'Nama SKU sudah pernah dipakai';
        case 'SKU_IS_EXIST': 
            return 'Kode SKU sudah pernah dipakai';
        case 'ANY_FIELD_NOT_BE_EMPTY': 
            return 'Volume barang tidak boleh kosong';
        case 'jwt_exception':
            return 'Session expired, anda akan di alihkan ke halaman login';
        default:
            return 'Terjadi Kesalahan';
    }
};