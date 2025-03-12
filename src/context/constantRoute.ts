import { NextRouter } from 'next/router';

export const isAuthRoute = (router: NextRouter) => {
    const listAuthRouter = ['/login', '/register','/verification-email', '/verification-otp', '/error-token' ];
    if (listAuthRouter.includes(router.pathname)) {
        return true;
    }

    return false;
};

export const feature = (value) => {

    switch(value) {
      case 'Edit Profile' :
        return '/edit-profile';
      case 'Sync Produk Toko':
        return '/produk/sinkron-produk';
      case 'Tambahkan ke Master SKU':
        return'/produk/tambah-master-single-sku';
      case 'Tambah Toko':
        return'/toko-terintegrasi/tambah-toko';
      case 'Lihat Detail & Edit Authorized Store':
        return ['/toko-terintegrasi/riwayat-toko ', '/toko-terintegrasi/riwayat-toko-lainya' , '/toko-terintegrasi/edit-toko' , '/toko-terintegrasi/edit-toko-lainya'];
      case 'Tambah Bundling SKU':
        return '/master-sku/create-bundling';
      case 'Edit Bundling SKU': 
        return ['/master-sku/edit-bundling/[id]', '/master-sku/activity-history'];
      case 'Tambah Single SKU':
        return '/master-sku/create';
      case 'Edit Single SKU':
        return ['/master-sku/edit/[id]', '/master-sku/activity-history'];
      case 'Lihat List dan Detail Pesanan':
        return ['/order/detail-pesanan', '/order/list-table/bermasalah', '/order/list-table/diproses', '/order/list-table/pengiriman', '/order/list-table/selesai', '/order/list-table/pembatalan', '/order/list-table/[type]'];
      case 'Tambah Pesanan':
        return '/order/create';
      case 'Ubah Pesanan': 
        return'/order/edit/[id]';
      case 'Selesaikan Pesanan':
        return 'order/completed/[id]';
      case 'Tambah Gudang':
        return '/pengaturan/gudang/form-gudang';
      case 'Lihat Detail & Edit Gudang':
        return ['/pengaturan/gudang/form-gudang' , '/pengaturan/gudang/activity-history'];
      case 'Tambah Role':
        return '/pengaturan/role/form-role';
      case 'Lihat Detail & Edit Role':
        return ['/pengaturan/role/form-role ', '/pengaturan/role/activity-history'];
      case 'Tambah Sub Account':
        return '/pengaturan/sub-account/form-sub-account?action=add';
      case 'Lihat Detail & Edit Sub Account':
        return ['/pengaturan/sub-account/form-sub-account' , '/pengaturan/sub-account/activity-history'];
      default:
        return '';
    }
};