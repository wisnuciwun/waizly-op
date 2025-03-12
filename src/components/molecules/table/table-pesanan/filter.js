/* eslint-disable react-hooks/exhaustive-deps */
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Icon, Col, Row } from '@/components';
import React, { useState, useEffect } from 'react';
import {
  getChannel,
  getWarehouse,
  getCourier,
} from '@/services/storeIntegration/index';
import { useSelector } from 'react-redux';

import Image from 'next/image';
import Shopify from '@/assets/images/marketplace/shopify.png';
import Tokopedia from '@/assets/images/marketplace/tokopedia.png';
import Shopee from '@/assets/images/marketplace/shopee.png';
import Lazada from '@/assets/images/marketplace/lazada.png';
import Tiktok from '@/assets/images/marketplace/tiktok.png';
import Other from '@/assets/images/marketplace/other.png';
import styled from 'styled-components';

const FilterTableStore = ({
  updateChannelInPayload,
  updateLocationInPayload,
  updateCourierInPayload,
  updatePaymentMethodInPayload,
  resetPayload,
  hideChannel = false,
  hideWarehouse = false,
  hidePayment = false,
  hideCourier = false,
  counterBadge = false
}) => {
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);

  const { client_id } = useSelector((state) => state.auth.user);
  const [channels, setChannels] = useState([]);
  const [location, setDataLocation] = useState([]);
  const [courier, setCourier] = useState([]);
  // const [paymentMethod, setPaymentMethod] = useState([]);

  const paymentMethods = [
    {
      payment_methods_id: 1,
      payment_methods: 'NON COD',
    },
    {
      payment_methods_id: 2,
      payment_methods: 'COD',
    },
  ];

  const getImageSrc = (channelName) => {
    const formattedName = channelName.toLowerCase().replace(/\s+/g, '');
    switch (formattedName) {
      case 'tokopedia':
        return Tokopedia;
      case 'shopee':
        return Shopee;
      case 'lazada':
        return Lazada;
      case 'tiktok':
        return Tiktok;
      case 'shopify':
        return Shopify;
      case 'other':
        return Other;
      default:
        return Other;
    }
  };

  const handleChannelClick = (channel) => {
    const updatedChannels = selectedChannels ? [...selectedChannels] : [];
    const index = updatedChannels.findIndex(
      (ch) => ch.id === channel.channel_id
    );

    const value = {
      id: channel.channel_id,
      type: 'channel',
    };

    if (index > -1) {
      updatedChannels.splice(index, 1);
    } else {
      updatedChannels.push(value);
    }

    setSelectedChannels(updatedChannels);
    updateChannelInPayload(updatedChannels);
  };

  const handleLocationClick = (location) => {
    const updatedLocations = selectedLocation ? [...selectedLocation] : [];
    const index = updatedLocations.findIndex(
      (loc) => loc.id === location.location_id
    );

    const value = {
      id: location.location_id,
      type: 'location',
    };

    if (index > -1) {
      updatedLocations.splice(index, 1);
    } else {
      updatedLocations.push(value);
    }

    setSelectedLocation(updatedLocations);
    updateLocationInPayload(updatedLocations);
  };

  const handleCourierClick = (courier) => {
    const updatedCourier = selectedCourier ? [...selectedCourier] : [];
    const index = updatedCourier.findIndex(
      (cr) => cr.id === courier.logistic_carrier_id
    );

    const value = {
      id: courier.logistic_carrier_id,
      type: 'courier',
    };

    if (index > -1) {
      updatedCourier.splice(index, 1);
    } else {
      updatedCourier.push(value);
    }

    setSelectedCourier(updatedCourier);
    updateCourierInPayload(updatedCourier);
  };

  const handlePaymentMethodClick = (paymentMethods) => {
    const updatedPaymentMethod = selectedPaymentMethod
      ? [...selectedPaymentMethod]
      : [];
    const index = updatedPaymentMethod.findIndex(
      (pym) => pym.id === paymentMethods.payment_methods_id
    );

    const value = {
      id: paymentMethods.payment_methods_id,
      type: 'paymentmethod',
    };

    if (index > -1) {
      updatedPaymentMethod.splice(index, 1);
    } else {
      updatedPaymentMethod.push(value);
    }
    setSelectedPaymentMethod(updatedPaymentMethod);
    updatePaymentMethodInPayload(updatedPaymentMethod);
  };

  const resetSelectedChannels = () => {
    setSelectedChannels(null);
    setSelectedLocation(null);
    setSelectedCourier(null);
    setSelectedPaymentMethod(null);
  };

  const resetPayloadData = () => {
    setSelectedChannels(null);
    setSelectedLocation(null);
    setSelectedCourier(null);
    setSelectedPaymentMethod(null);

    setTimeout(() => {
      let channelElements = document.querySelectorAll('.channel-item');
      channelElements.forEach((element) => {
        element.style.backgroundColor = '#E7EAEE';
      });

      let locationElements = document.querySelectorAll('.location-item');
      locationElements.forEach((element) => {
        element.style.backgroundColor = '#E7EAEE';
      });
    }, 0);

    resetPayload();
  };

  const fetchChannelData = async () => {
    try {
      const response = await getChannel();
      if (response.status === 200) {
        let filteredChannels = response.data.channel;

        filteredChannels = filteredChannels.filter((channel) =>
          [1, 2, 3, 4, 6, 11, 14].includes(channel.channel_id)
        );

        setChannels(filteredChannels);
      } else {
        console.error('Error fetching channel data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error.message);
    }
  };

  const fetchLocationData = async () => {
    try {
      const response = await getWarehouse(client_id, 'ALL');

      if (response.status === 200) {
        const location = response.data;
        setDataLocation(location);
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  // fetch delivery courier
  const fetchDeliveryCourier = async () => {
    try {
      const response = await getCourier(client_id);
      if (response.status === 200) {
        const courier = response?.data;
        setCourier(courier);
      }
    } catch (error) {
      // console.error("Error fetching data:", error?.message);
    }
  };

  useEffect(() => {
    fetchChannelData();
    fetchLocationData();
    fetchDeliveryCourier();
    resetSelectedChannels();
  }, []);

  let filterSelected = 
  (selectedChannels?.length ?? 0) + 
  (selectedLocation?.length ?? 0) + 
  (selectedCourier?.length ?? 0) + 
  (selectedPaymentMethod?.length ?? 0);

  return (
    <>
      <UncontrolledDropdown>
        <DropdownToggle tag="a" className="">
          {/* <Button> */}
          <Styles.ContainerFilter>
            <Icon style={{ marginTop: 1, fontSize: 20 }} name="filter"></Icon>
            <Styles.Text>{'Filter'}</Styles.Text>
            <div hidden={!counterBadge || filterSelected == 0} className="filter-counter">
              {filterSelected > 9 ? '9+' : filterSelected}
            </div>
          </Styles.ContainerFilter>

          {/* </Button> */}
        </DropdownToggle>
        <DropdownMenu
          end
          className="filter-wg dropdown-menu"
          style={{
            overflow: 'visible',
            overflowY: 'auto',
            width: 500,
            maxHeight: 400,
          }}
        >
          <Styles.DropdownMenu className="dropdown-body dropdown-body-rg">
            {/* channel */}
            <div hidden={hideChannel}>
              <span className="sub-title dropdown-title">CHANNEL</span>
              <Row
                className="gx-2 gy-2"
                style={{ marginTop: -5, marginBottom: -10 }}
              >
                {channels.map((channel, idx) => (
                  <Col key={idx} size="4">
                    <div
                      style={{
                        backgroundColor: selectedChannels?.some(
                          (ch) => ch.id === channel.channel_id
                        )
                          ? '#E7EAEE'
                          : '#fff',
                        color: '#4C4F54',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display:
                          channel.channel_name === 'SOCIALECOMMERCE'
                            ? 'none'
                            : '',
                      }}
                      onClick={() => handleChannelClick(channel)}
                      className="text-truncate"
                    >
                      <Image
                        src={getImageSrc(channel.channel_name)}
                        width={20}
                        height={20}
                        alt="waizly-logo"
                        style={{ marginRight: '8px' }} // Add margin-right here
                      />
                      {channel.channel_name}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            <div hidden={hideWarehouse}>
              <span className="sub-title dropdown-title">GUDANG</span>
              <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
                {location.map((val, idx) => (
                  <Col key={idx} size="3">
                    <div
                      style={{
                        backgroundColor: (selectedLocation || []).some(
                          (loc) => loc.id === val.location_id
                        )
                          ? '#E7EAEE'
                          : '#fff',
                        color: '#4C4F54',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleLocationClick(val)}
                      className="text-truncate"
                    >
                      {val.location_name}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            <div hidden={hidePayment}>
              <span className="sub-title dropdown-title">
                METODE PEMBAYARAN
              </span>
              <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
                {paymentMethods.map((val, idx) => (
                  <Col key={idx} size="3">
                    <div
                      style={{
                        backgroundColor: (selectedPaymentMethod || []).some(
                          (pym) => pym.id === val.payment_methods_id
                        )
                          ? '#E7EAEE'
                          : '#fff',
                        color: '#4C4F54',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handlePaymentMethodClick(val)}
                      className="text-truncate"
                    >
                      {val.payment_methods}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            <div hidden={hideCourier}>
              <span className="sub-title dropdown-title">COURIER</span>
              <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
                {courier.map((val, idx) => (
                  <Col key={idx} size="3">
                    <div
                      style={{
                        backgroundColor: (selectedCourier || []).some(
                          (cr) => cr.id === val.logistic_carrier_id
                        )
                          ? '#E7EAEE'
                          : '#fff',
                        color: '#4C4F54',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleCourierClick(val)}
                      className="text-truncate"
                    >
                      {val.logistic_carrier}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Styles.DropdownMenu>
          <div
            className="dropdown-foot border-0"
            style={{ justifyContent: 'flex-end' }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={resetPayloadData} // Trigger resetPayload when the button is clicked
            >
              Reset
            </button>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  );
};

const Styles = {
  ContainerFilter: styled.div`
    display: flex;
    margin-left: 16px;
    flex-direction: row;
    gap: 4px;
    justify-content: center;
    cursor: pointer;
    padding-left: 4px;
  `,
  Text: styled.text`
    font-size: 14px;
    font-weight: 700;
    color: #203864;
  `,
  DropdownMenu: styled.div`
    > * {
      margin-bottom: 20px;
    }
  `,
};

export default FilterTableStore;
