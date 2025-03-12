/* eslint-disable react-hooks/exhaustive-deps */
// React & Next import
import {useState, useEffect, useRef} from 'react';

// component
import {Head, FilterMarketplaceDashboard, FilterDate, FilterStore, SkeletonLoading} from '@/components';

// third party
import {Row, Col, Card} from 'reactstrap';

// layout
import Content from '@/layout/content/Content';
import CountActionDashboard from '@/layout/dashboard/action-count-dashboard';
import CardTopProducts from '@/layout/dashboard/card/card-top-product';
import CardSalesSummary from '@/layout/dashboard/card/card-sales-summary';
import CardCashOnDelivery from '@/layout/dashboard/card/card-cod';
import CardInfoStatus from '@/layout/dashboard/card/card-info-status';
import OrderStatistics from '@/layout/dashboard/order-statistic';

// dummy
import {dummyDataSalesSummary, dummyDataCashOnDelivery, dummyCardInfoStatusDashboard} from '@/components/dummy-data/dashboard-list';

// redux & api
import {useDispatch, useSelector} from 'react-redux';
import {getDataStatusShipping, getDataSummaryOrder, getDataChart, getDataStore} from '@/services/dashboard';
import {setOrderCountSidebar} from '@/redux/action/product';

// utils
import {convertDate} from '@/utils/convertTimeStamp';
import { UseDelay } from '@/utils/formater';
import {getCountOrderSidebar} from '@/services/order';

