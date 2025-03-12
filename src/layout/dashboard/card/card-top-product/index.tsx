// next & react
import React from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import Nodata from '@/assets/images/illustration/no-data-product.svg';

// third party
import { Card } from 'reactstrap';

// component
import { SkeletonLoading } from '@/components';

// asset
import defaultImage from '@/assets/images/dummy/default.svg';

// styles
import { styles } from './styles';

// utils
import { formatCurrencyId } from '@/utils/formatCurrency';
import { getChannelLogo } from '@/utils/get-logo-channel';
import colors from '@/utils/colors';

interface Product {
  name?: string;
  marketplace?: StaticImageData;
  sku?: string;
  store_name?: string;
  channel_name?: string;
  reference_price?: string;
  terjual?: string;
  product_image_url?:string
}

interface Props {
  titleCard?: string;
  data: Product[];
  loading: boolean;
}

const CardTopProducts = ({ titleCard, data, loading }: Props) => {
  return (
    <Card style={styles.CardWraper}>
      <div className="card-inner">
        <div className="card-title-group mb-2">
          <div className="card-title">
          <p style={{fontSize: 14, fontWeight: '600', color: colors.black}} className="title-product">{titleCard}</p>
          </div>
        </div>
        <ul
          className="nk-top-products"
          style={{ ...styles.WrapperList, ...styles.CustomOverflowY }}
        >
          {data && data.length > 0 ? (
            <>
              {data.map((item: Product, idx: number) => (
                <li className="item" key={idx}>
                  <div className="thumb">
                    {loading ? (
                      <>
                        <SkeletonLoading
                          width={'45px'}
                          height={'45px'}
                          className="rounded-circle"
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          src={item?.product_image_url || defaultImage}
                          width={44}
                          height={44}
                          alt="product"
                        />
                      </>
                    )}
                  </div>
                  <div style={styles.TitleProductWrapper}>
                    {loading ? (
                      <div style={{ marginLeft: 5 }}>
                        <SkeletonLoading
                          width={'100px'}
                          height={'15px'}
                          className="mb-1"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="text-truncate">
                          <span className="title text-truncate px-1">
                            {item?.name ?? '-'}
                          </span>
                        </div>
                      </>
                    )}
                    {loading ? (
                      <>
                        <SkeletonLoading
                          width={'50px'}
                          height={'15px'}
                          className="mt-1"
                        />
                      </>
                    ) : (
                      <>
                        <div
                          className="d-flex text-truncate"
                          style={styles.MarketPlaceImage}
                        >
                          <Image
                            src={getChannelLogo(item?.channel_name).logo}
                            width={16}
                            alt="marketplace"
                          />
                          <span
                            className="price text-truncate"
                            style={styles.Price}
                          >
                            {item?.store_name ?? '-'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="total text-nowrap text-truncate">
                    {loading ? (
                      <>
                        <SkeletonLoading
                          width={'80px'}
                          height={'15px'}
                          className="mb-1 float-end"
                        />
                        <SkeletonLoading
                          width={'100px'}
                          height={'15px'}
                          className="mb-1 float-end"
                        />
                      </>
                    ) : (
                      <>
                        <div
                          className="amount text-truncate"
                          style={styles.Amount}
                        >
                          {`${item?.reference_price}`.length > 12
                            ? `${item?.reference_price.slice(0, 12)}...`
                            : `Rp ${
                                formatCurrencyId(item?.reference_price) ?? '-'
                              }`}
                        </div>
                        <div
                          className="count text-truncate"
                          style={styles.Price}
                        >
                          {item?.terjual ?? '-'} Terjual
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </>
          ) : (
            <>
              {loading ? (
                <>
                  {[...Array(4)].map((_, index) => (
                    <li className="item" key={index}>
                      <div className="thumb">
                        <SkeletonLoading
                          width={'45px'}
                          height={'45px'}
                          className="rounded-circle"
                        />
                      </div>
                      <div
                        style={{ ...styles.TitleProductWrapper, marginLeft: 5 }}
                      >
                        <SkeletonLoading
                          width={'100px'}
                          height={'15px'}
                          className="mb-1"
                        />
                        <SkeletonLoading
                          width={'50px'}
                          height={'15px'}
                          className="mt-1"
                        />
                      </div>
                      <div className="total text-nowrap text-truncate">
                        <SkeletonLoading
                          width={'80px'}
                          height={'15px'}
                          className="mb-1 float-end"
                        />
                        <SkeletonLoading
                          width={'100px'}
                          height={'15px'}
                          className="mb-1 float-end"
                        />
                      </div>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  <div style={styles.wrapperNoData}>
                    <Image src={Nodata} alt="waizly-logo" />
                    <div style={styles.textNoData}>Whoops!</div>
                    <p style={styles.desc}>Kamu belum memiliki produk terjual.</p>
                  </div>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </Card>
  );
};

export default CardTopProducts;
