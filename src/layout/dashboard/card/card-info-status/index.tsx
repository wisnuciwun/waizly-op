// next & react
import React from 'react';
import Image from 'next/image';

// component
import { Button, Icon, SkeletonLoading } from '@/components';
import { Row, Col, Card } from 'reactstrap';

// styles
import {
  styles,
  iconStyles,
  wrapperButtonIcon,
  getLineGradientStyle,
} from './styles';

// utils
import { formatCurrencyId } from '@/utils/formatCurrency';

// image
import EmptyImgae from '@/assets/images/illustration/ilustration-nodata.svg';

interface data {
  title?: string;
  icon: string;
  icon_color?: string;
  icon_bg?: string;
}

interface Props {
  data: data[];
  dataCount: any;
  loading: boolean;
}

const CardInfoStatus = ({ data, dataCount, loading }: Props) => {
  const dataCountIndex = [
    dataCount?.menunggu_resi,
    dataCount?.ready_to_pickup,
    dataCount?.shipped,
    // dataCount.in_trainsit,
    // dataCount.in_process,
    dataCount?.complete,
  ];

  // costum style margin left by index
  const marginLeftByIndex: { [key: number]: string } = {
    0: '-5px',
    1: '-4px',
    2: '1px',
    3: '1px',
  };

  const allZero = dataCountIndex.every((count) => count === 0);
  const allNaN = dataCountIndex.every((count) => isNaN(count));

  return (
    <>
      <Card style={styles.container} className="px-4 py-3">
        <span style={styles.Headertitle}>
          Status Pengiriman yang ter-integrasi dengan Bebas Kirim
        </span>
        <p style={styles.Headersub} className={allZero ? 'd-none' : 'd-block'}>
          Hanya menampilkan status pengiriman pesanan yang menggunakan layanan
          Bebas Kirim
        </p>
        {loading ? (
          <>
            <div className="d-none d-sm-flex mt-2 mx-4" style={styles.Wrapper}>
              {data.map((item: data, idx: number) => (
                <div
                  key={idx}
                  className={idx !== data.length - 1 ? 'w-100' : ''}
                >
                  <div className="d-flex align-items-center">
                    <SkeletonLoading
                      width={'52px'}
                      height={'52px'}
                      className="rounded-circle"
                    />
                  </div>
                  <div style={styles.WrapperText}>
                    <div className="skeleton-status-shipping">
                      <SkeletonLoading
                        width={'95px'}
                        height={'15px'}
                        className="rounded-full my-3"
                      />
                      <SkeletonLoading
                        width={'25px'}
                        height={'25px'}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Row
              className="d-sm-none mt-2 mx-4 mb-3"
              style={{ placeContent: 'center' }}
            >
              {data.map((item: data, idx: number) => (
                <Col
                  xs={5}
                  key={idx}
                  className="m-3 text-center"
                  style={{ textAlignLast: 'center' }}
                >
                  <div className="d-flex flex-column align-items-center">
                    <SkeletonLoading
                      width={'52px'}
                      height={'52px'}
                      className="rounded-circle"
                    />
                    <div className="d-flex flex-column align-items-center">
                      <SkeletonLoading
                        width={'95px'}
                        height={'15px'}
                        className="rounded-full my-3"
                      />
                      <SkeletonLoading
                        width={'25px'}
                        height={'25px'}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <>
            {allZero || allNaN ? (
              <>
                <div className="d-flex flex-column text-center align-items-center my-4">
                  <Image src={EmptyImgae} width={180} alt="empty-image" />
                  <span style={styles.emptyTitle}>Whoops!</span>
                  <span style={styles.emptySubTitle}>
                    Data tidak tersedia, silakan menggunakan layanan Bebas
                    Kirim untuk melihat status pengiriman ini
                  </span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="d-none d-sm-flex mt-2 mx-4"
                  style={styles.Wrapper}
                >
                  {data.map((item: data, idx: number) => (
                    <div
                      key={idx}
                      className={idx !== data.length - 1 ? 'w-100' : ''}
                    >
                      <div className="d-flex align-items-center">
                        <Button
                          size="lg"
                          style={wrapperButtonIcon(item.icon_color)}
                        >
                          <Icon
                            name={item.icon}
                            style={iconStyles(item.icon_color, item.icon_bg)}
                          />
                        </Button>
                        <div
                          className="d-none d-sm-flex"
                          style={getLineGradientStyle(idx)}
                        ></div>
                      </div>
                      <div
                        style={{
                          ...styles.WrapperText,
                          marginLeft:
                            idx === 2 ? '-28px' : styles.WrapperText.marginLeft,
                        }}
                      >
                        <p style={styles.Text}>{item.title}</p>
                        <p
                          style={{
                            ...styles.Count,
                            marginLeft: marginLeftByIndex[idx],
                          }}
                        >
                          {formatCurrencyId(dataCountIndex[idx])}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Row
              className="d-sm-none mt-2 mx-4 mb-3"
              style={{ placeContent: 'center' }}
            >
              {data.map((item: data, idx: number) => (
                <Col
                  xs={5}
                  key={idx}
                  className="m-3 text-center"
                  style={{ textAlignLast: 'center' }}
                >
                  <div>
                    <Button
                      size="lg"
                      style={wrapperButtonIcon(item.icon_color)}
                    >
                      <Icon
                        name={item.icon}
                        style={iconStyles(item.icon_color, item.icon_bg)}
                      />
                    </Button>
                    <div>
                      <p style={styles.Text}>{item.title}</p>
                      <p
                        style={{
                          ...styles.Count,
                        }}
                      >
                        {formatCurrencyId(dataCountIndex[idx])}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Card>
    </>
  );
};

export default CardInfoStatus;
