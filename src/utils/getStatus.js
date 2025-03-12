export function getStatusLabelTypeWerehouse(status) {
  let backgroundColor;
  let color;
  let text;

  switch (status) {
    case 'GUDANG PRIBADI':
      backgroundColor = '#D5FDFF';
      color = '#00A7E1';
      text = 'PRIBADI';
      break;
    case 'GUDANG MARKETPLACE':
      backgroundColor = '#E2FFEC';
      color = '#36C068';
      text = 'MARKETPLACE';
      break;
    case 'GUDANG ETHIX':
      backgroundColor = '#E1EFFA';
      color = '#0372D9';
      text = 'ETHIX';
      break;
    default:
      backgroundColor = 'none';
      color = '#4c4f54';
      text = '-';
      break;
  }

  return { backgroundColor, color, text };
}

export function getTransferStatus(status) {
  switch (status) {
      case 'Approved':
          return 'Disetujui';
      case 'Awaiting Approval':
          return 'Menunggu Persetujuan';
      case 'Menunggu Outbound':
          return 'Menunggu Persetujuan';
      case 'Cancelled':
          return 'Dibatalkan';
      case 'goods':
          return 'Normal';
      case 'damages':
          return 'Rusak';
      default:
          return status; 
  }
}

export function getAdjustmentStatus(status) {
  switch (status) {
      case 'Approve':
          return 'Disetujui';
      case 'New Stock Adjustment':
          return 'Menunggu Persetujuan';
      case 'Reject':
          return 'Dibatalkan';
      case 'good':
            return 'Normal';
      case 'damage':
            return 'Rusak';
      default:
          return status; 
  }
}