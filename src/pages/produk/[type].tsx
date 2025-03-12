import React from 'react';
import TableProduct from '@/components/molecules/table/table-produk/table-product';

import {lastPath } from '@/utils/formater';


const Product = () => {
    const type = lastPath(window.location.href);

    return(
        // <></>
        <TableProduct type={type}/>
    );
};

export default Product;