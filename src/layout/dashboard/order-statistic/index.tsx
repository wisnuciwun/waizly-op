// component
import { LineChart } from '@/components/template/chart/line-chart';

// third party
import { Card } from 'reactstrap';

// styles
import { styles } from './styles';

// component
import { SkeletonLoading } from '@/components';

const OrdersStatistics = ({
  labelsData,
  dataTotalOrder,
  dataTotalCancelOrder,
  startDateText,
  endDateText,
  loading,
}) => {
  return (
    <Card style={styles.container} >
      <div className="h-100">
        <div className="card-inner">
          <div className="card-title-group mb-4">
            <div className="card-title">
              <p style={styles.TitleChard}>Grafik Pesanan</p>
              <span style={styles.SubtitleCard}>
                Pesanan yang terkirim dalam rentang {startDateText} -{' '}
                {endDateText}.
              </span>
            </div>
          </div>
          {loading ? (
            <>
              <SkeletonLoading width={'100%'} height={200} />
            </>
          ) : (
            <>
              <div className="nk-ecwg8-ck">
                <LineChart
                  labels={labelsData}
                  datasets={[
                    {
                      label: 'Total orders',
                      borderWidth: 2,
                      borderColor: '#733AEA',
                      backgroundColor: 'rgba(157, 114, 255, 0.15)',
                      data: dataTotalOrder,
                    },
                    {
                      label: 'Canceled orders',
                      borderWidth: 2,
                      borderColor: '#F2426E',
                      borderDash: [5],
                      backgroundColor: 'transparent',
                      data: dataTotalCancelOrder,
                    },
                  ]}
                  tooltip={true}
                  legend={false}
                  yAxis={true}
                  xAxis={true}
                />
              </div>
              <ul className="nk-ecwg8-legends mt-4 mb-0">
                <li className="mx-4">
                  <div className="title">
                    <span
                      className="dot dot-lg sq"
                      style={{ background: '#733AEA' }}
                    ></span>
                    <span style={styles.legend}>Total Pesanan</span>
                  </div>
                </li>
                <li className="mx-4">
                  <div className="title">
                    <span
                      className="dot dot-lg sq"
                      style={{ background: '#F2426E' }}
                    ></span>
                    <span style={styles.legend}>Pesanan Dibatalkan</span>
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
export default OrdersStatistics;
