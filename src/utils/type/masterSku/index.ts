export interface FormDataSingleSku {
    skuName: string;
    skuCode: string;
    skuDescription? :string;
    referencePrice: number | null;
    weightProduct: number | null;
    lengthProduct: number | null;
    widthProduct: number | null;
    heightProduct: number | null;
    managedByEthix?: string;
    managedByProduct?: string;
    outboundExp?: number | string;
    inboundExp?:number | string;
    conversionUnit?: number | string;
    barcode?: string;
    outerBarcode?: string;
    skuBrand?: string;
    created?: string;
    updated?: string;
    advanceQc?: boolean;
    productionBatch?: boolean;
    categorySku?: string;
};

export interface SelectedMultiple {
    value: number;
    label: string;
}

export interface ListMappingProductProps {
    id: string;
    storeImage: string;
    storeName: string;
    image: string;
    productName: string;
    productCode: string | number;
    productVariant: string;
};

export interface FormDisableSingleSku {
    length: boolean;
    width: boolean;
    height: boolean;
}

export interface ImagesUploadState {
    id: number | null;
    imageBase64: string | null;
    fileType: File
}

export interface ErrorForm {
    skuName: boolean;
    skuCode: boolean;
    skuDescription: boolean;
    referencePrice: boolean;
    weightProduct: boolean;
    lengthProduct: boolean;
    widthProduct: boolean;
    heightProduct: boolean;
    outboundExp: boolean;
    inboundExp: boolean;
    barcode: boolean;
    outerBarcode: boolean;
    categorySku: boolean;
    conversionUnit: boolean;
    firstImageValue: boolean;
  }

export type FormErrorTypeSku = 'NAME_SKU' | 'CODE_SKU' | 'DESCRIPTION_SKU' | 'REFERENCEPRICE_SKU' | 'PRODUCT_WEIGHT' | 'PRODUCT_LENGTH' | 'PRODUCT_WIDTH' | 'PRODUCT_HEIGHT' | 'OUTBOUND_EXPIRED' | 'INBOUND_EXPIRED' | 'BARCODE_SKU' | 'OUTERBARCODE_SKU'| 'CONVERSION_UNIT' | 'CATEGORY_SKU' |null;