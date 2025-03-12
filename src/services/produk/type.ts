export interface PropsProductSKU {
    size: number;
    client_id: number;
    page: number;
    channel: Array<number>;
    store: Array<number>;
    search: SearchSKU
}

interface SearchSKU {
    product_name: string | null;
    sku: string | null;
}