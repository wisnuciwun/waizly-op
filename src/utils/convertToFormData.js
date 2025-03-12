export function createFormDataBundlingSku(payload, edit = false) {
    const formData = new FormData();

    formData.append('bundling_name', payload.bundling_name);
    formData.append('sku', payload.sku);
    formData.append('barcode', payload.barcode);
    formData.append('publish_price', payload.publish_price);
    formData.append('weight_in_gram', payload.weight_in_gram);
    formData.append('client_id', payload.client_id);
    formData.append('dimension[length]', payload.dimension.length);
    formData.append('dimension[width]', payload.dimension.width);
    formData.append('dimension[height]', payload.dimension.height);
    payload.bundling_detail.forEach((detail, index) => {
        formData.append(`bundling_detail[${index}][product_id]`, detail.product_id);
        formData.append(`bundling_detail[${index}][quantity]`, detail.quantity);
    });
    formData.append('brand', payload.brand);
    formData.append('description', payload.description);
    formData.append('managed_by', payload.managed_by);
    formData.append('product_management_type', payload.product_management_type);
    formData.append('inbound_expired', payload.inbound_expired);
    formData.append('outbound_expired', payload.outbound_expired);
    formData.append('outer_barcode', payload.outer_barcode);
    formData.append('conversion_unit', payload.conversion_unit);
    formData.append('is_production_batch', payload.is_production_batch);
    formData.append('is_advance_qc', payload.is_advance_qc);
    formData.append('category', payload.category);
    payload.mapping.forEach((mapping, index) => {
        formData.append(`mapping[${index}]`, mapping);
    });
    if (edit) {
        payload.images.forEach((image, index) => {
            formData.append(`images[${index}][index]`, image.id);
            formData.append(`images[${index}][images]`, image.images);
        });
    } else {
        payload.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
    }

    return formData;
}

export function createFormDataSingleSku(payload, edit = false) {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('sku', payload.sku);
    formData.append('barcode', payload.barcode);
    formData.append('reference_price', payload.reference_price);
    formData.append('weight_in_gram', payload.weight_in_gram);
    formData.append('length', payload.length);
    formData.append('width', payload.width);
    formData.append('height', payload.height);
    formData.append('client_id', payload.client_id);
    formData.append('brand', payload.brand);
    formData.append('description', payload.description);
    formData.append('managed_by', payload.managed_by);
    formData.append('product_management_type', payload.product_management_type);
    formData.append('inbound_expired', payload.inbound_expired);
    formData.append('outbound_expired', payload.outbound_expired);
    formData.append('outer_barcode', payload.outer_barcode);
    formData.append('conversion_unit', payload.conversion_unit);
    formData.append('is_production_batch', payload.is_production_batch);
    formData.append('is_advance_qc', payload.is_advance_qc);
    formData.append('category', payload.category);
    payload.mapping.forEach((mapping, index) => {
        formData.append(`mapping[${index}]`, mapping);
    });
    if (edit) {
        payload.images.forEach((image, index) => {
            formData.append(`images[${index}][index]`, image.id);
            formData.append(`images[${index}][images]`, image.images);
        });
    } else {
        payload.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
    }

    return formData;
}