export interface ProductListingProps {
    child_product_listing_id: number;
    parent_product_listing_id: number;
    product_id: string;
    product_name: string;
    store_name: string;
    store_id: number;
    client_id: number;
    channel_id: number;
    channel_name: string;
    is_single_product: boolean;
    sku: string;
    created_at: string;
    is_has_sku: boolean;
    variant?: Variant | null;
    variant_name_1: string | null;
    variant_name_2: string | null;
    variant_name_3: string | null;
}

interface Variant {
    variant_name_1: string | null;
    variant_name_2: string | null;
    variant_name_3: string | null;
}

export interface ProductSingelProps {
    id: number;
    sku: string;
    name: string;
    price: string;
    product_type: string;
    created_at: string;
    quantity?: number | null;
    weight?: number | null;
    product_id?: number;
}