import { ProductSingelProps } from '../product';

export interface CreateOrderPayload {
    store_id: number | null;
    store_name?: string | null;
    channel: string;
    channel_id: number | null;
    location_id: number | null;
    location_name?: string | null;
    order_code: string;
    checkout_at: number | null;
    date_checkout?: Date | null;
    time_checkout?: string | null;
    payment_method_type_id: number | null; 
    payment_method_name?: string | null;
    remarks: string;
    created_via: string; 
    buyer_info:{
        buyer_name: string | null;
        buyer_phone: string | null;
        buyer_email: string | null;
    },
    package_info: PackageInfo;
    delivery_info: DeliveryInfo;
    recipient_info: RecipientInfo;
    price_info: PriceInfoCreateOrder;
    items: ProductSingelProps[]
}

export interface PayloadEditOrder {
    // logistic_carrier: string;
    // tracking_number: string;
    location_id: number | null;
    remarks: string;
    buyer_info:{
        buyer_name: string;
        buyer_phone: string;
        buyer_email: string;
    },
    package_info: PackageInfo;
    delivery_info: DeliveryInfoEdit;
    recipient_info: RecipientInfo;
    price_info: PriceInfoCreateOrder;
    items: ProductSingelProps[];
}

export interface PackageInfo {
    package_weight: number | null;
    package_length: number | null;
    package_width: number | null;
    package_height: number | null;
}

export interface DeliveryInfo {
    delivery_method_id: number; 
    logistic_provider_name: string;
    logistic_service_name: string;
    logistic_carrier: string;
    tracking_number: string;
}

export interface DeliveryInfoEdit {
    logistic_provider_name: string;
    logistic_service_name: string;
    logistic_carrier: string;
    tracking_number: string;
}

export interface RecipientInfo {
    recipient_name: string | null;
    recipient_phone: string | null;
    sub_district_id: number | null;
    city_name?: string | null;
    origin_district_id: number | null;
    recipient_postal_code: string | null;
    recipient_full_address: string | null;
    recipient_remarks: string | null;
    area_name?: string | null;
}

export interface PriceInfoCreateOrder {
    sub_total_price: number | null;
    shipping_price: number | null;
    other_price: number | null;
    total_discount_price: number | null;
    grand_total_order_price: number | null;
    shipping_price_buyer: boolean;
    is_insurance: boolean;
    insurance_amount: number | null;
    cod_fee: number | null;
    cod_price: number | null;
    cod_percentage: number | null;
    discount_seller: number | null;
    discount_shipping: number | null;
    packing_price: number | null;
}

export interface ProductList {
    product_id: number | null;
    qty: number | null;
    unit_weight: number | null;
    unit_price: number | null;
}

export interface AreaSearchProps {
    sub_district_id: number | null;
    area_name: string | null;
    sub_district_name: string | null;
    district_name: string | null;
    city_name: string | null;
    province_name: string | null;
    country_name: string | null;
}

export interface LocationList {
    location_id: number;
    location_code: string;
    location_name: string
    sub_district_id: number | null;
    location_type_id: number;
    location_type_name: string;
    city_name?: string;
}

export interface ListShippingRate {
    courier: string;
    service_type: string;
    publish_price: number;
    minimum_weight: number;
    min_estimate_delivery: number;
    max_estimate_delivery: number;
    estimate_price: number;
    currency_code: string;
    unit_of_measure: string;
}

export interface TracingHistoryProps {
    status: string;
    created_at: string;
    updated_at: string;
    status_courier: StatusCourier[]
}

export interface StatusCourier {
    status_code: string;
    status_name: string;
    description: string;
    remark: string;
    created_at: string;
    updated_at: string;
}

export interface ShippingProps {
    order_header_id: number;
    original_order_code: string;
    tracking_number: string;
    checkout_at: string;
    logistic_carrier: string;
    logistic_provider_name: string;
    logistic_service_name: string;
    shipper_name: string;
    shipper_phone: string;
    shipper_address: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_full_address: string;
    recipient_remarks: string;
    package_weight: string;
    delivery_method_id: number;
    delivery_method: string;
    payment_method_id: number;
    payment_method: string;
    cod_fee: number;
    routing_code?: string;
    items: OrderItems[];
}

export interface OrderItems  {
    order_detail_id: number;
    product_name: string;
    quantity: number
}

export interface UploadOrderHistoryItems {
    upload_id: string;
    file_name: string;
    upload_by: string;
    status_id: number;
    success: number;
    failed: number;
    id: string;
    created_at: string;
}

export interface DownloadOrderHistoryItems {
    download_id: string;
    request_by: string;
    status_request: number;
    store_name: string;
    id: string;
    created_at: string;
    file_type: string;
}