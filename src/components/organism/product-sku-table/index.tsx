/* eslint-disable no-unused-vars */
import { ProductSingelProps } from '@/utils/type/product';
import React from 'react';
import Product, { styles } from './styles';
import EmptyData from './EmptyData';
import { ListTableProduct } from '@/components';

interface Props {
  list?: ProductSingelProps[] | null;
  setQuantity: (index: number, value: number) => void;
  setWeight: (index: number, value: number) => void;
  setPrice: (index: number, value: number) => void;
  onAddProduct: () => void;
  onDeleteProduct: (data: number) => void;
  edit: boolean;
}

const ProductSkuTable = ({
  list,
  setQuantity,
  setWeight,
  setPrice,
  onAddProduct,
  onDeleteProduct,
  edit,
}: Props) => {
  return (
    <>
      {list && list.length > 0 ? (
        <>
          <div style={{overflowX: 'auto'}}>
            <Product.Table>
              <thead
                className="table-primary"
                style={{ border: '1px solid #E9E9EA' }}
              >
                <tr style={styles.header}>
                  <th style={styles.listHeader}>Informasi SKU</th>
                  <th style={styles.listHeader}>
                    Jumlah<span style={{ color: 'red' }}>*</span>
                  </th>
                  <th style={styles.listHeader}>
                    Berat Satuan (g)<span style={{ color: 'red' }}>*</span>
                  </th>
                  <th style={styles.listHeader}>
                    Harga Satuan<span style={{ color: 'red' }}>*</span>
                  </th>
                  <th style={styles.listHeader}>Sub Total Produk</th>
                  {!edit && <th style={styles.listHeader}>Aksi</th>}
                </tr>
              </thead>
              {/* <Product.ContainerHeader>
                              <Product.LabelHead style={styles.infoSection}>{'Informasi SKU'}</Product.LabelHead>
                              <Product.LabelHead style={styles.inputSection}>{'Jumlah'}<span style={styles.required}>*</span></Product.LabelHead>
                              <Product.LabelHead style={styles.inputSection}>{'Berat Satuan (g)'}<span style={styles.required}>*</span></Product.LabelHead>
                              <Product.LabelHead style={styles.inputSection}>{'Harga Satuan'}<span style={styles.required}>*</span></Product.LabelHead>
                              <Product.LabelHead style={styles.inputSection}>{'Sub Total Produk'}</Product.LabelHead>
                              {!edit && <Product.LabelHead style={styles.action}>{'Aksi'}</Product.LabelHead>}
                              
                          </Product.ContainerHeader> */}
              {list.map((data, index) => (
                <ListTableProduct
                  key={index}
                  image={''}
                  productName={data.name}
                  productCode={data.sku}
                  quantity={data.quantity}
                  setQuantity={(value) => setQuantity(index, value)}
                  weight={data.weight}
                  setWeight={(value) => setWeight(index, value)}
                  price={parseInt(data.price)}
                  setPrice={(value) => setPrice(index, value)}
                  totalProduct={parseInt(data.price)}
                  withInput={!edit}
                  onDelete={() => onDeleteProduct(data.id)}
                />
              ))}
            </Product.Table>
          </div>
          
          {/* {!edit && ( */}
          <Product.ContainerFooter>
            <Product.TextFooter onClick={onAddProduct} style={styles.underline}>
              {'+ Tambah SKU'}
            </Product.TextFooter>
            <Product.TextFooter>
              {'Total SKU: ' + list.length}
            </Product.TextFooter>
          </Product.ContainerFooter>
          {/* )} */}
        </>
      ) : (
        <>
          <Product.Container>
            <EmptyData onClick={onAddProduct} titleButton={'Tambah SKU'} />
          </Product.Container>
          <Product.ContainerRightFooter>
            <Product.TextFooterRight>
              {'Total SKU: 0'}
            </Product.TextFooterRight>
            {(list != null || list?.length <= 0) && (
              <Product.TextFooterRightError>
                {'Jumlah SKU dalam pesanan minimal 1'}
              </Product.TextFooterRightError>
            )}
          </Product.ContainerRightFooter>
        </>
      )}
    </>
  );
};

export default ProductSkuTable;
