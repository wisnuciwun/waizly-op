import SHOPEE from '@/assets/images/marketplace/shopee.png';
import TOKOPEDIA from '@/assets/images/marketplace/tokopedia.png';
import LAZADA from '@/assets/images/marketplace/lazada.png';
import SHOPIFY from '@/assets/images/marketplace/shopify.png';
import TIKTOK from '@/assets/images/marketplace/tiktok.png';
import OTHER from '@/assets/images/marketplace/offline.png';
import SOCIALECOMMERCE from '@/assets/images/marketplace/social-commerce.png';
// import { StaticImageData } from 'next/image';

export function iconChannel(channelName: string) {
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
      return SOCIALECOMMERCE;
      break;
    default:
      return OTHER;
      break;
  }
}