// next import
import Image from 'next/image';

// component
import { Icon } from '@/components';

// asset
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';

// utils
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils';

export const dataTableColumns = [
  {
    name: 'Nama SKU',
    selector: (row) => row?.name,
    // compact: true,
    grow: 2,
    sortable: true,
    // style: { paddingRight: "20px" },
    cell: (row) => (
      <div className="product-table-card mt-2 mb-2">
        <Image src={ilustrationCamera} width={48} alt="product-sku" />
        <div>
          <span className="product-table-info">{row?.name}</span>
        </div>
      </div>
    ),
  },
  {
    name: 'Tipe',
    selector: (row) => row?.product_type,
    cell: (row) => (
      <span
        className={`${row?.product_type === 'SINGLE'
            ? 'product-table-type-single'
            : 'product-table-type-bundling'
          }`}
      >
        {row?.product_type}
      </span>
    ),
    sortable: true,
  },
  {
    name: 'Kode SKU',
    selector: (row) => row?.sku,
    sortable: true,
    cell: (row) => <span>{row?.sku}</span>,
  },
  {
    name: 'Produk Toko Terhubung',
    selector: (row) => row.phone,
    sortable: true,
    cell: () => <span>50</span>,
  },
  {
    name: 'Referensi Harga',
    selector: (row) => row?.price,
    sortable: true,
    cell: (row) => (
      <span className="product-table-currency">
        <span>Rp</span> {formatCurrency(parseFloat(row?.price))}
      </span>
    ),
  },
  {
    name: 'Waktu Dibuat',
    selector: (row) => row?.created_at,
    sortable: true,
    cell: (row) => <span>{formatDate(row?.created_at)}</span>,
  },
  {
    name: 'Aksi',
    selector: (row) => row.status,
    sortable: false,
    cell: () => (
      <div style={{ cursor: 'pointer' }}>
        <Icon name="edit-alt" className="product-table-icon" />
      </div>
    ),
  },
];
