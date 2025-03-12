import Shopify from '@/assets/images/marketplace/shopify.png';
import Tokopedia from '@/assets/images/marketplace/tokopedia.png';
import Shopee from '@/assets/images/marketplace/shopee.png';
import Lazada from '@/assets/images/marketplace/lazada.png';
import Tiktok from '@/assets/images/marketplace/tiktok.png';

export const channelLogo = (channelName) => {
     const formattedName = channelName.toLowerCase().replace(/\s+/g, '');
     switch (formattedName) {
          case 'tokopedia':
               return Tokopedia;
          case 'shopee':
               return Shopee;
          case 'lazada':
               return Lazada;
          case 'tiktok':
               return Tiktok;
          case 'shopify':
               return Shopify;
          default:
               return Shopify;
     }
};