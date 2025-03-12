export interface PaginationProps {
    page: number;
    size: number;
    totalRecord: number;
}

export interface ErrorProps {
    show: boolean;
    message: string;
}

export interface IShopifyExternal {
    store_url: string;
    channel_name: string;
    channel_id: number;
}