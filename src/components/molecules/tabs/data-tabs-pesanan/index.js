import { orderStatus } from '@/utils';

export const dataTabsIconDiproses = [
  {
    label: 'Belum Dibayar',
    type: orderStatus.BELUM_DIBAYAR,
    icon: 'money',
  },
  {
    label: 'Siap Proses',
    type: orderStatus.SIAP_DIPROSES,
    icon: 'archived',
  },
  {
    label: 'Diproses',
    type: orderStatus.DIPROSES,
    icon: 'package',
  },
];

export const dataTabsIconBermasalah = [
  {
    label: 'Unmapping Produk',
    type: orderStatus.UNMAPPING_PRODUK,
    icon: 'unlink',
  },
  {
    label: 'Unmapping Gudang',
    type: orderStatus.UNMAPPING_GUDANG,
    icon: 'unlink-alt',
  },
  {
    label: 'Out of Stock',
    type: orderStatus.OUT_OF_STOCK,
    icon: 'cart',
  },
  {
    label: 'Unmapping Pengiriman',
    type: orderStatus.UNMAPPING_ORDER,
    icon: 'location',
  },
];

export const dataTabsIconPengiriman = [
  {
    label: 'Menunggu Resi',
    type: orderStatus.MENUNGGU_RESI,
    icon: 'qr',
  },
  {
    label: 'Menunggu Kurir',
    type: orderStatus.MENUNGGU_KURIR,
    icon: 'user-group',
  },
  {
    label: 'Sedang Dikirim',
    type: orderStatus.SEDANG_DIKIRIM,
    icon: 'truck',
  },
  {
    label: 'Pengiriman Selesai',
    type: orderStatus.PENGIRIMAN_SELESAI,
    icon: 'check-c',
  },
];

export const dataTabsIconSelesai = [
  {
    label: 'Diterima',
    type: orderStatus.DITERIMA,
    icon: 'archive',
  },
  {
    label: 'Dalam Pengembalian',
    type: orderStatus.DALAM_PENGEMBALIAN,
    icon: 'truck',
  },
  {
    label: 'Selesai Dikembalikan',
    type: orderStatus.SELESAI_DIKEMBALIKAN,
    icon: 'check-c',
  },
];

export const dataTabsIconPembatalan = [
  {
    label: 'Pengajuan Pembatalan',
    type: orderStatus.PENGAJUAN_PEMBATALAN,
    icon: 'property-remove',
  },
  {
    label: 'Dibatalkan',
    type: orderStatus.DIBATALKAN,
    icon: 'list-check',
  },
];
