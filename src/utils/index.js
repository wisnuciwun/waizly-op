
import SHOPEE from '@/assets/images/marketplace/shopee.png';
import TOKOPEDIA from '@/assets/images/marketplace/tokopedia.png';
import LAZADA from '@/assets/images/marketplace/lazada.png';
import SHOPIFY from '@/assets/images/marketplace/shopify.png';
import TIKTOK from '@/assets/images/marketplace/tiktok.png';
import OTHER from '@/assets/images/marketplace/offline.png';

export const dateFormatterAlt = (date, reverse) => {
  let d = date.getDate();
  let m = date.getMonth();
  let y = date.getFullYear();
  reverse ? (date = m + '-' + d + '-' + y) : (date = y + '-' + d + '-' + m);
  return date;
};

export const bulkActionOptions = [
  { value: 'store_name_op', label: 'Nama Toko di Bebas Kirim' },
  { value: 'store_name_channel', label: 'Nama Toko Channel' }
];

export const mapChannelNameToId = (channelName) => {
  switch (channelName) {
    case 'SHOPEE':
      return 1;
    case 'TOKOPEDIA':
      return 2;
    case 'TIKTOK':
      return 3;
    case 'LAZADA':
      return 4;
    case 'SHOPIFY':
      return 6;
    default:
      return null;
  }
};

export const findUpper = (string) => {
  let extractedString = [];

  for (var i = 0; i < string.length; i++) {
    if (
      string.charAt(i) === string.charAt(i).toUpperCase() &&
      string.charAt(i) !== ' '
    ) {
      extractedString.push(string.charAt(i));
    }
  }
  if (extractedString.length > 1) {
    return extractedString[0] + extractedString[1];
  } else {
    return extractedString[0];
  }
};

// date format
export const formatDate = (dateString) => {
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
    new Date(dateString)
  );

  return formattedDate.replace(/\//g, '/').replace(',', '');
};

// utils/dateUtils.js
export const formatDateText = (timestamp) => {
  if (!timestamp) return '-';

  const date = new Date(timestamp);
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const orderStatus = {
  BELUM_DIBAYAR: 18,
  SIAP_DIPROSES: 20,
  UNMAPPING_PRODUK: 37,
  UNMAPPING_ORDER: 42,
  UNMAPPING_GUDANG: 38,
  UNMAPPING_ORDER: 42,
  OUT_OF_STOCK: 21,
  DIPROSES: 23,
  MENUNGGU_KURIR: 26,
  // SIAP_DIKIRIM: 26,
  MENUNGGU_RESI: 25,
  SEDANG_DIKIRIM: 27,
  PENGIRIMAN_SELESAI: 39,
  DITERIMA: 28,
  DALAM_PENGEMBALIAN: 40,
  PENGAJUAN_PEMBATALAN: 41,
  DIBATALKAN: 30,
  SELESAI_DIKEMBALIKAN: 29,
};

export const inventoryStatus = {
  MENUNGGU_PERSETUJUAN: 43,
  DISETUJUI: 45,
  DIBATALKAN: 44,
  SEMUA: 0
};

export function iconChannel(channelName) {
    switch (channelName) {
      case 'SHOPEE':
        return SHOPEE;
        break;
      case 'TOKOPEDIA':
        return TOKOPEDIA;
        break;
      case 'LAZADA':
        return LAZADA;
        break;
      case 'SHOPIFY':
        return SHOPIFY;
        break;
      case 'TIKTOK':
        return TIKTOK;
        break;
      case 'OTHER':
        return OTHER;
        break;
      case 'SOCIALECOMMERCE':
        return OTHER;
        break;
      default:
        return OTHER;
        break;
    }
  }