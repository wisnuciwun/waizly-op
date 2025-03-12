// asset
import shopee from '@/assets/images/marketplace/shopee.png';
import tokped from '@/assets/images/marketplace/tokopedia.png';
import shopify from '@/assets/images/marketplace/shopify.png';

export const dummyDataCard = [
  {
    title: 'Siap Diproses',
    value: '346,200',
    tooltipText: 'Jumlah Pesanan yang perlu diproses',
    id: '1',
    backgroundColor: [
      '#e0e4ff',
      '#e0e4ff',
      '#e0e4ff',
      '#e0e4ff',
      '#e0e4ff',
      '#6576ff',
    ],
    color: '#6576ff',
    hoverColor: '#ebedff',
    link: '/order/list-table/diproses',
  },
  {
    title: 'Diproses',
    value: '1,200',
    tooltipText: 'Jumlah pesanan yang sedang diproses',
    id: '3',
    backgroundColor: [
      '#cde8fe',
      '#cde8fe',
      '#cde8fe',
      '#cde8fe',
      '#cde8fe',
      '#058efc',
    ],
    color: '#058efc',
    hoverColor: '#ddeffe',
    link: '/order/list-table/diproses',
  },
  {
    title: 'Dalam Pengembalian',
    value: '500',
    tooltipText: 'Jumlah pesanan yang sedang dalam pengajuan pengembalian',
    id: '4',
    backgroundColor: [
      '#fdf2cf',
      '#fdf2cf',
      '#fdf2cf',
      '#fdf2cf',
      '#fdf2cf',
      '#f4bd0e',
    ],
    color: '#f4bd0e',
    hoverColor: '#fef6e0',
    link: '/order/list-table/selesai',
  },
  {
    title: 'Pengajuan Pembatalan',
    value: '16,000',
    tooltipText: 'Jumlah pesanan yang sedang dalam pengajuan pembatalan',
    id: '5',
    backgroundColor: [
      '#ffe0ed',
      '#ffe0ed',
      '#ffe0ed',
      '#ffe0ed',
      '#ffe0ed',
      '#ff63a5',
    ],
    color: '#ff63a5',
    hoverColor: '#ffebf3',
    link: '/order/list-table/pembatalan',
  },
  {
    title: 'Pengiriman Selesai',
    value: '12,346,200',
    tooltipText:
      'Jumlah pesanan yang telah dikirimkan dan menunggu konfirmasi dari penerima',
    id: '6',
    backgroundColor: [
      '#d2f4ea',
      '#d2f4ea',
      '#d2f4ea',
      '#d2f4ea',
      '#d2f4ea',
      '#20c997',
    ],
    color: '#20c997',
    hoverColor: '#e2f8f1',
    link: '/order/list-table/pengiriman',
  },
  {
    title: 'Pesanan Bermasalah',
    value: '10',
    tooltipText: 'Jumlah pesanan yang tidak dapat diproses',
    id: '7',
    backgroundColor: [
      '#fcd9d9',
      '#fcd9d9',
      '#fcd9d9',
      '#fcd9d9',
      '#fcd9d9',
      '#f24242',
    ],
    color: '#f24242',
    hoverColor: '#fce9e7',
    link: '/order/list-table/bermasalah',
  },
];

export const dummyChart = (backgroundColor: any) => {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    dataUnit: 'USD',
    stacked: true,
    datasets: [
      {
        label: 'Active User',
        barPercentage: 0.7,
        categoryPercentage: 0.7,
        backgroundColor: backgroundColor,
        data: [8000, 6500, 9500, 4000, 8500, 9700],
      },
    ],
  };
};

export const dummyDataTopProduct = [
  {
    titleProduct: 'Pink Fitness Tracker',
    marketplace: shopee,
    code: 'PFT001',
    price: 'Rp130,000',
    sold: '10',
  },
  {
    titleProduct: 'Pink Fitness Tracker',
    marketplace: tokped,
    code: 'PFT001',
    price: 'Rp130,000',
    sold: '10',
  },
  {
    titleProduct: 'Pink Fitness Tracker',
    marketplace: shopify,
    code: 'PFT001',
    price: 'Rp130,000',
    sold: '10',
  },
  {
    titleProduct: 'Pink Fitness Tracker',
    marketplace: tokped,
    code: 'PFT001',
    price: 'Rp130,000',
    sold: '10',
  },
];

export const dummyDataSalesSummary = [
  {
    title: 'Total Pesanan',
    icon: 'cart',
    color: '#6576FF',
    background_color: '#EBEDFF',
  },
  {
    title: 'Pesanan Dalam Pengiriman',
    icon: 'truck',
    color: '#F4BD0E',
    background_color: '#FEF6E0',
  },
  {
    title: 'Pesanan Selesai',
    icon: 'archive',
    color: '#20C997',
    background_color: '#E2F8F1',
  },
  {
    title: 'Pesanan Dibatalkan',
    icon: 'cross-c',
    color: '#FF63A5',
    background_color: '#FFEBF3',
  },
];

export const dummyDataCashOnDelivery = [
  {
    icon: 'cart',
    color_text_count: '#6576FF',
    color: '#6576FF',
    background_color: '#EFECFF',
    cod_title: 'Total',
  },
  {
    icon: 'users',
    color_text_count: '#FFA353',
    color: '#FFA353',
    background_color: 'rgba(255, 163, 83, 0.2)',
    cod_title: 'Remaining',
  },
  {
    icon: 'layers',
    color_text_count: '#20C997',
    color: '#20C997',
    background_color: '#E9FCF7',
    cod_title: 'Collected',
  },
];

export const dummyDataCashOnDeliveryCount = [
  {
    cod_total: '2',
    count: '859,600',
  },
  {
    cod_total: '3',
    count: '2,000',
  },
  {
    cod_total: '5',
    count: '857,600',
  },
];

export const dummyCardInfoStatusDashboard = [
  {
    title: 'Menunggu Resi',
    icon: 'notes-alt',
    icon_color: '#816BFF',
    icon_bg: '#816BFF33',
  },
  {
    title: 'Menunggu Kurir',
    icon: 'user',
    count: '4,205',
    icon_color: '#FF63A5',
    icon_bg: '#FF63A533',
  },
  // {
  //   title: "Selesai Pickup",
  //   icon: "unarchive",
  //   icon_color: "#816BFF",
  //   icon_bg: "#816BFF33",
  // },
  // {
  //   title: "Sedang Transit",
  //   icon: "home",
  //   icon_color: "#FF63A5",
  //   icon_bg: "#FF63A533",
  // },
  {
    title: 'Dalam Pengiriman',
    icon: 'truck',
    icon_color: '#FFA353',
    icon_bg: '#FFA35333',
  },
  {
    title: 'Selesai Dikirim',
    icon: 'box',
    icon_color: '#20C997',
    icon_bg: '#20C99733',
  },
];
