import SHOPEE from '@/assets/images/marketplace/shopee.png';
import TOKOPEDIA from '@/assets/images/marketplace/tokopedia.png';
import LAZADA from '@/assets/images/marketplace/lazada.png';
import SHOPIFY from '@/assets/images/marketplace/shopify.png';
import TIKTOK from '@/assets/images/marketplace/tiktok.png';
import OTHER from '@/assets/images/marketplace/offline.png';
import SOCIALECOMMERCE from '@/assets/images/marketplace/social-commerce.png';
import { StaticImageData } from 'next/image';

export function getMarketPlaceLogo(channelName: string) {
  let logo: StaticImageData;

  switch (channelName) {
    case 'SHOPEE':
      logo = SHOPEE;
      break;
    case 'TOKOPEDIA':
      logo = TOKOPEDIA;
      break;
    case 'LAZADA':
      logo = LAZADA;
      break;
    case 'SHOPIFY':
      logo = SHOPIFY;
      break;
    case 'TIKTOK':
      logo = TIKTOK;
      break;
    case 'OTHER':
      logo = OTHER;
      break;
    case 'SOCIALECOMMERCE':
      logo = SOCIALECOMMERCE;
      break;
    default:
      logo = OTHER;
      break;
  }

  return { logo };
}
