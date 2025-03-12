import { IShopifyExternal } from '@/utils/type';

export const setShopifyValue = (shopifyValue: IShopifyExternal | null) => {
    return {
        type: 'SET_SHOPIFY_VALUE',
        shopifyValue
    };
};