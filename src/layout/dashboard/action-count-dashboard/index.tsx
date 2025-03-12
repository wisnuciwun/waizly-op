/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

//third party
import {CardTitle, Col, Row} from 'reactstrap';

//styles
import Create, {styles} from './styles';

//components
import TooltipComponent from '@/components/template/tooltip';
import {BarChart} from '@/components/template/chart/bar-chart';
import {dummyChart} from '@/components/dummy-data/dashboard-list';
import {getActionDataDashboard} from '@/services/dashboard';
import {useSelector} from 'react-redux';
import {Skeleton} from 'primereact/skeleton';

function CountActionDashboard({}) {
  const {client_id} = useSelector((state: any) => state?.auth.user);

  const [actionDasboardData, setActionDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClickRouteCard = (link: string) => window.location.replace(link);

  const fetchDataCounActiontDashboard = async () => {
    try {
      setLoading(true);
      const response = await getActionDataDashboard({client_id});
      setActionDashboardData(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataCounActiontDashboard();
  }, []);

  return (
    <div className="wrapper-bg-light">
      <Create.TitleCard>Perlu Tindakan</Create.TitleCard>
      <Create.SubTitleCard>Data yang disajikan di bawah ini bersifat aktual dan diperbarui secara real-time. Silakan lakukan tindakan untuk memperbarui informasi status pesananmu.</Create.SubTitleCard>

      <Row xs="3" className={'gy-4 gx-4'}>
        {loading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <Col key={index} sm="6" lg="4" xs="12">
                <Skeleton width="100%" height="150px" />
              </Col>
            ))}
          </>
        ) : (
          <>
            {actionDasboardData && actionDasboardData.map((actionData, idx) => (
              <Col sm="6" lg="4" xs="12" key={idx}>
                <Create.CardCountAction onClick={() => handleClickRouteCard(actionData.link)} isColorBorder={actionData.color} isBackgroundColor={actionData.hoverColor}>
                  <div className={'card-inner'} style={{padding: 20}}>
                    <div className="card-title-group align-start mb-2">
                      <CardTitle>
                        <p className="title" style={styles.TitleCard}>
                          {actionData.title}
                        </p>
                      </CardTitle>
                      <div className="card-tools">
                        <TooltipComponent icon="help-fill" iconClass="card-hint" direction="left" id={'Tooltip-' + actionData.id} text={actionData.tooltipText} style={styles.TooltipCanvasField} />
                      </div>
                    </div>
                    <div className="align-end flex-sm-wrap flex-md-nowrap" style={styles.CountWrapperHeight}>
                      <div className="nk-sale-data" style={styles.CountWrapperColumn}>
                        <Create.ValueText className="amount text-truncate" isColor={actionData.color}>
                          {actionData.value}
                        </Create.ValueText>
                      </div>
                      <div className="nk-sales-ck" style={styles.CountWrapperColumn}>
                        <BarChart dataChart={dummyChart(actionData.backgroundColor)} />
                      </div>
                    </div>
                  </div>
                </Create.CardCountAction>
              </Col>
            ))}
          </>
        )}
      </Row>
    </div>
  );
}

export default CountActionDashboard;
