import { IShopifyExternal } from '@/utils/type';

interface AppReducerState {
    shopifyValue: IShopifyExternal | null;
}

export type AppReducerAction = 
| { type: 'SET_SHOPIFY_VALUE'; shopifyValue: IShopifyExternal | null }

const defaultState = {
    shopifyValue: {},
} as AppReducerState;

export default function storesReducer(
    state = defaultState,
    action: AppReducerAction,
) {
    switch (action.type) {
        case 'SET_SHOPIFY_VALUE':
            return {
                ...state,
                shopifyValue: action.shopifyValue
            };
        default:
            return state;
    }
}