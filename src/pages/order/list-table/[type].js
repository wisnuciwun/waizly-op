/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// React
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { UncontrolledTooltip } from 'reactstrap';
// layout
import Content from '@/layout/content/Content';
import { FilterTableOrder } from '@/components/molecules/filter-table';

// component
import {
  Head,
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockBetween,
  Button,
  DropdownOption,
  Icon,
  BlockContent,
  PreviewAltCard,
  PaginationComponent,
  TabsIcon,
  ModalConfirm,
  Select,
  TagFilter
} from '@/components';
import { DataTableTitle } from '@/components/molecules/table/table-master-sku';
import { Input, Badge, Modal, ModalBody, Row, Col, Spinner } from 'reactstrap';
import { Skeleton } from 'primereact/skeleton';
import DatePicker from 'react-datepicker';
import ModalCancel from '@/components/atoms/modal/modal-confirm/modalCancel';
import ModalShipping from '@/components/atoms/modal/modal-shipping';

// Asset
import Nodata from '@/assets/images/illustration/no-data.svg';
import gifSuccess from '@/assets/gift/Highfive.gif';
import gifError from '@/assets/gift/Anxiety.gif';
import gifConfirm from '@/assets/gift/verification-yes-no.gif';
import gifConfirmGreen from '@/assets/gift/verification-yes-no-green.gif';
import gifReadyProcess from '@/assets/gift/heavy-box.gif';
import gifAnxiety from '@/assets/gift/Anxiety.gif';
import TooltipComponent from '@/components/template/tooltip';

// utils
import {
  getOptionCancellation,
  getOptionPesanan,
  getOptionRetur,
} from '@/utils/getSelectOption';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// redux & service
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { setOrderCountSidebar } from '@/redux/action/product';

// img
import loadingGif from '@/assets/gift/loading.gif';
import courierImg from '@/assets/images/illustration/illustration-courier.svg';
import courierDisabled from '@/assets/images/illustration/illustration-courier-disabled.svg';
import personSendDisabled from '@/assets/images/illustration/illustration-send-disabled.svg';
import personSend from '@/assets/images/illustration/illustration-send.svg';
import choosingOptions from '@/assets/gift/choosing-options.gif';
import FilterTableStore from '@/components/molecules/table/table-pesanan/filter';
import {
  dataTabsIconBermasalah,
  dataTabsIconDiproses,
  dataTabsIconPembatalan,
  dataTabsIconPengiriman,
  dataTabsIconSelesai,
} from '@/components/molecules/tabs/data-tabs-pesanan';
import {
  countStatusOrder,
  getDeliveryInfo,
  getOrderList,
  postAcceptReturOrder,
  postCancelOrder,
  postCompleteOrder,
  postProcessOrder,
  postBulkProcessOrder,
  postReturOrder,
  postShipOrder,
  postRejectCancel,
  postAcceptCancel,
  getShippingLabel,
  bulkRate,
  checkBulkRate,
  checkIndividualRate,
  getCountOrderSidebar,
  trackingHistory,
  postBulkCompleteOrder,
} from '@/services/order';
import { orderStatus, iconChannel } from '@/utils';
import { usePermissions } from '@/utils/usePermissions';
import ButtonMore from '@/components/atoms/buttonmore';
import { changeToFormatPhone } from '@/utils/formater';
import ModalTrackingOrder from '../detail-pesanan/components/modal-tracking-order';
import Link from 'next/link';

