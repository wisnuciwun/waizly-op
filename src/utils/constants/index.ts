export const listStatusOrder = [
    {
        label: 'Bermasalah',
        value: 1,
        valueList: [37,38,42, 21]
    },
    {
        label: 'Diproses',
        value: 2,
        valueList: [18,20,23]
    },
    {
        label: 'Pengiriman',
        value: 3,
        valueList: [25,26,27,39]
    },
    {
        label: 'Selesai',
        value: 4,
        valueList: [28,40,29]
    },
    {
        label: 'Pembatalan',
        value: 5,
        valueList: [41,30]
    }
];

export const listTypeFile = [
    {
        label: 'Excel (.xlsx)',
        value: 'xlsx',
    },
    {
        label: 'Comma Separated Values (.csv)',
        value: 'csv',
    }
];

export const TabOptionInventoryInbound = [
    {
        label: 'Semua',
        type: 'all',
        icon: '',
    },
    {
        label: 'Menunggu Inbound',
        type: 'waiting-inbound',
        icon: 'archive',
    },
    {
        label: 'Selesai',
        type: 'completed',
        icon: 'check-c',
    }
];
export const TabOptionInventoryTransfer = [
    {
        label: 'Semua',
        type: 'all',
        icon: '',
    },
    {
        label: 'Menunggu Persetujuan',
        type: 'waiting-approvel',
        icon: 'file-check',
    },
    {
        label: 'Disetujui',
        type: 'approved',
        icon: 'check-c',
    },
    {
        label: 'Dibatalkan',
        type: 'canceled',
        icon: 'cross-c',
    }
];

export const listPaymentType = [
    {
        label: 'Semua Metode Pembayaran',
        value: 'ALL',
    },
    {
        label: 'COD',
        value: '2',
    },
    {
        label: 'NON COD',
        value: '1',
    }
];

export const listCodType = [
    {
        label: 'Semua Tipe COD',
        value: 'ALL',
    },
    {
        label: 'COD Sistem',
        value: 'SYSTEM',
    },
    {
        label: 'COD Manual',
        value: 'MANUAL',
    }
];

export const TabOptionInventoryOutbound = [
    {
        label: 'Semua',
        type: 'all',
        icon: '',
    },
    {
        label: 'Menunggu Outbound',
        type: 'waiting-outbound',
        icon: 'unarchive',
    },
    {
        label: 'Selesai',
        type: 'completed',
        icon: 'check-c',
    }
];
