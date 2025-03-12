// next & react
import React from 'react';

// third party
import { Card } from 'reactstrap';

// component
import Icon from '@/components/atoms/icon';
import { Button, SkeletonLoading } from '@/components';

// styles
import { styles, iconStyles, textCount } from './styles';
import colors from '@/utils/colors';

interface Summary {
  count?: string;
  title?: string;
  icon?: string;
  color?: string;
  background_color?: string;
}

interface SummaryCount {
  count?: string;
}

interface Props {
  titleCard?: string;
  data: Summary[];
  dataCount: SummaryCount[];
  loading?: boolean;
}

const CardSalesSummary = ({ titleCard, data, dataCount, loading }: Props) => {
  return (
    <Card style={styles.CardWraper}>
      <div>
        <div className="card-title-group card-product-inner">
          <div className="card-title">
            <p style={{fontSize: 14, fontWeight: '600', color: colors.black}} className="title-product">{titleCard}</p>
          </div>
        </div>
        <ul className="nk-top-products" style={styles.WrapperList}>
          {data.map((item: Summary, idx: number) => (
            <li className="item" key={idx} style={styles.WrapperItem}>
              <div style={styles.WrapperIcon}>
                {loading ? (
                  <>
                    <SkeletonLoading
                      width={'43px'}
                      height={'43px'}
                      className="rounded-circle"
                    />
                  </>
                ) : (
                  <>
                    <Button size="lg" className="p-0">
                      <Icon
                        name={item?.icon}
                        style={iconStyles(item.color, item.background_color)}
                      />
                    </Button>
                  </>
                )}
              </div>
              <div style={styles.TitleProductWrapper}>
                {loading ? (
                  <>
                    <SkeletonLoading
                      width={'50px'}
                      height={'13px'}
                      className="mb-2"
                    />
                    <SkeletonLoading width={'120px'} height={'13px'} />
                  </>
                ) : (
                  <>
                    <div className="text-truncate">
                      <span
                        className="title text-truncate px-1"
                        style={textCount(item.color)}
                      >
                        {dataCount ? dataCount[idx]?.count : 0}
                      </span>
                    </div>
                    <div
                      style={styles.wrapperTextInfo}
                      className="text-truncate"
                    >
                      <span
                        className="price text-nowrap"
                        style={styles.TextInfo}
                      >
                        {item?.title}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default CardSalesSummary;
