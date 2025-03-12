// next & react
import React from 'react';
import Image from 'next/image';

// third party
import { Card } from 'reactstrap';

// component
import Icon from '@/components/atoms/icon';
import { Button, SkeletonLoading } from '@/components';

// styles
import { styles, iconStyles, textCountCodStyles } from './styles';

// utils
import { formatCurrencyId } from '@/utils/formatCurrency';

// asset
import emptyImage from '@/assets/images/empty/wallet.svg';
import colors from '@/utils/colors';

interface Summary {
  count?: string;
  totalOrders?: string;
  icon?: string;
  color_text_count?: string;
  color?: string;
  background_color?: string;
  cod_title?: string;
}

interface SummaryCount {
  sum?: any;
  count?: any;
}

interface Props {
  titleCard?: string;
  data: Summary[];
  dataCount: SummaryCount[];
  loading?: boolean;
}

const CardCashOnDelivery = ({ titleCard, data, dataCount, loading }: Props) => {
  return (
    <Card style={styles.CardWraper}>
      <div>
        <div className="card-title-group card-product-inner">
          <div className="card-title">
          <p style={{fontSize: 14, fontWeight: '600', color: colors.black}} className="title-product">
              {titleCard}
            </p>
          </div>
        </div>
        <ul className="nk-top-products" style={styles.WrapperList}>
          {loading ? (
            <>
              {data.map((item: Summary, idx: number) => (
                <li
                  className="item d-flex justify-content-between mb-2"
                  key={idx}
                >
                  <div style={styles.TitleProductWrapper}>
                    <div className="text-truncate">
                      <SkeletonLoading width={'150px'} height={'15px'} />
                    </div>
                    <div className="d-flex" style={styles.MarketPlaceImage}>
                      <SkeletonLoading
                        width={'100px'}
                        height={'15px'}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <div style={styles.skeletonLoadingWrapp}>
                      <SkeletonLoading
                        width={'43px'}
                        height={'43px'}
                        className="rounded-circle"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </>
          ) : (
            <>
              {dataCount && dataCount.length === 0 ? (
                <>
                  <div style={styles.wrapperNoData}>
                    <Image src={emptyImage} width={131} alt="empty" />
                    <div style={styles.textNoData}>Whoops!</div>
                    <p className="px-3" style={styles.textSubNoData}>
                      Data tidak tersedia karena data ini hanya untuk pesanan
                      yang menggunakan integrasi kurir Bebas Kirim.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {data.map((item: Summary, idx: number) => (
                    <li
                      className="item d-flex justify-content-between mb-2"
                      key={idx}
                    >
                      <div style={styles.TitleProductWrapper}>
                        <div className="text-truncate">
                          <text
                            style={styles.TextTotalCod}
                            className="text-truncate px-1"
                          >
                            {`COD ${item.cod_title} (${dataCount ? dataCount[idx]?.count : 0} Pesanan)`}
                          </text>
                        </div>
                        <div className="d-flex" style={styles.MarketPlaceImage}>
                          <span
                            className="text-truncate"
                            style={textCountCodStyles(item?.color_text_count)}
                          >
                            {formatCurrencyId(dataCount ? dataCount[idx].sum : 0) ?? '-'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Button size="lg" className="p-0">
                          <Icon
                            name={item?.icon}
                            style={iconStyles(
                              item?.color,
                              item?.background_color
                            )}
                          />
                        </Button>
                      </div>
                    </li>
                  ))}
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </Card>
  );
};

export default CardCashOnDelivery;
