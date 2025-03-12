// get select option level order
export const getLevelOrder = [
  { value: '<100 Order/bulan', name: '<100 Order / Bulan' },
  { value: '100-500 Order/bulan', name: '100 - 500 Order / Bulan' },
  { value: '500', name: '500 - 1000 Order / Bulan' },
  { value: '>1000', name: '> 1000 Order / Bulan' },
];

// get select option product
export const getProduct = [
  { value: 'Pakaian/Busana', name: 'Pakaian / Busana' },
  { value: 'Makanan-Minuman', name: 'Makanan-Minuman' },
  { value: 'Kesehatan', name: 'Kesehatan' },
  { value: 'Buku-Dapur', name: 'Buku-Dapur' },
  { value: 'Gaming-Otomotif', name: 'Gaming-Otomotif' },
  { value: 'PeralatanOlahraga', name: 'Peralatan Olahraga' },
  { value: 'Elektronik', name: 'Elektronik' },
  { value: 'AksesorisElektronik', name: 'Aksesoris Elektronik' },
  { value: 'Aksesoris', name: 'Aksesoris' },
  { value: 'PerawatanKecantikan', name: 'Perawatan Kecantikan' },
  { value: 'RumahTangga', name: 'Rumah Tangga' },
  { value: 'Lainnya', name: 'Lainnya' },
];

// get select option channel
export const getChannel = [
  { value: 'Marketplace', name: 'Marketplace' },
  { value: 'SocialECommerce', name: 'Social E-Commerce' },
  { value: 'OfflineStore', name: 'Offline Store' },
  { value: 'WebStore', name: 'Web Store' },
  { value: 'Lainnya', name: 'Lainnya' },
];

// get option singgle master sku
export const getOptionMasterSku = [
  { value: 'name', name: 'Nama SKU' },
  { value: 'sku', name: 'Kode SKU' },
];

export const getOptionManagedByEthix = [
  {
    label: 'Ya',
    value: 'yes',
  },
  {
    label: 'Tidak',
    value: 'no',
  }
];

export const getOptionManagedByProduct = [
  {
    label: 'FIFO',
    value: 'fifo',
  },
  {
    label: 'FEFO',
    value: 'fefo',
  }
];

export const optionMasterSku = [
  { value: 'name', name: 'Nama Produk' },
  { value: 'sku', name: 'Kode Produk' },
];

export const optionInventorySku = [
  { value: 'name', name: 'Nama SKU' },
  { value: 'sku', name: 'Kode SKU' },
];

// get option bundling master sku
export const getOptionAddBundlingSku = [
  { value: 'name', name: 'Nama SKU' },
  { value: 'sku', name: 'Kode SKU' },
];

// get select option werehouse
export const getWerehouse = [
  { value: 1, name: 'GUDANG PRIBADI' },
  { value: 2, name: 'GUDANG ETHIX' },
  { value: 3, name: 'GUDANG MARKETPLACE', disabled: true },
];

// get option produk
export const getOptionProduk = [
  { value: 'product_name', name: 'Nama Produk' },
  { value: 'sku', name: 'Kode Produk' },
];

export const getOptionCancellation = [
  { value: 'BUYER', name: 'Pembeli' },
  { value: 'SELLER', name: 'Penjual' },
];

// get option produk
export const getOptionPesanan = [
  { value: 'order_code', name: 'Nomor Pesanan' },
  { value: 'tracking_number', name: 'Nomor Resi' },
  { value: 'recipient_name', name: 'Nama Penerima' },
  { value: 'logistic_carrier', name: 'Jasa Kirim' },
];

export const getOptionInventory = [
  { value: 'purchase_code', name: 'Nomor Pembelian' },
  { value: 'sku_code', name: 'Kode SKU' },
  { value: 'sku_name', name: 'Nama SKU' },
];

export const getOptionInventoryInbound = [
  { value: 'order_code', name: 'Nomor Inbound' },
  { value: 'sku_code', name: 'Kode SKU' },
  { value: 'sku_name', name: 'Nama SKU' },
];

export const getOptionInventoryOutbound = [
  { value: 'order_code', name: 'Nomor Outbound' },
  { value: 'sku_code', name: 'Kode SKU' },
  { value: 'sku_name', name: 'Nama SKU' },
];

export const getSelectedFilterSubAccount = [
  { value: 'manager', name: 'MANAGER' },
  { value: 'admin', name: 'ADMIN' },
  { value: 'tambah_pesanan', name: 'TAMBAH PESANAN' },
  { value: 'pengelola_gudang', name: 'PENGELOLA GUDANG' },
  { value: 'super_admin', name: 'SUPER ADMIN' },
];

export const getOptionSubAccount = [
  { value: 'full_name', name: 'Nama Pengguna' },
  { value: 'email', name: 'Email' },
];

export const getOptionRetur = [
  { value: 'BUYER', name: 'Pembeli' },
  { value: 'COURIER', name: 'Kurir' },
];


export const getOptionExport = [
  { value: 'csv', name: 'Comma Separated Values (.csv)' },
  { value: 'xlsx', name: 'Microsoft Excel Open XML Spreadsheet (.xlsx)' },
];

export const getOptionUpload = [
  { value: 'name', name: 'Nama File' },
  { value: 'id', name: 'ID Unggah' }
];

export const getOptionDownlaod = [
  { value: 'name', name: 'Nama Toko' },
  { value: 'id', name: 'ID Unduh' }
];

export const getOptionInventoryTransfer = [
  { value: 'order_code', name: 'Nomor Transfer' },
  { value: 'sku_name', name: 'Nama SKU' },
  { value: 'sku_code', name: 'Kode SKU' },
];

export const getOptionStockInventoryTransfer = [
  { value: 'goods', name: 'Stok Normal' },
  { value: 'damages', name: 'Stok Rusak' },
];

export const getOptionInventoryAdjustment = [
  { value: 'code', name: 'Nomor Adjustment' },
  { value: 'sku_name', name: 'Nama SKU' },
  { value: 'sku_code', name: 'Kode SKU' },
];

export const getOptionStockInventoryAdjustment = [
  { value: 'good', name: 'Stok Normal' },
  { value: 'damage', name: 'Stok Rusak' },
];
