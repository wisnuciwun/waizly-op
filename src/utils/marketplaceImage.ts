import Shopee from '@/assets/images/marketplace/shopee.png';
import Tokopedia from '@/assets/images/marketplace/tokopedia.png';
import Lazada from '@/assets/images/marketplace/lazada.png';
import Tiktok from '@/assets/images/marketplace/tiktok.png';
import Shopify from '@/assets/images/marketplace/shopify.png';
import Other from '@/assets/images/marketplace/other.png';

const getMarketplaceImage = (value: string) => {
    switch (value) {
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
        case 'other':
          return Other;
        default:
          return Other;
    }
};

export default getMarketplaceImage;