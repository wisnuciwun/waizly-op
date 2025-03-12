export interface InboundDetail {
    inbound_detail_id: number;
    purchase_detail_id: number;
    product_name: string;
    product_sku: string;
    quantity: number;
    product_id: number;
    product_image: string;
    good_quantity: number;
    damage_quantity: number;
}

interface Inbound {
    inbound_id: number;
    inbound_code: string;
    status: string;
    location_name: string;
    purchase_created: string;
    approved_at: string;
    purchase_date: string;
    total_quantity: number;
    total_sku: number;
    received_by: string;
    created_by: string;
    notes: string;
    created_at: string;
    updated_at: string;
    tracking_number: string;
    external_id: string;
    supplier_name: string;
    courier: string;
}

export interface InboundData {
    inbound: Inbound;
    inbound_detail: InboundDetail[];
}

interface Transfer {
    transfer_header_id: number;
    transfer_code: string;
    origin_id: number;
    origin_name: string;
    destination_id: number;
    destination_name: string;
    external_id: string;
    client_id: number;
    status_id: number;
    created_by: number;
    created_by_name: string;
    approved_by: number;
    approved_by_name: string;
    updated_by: number;
    notes: string;
    created_at: string;
    transfer_date: string;
    sku_quantity: number;
    item_quantity: number;
    source_stock: string;
}

export interface TransferDetailItems {
    name: string;
    product_id: string;
    sku: number;
    quantity: number;
}

export interface TransferData {
    transfer: Transfer;
}

interface Adjustment {
    adjustment_header_id: number;
    code: string;
    external_id: string;
    adjustment_date: string;
    created_at: string;
    notes: string;
    adjustment_at: string;
    stock_source: string;
    status: string;
    status_code: string;
    status_id: number;
    location: string;
    created_by: string;
    approved_by: string;
    approved_at: string;
    rejected_by: string;
    rejected_at: string;
    total_stock_adjustment: number;
    total_sku: number;
}

export interface AdjustmentDetailItems {
    product_name: string;
    product_id: string;
    product_sku: number;
    quantity: number;
}

export interface AdjustmentData {
    adjustment: Adjustment;
}