function Dashboard() {
  // get client id from redux
  const {client_id} = useSelector((state: any) => state?.auth.user);

  // state data
  const [selectedMarketplaceIds, setSelectedMarketplaceIds] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState([]);
  const [dataStatusShipping, setDataStatusShipping] = useState([]);
  const [dataSummaryOrder, setDataSummaryOrder] = useState([]);
  const [dataTopSales, setDataTopSales] = useState([]);
  const [dataLabelChart, setDataLabelChart] = useState([]);
  const [dataTotalOrderChart, setDataTotalOrderChart] = useState([]);
  const [dataCancelOrderChart, setDataCancelOrderChart] = useState([]);
  const [dataCod, setDataCod] = useState([]);
  const [dataMarketPlace, setDataMarketPlace] = useState([]);
  const [dataStore, setDataStore] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // state loading and disable field
  const [loadingFetchShipping, setLoadingFetchShipping] = useState(false);
  const [loadingFetchSummary, setLoadingFetchSummary] = useState(false);
  const [loadingFetchChart, setLoadingFetchChart] = useState(false);
  const [loadingFetchMarketPlace, setLoadingFetchMarketPlace] = useState(false);
  const [disabledStore, setDisabledStore] = useState(true);
  const dispatch = useDispatch();

  // handle filter
  const handleFilterChange = (selectedIds: number[]) => {
    setSelectedMarketplaceIds(selectedIds);
    setDisabledStore(selectedIds.length === 0);
  };

  // use ref for handle api can't call loop
  const prevSelectedStoreIdRef = useRef([]);
  const prevSelectedStoreId = prevSelectedStoreIdRef.current;

  // fetch status shipping
  const fetchDataStatusShipping = async () => {
    try {
      setLoadingFetchShipping(true);
      const response = await getDataStatusShipping({
        client_id,
        channel_id: selectedMarketplaceIds,
        store_id: selectedStoreId,
        start_date: startDate,
        end_date: endDate,
      });
      setDataStatusShipping(response?.data);
    } catch (error) {
      // console.log(error);
    } finally {
      await UseDelay(1500);
      setLoadingFetchShipping(false);
    }
  };

  // fetch summary order
  const fetchDataSummaryOrder = async () => {
    try {
      setLoadingFetchSummary(true);
      const response = await getDataSummaryOrder({
        client_id,
        channel_id: selectedMarketplaceIds,
        store_id: selectedStoreId,
        start_date: startDate,
        end_date: endDate,
      });
      setDataSummaryOrder(response?.data?.ringkasan_penjualan);
      setDataTopSales(response?.data?.top_sales);
      setDataCod(response?.data?.cod_summary);
    } catch (error) {
      // console.log(error);
    } finally {
      await UseDelay(1500);
      setLoadingFetchSummary(false);
    }
  };

  // fetch chart data
  const fetchDataChart = async () => {
    try {
      setLoadingFetchChart(true);
      const response = await getDataChart({
        client_id,
        channel_id: selectedMarketplaceIds,
        store_id: selectedStoreId,
        start_date: startDate,
        end_date: endDate,
      });
      setDataLabelChart(response?.data?.labels?.date);
      setDataTotalOrderChart(response?.data?.datasets[0].data);
      setDataCancelOrderChart(response?.data?.datasets[1].data);
    } catch (error) {
      // console.log(error);
    } finally {
      await UseDelay(1500);
      setLoadingFetchChart(false);
    }
  };

  // fetch data store
  const fetchMarketplace = async () => {
    try {
      setLoadingFetchMarketPlace(true);
      const response = await getDataStore(client_id, selectedMarketplaceIds);
      const updatedChannel = response?.data?.channel?.filter((isSocialCommerce: any) => isSocialCommerce.channel_name !== 'SOCIALECOMMERCE');
      setDataMarketPlace(updatedChannel);
      setDataStore(response?.data?.store);
      setSelectedStoreId([]);
    } catch (error) {
      // console.log("errorrr", error);
    } finally {
      await UseDelay(1500);
      setLoadingFetchMarketPlace(false);
    }
  };

  const fetchAll = async () => {
    fetchDataChart();
    fetchDataSummaryOrder();
    fetchDataStatusShipping();
  };

  useEffect(() => {
    fetchAll();
  }, [startDate, endDate, selectedMarketplaceIds]);

  useEffect(() => {
    if (selectedStoreId.length > 0) {
      fetchAll();
    }
  }, [selectedStoreId]);

  useEffect(() => {
    fetchMarketplace();
  }, [selectedMarketplaceIds]);

  // use Effect for hanle useRef
  useEffect(() => {
    prevSelectedStoreIdRef.current = selectedStoreId;
  }, [selectedStoreId]);

  useEffect(() => {
    if (selectedStoreId.length === 0 && prevSelectedStoreId.length !== 0) {
      fetchAll();
    }
  }, [selectedStoreId, prevSelectedStoreId]);

  useEffect(() => {
    getCountOrderSidebar(client_id).then((v) => {
      dispatch(setOrderCountSidebar(v?.data || 0));
    });
  }, []);

  return (
    <>
      <Head title="Dashboard" />
      <Content>
        <CountActionDashboard />

        {/* filter store and date */}
        <hr className="my-4" />
        <Card className=" px-3">
          <div className="d-flex justify-content-between flex-wrap">
            <div className="my-1 col-13 col-lg-6">
              <FilterMarketplaceDashboard data={dataMarketPlace} onFilterChange={handleFilterChange} loading={loadingFetchMarketPlace} />
            </div>
            <div className="my-2 col-12 col-md-12 col-lg-6">
              <div className="d-flex g-8">
                <div className="mb-2 col-sm-12 col-md-6 mb-sm-0">
                  <FilterDate setStartDate={setStartDate} setEndDate={setEndDate} />
                </div>
                {loadingFetchMarketPlace ? (
                  <>
                    <div className="m-2 col-sm-12 col-md-6 my-md-0">
                      <SkeletonLoading width={'100%'} height={36} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="m-2 col-sm-12 col-md-6 my-md-0">
                      <FilterStore valueOption={selectedStoreId} setValueOption={setSelectedStoreId} placeholder={'Pilih Toko'} option={dataStore} emptyMessage="Toko tidak di temukan" disabled={disabledStore} optionLabel="name" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* card info status shipping */}
        <CardInfoStatus data={dummyCardInfoStatusDashboard} dataCount={dataStatusShipping} loading={loadingFetchShipping} />

        {/* chart order */}
        <OrderStatistics loading={loadingFetchChart} labelsData={dataLabelChart} dataTotalOrder={dataTotalOrderChart} dataTotalCancelOrder={dataCancelOrderChart} startDateText={convertDate(startDate)} endDateText={convertDate(endDate)} />

        {/* card summary order, top sales and  cash on delivery */}
        <Row className="mt-2">
          <Col sm="6" md="4" className="mt-2">
            <CardSalesSummary titleCard="Ringkasan Penjualan" data={dummyDataSalesSummary} dataCount={dataSummaryOrder} loading={loadingFetchSummary} />
          </Col>
          <Col sm="6" md="4" className="mt-2">
            <CardTopProducts titleCard="10 Produk Teratas" data={dataTopSales} loading={loadingFetchSummary} />
          </Col>
          <Col sm="6" md="4" className="mt-2">
            <CardCashOnDelivery titleCard="Cash On Delivery" data={dummyDataCashOnDelivery} dataCount={dataCod} loading={loadingFetchSummary} />
          </Col>
        </Row>
      </Content>
    </>
  );
}

export default Dashboard;
