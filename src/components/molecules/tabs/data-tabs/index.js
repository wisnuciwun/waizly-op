import Blokir from '@/assets/images/icon/blokir.svg';
import Archive from '@/assets/images/icon/archive.svg';
import Home from '@/assets/images/icon/home.svg';
import Draft from '@/assets/images/icon/draft.svg';
import iconTokoLainya from '@/assets/svg/icon-lainnya.svg';

export const dataTabsMasterSku = [
  {
    label: 'Semua',
    type: 'all',
    tabStatus: '1',
    icon: '',
  },
  {
    label: 'Single SKU',
    type: 'single',
    tabStatus: '2',
    icon: 'icon ni ni-file',
  },
  {
    label: 'Bundling SKU',
    type: 'bundling',
    tabStatus: '3',
    icon: 'icon ni ni-files',
  },
];

export const dataTabsProduk = [
  {
    label: 'Aktif',
    type: 31,
    tabStatus: '1',
    icon: Home,
  },
  {
    label: 'Diarsipkan',
    type: 32,
    tabStatus: '2',
    icon: Archive,
  },
  {
    label: 'Draf',
    type: 34,
    tabStatus: '3',
    icon: Draft,
  },
  {
    label: 'Blokir',
    type: 36,
    tabStatus: '4',
    icon: Blokir,
  },
];

export const dataTabsTokoTerintegrasi = [
  {
    label: 'Semua',
    type: 1,
    tabStatus: '1',
    icon: '',
  },
  {
    label: 'Marketplace',
    type: 2,
    tabStatus: '2',
    icon: 'bag',
  },
  {
    label: 'Web Store',
    type: 3,
    tabStatus: '3',
    icon: 'globe',
  },
  {
    label: 'Toko Lainnya',
    type: 4,
    tabStatus: '4',
    icon: iconTokoLainya,
    customIcon: true,
  },
];