function ListTable() {
  const dispatch = useDispatch();
  const permissions = usePermissions();
  const [routeCode, setrouteCode] = useState('');
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const title = params != null ? [...params?.type.split('')] : [''];
  title?.shift();
  const [channel, setchannel] = useState(null);
  const [location, setlocation] = useState(null);
  const [courier, setCourier] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [isSucces, setisSucces] = useState({ show: false, text: '' });
  const [isError, setisError] = useState({ show: false, text: '' });
  const { client_id } = useSelector((state) => state.auth.user);
  const [dataOrder, setdataOrder] = useState([]);
  const [deliveryType, setdeliveryType] = useState('');
  const [modalSendOrder, setmodalSendOrder] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [modalRedConfirm, setmodalRedConfirm] = useState(false);
  const [modalGreenConfirm, setmodalGreenConfirm] = useState(false);
  const [modalProcessOrder, setmodalProcessOrder] = useState(false);
  const [modalReadyOrder, setmodalReadyOrder] = useState(false);
  const [modalAcceptRetur, setmodalAcceptRetur] = useState(false);
  const [modalAlertOngkir, setmodalAlertOngkir] = useState(false);
  const loading = false;
  const [selectedSearchOption, setSelectedSearchOption] =
    useState('order_code');
  const [selectedCanceledBy, setselectedCanceledBy] = useState('BUYER');
  const [cancelReason, setcancelReason] = useState('');
  const [courierName, setcourierName] = useState('');
  const [resi, setresi] = useState('');
  const [selectedReturBy, setselectedReturBy] = useState('BUYER');
  const [returReason, setreturReason] = useState('');
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 8, size: 10 });
  const [pageInfo, setPageInfo] = useState({
    total_record: 10,
    size_per_page: 10,
    previous_page: null,
    current_page: 1,
    next_page: 2,
    total_pages: 1,
  });
  const [isModalCancel, setisModalCancel] = useState(false);
  const [isModalRetur, setisModalRetur] = useState(false);
  const [isModalConfirmSend, setisModalConfirmSend] = useState(false);
  const [selectedHeaderId, setselectedHeaderId] = useState('');
  const route = useRouter();
  const [statusCounter, setstatusCounter] = useState([]);
  const [rangeDate, setRangeDate] = useState({ start: null, end: null });
  const inputRef = useRef(null);
  const [showModalShipping, setShowModalShipping] = useState(false);
  const [dataShippingLabel, setDataShippingLabel] = useState();
  const [openDate, setOpenDate] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [showModalWaitingBulkShipping, setShowModalWaitingBulkShipping] =
    useState(false);
  const [showModalSuccessCountShipping, setShowModalSuccessCountShipping] =
    useState(false);
  const [showModalBulkCompleteOrder, setShowModalBulkCompleteOrder] =
    useState(false);
  const [infoBulkRate, setInfoBulkRate] = useState({
    status: false,
    success: 0,
    failed: 0,
  });
  const [loadingButton, setLoadingButton] = useState(false);
  const [idOrderHeader, setIdOrderHeader] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const handlePageChange = (page) => {
    setPaginationModel((prevState) => ({ ...prevState, page }));
    setSelectedItem([]);
  };
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [listHistoryOrder, setListHistoryOrder] = useState([]);
  const ethixWarehouseCode = 2;
  const [copyText, setcopyText] = useState('Copy');

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [dataFilter, setDataFilter] = useState(null);

  const handlePerPage = (size) => {
    setPaginationModel((prevState) => ({ ...prevState, size, page: 1 }));
  };

  const handleResetFilter = () => {
    setlocation(null);
    setchannel(null);
    setCourier(null);
    setPaymentMethod(null);
  };

  const handleDeleteFilter = (idx) => {
    const dataFilters = dataFilter.filter((_,index) => index !== idx);

    setDataFilter(dataFilters);
  };

  const updateChannelInPayload = (selectedChannel) => {
    const channelsArray = Array.isArray(selectedChannel) ? selectedChannel : [];
    const selectedChannels = channelsArray.filter(
      (value) => value.type === 'channel',
    );
    const channelIds =
      selectedChannels.length == 0
        ? null
        : selectedChannels.map((channel) => channel.id);

    setchannel(channelIds);
    handlePageChange(1);
  };

  const updateLocationInPayload = (selectedLocation) => {
    const channelsArray = Array.isArray(selectedLocation)
      ? selectedLocation
      : [];
    const selectedLocations = channelsArray.filter(
      (value) => value.type === 'location',
    );
    const locationIds =
      selectedLocations.length == 0
        ? null
        : selectedLocations.map((val) => val.id);

    setlocation(locationIds);
    handlePageChange(1);
  };

  const updateCourierInPayload = (selectedCourier) => {
    const courierArray = Array.isArray(selectedCourier) ? selectedCourier : [];
    const selectedCouriers = courierArray.filter(
      (value) => value.type === 'courier',
    );
    const courierIds =
      selectedCouriers.length == 0
        ? null
        : selectedCouriers.map((val) => val.id);

    setCourier(courierIds);
    handlePageChange(1);
  };

  const updatePaymentMethodInPayload = (selectedPaymentMethod) => {
    const paymentMethodArray = Array.isArray(selectedPaymentMethod)
      ? selectedPaymentMethod
      : [];
    const selectedPaymentMethods = paymentMethodArray.filter(
      (value) => value.type === 'paymentmethod',
    );
    const paymentMethodIds =
      selectedPaymentMethods.length == 0
        ? null
        : selectedPaymentMethods.map((val) => val.id);

    setPaymentMethod(paymentMethodIds);
    handlePageChange(1);
  };

  const onRangeChange = (dates) => {
    const [start, end] = dates;
    setRangeDate({ start: start, end: end });
    if (start && end) {
      setOpenDate(false);
    }
  };

  const tabOption = () => {
    switch (params?.type) {
      case 'bermasalah':
        return dataTabsIconBermasalah;
      case 'diproses':
        return dataTabsIconDiproses;
      case 'pengiriman':
        return dataTabsIconPengiriman;
      case 'selesai':
        return dataTabsIconSelesai;
      case 'pembatalan':
        return dataTabsIconPembatalan;
      default:
        return dataTabsIconBermasalah;
    }
  };

  const onGetOrderList = async (data) => {
    setLoadingData(true);
    const filterChannel = dataFilter?.filter((value) => value.type === 'Channel')[0]?.filter || [];
    const filterLocation = dataFilter?.filter((value) => value.type === 'Gudang')[0]?.filter || [];
    const filterCourier = dataFilter?.filter((value) => value.type === 'Courier')[0]?.filter || [];
    const filterMetode = dataFilter?.filter((value) => value.type === 'Metode Pembayaran')[0]?.filter || [];
    
    let payload = {
      client_id: client_id,
      channel_id: filterChannel,
      location_id: filterLocation,
      logistic_carrier_id: filterCourier,
      payment_method_id: filterMetode,
      status_id: params?.type == 'semua' ? [] : [routeCode],
      search: {
        order_code: null,
        tracking_number: null,
        recipient_name: null,
        logistic_carrier: null,
      },
      start_date:
        rangeDate.start != null
          ? parseInt(moment(rangeDate.start).startOf('day') / 1000)
          : null,
      end_date:
        rangeDate.end != null
          ? parseInt(moment(rangeDate.end).endOf('day') / 1000)
          : null,
          page: data ? data.page : paginationModel.page,
          size: data ? data.size : paginationModel.size,
    };

    payload.search[selectedSearchOption] = search;

    try {
      await getOrderList(payload).then((res) => {
        if (res.status == 200) {
          setdataOrder(res.data.orders);
          setPageInfo(res.data.page);
        }
      });
    } catch (error) {
      // if (error?.response?.status === 400) {
      //   route.push("/login");
      // }
    } finally {
      setLoadingData(false);
    }
  };

  const onGetStatusCounter = () => {
    if (params?.type != 'semua') {
      let payload = {
        client_id: client_id,
        status_id: tabOption().map((v) => v.type),
      };

      countStatusOrder(payload).then((res) => {
        if (res.status == 200) {
          let counter = tabOption().map(
            (v) =>
              res.data.count_order.find((w) => w.internal_status_id == v.type)
                .count,
          );
          setstatusCounter(counter);
        }
      });
    }
  };

  const statusBadge = (dataByItem) => {
    let selectedRouteCode =
      params?.type == 'semua' ? dataByItem?.status_id : routeCode;

    switch (selectedRouteCode) {
      case orderStatus.SIAP_DIPROSES:
        if (
          dataByItem &&
          (parseFloat(dataByItem.shipping_price) < 0 ||
            dataByItem.shipping_price === null) &&
          dataByItem?.delivery_method !== 'SELF-DELIVERY'
        ) {
          return {
            style: { backgroundColor: '#FFF2C6', color: '#FFB703' },
            text: dataTabsIconDiproses
              .filter((v) => v.type == selectedRouteCode)[0]
              ?.label?.toUpperCase(),
            buttonText: 'Hitung Biaya Kirim',
            buttonMoreText: 'Batalkan Pesanan',
          };
        } else {
          return {
            style: { backgroundColor: '#FFF2C6', color: '#FFB703' },
            text: dataTabsIconDiproses
              .filter((v) => v.type == selectedRouteCode)[0]
              ?.label?.toUpperCase(),
            buttonText: 'Proses Pesanan',
            buttonMoreText: 'Batalkan Pesanan',
          };
        }
      case orderStatus.BELUM_DIBAYAR:
      case orderStatus.UNMAPPING_PRODUK:
      case orderStatus.UNMAPPING_GUDANG:
      case orderStatus.OUT_OF_STOCK:
        return {
          style: { backgroundColor: '#FFF2C6', color: '#FFB703' },
          text: dataTabsIconDiproses
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
          buttonText: 'Proses Pesanan',
          buttonMoreText: 'Batalkan Pesanan',
        };
      case orderStatus.DIPROSES:
        return {
          style: { backgroundColor: '#FFE9D0', color: '#EF7A27' },
          text: dataTabsIconDiproses
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
          buttonText: 'Kirim Pesanan',
          buttonMoreText: 'Batalkan Pesanan',
        };
      case orderStatus.MENUNGGU_RESI:
      case orderStatus.MENUNGGU_KURIR:
        return {
          style: { backgroundColor: '#D5FDFF', color: '#00A7E1' },
          text: dataTabsIconPengiriman
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
          buttonMoreText: 'Batalkan Pesanan',
        };
      case orderStatus.SEDANG_DIKIRIM:
      case orderStatus.PENGIRIMAN_SELESAI:
        return {
          style: { backgroundColor: '#E1EFFA', color: '#0372D9' },
          text: dataTabsIconPengiriman
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
          buttonText: 'Selesaikan Pesanan',
          buttonMoreText: 'Permintaan Pengembalian',
        };
      case orderStatus.DITERIMA:
        return {
          style: { backgroundColor: '#E2FFEC', color: '#36C068' },
          text: dataTabsIconSelesai
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.DALAM_PENGEMBALIAN:
        return {
          style: { backgroundColor: '#E9E9EA', color: '#4C4F54' },
          text: dataTabsIconSelesai
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
          buttonText: 'Terima Pengembalian',
        };
      case orderStatus.DIBATALKAN:
      case orderStatus.PENGAJUAN_PEMBATALAN:
        return {
          style: { backgroundColor: '#FFE3E0', color: '#FF6E5D' },
          text: dataTabsIconPembatalan
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
        };
      case orderStatus.UNMAPPING_ORDER:
        return {
          style: { backgroundColor: '#FFE9D0', color: '#EF7A27' },
          text: dataTabsIconBermasalah
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
          buttonMoreText: 'Batalkan Pesanan',
          buttonText: 'Lengkapi Pesanan',
        };
      case orderStatus.SELESAI_DIKEMBALIKAN:
        return {
          style: { backgroundColor: '#E2FFEC', color: '#36C068' },
          text: dataTabsIconSelesai
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
        };
      default:
        return {
          style: { backgroundColor: '#FFF2C6', color: '#FFB703' },
          text: dataTabsIconDiproses
            .filter((v) => v.type == selectedRouteCode)[0]
            ?.label?.toUpperCase(),
        };
    }
  };

  const handleTabChange = (value) => {
    setSearch('');
    // setlocation(null);
    // setchannel(null);
    setRangeDate({ start: null, end: null });
    setPaginationModel({ page: 1, size: 10 });
    setSelectedItem([]);
    // setrouteCode(value);
  };

  const initialRouteCode = () => {
    const tabs = searchParams.get('tab');
    if (params?.type != undefined && !tabs) {
      switch (params?.type) {
        case 'bermasalah':
          handleSetParams(orderStatus.UNMAPPING_PRODUK);
          break;
        case 'diproses':
          handleSetParams(orderStatus.BELUM_DIBAYAR);
          break;
        case 'pengiriman':
          handleSetParams(orderStatus.MENUNGGU_RESI);
          break;
        case 'selesai':
          handleSetParams(orderStatus.DITERIMA);
          break;
        case 'pembatalan':
          handleSetParams(orderStatus.PENGAJUAN_PEMBATALAN);
          break;
        default:
          setrouteCode(orderStatus.UNMAPPING_PRODUK);
          break;
      }
    }
  };

  const handleSetParams = (value) => {
    let tabs = '';
    switch (value) {
      case orderStatus.BELUM_DIBAYAR:
        tabs = 'Belum_Dibayar';
        break;
      case orderStatus.SIAP_DIPROSES:
        tabs = 'Siap_Proses';
        break;
      case orderStatus.DIPROSES:
        tabs = 'Diproses';
        break;
      case orderStatus.UNMAPPING_PRODUK:
        tabs = 'Unmapping_Produk';
        break;
      case orderStatus.UNMAPPING_GUDANG:
        tabs = 'Unmapping_Gudang';
        break;
      case orderStatus.OUT_OF_STOCK:
        tabs = 'Out_Of_Stock';
        break;
      case orderStatus.UNMAPPING_ORDER:
        tabs = 'Unmapping_Pengiriman';
        break;
      case orderStatus.MENUNGGU_RESI:
        tabs = 'Menunggu_Resi';
        break;
      case orderStatus.MENUNGGU_KURIR:
        tabs = 'Menunggu_Kurir';
        break;
      case orderStatus.SEDANG_DIKIRIM:
        tabs = 'Sedang_Dikirim';
        break;
      case orderStatus.PENGIRIMAN_SELESAI:
        tabs = 'Pengiriman_Selesai';
        break;
      case orderStatus.DALAM_PENGEMBALIAN:
        tabs = 'Dalam_Pengembalian';
        break;
      case orderStatus.SELESAI_DIKEMBALIKAN:
        tabs = 'Selesai_Dikembalikan';
        break;
      case orderStatus.DITERIMA:
        tabs = 'Diterima';
        break;
      case orderStatus.PENGAJUAN_PEMBATALAN:
        tabs = 'Pengajuan_Pembatalan';
        break;
      case orderStatus.DIBATALKAN:
        tabs = 'Dibatalkan';
        break;
      default:
        tabs = '';
        break;
    }

    route.push({
      pathname: pathname,
      query: {
        tab: tabs,
      },
    });
  };

  const initQueryParams = () => {
    const tabs = searchParams.get('tab');
    if (tabs) {
      if (params?.type === 'diproses') {
        switch (tabs) {
          case 'Belum_Dibayar':
            setrouteCode(orderStatus.BELUM_DIBAYAR);
            break;
          case 'Siap_Proses':
            setrouteCode(orderStatus.SIAP_DIPROSES);
            break;
          case 'Diproses':
            setrouteCode(orderStatus.DIPROSES);
            break;
          default:
            setrouteCode(orderStatus.BELUM_DIBAYAR);
            break;
        }
      } else if (params?.type === 'bermasalah') {
        switch (tabs) {
          case 'Unmapping_Produk':
            setrouteCode(orderStatus.UNMAPPING_PRODUK);
            break;
          case 'Unmapping_Gudang':
            setrouteCode(orderStatus.UNMAPPING_GUDANG);
            break;
          case 'Out_Of_Stock':
            setrouteCode(orderStatus.OUT_OF_STOCK);
            break;
          case 'Unmapping_Pengiriman':
            setrouteCode(orderStatus.UNMAPPING_ORDER);
            break;
          default:
            setrouteCode(orderStatus.UNMAPPING_PRODUK);
            break;
        }
      } else if (params?.type === 'pengiriman') {
        switch (tabs) {
          case 'Menunggu_Resi':
            setrouteCode(orderStatus.MENUNGGU_RESI);
            break;
          case 'Menunggu_Kurir':
            setrouteCode(orderStatus.MENUNGGU_KURIR);
            break;
          case 'Sedang_Dikirim':
            setrouteCode(orderStatus.SEDANG_DIKIRIM);
            break;
          case 'Pengiriman_Selesai':
            setrouteCode(orderStatus.PENGIRIMAN_SELESAI);
            break;
          default:
            setrouteCode(orderStatus.MENUNGGU_RESI);
            break;
        }
      } else if (params?.type === 'selesai') {
        switch (tabs) {
          case 'Diterima':
            setrouteCode(orderStatus.DITERIMA);
            break;
          case 'Dalam_Pengembalian':
            setrouteCode(orderStatus.DALAM_PENGEMBALIAN);
            break;
          case 'Selesai_Dikembalikan':
            setrouteCode(orderStatus.SELESAI_DIKEMBALIKAN);
            break;
          default:
            setrouteCode(orderStatus.DITERIMA);
            break;
        }
      } else if (params?.type === 'pembatalan') {
        switch (tabs) {
          case 'Pengajuan_Pembatalan':
            setrouteCode(orderStatus.PENGAJUAN_PEMBATALAN);
            break;
          case 'Dibatalkan':
            setrouteCode(orderStatus.DIBATALKAN);
            break;
          default:
            setrouteCode(orderStatus.PENGAJUAN_PEMBATALAN);
            break;
        }
      } else {
        // todo
      }
    }
  };

  const handleCountIndividualShipping = async (id) => {
    try {
      setLoadingButton(true);
      setIdOrderHeader(id);
      await checkIndividualRate(id);
    } catch (error) {
      console.log(error);
    } finally {
      setselectedHeaderId('');
      setLoadingButton(false);
      onGetOrderList();
    }
  };

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      handlePageChange(1);
    }
  };

  const handleActionButton = (item) => {
    let id = item.order_header_id;
    let deliveryId = item.delivery_method_id;
    let deliveryMethod = item.delivery_method;
    setselectedHeaderId(id);

    if (routeCode == orderStatus.DIPROSES) {
      if (deliveryId === 1 && deliveryMethod === 'SYSTEM-DELIVERY') {
        setdeliveryType('pickup');
      } else {
        setdeliveryType('dropoff');
      }
      setmodalSendOrder(true);
    } else if (
      routeCode == orderStatus.SEDANG_DIKIRIM ||
      routeCode == orderStatus.PENGIRIMAN_SELESAI
    ) {
      setmodalRedConfirm(true);
    } else if (routeCode == orderStatus.SIAP_DIPROSES) {
      if (
        (parseFloat(item.shipping_price) < 0 || item.shipping_price === null) &&
        deliveryMethod !== 'SELF-DELIVERY'
      ) {
        handleCountIndividualShipping(id);
      } else {
        setmodalReadyOrder(true);
      }
    } else if (routeCode == orderStatus.DALAM_PENGEMBALIAN) {
      setmodalAcceptRetur(true);
    } else if (routeCode == orderStatus.UNMAPPING_ORDER) {
      route.push({
        pathname: `/order/completed/${item.order_header_id}`,
      });
    }
  };

  const handleDropoffButton = async () => {
    setisModalConfirmSend(true);
    setmodalSendOrder(false);
    await getDeliveryInfo(selectedHeaderId).then((res) => {
      if (res.status == 200) {
        setcourierName(res.data?.logistic_carrier);
        setresi(res.data?.tracking_number);
      }
    });
  };

  const truncateValue = (name, length) => {
    return name != null && name.length > length
      ? `${name.substring(0, length)}...`
      : name;
  };

  const handleAcceptCancel = (id) => {
    setselectedHeaderId(id);
    setmodalGreenConfirm(true);
  };

  const handleRejectCancel = (id) => {
    setselectedHeaderId(id);
    setmodalRedConfirm(true);
  };

  const updateOrderCountSidebar = () => {
    getCountOrderSidebar(client_id).then((v) => {
      dispatch(setOrderCountSidebar(v.data));
    });
  };


  useEffect(() => {
    handleTabChange(routeCode);
    initialRouteCode();
  }, [params]);

  useEffect(() => {
    initQueryParams();
  }, [searchParams.get('tab')]);

  useEffect(() => {
    if (routeCode) {
      onGetOrderList();
      onGetStatusCounter();
    }
  }, [routeCode, paginationModel]);

  useEffect(() => {
    if(dataFilter) {
      onGetOrderList({page: 1, size: 10});
    }
  },[dataFilter]);

  useEffect(() => {
    handlePageChange(1);
  }, [rangeDate.end]);

  useEffect(() => {
    updateOrderCountSidebar();
  }, []);

  const onPostCancelOrder = async () => {
    let body = {
      cancel_by: selectedCanceledBy,
      cancel_reason: cancelReason,
    };

    await postCancelOrder(body, selectedHeaderId, routeCode).then((res) => {
      if (res.status == 200) {
        updateOrderCountSidebar();
        setisModalCancel(false);
        setcancelReason('');
        setselectedHeaderId('');
        setisSucces({ show: true, text: 'Berhasil Membatalkan Pesanan!' });
        onGetOrderList();
        onGetStatusCounter();
        setTimeout(() => {
          setisSucces({ show: false, text: '' });
        }, 2000);
      }
    });
  };

  const onPostReturOrder = async () => {
    let body = {
      return_by: selectedReturBy,
      return_reason: returReason,
    };

    await postReturOrder(body, selectedHeaderId).then((res) => {
      if (res.status == 200) {
        updateOrderCountSidebar();
        setisModalRetur(false);
        setreturReason('');
        setselectedHeaderId('');
        setisSucces({ show: true, text: 'Berhasil Mengembalikan Pesanan!' });
        onGetOrderList();
        onGetStatusCounter();
        setTimeout(() => {
          setisSucces({ show: false, text: '' });
        }, 2000);
      }
    });
  };

  const onPostCompleteOrder = async () => {
    await postCompleteOrder(selectedHeaderId).then((res) => {
      if (res.status == 200) {
        updateOrderCountSidebar();
        setmodalRedConfirm(false);
        setselectedHeaderId('');
        setisSucces({ show: true, text: 'Berhasil Menyelesaikan Pesanan!' });
        onGetOrderList();
        onGetStatusCounter();
        setTimeout(() => {
          setisSucces({ show: false, text: '' });
        }, 2000);
      }
    });
  };

  const onPostProcessOrder = async () => {
    if (selectedHeaderId != '') {
      await postProcessOrder(selectedHeaderId).then((res) => {
        if (res.status == 200) {
          updateOrderCountSidebar();
          setmodalReadyOrder(false);
          setselectedHeaderId('');
          setisSucces({
            show: true,
            text: 'Berhasil Melakukan Proses Pesanan!',
          });
          onGetOrderList();
          onGetStatusCounter();
          setTimeout(() => {
            setisSucces({ show: false, text: '' });
          }, 2000);
        }
      });
    } else if (selectedItem.length != 0) {
      const payload = {
        order_header_id: selectedItem.map((v) => v.order_header_id),
      };
      await postBulkProcessOrder(payload).then((res) => {
        if (res != null && res?.status == 200) {
          updateOrderCountSidebar();
          setmodalReadyOrder(false);
          setSelectedItem([]);
          let countNoOngkir = selectedItem.filter(
            (v) =>
              v.delivery_method != 'SELF-DELIVERY' &&
              (v.shipping_price === '0.00' ||
                (v.shipping_price === '-1.00' && !v.shipping_rate_status)),
          );

          if (countNoOngkir.length > 0) {
            setmodalAlertOngkir(true);
            setTimeout(() => {
              setmodalAlertOngkir(false);
            }, 2000);
          } else {
            setisSucces({
              show: true,
              text: 'Berhasil Melakukan Proses Pesanan!',
            });
            setTimeout(() => {
              setisSucces({ show: false, text: '' });
            }, 2000);
          }
          onGetOrderList();
          onGetStatusCounter();
        } else {
          setSelectedItem([]);
          setmodalReadyOrder(false);
          setmodalAlertOngkir(true);
          setTimeout(() => {
            setmodalAlertOngkir(false);
          }, 2000);
        }
      });
    }
  };

  const onPostAcceptReturOrder = async () => {
    await postAcceptReturOrder(selectedHeaderId).then((res) => {
      if (res.status == 200) {
        updateOrderCountSidebar();
        setmodalAcceptRetur(false);
        setselectedHeaderId('');
        setisSucces({
          show: true,
          text: 'Berhasil Menerima Pesanan Pengembalian',
        });
        onGetOrderList();
        onGetStatusCounter();
        setTimeout(() => {
          setisSucces({ show: false, text: '' });
        }, 2000);
      }
    });
  };

  const onPostShipOrder = async () => {
    let body = {
      tracking_number: resi,
      logistic_carrier: courierName,
    };

    await postShipOrder(body, selectedHeaderId).then((res) => {
      if (res.status == 200) {
        updateOrderCountSidebar();
        setmodalSendOrder(false);
        setdeliveryType('');
        setselectedHeaderId('');
        setisModalConfirmSend(false);
        setresi('');
        setcourierName('');
        setisSucces({ show: true, text: 'Berhasil Mengirim Pesanan!' });
        onGetOrderList();
        onGetStatusCounter();
        setTimeout(() => {
          setisSucces({ show: false, text: '' });
        }, 2000);
      }
    });
  };

  const handleCancelBtn = () => {
    setisModalCancel(false);
    setisModalRetur(false);
    setisModalConfirmSend(false);
    setcancelReason('');
    setreturReason('');
    setresi('');
    setcourierName('');
    setselectedHeaderId('');
  };

  const handleCancelTrigger = (id) => {
    if (
      routeCode == orderStatus.SIAP_DIPROSES ||
      routeCode == orderStatus.DIPROSES ||
      routeCode == orderStatus.MENUNGGU_KURIR ||
      routeCode == orderStatus.MENUNGGU_RESI ||
      routeCode == orderStatus.UNMAPPING_ORDER
    ) {
      setisModalCancel(true);
    } else if (routeCode == orderStatus.SEDANG_DIKIRIM) {
      setisModalRetur(true);
    } else if (routeCode == orderStatus.PENGIRIMAN_SELESAI) {
      setisModalRetur(true);
    }

    setselectedHeaderId(id);
    setTimeout(() => {
      inputRef.current.click();
    }, 200);
  };

  const onHideRightButton = () => {
    let hideStatus = [
      orderStatus.UNMAPPING_PRODUK,
      orderStatus.UNMAPPING_GUDANG,
      orderStatus.OUT_OF_STOCK,
      orderStatus.BELUM_DIBAYAR,
      orderStatus.MENUNGGU_KURIR,
      orderStatus.SELESAI_DIKEMBALIKAN,
      orderStatus.PENGAJUAN_PEMBATALAN,
      orderStatus.DITERIMA,
      orderStatus.DIBATALKAN,
      orderStatus.MENUNGGU_RESI,
      // orderStatus.UNMAPPING_ORDER,
    ];

    if (hideStatus.find((v) => v == routeCode) != undefined) {
      return true;
    } else {
      return false;
    }
  };

  const onHideMoreButton = (item) => {
    let hideStatus = [
      orderStatus.UNMAPPING_PRODUK,
      orderStatus.UNMAPPING_GUDANG,
      orderStatus.OUT_OF_STOCK,
      orderStatus.BELUM_DIBAYAR,
      orderStatus.SELESAI_DIKEMBALIKAN,
      orderStatus.PENGAJUAN_PEMBATALAN,
      orderStatus.DIBATALKAN,
      orderStatus.DALAM_PENGEMBALIAN,
      orderStatus.DITERIMA,
      // orderStatus.PENGIRIMAN_SELESAI
    ];

    if (hideStatus.find((v) => v == routeCode) != undefined) {
      if (
        routeCode == orderStatus.PENGIRIMAN_SELESAI &&
        item.delivery_method != 'SYSTEM-DELIVERY'
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const onPostAcceptCancel = async () => {
    await postAcceptCancel(selectedHeaderId).then((res) => {
      if (res.status == 200) {
        updateOrderCountSidebar();
        setmodalGreenConfirm(false);
        setselectedHeaderId('');
        setisSucces({ show: true, text: 'Berhasil Menerima Cancel Pesanan!' });
        onGetOrderList();
        onGetStatusCounter();
        setTimeout(() => {
          setisSucces({ show: false, text: '' });
        }, 2000);
      }
    });
  };

  const showEditOrder = (status, delivery, location, permission) => {
    if (status == orderStatus.SIAP_DIPROSES && permission) {
      return true;
    } else {
      if (delivery == 2 && location != 2 && permission) {
        return true;
      }
    }

    return false;
  };

  const onPostRejectCancel = async () => {
    await postRejectCancel(selectedHeaderId).then((res) => {
      if (res.status == 200) {
        updateOrderCountSidebar();
        setmodalRedConfirm(false);
        setselectedHeaderId('');
        setisSucces({ show: true, text: 'Berhasil Menolak Cancel Pesanan!' });
        onGetOrderList();
        onGetStatusCounter();
        setTimeout(() => {
          setisSucces({ show: false, text: '' });
        }, 2000);
      }
    });
  };

  const redConfirmAction = () => {
    switch (routeCode) {
      case orderStatus.SEDANG_DIKIRIM:
      case orderStatus.PENGIRIMAN_SELESAI:
        onPostCompleteOrder();
        break;
      case orderStatus.PENGAJUAN_PEMBATALAN:
        onPostRejectCancel();
        break;
      default:
        break;
    }
  };

  const greenConfirmAction = () => {
    if (routeCode == orderStatus.PENGAJUAN_PEMBATALAN) {
      onPostAcceptCancel();
    }
  };

  const handlePrintShipping = async (id) => {
    const response = await getShippingLabel(id);
    setDataShippingLabel(response?.data.label_order);

    setShowModalShipping(true);
    setTimeout(() => {
      setShowModalShipping(false);
    }, 5000);
  };

  const handleSelectItem = (value, checked) => {
    if (checked) {
      if (!disableActionButton(value.channel_name)) {
        setSelectedItem((items) => [...items, value]);
      }
    } else {
      const data = selectedItem.filter(
        (data) => data.order_code != value.order_code,
      );
      setSelectedItem(data);
    }
  };

  const handleSelectedAll = (checked) => {
    if (checked) {
      // let list = [];
      // dataOrder.forEach((data) => {
      //   list.push({
      //     order_code: data.order_code
      //   })
      // })

      setSelectedItem(dataOrder);
    } else {
      setSelectedItem([]);
    }
  };

  const handleCountShipping = async () => {
    setShowModalWaitingBulkShipping(true);
    let payload = [];

    selectedItem.forEach((value) => {
      if (value.delivery_method_id == 1) {
        payload.push(value.order_header_id);
      }
    });

    const response = await bulkRate({ orders: payload });

    if (response) {
      const handleCheckCountShipping = setInterval(async () => {
        const res = await checkBulkRate(response.data.data.request_id);
        setInfoBulkRate({
          status: res.data.data.status,
          failed: res.data.data.failed,
          success: res.data.data.success,
        });
        if (res.data.data.status) {
          clearInterval(handleCheckCountShipping);
          setShowModalSuccessCountShipping(true);
          setShowModalWaitingBulkShipping(false);

          setTimeout(() => {
            setShowModalSuccessCountShipping(false);
            setSelectedItem([]);
            onGetOrderList();
          }, 4000);
        }
      }, 5000);
    }
  };

  const disableActionButton = (channel_name , btnName = null) => {
    if (
      channel_name === 'SOCIALECOMMERCE' ||
      channel_name === 'OTHER' ||
      channel_name === 'SHOPIFY'
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleTrackOrder = async (idSearch) => {
    setShowOrderHistory(true);
    setLoadingHistory(true);
    try {
      const response = await trackingHistory(idSearch);
      setListHistoryOrder(response?.data?.tracking_order || []);
      setLoadingHistory(false);
    } catch (error) {
      setLoadingHistory(false);
    }
  };

  const handleBulkCompleteOrder = async () => {
    const payloadBulkCompleteOrder = {
      order_header_id: selectedItem.map((v) => v.order_header_id),
    };
    await postBulkCompleteOrder(payloadBulkCompleteOrder).then((res) => {
      if (res != null && res?.status == 200) {
        setShowModalBulkCompleteOrder(false);
        setSelectedItem([]);
        onGetOrderList();
        onGetStatusCounter();
      }
    });
  };

  return (
    <>
      <Head title="Pesanan - Shopify" />
      <Content>
        <BlockHead size="sm">
          <BlockHeadContent>
            <BlockBetween>
              <BlockTitle>
                {params?.type[0].toUpperCase() + title.join('')}
              </BlockTitle>
              <ul className="nk-block-tools">
                <li>
                  <Button
                    size="lg"
                    // className={`btn w-100 center shadow-none btn-primary`}
                    type={loading ? 'button' : 'submit'}
                    // disabled={syncStoreLoading}
                    onClick={() => route.push('/pesanan/sinkron-pesanan')}
                  >
                    <Icon
                      name="reload"
                      style={{
                        marginRight: '8px',
                        color: '#203864',
                        fontSize: 20,
                      }}
                    />
                    <text style={{ color: '#203864' }}>
                      {'Sinkron Pesanan'}
                    </text>
                  </Button>
                </li>
                <li>
                  <Button
                    size="lg"
                    // className={`btn w-100 center shadow-none btn-primary`}
                    type={loading ? 'button' : 'submit'}
                    // disabled={syncStoreLoading}
                    onClick={() => route.push('/order/download')}
                  >
                    <Icon
                      name="download-cloud"
                      style={{
                        marginRight: '8px',
                        color: '#203864',
                        fontSize: 20,
                      }}
                    />
                    <text style={{ color: '#203864' }}>{'Unduh Pesanan'}</text>
                  </Button>
                </li>
                <li>
                  <Button
                    disabled={!permissions.includes('Tambah Pesanan')}
                    size="lg"
                    // className={`btn w-100 center shadow-none btn-primary`}
                    type={loading ? 'button' : 'submit'}
                    // disabled={syncStoreLoading}
                    onClick={() => route.push('/order/upload')}
                  >
                    <Icon
                      name="upload-cloud"
                      style={{
                        marginRight: '8px',
                        color: '#203864',
                        fontSize: 20,
                      }}
                    />
                    <text style={{ color: '#203864' }}>{'Unggah Pesanan'}</text>
                  </Button>
                </li>
                <li>
                  <Button
                    onClick={() => {
                      route.push({
                        pathname: '/order/create',
                      });
                    }}
                    color="primary"
                    style={{ height: 43 }}
                    disabled={!permissions.includes('Tambah Pesanan')}
                    className={
                      !permissions.includes('Tambah Pesanan') && 'btn-disabled'
                    }
                  >
                    Tambah Pesanan
                  </Button>
                </li>
              </ul>
            </BlockBetween>
          </BlockHeadContent>
        </BlockHead>
        <BlockHeadContent>
          <Block>
            {params?.type != 'semua' && (
              <div className="d-flex">
                <div className="mb-2">
                  <>
                    <TabsIcon
                      tabsData={tabOption()}
                      activeTab={routeCode}
                      tabCounts={statusCounter}
                      onTabChange={handleSetParams}
                    />
                  </>
                </div>
                <div>&nbsp;</div>
              </div>
            )}
            <div
              className={
                'nk-block-tools g-3 d-flex align-items-center justify-content-between'
              }
              style={{
                marginLeft: 0,
                marginRight: 0,
                marginTop: 8,
                marginBottom: 4,
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <ul className="d-flex g-3 align-items-center">
                <li>
                  <div>
                    <div className="d-flex">
                      <div className="form-wrap">
                        <DropdownOption
                          className="filter-dropdown"
                          options={getOptionPesanan}
                          optionLabel={'name'}
                          placeholder={'Pilih'}
                          value={selectedSearchOption}
                          onChange={(e) =>
                            setSelectedSearchOption(e.target.value)
                          }
                        />
                      </div>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon
                            name="search"
                            className="pt-1"
                            style={{
                              color: '#203864',
                              backgroundColor: '#ffffff',
                            }}
                          ></Icon>
                        </div>
                        <Input
                          type="text"
                          className="form-control filter-search shadow-none"
                          placeholder="Search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={handleSearchEnter}
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex" style={{ width: '240px' }}>
                    <DatePicker
                      selected={rangeDate.start}
                      startDate={rangeDate.start}
                      onChange={onRangeChange}
                      endDate={rangeDate.end}
                      selectsRange
                      showIcon={rangeDate.start == null}
                      className="form-control form-filter"
                      isClearable
                      placeholderText="Rentang Tanggal Pemesanan"
                      maxDate={new Date()}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      onFocus={() => setOpenDate(true)}
                      onClickOutside={() => setOpenDate(false)}
                      open={openDate}
                      icon={
                        <svg
                          viewBox="0 0 18 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => setOpenDate(true)}
                        >
                          <path
                            d="M4 11.6602C4 11.4388 4.07812 11.25 4.23438 11.0938C4.40365 10.9245 4.60547 10.8398 4.83984 10.8398H7.33984C7.5612 10.8398 7.75 10.9245 7.90625 11.0938C8.07552 11.25 8.16016 11.4388 8.16016 11.6602C8.16016 11.8945 8.07552 12.0964 7.90625 12.2656C7.75 12.4219 7.5612 12.5 7.33984 12.5H4.83984C4.60547 12.5 4.40365 12.4219 4.23438 12.2656C4.07812 12.0964 4 11.8945 4 11.6602ZM10.25 12.5H13.5898C13.8112 12.5 14 12.4219 14.1562 12.2656C14.3255 12.0964 14.4102 11.8945 14.4102 11.6602C14.4102 11.4388 14.3255 11.25 14.1562 11.0938C14 10.9245 13.8112 10.8398 13.5898 10.8398H10.25C10.0156 10.8398 9.8138 10.9245 9.64453 11.0938C9.48828 11.25 9.41016 11.4388 9.41016 11.6602C9.41016 11.8945 9.48828 12.0964 9.64453 12.2656C9.8138 12.4219 10.0156 12.5 10.25 12.5ZM17.3398 5V14.1602C17.3398 14.8503 17.0924 15.4427 16.5977 15.9375C16.1159 16.4193 15.5299 16.6602 14.8398 16.6602H3.16016C2.47005 16.6602 1.8776 16.4193 1.38281 15.9375C0.901042 15.4427 0.660156 14.8503 0.660156 14.1602V5C0.660156 4.3099 0.901042 3.72396 1.38281 3.24219C1.8776 2.7474 2.47005 2.5 3.16016 2.5H4.83984V1.66016C4.83984 1.4388 4.91797 1.25 5.07422 1.09375C5.24349 0.924479 5.4388 0.839844 5.66016 0.839844C5.89453 0.839844 6.08984 0.924479 6.24609 1.09375C6.41536 1.25 6.5 1.4388 6.5 1.66016V2.5H11.5V1.66016C11.5 1.4388 11.5781 1.25 11.7344 1.09375C11.9036 0.924479 12.1055 0.839844 12.3398 0.839844C12.5612 0.839844 12.75 0.924479 12.9062 1.09375C13.0755 1.25 13.1602 1.4388 13.1602 1.66016V2.5H14.8398C15.5299 2.5 16.1159 2.7474 16.5977 3.24219C17.0924 3.72396 17.3398 4.3099 17.3398 5ZM2.33984 7.5H15.6602V5C15.6602 4.76562 15.5755 4.57031 15.4062 4.41406C15.25 4.24479 15.0612 4.16016 14.8398 4.16016H13.1602V5C13.1602 5.23438 13.0755 5.4362 12.9062 5.60547C12.75 5.76172 12.5612 5.83984 12.3398 5.83984C12.1055 5.83984 11.9036 5.76172 11.7344 5.60547C11.5781 5.4362 11.5 5.23438 11.5 5V4.16016H6.5V5C6.5 5.23438 6.41536 5.4362 6.24609 5.60547C6.08984 5.76172 5.89453 5.83984 5.66016 5.83984C5.4388 5.83984 5.24349 5.76172 5.07422 5.60547C4.91797 5.4362 4.83984 5.23438 4.83984 5V4.16016H3.16016C2.9388 4.16016 2.74349 4.24479 2.57422 4.41406C2.41797 4.57031 2.33984 4.76562 2.33984 5V7.5ZM15.6602 9.16016H2.33984V14.1602C2.33984 14.3945 2.41797 14.5964 2.57422 14.7656C2.74349 14.9219 2.9388 15 3.16016 15H14.8398C15.0612 15 15.25 14.9219 15.4062 14.7656C15.5755 14.5964 15.6602 14.3945 15.6602 14.1602V9.16016Z"
                            fill="#203864"
                          />
                        </svg>
                      }
                    />
                  </div>
                </li>
                <li style={{ marginLeft: '-16px' }}>
                  <FilterTableOrder
                    isOpen={isOpenFilter} 
                    setIsOpen={(value) => setIsOpenFilter(value)} 
                    dataFilter={dataFilter}
                    setDataFilter={(data) => setDataFilter(data)}
                  />
                </li>
                {routeCode === orderStatus.PENGIRIMAN_SELESAI && (
                  <li style={{ right: 13 }} className="position-absolute">
                    <Button
                      onClick={() => setShowModalBulkCompleteOrder(true)}
                      className={`
                      ${selectedItem.length == 0 && 'btn-disabled'}
                    `}
                      color="primary"
                      style={{ padding: '12px 24px' }}
                      disabled={selectedItem.length == 0}
                    >
                      <div className="d-flex align-content-center">
                        <Icon
                          name="box"
                          style={{ fontSize: 20, color: 'white' }}
                        />
                        <span style={{ fontSize: 14 }} className="text-white">
                          Selesaikan Pesanan
                        </span>
                      </div>
                    </Button>
                  </li>
                )}
              </ul>
              {routeCode === orderStatus.SIAP_DIPROSES && (
                <ul
                  className="nk-block-tools g-3"
                  style={{ overflow: 'scroll', scrollbarWidth: 'none' }}
                >
                  <li>
                    <Button
                      onClick={() => setmodalReadyOrder(true)}
                      color="primary"
                      style={{ height: 43 }}
                      disabled={
                        selectedItem.length == 0 ||
                        selectedItem
                          .map((v) => disableActionButton(v.channel_name))
                          .some((v) => v == true)
                      }
                      className={`
                        ${selectedItem.length == 0 && 'btn-disabled'}
                      `}
                    >
                      Proses Pesanan
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={handleCountShipping}
                      color="primary"
                      style={{ height: 43 }}
                      disabled={
                        !permissions.includes('Tambah Pesanan') ||
                        !selectedItem.find(
                          (value) => value.delivery_method_id == 1,
                        )
                      }
                      className={
                        !permissions.includes('Tambah Pesanan') ||
                        !selectedItem.find(
                          (value) => value.delivery_method_id == 1,
                        )
                          ? 'btn-disabled'
                          : ''
                      }
                    >
                      Hitung Biaya Pengiriman
                    </Button>
                  </li>
                </ul>
              )}
            </div>
          </Block>
        </BlockHeadContent>
        {dataFilter && dataFilter.length > 0 ? (
          <div className='mt-2' style={{ marginBottom: -8 }}>
            <TagFilter
              data={dataFilter}
              onDelete={(index) => handleDeleteFilter(index)}
              onReset={() => setDataFilter([])}
            />
          </div>
          
          ): null}
        <BlockContent>
          <Block>
            <div style={{ maxWidth: '100%' }}>
              <div className="card-inner-group">
                <div
                  className="card-inner p-0 border-0 overflow-x-auto"
                  style={{ fontSize: '13px' }}
                >
                  <table className="master-sku-nk-tb-list is-separate my-3">
                    <thead>
                      <tr
                        className="nk-tb-col-check"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {(routeCode === orderStatus.SIAP_DIPROSES ||
                          routeCode === orderStatus.PENGIRIMAN_SELESAI) &&
                        dataOrder.length > 0 ? (
                          <th className="master-sku-nk-tb-col">
                            <div className="custom-control custom-control-sm custom-checkbox notext">
                              <input
                                disabled={false}
                                type="checkbox"
                                className="custom-control-input"
                                id="pid"
                                onChange={(e) =>
                                  handleSelectedAll(e.target.checked)
                                }
                                checked={
                                  dataOrder.length == selectedItem.length
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="pid"
                              ></label>
                            </div>
                          </th>
                        ) : null}
                        <th className="master-sku-nk-tb-col">
                          <DataTableTitle>
                            <span
                              style={{ fontWeight: 'normal', color: '#4C4F54' }}
                            >
                              Nomor Pesanan
                            </span>
                          </DataTableTitle>
                        </th>
                        <th className="master-sku-nk-tb-col">
                          <DataTableTitle>
                            <span
                              style={{ fontWeight: 'normal', color: '#4C4F54' }}
                            >
                              Gudang
                            </span>
                          </DataTableTitle>
                        </th>
                        <th className="master-sku-nk-tb-col">
                          <DataTableTitle className="d-flex align-items-center justify-content-between">
                            <span
                              style={{ fontWeight: 'normal', color: '#4C4F54' }}
                            >
                              Kurir & No Resi
                            </span>
                          </DataTableTitle>
                        </th>
                        <th className="master-sku-nk-tb-col">
                          <DataTableTitle>
                            <span
                              style={{ fontWeight: 'normal', color: '#4C4F54' }}
                            >
                              Nilai Pesanan
                            </span>
                          </DataTableTitle>
                        </th>
                        {/* {routeCode === orderStatus.SIAP_DIPROSES ||
                          params?.type === "semua" ? ( */}
                        <th className="master-sku-nk-tb-col">
                          <DataTableTitle>
                            <span
                              style={{
                                fontWeight: 'normal',
                                color: '#4C4F54',
                              }}
                            >
                              Biaya Pengiriman
                            </span>
                          </DataTableTitle>
                        </th>
                        {/* ) : null
                        } */}
                        <th className="master-sku-nk-tb-col">
                          <DataTableTitle>
                            <span
                              style={{ fontWeight: 'normal', color: '#4C4F54' }}
                            >
                              Penerima
                            </span>
                          </DataTableTitle>
                        </th>
                        <th className="master-sku-nk-tb-col">
                          <DataTableTitle>
                            <span
                              style={{ fontWeight: 'normal', color: '#4C4F54' }}
                            >
                              Metode Pembayaran
                            </span>
                          </DataTableTitle>
                        </th>
                        <th className="master-sku-nk-tb-col">
                          <DataTableTitle>
                            <span
                              style={{ fontWeight: 'normal', color: '#4C4F54' }}
                            >
                              Status
                            </span>
                          </DataTableTitle>
                        </th>
                        <th
                          hidden={params?.type == 'semua'}
                          style={{
                            minWidth: dataOrder.length != 0 ? 125 : undefined,
                          }}
                          className="master-sku-nk-tb-col"
                        >
                          <DataTableTitle className="d-flex align-items-center justify-content-between">
                            <span
                              style={{ fontWeight: 'normal', color: '#4C4F54' }}
                            >
                              Aksi
                            </span>
                          </DataTableTitle>
                        </th>
                        {/* <th className="master-sku-nk-tb-col">
                          <DataTableTitle className="d-flex align-items-center justify-content-between">
                            <span
                              style={{ fontWeight: "normal", color: "#4C4F54" }}
                            ></span>
                          </DataTableTitle>
                        </th> */}
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        fontSize: 12,
                        color: '#4C4F54',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {loadingData ? (
                        <>
                          {Array.from({ length: 10 }, (_, i) => (
                            <tr
                              key={i}
                              style={{
                                backgroundColor: '#fff',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                              }}
                            >
                              <td className="tb-col nk-tb-col">
                                <Skeleton
                                  width={'168px'}
                                  height={'32px'}
                                  shape={'rectangle'}
                                />
                              </td>
                              <td className="tb-col nk-tb-col">
                                <Skeleton
                                  width={'184px'}
                                  height={'32px'}
                                  shape={'rectangle'}
                                />
                              </td>
                              <td className="tb-col nk-tb-col">
                                <Skeleton
                                  width={'184px'}
                                  height={'32px'}
                                  shape={'rectangle'}
                                />
                              </td>
                              <td className="tb-col nk-tb-col">
                                <Skeleton
                                  width={'184px'}
                                  height={'32px'}
                                  shape={'rectangle'}
                                />
                              </td>
                              <td className="tb-col nk-tb-col">
                                <Skeleton
                                  width={'184px'}
                                  height={'32px'}
                                  shape={'rectangle'}
                                />
                              </td>
                              <td className="tb-col nk-tb-col">
                                <Skeleton
                                  width={'184px'}
                                  height={'32px'}
                                  shape={'rectangle'}
                                />
                              </td>
                              <td className="tb-col nk-tb-col">
                                <Skeleton
                                  width={'184px'}
                                  height={'32px'}
                                  shape={'rectangle'}
                                />
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          {dataOrder?.map((item, id) => (
                            <>
                              <tr
                                key={id}
                                style={{
                                  backgroundColor: '#fff',
                                  paddingTop: '0.75rem',
                                  paddingBottom: '0.75rem',
                                }}
                              >
                                {/* <div>kandieab</div> */}
                                {(routeCode === orderStatus.SIAP_DIPROSES ||
                                  routeCode ===
                                    orderStatus.PENGIRIMAN_SELESAI) && (
                                  <th className="nk-tb-col-check master-sku-nk-tb-col tb-col">
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                      <input
                                        disabled={false}
                                        type="checkbox"
                                        className="custom-control-input"
                                        // defaultChecked={item.check}
                                        id={item.order_code + 'oId-all'}
                                        key={Math.random()}
                                        checked={
                                          selectedItem.filter(
                                            (value) =>
                                              value.order_code ===
                                              item.order_code,
                                          ).length == 1
                                        }
                                        onChange={(e) =>
                                          handleSelectItem(
                                            item,
                                            e.target.checked,
                                          )
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={item.order_code + 'oId-all'}
                                      ></label>
                                    </div>
                                  </th>
                                )}
                                <td
                                  className="tb-col nk-tb-col"
                                  style={{ width: 220 }}
                                >
                                  <div className="d-flex align-items-center gap-1">
                                    <div>
                                      <Image
                                        src={iconChannel(item?.channel_name)}
                                        width={18}
                                        alt="logo-marketplace"
                                      />
                                      {/* <Image src={getMarketPlaceLogo(item?.channel_name).logo} width={18} height={18} /> */}
                                    </div>
                                    <span className="text-truncate">
                                      {truncateValue(item?.store_name, 50)}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                    className="text-primary mt-2 text-truncate"
                                  >
                                    <Link
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={`/order/detail-pesanan?id=${item?.order_header_id}`}
                                    >
                                      {item?.order_code}
                                    </Link>
                                  </div>
                                  <div style={{ color: '#BDC0C7' }}>
                                    {moment(item?.checkout_at).format(
                                      'DD/MM/YYYY HH:mm',
                                    )}
                                  </div>
                                </td>
                                <td
                                  style={{ fontWeight: 200, width: 140 }}
                                  className="tb-col nk-tb-col"
                                >
                                  <div
                                    style={{ maxWidth: 120 }}
                                    className="text-truncate"
                                  >
                                    {item.location_name}
                                  </div>
                                  <div className="text-truncate">
                                    {item.location_code}
                                  </div>
                                </td>
                                <td
                                  style={{ width: 200 }}
                                  className="tb-col nk-tb-col"
                                >
                                  <div
                                    style={{
                                      fontWeight: 400,
                                      color: '#BDC0C7',
                                    }}
                                  >
                                    {item.delivery_method}
                                  </div>
                                  <div className="d-flex align-items-center justify-content-between gap-2 mt-1 mb-1">
                                    <div
                                      className="text-truncate"
                                      style={{ maxWidth: 100 }}
                                    >
                                      {item.logistic_carrier || '-'}
                                    </div>
                                    <Badge
                                      color=""
                                      className="badge-dim"
                                      style={{
                                        fontWeight: 700,
                                        color:
                                          item.delivery?.toLowerCase() ==
                                          'cargo'
                                            ? '#0372D9'
                                            : '#00A7E1',
                                        height: 20,
                                        padding: '0px 8px 0px 8px',
                                        backgroundColor:
                                          item.delivery?.toLowerCase() ==
                                          'cargo'
                                            ? '#E1EFFA'
                                            : '#D5FDFF',
                                        border: 'none',
                                      }}
                                    >
                                      {item.delivery}
                                    </Badge>
                                  </div>
                                  {item.delivery_method == 'SYSTEM-DELIVERY' &&
                                  !disableActionButton(item.channel_name) &&
                                  (routeCode === orderStatus.MENUNGGU_KURIR ||
                                    routeCode === orderStatus.SEDANG_DIKIRIM ||
                                    routeCode ===
                                      orderStatus.PENGIRIMAN_SELESAI ||
                                    routeCode === orderStatus.DITERIMA ||
                                    routeCode ===
                                      orderStatus.DALAM_PENGEMBALIAN ||
                                    routeCode ===
                                      orderStatus.SELESAI_DIKEMBALIKAN ||
                                    params?.type === 'semua') ? (
                                    <div
                                      hidden={!item.tracking_number}
                                      style={{ fontWeight: 700 }}
                                      className="cursor-pointer"
                                    >
                                      <span
                                        style={{
                                          cursor: 'pointer',
                                          color: '#203864',
                                        }}
                                        onClick={() =>
                                          handleTrackOrder(item.order_header_id)
                                        }
                                      >
                                        {item.tracking_number}
                                      </span>
                                      <CopyToClipboard
                                        text={item.tracking_number}
                                        onCopy={() => {
                                          setcopyText('Copied!');
                                          setTimeout(() => {
                                            setcopyText('Copy');
                                          }, 2000);
                                        }}
                                      >
                                        <span
                                          style={{
                                            cursor: 'pointer',
                                            fontSize: 14,
                                          }}
                                        >
                                          &nbsp;
                                          <Icon
                                            className="mt-3"
                                            id={
                                              'tooltip' + item.tracking_number
                                            }
                                            name="copy"
                                          />
                                        </span>
                                      </CopyToClipboard>
                                      <UncontrolledTooltip
                                        style={{
                                          width: '12rem',
                                          borderRadius: 8,
                                          textAlign: 'start',
                                        }}
                                        placement="right"
                                        target={
                                          'tooltip' + item.tracking_number
                                        }
                                      >
                                        {copyText}
                                      </UncontrolledTooltip>
                                    </div>
                                  ) : (
                                    <div
                                      style={{ fontWeight: 700 }}
                                      hidden={!item.tracking_number}
                                    >
                                      <span style={{ color: '#203864' }}>
                                        {item.tracking_number}
                                      </span>
                                      <CopyToClipboard
                                        text={item.tracking_number}
                                        onCopy={() => {
                                          setcopyText('Copied!');
                                          setTimeout(() => {
                                            setcopyText('Copy');
                                          }, 2000);
                                        }}
                                      >
                                        <span
                                          style={{
                                            cursor: 'pointer',
                                            fontSize: 14,
                                          }}
                                        >
                                          &nbsp;
                                          <Icon
                                            id={
                                              'tooltip-2' + item.tracking_number
                                            }
                                            name="copy"
                                          />
                                        </span>
                                      </CopyToClipboard>
                                      <UncontrolledTooltip
                                        style={{
                                          width: '12rem',
                                          borderRadius: 8,
                                          textAlign: 'start',
                                        }}
                                        placement="right"
                                        target={
                                          'tooltip-2' + item.tracking_number
                                        }
                                      >
                                        {copyText}
                                      </UncontrolledTooltip>
                                    </div>
                                  )}
                                </td>
                                <td
                                  className="tb-col nk-tb-col"
                                  style={{ width: 150 }}
                                >
                                  <div
                                    className="text-truncate"
                                    style={{ fontWeight: 700 }}
                                  >
                                    Rp{' '}
                                    {parseFloat(
                                      item.payment_method_id == 2
                                        ? item.cod_price
                                        : item.total_price,
                                    ).toLocaleString('en')}
                                  </div>
                                </td>
                                {/* {routeCode === orderStatus.SIAP_DIPROSES || */}
                                {/* params?.type === "semua" ? ( */}
                                <td
                                  className="tb-col nk-tb-col"
                                  style={{ width: 190 }}
                                >
                                  {item.shipping_price === '-1.00' &&
                                  item.shipping_rate_status ? (
                                    <div
                                      className="d-flex align-items-center"
                                      style={{ marginRight: 8 }}
                                    >
                                      <Badge
                                        color=""
                                        className="badge-dim"
                                        style={{
                                          fontWeight: 700,
                                          color: '#FF6E5D',
                                          height: 20,
                                          padding: '0px 8px 0px 8px',
                                          backgroundColor: '#FFE3E0',
                                          border: 'none',
                                          paddingTop: 1,
                                          fontSize: 12,
                                        }}
                                      >
                                        {'GAGAL'}
                                      </Badge>
                                      <TooltipComponent
                                        icon="help-fill"
                                        iconClass="card-hint"
                                        direction="right"
                                        id={'Tooltips-' + item.order_header_id}
                                        text={'Tujuan Tidak Tercover'}
                                        style={{
                                          width: '12rem',
                                          borderRadius: 8,
                                          textAlign: 'start',
                                        }}
                                      />
                                    </div>
                                  ) : item.shipping_price === '-1.00' &&
                                    !item.shipping_rate_status ? (
                                    <>{'-'}</>
                                  ) : (
                                    <div
                                      className="text-truncate"
                                      style={{ fontWeight: 400 }}
                                    >
                                      Rp{' '}
                                      {parseFloat(
                                        item.shipping_price,
                                      ).toLocaleString('en')}
                                    </div>
                                  )}
                                </td>
                                {/* ) : null
                                } */}
                                <td>
                                  <div
                                    style={{ fontWeight: 700 }}
                                    className="text-truncate"
                                  >
                                    {truncateValue(item?.recipient_name, 25)}
                                  </div>
                                  <div className="text-truncate">
                                    {item?.recipient_phone
                                      ? changeToFormatPhone(
                                          item?.recipient_phone,
                                        )
                                      : '-'}
                                  </div>
                                </td>
                                <td
                                  style={{ fontWeight: 200, width: 140 }}
                                  className="tb-col nk-tb-col"
                                >
                                  <Badge
                                    className="badge-dim"
                                    color=""
                                    style={{
                                      fontWeight: 700,
                                      color: '#0372D9',
                                      backgroundColor: '#E1EFFA',
                                      height: 20,
                                      padding: '0px 8px 0px 8px',
                                      border: 'none',
                                    }}
                                  >
                                    {item.payment_method?.replace(
                                      'NON-COD',
                                      'NON COD',
                                    ) ?? '-'}
                                  </Badge>
                                </td>
                                <td className="tb-col nk-tb-col">
                                  <div className="d-flex align-items-center gap-0">
                                    <Badge
                                      className="badge-dim"
                                      color=""
                                      style={{
                                        fontWeight: 700,
                                        color: statusBadge(item).style.color,
                                        backgroundColor:
                                          statusBadge(item).style
                                            .backgroundColor,
                                        height: 20,
                                        padding: '0px 8px 0px 8px',
                                        border: 'none',
                                      }}
                                    >
                                      {statusBadge(item).text}
                                    </Badge>
                                    {routeCode == orderStatus.SEDANG_DIKIRIM &&
                                      item.is_issue && (
                                        <TooltipComponent
                                          icon="help-fill"
                                          iconClass="card-hint"
                                          direction="right"
                                          id={
                                            'info-courier' +
                                            item.order_header_id
                                          }
                                          text={
                                            'Pengiriman sedang tertunda, silakan lacak resi pengiriman'
                                          }
                                          style={{
                                            width: '12rem',
                                            borderRadius: 8,
                                            textAlign: 'start',
                                          }}
                                        />
                                      )}
                                  </div>
                                </td>
                                <td
                                  hidden={params?.type == 'semua'}
                                  className="tb-col nk-tb-col"
                                >
                                  <div className="d-flex align-items-center gap-2">
                                    {routeCode ==
                                    orderStatus.PENGAJUAN_PEMBATALAN ? (
                                      <>
                                        <Button
                                          color="success"
                                          disabled={
                                            routeCode ==
                                              orderStatus.SEDANG_DIKIRIM &&
                                            item.delivery_method_id == 1 &&
                                            !permissions.includes(
                                              'Terima / Tolak Pembatalan',
                                            )
                                          }
                                          style={{
                                            fontWeight: 400,
                                            height: 44,
                                            width: 90,
                                          }}
                                          className={`d-flex justify-content-center ${
                                            !permissions.includes(
                                              'Terima / Tolak Pembatalan',
                                            ) && 'btn-disabled'
                                          }`}
                                          onClick={() =>
                                            handleAcceptCancel(
                                              item.order_header_id,
                                            )
                                          }
                                        >
                                          <Icon name="check" />
                                          &nbsp;Terima
                                        </Button>
                                        <Button
                                          color="danger"
                                          disabled={
                                            !permissions.includes(
                                              'Terima / Tolak Pembatalan',
                                            )
                                          }
                                          style={{
                                            fontWeight: 400,
                                            height: 44,
                                            width: 90,
                                          }}
                                          onClick={() =>
                                            handleRejectCancel(
                                              item.order_header_id,
                                            )
                                          }
                                          className={
                                            !permissions.includes(
                                              'Terima / Tolak Pembatalan',
                                            ) && 'btn-disabled'
                                          }
                                        >
                                          <Icon name="cross" />
                                          &nbsp;Tolak
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          hidden={
                                            onHideRightButton() ||
                                            (routeCode ==
                                              orderStatus.SEDANG_DIKIRIM &&
                                              item.delivery_method_id == 1)
                                          }
                                          color="primary"
                                          style={{
                                            fontWeight: 400,
                                            padding: '12px 24px',
                                            justifyContent: 'center',
                                            fontSize: 12,
                                            width: 152,
                                            height: 44,
                                          }}
                                          onClick={(e) => {
                                            if (
                                              e?.target.className.includes(
                                                'disabled',
                                              )
                                            ) {
                                              e.preventDefault();
                                            } else {
                                              handleActionButton(item);
                                            }
                                          }}
                                          type={
                                            loadingButton ? 'button' : 'submit'
                                          }
                                          disabled={
                                            !permissions.includes(
                                              statusBadge(item).buttonText,
                                            ) ||
                                            disableActionButton(
                                              item.channel_name,
                                            ) ||
                                            item.is_ooc ||
                                            (item.location_type_id ===
                                              ethixWarehouseCode &&
                                              routeCode == orderStatus.DIPROSES)
                                          }
                                          className={
                                            (!permissions.includes(
                                              statusBadge(item).buttonText,
                                            ) ||
                                              disableActionButton(
                                                item.channel_name,
                                              ) ||
                                              item.is_ooc ||
                                              (item.location_type_id ===
                                                ethixWarehouseCode &&
                                                routeCode ==
                                                  orderStatus.DIPROSES)) &&
                                            'btn-disabled'
                                          }
                                        >
                                          {loadingButton &&
                                          item?.order_header_id ===
                                            idOrderHeader ? (
                                            <Spinner size="sm" color="light" />
                                          ) : (
                                            statusBadge(item).buttonText
                                          )}
                                        </Button>
                                        <ButtonMore
                                          hideButton={onHideMoreButton(item)}
                                          id="more-option"
                                        >
                                          {permissions.includes(
                                            statusBadge(item).buttonMoreText,
                                          ) && (
                                            <div
                                              onClick={() => {
                                                !disableActionButton(
                                                  item.channel_name,
                                                ) &&
                                                  handleCancelTrigger(
                                                    item.order_header_id,
                                                  );
                                              }}
                                              style={{
                                                cursor: 'pointer',
                                              }}
                                              className={
                                                disableActionButton(
                                                  item.channel_name,
                                                ) && 'text-gray'
                                              }
                                            >
                                              {statusBadge(item).buttonMoreText}
                                            </div>
                                          )}
                                          {showEditOrder(
                                            item.status_id,
                                            item.delivery_method_id,
                                            item.location_type_id,
                                            permissions.includes(
                                              'Ubah Pesanan',
                                            ),
                                          ) && (
                                            <div
                                              onClick={() => {
                                                !disableActionButton(
                                                  item.channel_name,
                                                ) &&
                                                  route.push({
                                                    pathname: `/order/edit/${item.order_header_id}`,
                                                    query: {
                                                      status:
                                                        statusBadge().text.replace(
                                                          /\s+/g,
                                                          '_',
                                                        ),
                                                    },
                                                  });
                                              }}
                                              style={{
                                                cursor: 'pointer',
                                              }}
                                              className={
                                                disableActionButton(
                                                  item.channel_name,
                                                )
                                                  ? 'text-gray'
                                                  : ''
                                              }
                                            >
                                              {'Ubah Pesanan'}
                                            </div>
                                          )}
                                          {(item.status_id ==
                                            orderStatus.DIPROSES ||
                                            item.status_id ===
                                              orderStatus.MENUNGGU_KURIR) && (
                                            <div
                                              onClick={() => {
                                                !disableActionButton(
                                                  item.channel_name,
                                                  'Cetak Resi',
                                                ) &&
                                                  handlePrintShipping(
                                                    item.order_header_id,
                                                  );
                                              }}
                                              style={{
                                                cursor: 'pointer',
                                                marginTop: 6,
                                              }}
                                              className={
                                                disableActionButton(
                                                  item.channel_name,
                                                  'Cetak Resi',
                                                )
                                                  ? 'text-gray'
                                                  : ''
                                              }
                                            >
                                              {'Cetak Resi'}
                                            </div>
                                          )}
                                        </ButtonMore>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                              {item.is_ooc &&
                                routeCode == orderStatus.UNMAPPING_ORDER && (
                                  <td
                                    colSpan={30}
                                    style={{
                                      backgroundColor: '#fff',
                                      paddingTop: 5,
                                      paddingBottom: 13,
                                      position: 'relative',
                                      top: -8,
                                    }}
                                  >
                                    <div
                                      style={{
                                        padding: '16px 20px 16px 20px',
                                        backgroundColor: '#FCE9E7',
                                      }}
                                      className="d-flex mx-3 rounded"
                                    >
                                      <Icon
                                        name="info"
                                        style={{
                                          marginRight: '8px',
                                          color: '#E85347',
                                          fontSize: 20,
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: 14,
                                          color: '#E85347',
                                        }}
                                      >
                                        Pesanan kamu tidak dapat diproses. Harap
                                        batalkan dan buat ulang pesanan dengan
                                        memeriksa ketersediaan kurir untuk
                                        tujuan tersebut.
                                      </span>
                                    </div>
                                  </td>
                                )}
                            </>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <PreviewAltCard className="border-0 shadow-none">
                  <div className={'dataTables_wrapper'}>
                    <div className="d-flex justify-content-between align-items-center g-2">
                      <div className="text-start">
                        {dataOrder?.length > 0 && (
                          <PaginationComponent
                            itemPerPage={paginationModel.size}
                            totalItems={pageInfo?.total_record}
                            paginate={handlePageChange}
                            currentPage={pageInfo.current_page}
                          />
                        )}
                      </div>
                      <div className="text-center w-100">
                        {dataOrder?.length > 0 ? (
                          <div className="datatable-filter text-end">
                            <div
                              className="dataTables_length"
                              id="DataTables_Table_0_length"
                            >
                              <label>
                                <span className="d-none d-sm-inline-block">
                                  Data Per Halaman
                                </span>
                                <div className="form-control-select">
                                  <select
                                    name="DataTables_Table_0_length"
                                    className="custom-select custom-select-sm form-control form-control-sm"
                                    value={paginationModel.size}
                                    onChange={(e) =>
                                      handlePerPage(e.target.value)
                                    }
                                  >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="40">40</option>
                                    <option value="50">50</option>
                                  </select>
                                </div>
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="text-silent">
                            <Image
                              src={Nodata}
                              width={'auto'}
                              height={'auto'}
                              alt="waizly-logo"
                            />
                            <div className="text-silent">
                              Belum Terdapat Data.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </PreviewAltCard>
              </div>
            </div>
          </Block>
        </BlockContent>
      </Content>

      {isModalCancel && (
        <ModalCancel
          icon={gifConfirm}
          buttonConfirmation={true}
          textCancel="Kembali"
          textSubmit="Konfirmasi Pembatalan"
          useTimer={false}
          btnSubmitWidth={'68%'}
          btnCancelWidth={'30%'}
          separatedRound
          handleClickYes={onPostCancelOrder}
          handleClickCancelled={handleCancelBtn}
          modalBodyStyle={{
            marginTop: '-90px',
            borderRadius: 16,
          }}
          modalContentStyle={{ width: 400 }}
          widthImage={400}
          heightImage={320}
          disableBtnSubmit={
            cancelReason == '' ||
            cancelReason.trim().length < 10 ||
            cancelReason.trim().length > 200
              ? true
              : false
          }
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Apakah kamu yakin ingin membatalkan pesanan? Silakan isi formulir pembatalan pesanan'
          }
        >
          <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
            Pemohon Pembatalan<span style={{ color: 'red' }}>*</span>
          </div>
          <Select
            value={
              getOptionCancellation.find(
                (option) => option.value === selectedCanceledBy,
              ) || null
            }
            options={getOptionCancellation}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.value}
            onChange={(selectedOption) => {
              setselectedCanceledBy(selectedOption.value);
            }}
          />
          <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
            Alasan Pembatalan<span style={{ color: 'red' }}>*</span>
          </div>
          <Input
            innerRef={inputRef}
            type="textarea"
            style={{ height: 80 }}
            value={cancelReason}
            maxLength={200}
            onChange={(e) => setcancelReason(e.target.value)}
          />
        </ModalCancel>
      )}

      {modalConfirmation && (
        <ModalConfirm
          toggle={() => setModalConfirmation((prev) => !prev)}
          icon={choosingOptions}
          modalContentStyle={{ width: 380 }}
          widthImage={380}
          heightImage={320}
          modalBodyStyle={{
            width: 460,
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            marginTop: '-100px',
            height: '135px',
            paddingLeft: 54,
            paddingRight: 54,
            marginLeft: -40,
            marginBottom: 13,
          }}
          title={'Kamu Belum Memilih Produk!'}
          subtitle={
            'Pilih setidaknya 1 produk untuk di hubungkan ke Master SKU'
          }
          useTimer={false}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {isSucces.show && (
        <ModalConfirm
          hideCallback={() => {
            setisSucces({ show: false, text: '' });
          }}
          useTimer={true}
          icon={gifSuccess}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '120px',
            marginLeft: '-25px',
            buttonConfirmation: true,
            marginBottom: 13,
          }}
          title={isSucces.text}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {isError.show && (
        <ModalConfirm
          hideCallback={() => {
            setisError({ show: false, text: '' });
          }}
          timeOut={4000}
          useTimer={true}
          icon={gifError}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          buttonConfirmation={false}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            marginTop: '-100px',
            height: '120px',
            buttonConfirmation: true,
          }}
          title={isError.text}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      <Modal
        size="lg"
        isOpen={modalSendOrder}
        toggle={() => setmodalSendOrder(!modalSendOrder)}
        style={{ maxWidth: 821, width: '100%' }}
      >
        <ModalBody style={{ padding: '40px 80px' }}>
          <div>
            <p className="text-header-lg">Kirim Pesanan</p>
          </div>
          <Row>
            <Col sm={5}>
              <div style={{ marginTop: 40 }} className="flex justify-center">
                <Image
                  src={deliveryType == 'pickup' ? courierImg : courierDisabled}
                  width={138}
                  height={162}
                  alt="illustration"
                />
              </div>
              <div style={{ marginTop: 40 }} className="text-center">
                <p style={{ fontSize: 12 }}>
                  Pilih Pickup jika kurir akan mengambil pesanan yang akan
                  dikirim
                </p>
                <Button
                  disabled={deliveryType == 'pickup' ? false : true}
                  onClick={onPostShipOrder}
                  style={{
                    border: '1px solid #203864',
                    marginTop: 16,
                    fontSize: 14,
                  }}
                >
                  Pickup
                </Button>
              </div>
            </Col>
            <Col
              sm={2}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{ width: 1, background: '#D9D9D9', height: 250 }}
              ></div>
            </Col>
            <Col sm={5}>
              <div style={{ marginTop: 40 }} className="flex justify-center">
                <Image
                  src={
                    deliveryType == 'dropoff' ? personSend : personSendDisabled
                  }
                  width={175}
                  height={162}
                  alt="illustration"
                />
              </div>
              <div style={{ marginTop: 40 }} className="text-center">
                <p style={{ fontSize: 12 }}>
                  Pilih Drop off jika kamu mengantarkan sendiri pesanan ke agen
                  kurir
                </p>
                <Button
                  disabled={deliveryType == 'dropoff' ? false : true}
                  onClick={handleDropoffButton}
                  style={{
                    border: '1px solid #203864',
                    marginTop: 16,
                    fontSize: 14,
                  }}
                >
                  Drop Off
                </Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {isModalConfirmSend && (
        <ModalCancel
          icon={gifConfirm}
          buttonConfirmation={true}
          textCancel="Kembali"
          textSubmit="Konfirmasi"
          useTimer={false}
          btnSubmitWidth={'50%'}
          btnCancelWidth={'50%'}
          separatedRound
          handleClickYes={onPostShipOrder}
          handleClickCancelled={handleCancelBtn}
          modalBodyStyle={{
            marginTop: '-90px',
          }}
          modalContentStyle={{ width: 400 }}
          widthImage={400}
          heightImage={320}
          title={'Konfirmasi Pengiriman'}
          subtitle={
            'Klik Konfirmasi jika kamu sudah yakin dengan kurir dan nomor resimu. Setelah itu, kurir dan nomor resi tidak dapat diubah kembali.'
          }
        >
          <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
            Nama Kurir
          </div>
          <Input
            type="text"
            value={courierName}
            maxLength={50}
            onChange={(e) => setcourierName(e.target.value)}
          />
          <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
            Nomor Resi
          </div>
          <Input
            type="text"
            value={resi}
            maxLength={50}
            onChange={(e) => setresi(e.target.value)}
          />
        </ModalCancel>
      )}

      {modalRedConfirm && (
        <ModalConfirm
          icon={gifConfirm}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '185px',
            paddingLeft: 40,
            paddingRight: 40,
            marginLeft: -25,
            marginBottom: 13,
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu klik selesai, status pesanan tidak dapat diubah kembali'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setmodalRedConfirm(false)}
          handleClickYes={redConfirmAction}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {modalGreenConfirm && (
        <ModalConfirm
          icon={gifConfirmGreen}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            marginTop: '-100px',
            height: '185px',
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu klik selesai, status pesanan tidak dapat diubah kembali'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setmodalGreenConfirm(false)}
          handleClickYes={greenConfirmAction}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {modalReadyOrder && (
        <ModalConfirm
          icon={gifReadyProcess}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            width: 420,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            marginLeft: -35,
            paddingLeft: 54,
            paddingRight: 54,
            height: '185px',
            marginBottom: 13,
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu proses pesanan, status pesanan tidak dapat diubah kembali'
          }
          textSubmit={'Proses Pesanan'}
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setmodalReadyOrder(false)}
          handleClickYes={onPostProcessOrder}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {modalProcessOrder && (
        <ModalConfirm
          icon={gifConfirm}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            marginTop: '-100px',
            height: '185px',
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu klik proses pesanan, maka pesanan akan siap dikirim'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setmodalProcessOrder(false)}
          handleClickYes={onPostProcessOrder}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {modalAcceptRetur && (
        <ModalConfirm
          icon={gifConfirm}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            marginTop: '-100px',
            height: '185px',
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu klik selesai, pengembalian pesanan akan disetujui'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setmodalAcceptRetur(false)}
          handleClickYes={onPostAcceptReturOrder}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
      {showModalShipping && dataShippingLabel ? (
        <ModalShipping isShow={true} items={dataShippingLabel} />
      ) : null}

      {isModalRetur && (
        <ModalCancel
          icon={gifConfirm}
          buttonConfirmation={true}
          textCancel="Kembali"
          textSubmit="Konfirmasi Pengembalian"
          useTimer={false}
          btnSubmitWidth={'65%'}
          btnCancelWidth={'35%'}
          separatedRound
          handleClickYes={onPostReturOrder}
          handleClickCancelled={handleCancelBtn}
          modalBodyStyle={{
            marginTop: '-90px',
          }}
          modalContentStyle={{ width: 400 }}
          widthImage={400}
          heightImage={320}
          disableBtnSubmit={
            returReason == '' ||
            returReason.trim().length < 10 ||
            returReason.trim().length > 200
              ? true
              : false
          }
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Apakah kamu yakin ingin mengembalikan pesanan? Silahkan isi formulir pengembalian pesanan'
          }
        >
          <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
            Pemohon Pengembalian<span style={{ color: 'red' }}>*</span>
          </div>
          <Select
            value={
              getOptionRetur.find(
                (option) => option.value === selectedReturBy,
              ) || null
            }
            options={getOptionRetur}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.value}
            onChange={(selectedOption) => {
              setselectedReturBy(selectedOption.value);
            }}
          />
          <div className="mt-2" style={{ fontWeight: 700, color: '#203864' }}>
            Alasan Pengembalian<span style={{ color: 'red' }}>*</span>
          </div>
          <Input
            innerRef={inputRef}
            type="text"
            value={returReason}
            maxLength={200}
            onChange={(e) => setreturReason(e.target.value)}
          />
        </ModalCancel>
      )}
      {showModalSuccessCountShipping && (
        <ModalConfirm
          icon={gifSuccess}
          widthImage={400}
          heightImage={340}
          modalContentStyle={{ width: 400 }}
          modalBodyStyle={{
            width: 480,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            paddingBottom: 0,
            height: '208px',
            marginLeft: '-38px',
            paddingLeft: 90,
            paddingRight: 90,
            marginBottom: 13,
          }}
          title={'Berhasil Menghitung Biaya Pengiriman!'}
          subtitle={
            'Proses hitung biaya pengiriman telah berhasil! Silakan periksa biaya pengiriman yang mengalami kegagalan pada tabel pesanan.'
          }
          useTimer={false}
          buttonConfirmation={false}
          handleClickYes={() => {}}
          handleClickCancelled={() => {}}
          textSubmit={''}
          toggle={false}
          isCountAction
          successCount={infoBulkRate?.success}
          failedCount={infoBulkRate?.failed}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
      {showModalWaitingBulkShipping && (
        <ModalCancel
          toggle={false}
          icon={loadingGif}
          modalContentStyle={{ width: 400, height: 440 }}
          iconStyle={{ zoom: 1.4, objectFit: 'cover', marginBottom: 150 }}
          widthImage={400}
          heightImage={250}
          separatedRound
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: -225,
            paddingBottom: 40,
          }}
          title={'Sedang Proses Hitung Biaya Pengiriman...'}
          subtitle={
            'Tunggu ya, biaya pengiriman kamu sedang dalam proses perhitungan...'
          }
          buttonConfirmation={false}
          useTimer={false}
        />
      )}

      {modalAlertOngkir && (
        <ModalConfirm
          icon={gifAnxiety}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            paddingBottom: 0,
            height: '130px',
            marginLeft: '-25px',
            paddingLeft: 36,
            paddingRight: 36,
            marginBottom: 13,
          }}
          title={'Oops! Terjadi Kesalahan'}
          subtitle={
            'Ada pesanan yang belum dihitung biaya pengirimanya! Cek kembali data pesanan ya'
          }
          buttonConfirmation={false}
          handleClickYes={() => {}}
          handleClickCancelled={() => {}}
          textSubmit={''}
          toggle={false}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {showModalBulkCompleteOrder && (
        <ModalConfirm
          icon={gifConfirm}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            width: 400,
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '185px',
            paddingLeft: 40,
            paddingRight: 40,
            marginLeft: -25,
            marginBottom: 13,
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu klik selesai, semua status pesanan tidak dapat diubah kembali'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={() => setShowModalBulkCompleteOrder(false)}
          handleClickYes={handleBulkCompleteOrder}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      <ModalTrackingOrder
        show={showOrderHistory}
        onBack={() => setShowOrderHistory(false)}
        loading={loadingHistory}
        items={listHistoryOrder}
        icon={gifSuccess}
      />
    </>
  );
}

export default ListTable;
