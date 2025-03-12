/* eslint-disable react-hooks/exhaustive-deps */
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Icon, Col, Row } from '@/components';
import React, { useState, useEffect } from 'react';
import { getChannel, getLocation } from '@/services/storeIntegration/index';

import Image from 'next/image';
import Shopify from '@/assets/images/marketplace/shopify.png';
import Tokopedia from '@/assets/images/marketplace/tokopedia.png';
import Shopee from '@/assets/images/marketplace/shopee.png';
import Lazada from '@/assets/images/marketplace/lazada.png';
import Tiktok from '@/assets/images/marketplace/tiktok.png';
import Other from '@/assets/images/marketplace/other.png';
import { useSelector } from 'react-redux';

const FilterTableStore = ({
  updateChannelInPayload,
  updateLocationInPayload,
  onMappingStatusClick,
  onOrderStatusClick,
  onChange,
  resetPayload,
  activeTab,
}) => {
  const { client_id } = useSelector((state) => state.auth.user);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedMappingStatus, setSelectedMappingStatus] = useState([]);
  const [selectedOrderstatus, setSelectedOrderStatus] = useState([]);

  const [channels, setChannels] = useState([]);
  const [location, setDataLocation] = useState([]);

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
        return Shopify;
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

    if (onChange) {
      onChange(updatedChannels);
    }
  };

  const handleLocationClick = (location) => {
    const updatedLocations = selectedLocation ? [...selectedLocation] : [];
    const index = updatedLocations.findIndex((loc) => loc.id === location.id);

    const value = {
      id: location.id,
      type: 'location',
    };

    if (index > -1) {
      updatedLocations.splice(index, 1);
    } else {
      updatedLocations.push(value);
    }

    setSelectedLocation(updatedLocations);
    updateLocationInPayload(updatedLocations);

    if (onChange) {
      onChange(updatedLocations);
    }
  };

  const handleMappingStatusClick = (statusId) => {
    const statusMapping =
      {
        5: 'Connected',
        6: 'No Mapping',
        1: 'Authorizing',
        4: 'Problem Authorizing',
      }[statusId] || '';

    const updatedStatus = { id: statusId, type: statusMapping };

    const isStatusSelected = selectedMappingStatus.some(
      (selected) => selected.id === statusId
    );

    let updatedMappingStatus = [];
    if (!isStatusSelected) {
      updatedMappingStatus = [...selectedMappingStatus, updatedStatus];
    } else {
      updatedMappingStatus = selectedMappingStatus.filter(
        (selected) => selected.id !== statusId
      );
    }

    setSelectedMappingStatus(updatedMappingStatus);

    if (onMappingStatusClick) {
      onMappingStatusClick(updatedMappingStatus);
    }
  };

  const handleOrderStatus = (orderId) => {
    const isSelected = selectedOrderstatus.some(
      (selectedOrder) => selectedOrder.id === orderId
    );

    let updatedOrderStatus;

    if (isSelected) {
      updatedOrderStatus = selectedOrderstatus.filter(
        (selectedOrder) => selectedOrder.id !== orderId
      );
    } else {
      updatedOrderStatus = [
        ...selectedOrderstatus,
        { id: orderId, isActive: true },
      ];
    }

    const isOrder1Active = updatedOrderStatus.some(
      (order) => order.id === 1 && order.isActive
    );
    const isOrder2Active = updatedOrderStatus.some(
      (order) => order.id === 2 && order.isActive
    );

    setSelectedOrderStatus(updatedOrderStatus);
    let isStatusActive;
    if (isOrder1Active && isOrder2Active) {
      isStatusActive = null;
    } else if (isOrder1Active) {
      isStatusActive = true;
    } else if (isOrder2Active) {
      isStatusActive = false;
    } else {
      isStatusActive = null;
    }

    if (onOrderStatusClick) {
      onOrderStatusClick(isStatusActive);
    }
  };

  const resetSelectedChannels = () => {
    setSelectedChannels(null);
    setSelectedLocation(null);
    setSelectedMappingStatus([]);
    setSelectedOrderStatus([]);
  };

  const resetPayloadData = () => {
    setSelectedChannels(null);
    setSelectedLocation(null);
    setSelectedMappingStatus([]);
    setSelectedOrderStatus([]);

    setTimeout(() => {
      let channelElements = document.querySelectorAll('.channel-item');
      channelElements.forEach((element) => {
        element.style.backgroundColor = '#E7EAEE';
      });

      let locationElements = document.querySelectorAll('.location-item');
      locationElements.forEach((element) => {
        element.style.backgroundColor = '#E7EAEE';
      });

      let mappingStatusElements = document.querySelectorAll(
        '.mapping-status-item'
      );
      mappingStatusElements.forEach((element) => {
        element.style.backgroundColor = '#E7EAEE';
      });

      let orderStatusElements = document.querySelectorAll('.order-status-item');
      orderStatusElements.forEach((element) => {
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

        // Filter channels based on activeTab
        if (activeTab === '1') {
          filteredChannels = filteredChannels.filter((channel) =>
            [1, 2, 3, 4, 6, 11].includes(channel.channel_id)
          );
        } else if (activeTab === '2') {
          filteredChannels = filteredChannels.filter((channel) =>
            [1, 2, 3, 4].includes(channel.channel_id)
          );
        } else if (activeTab === '3') {
          filteredChannels = filteredChannels.filter((channel) =>
            [6].includes(channel.channel_id)
          );
        } else if (activeTab === '4') {
          filteredChannels = filteredChannels.filter((channel) =>
            [11].includes(channel.channel_id)
          );
        }

        setChannels(filteredChannels);
      } else {
        console.error('Error fetching channel data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error.message);
    }
  };
  const payload = {
    client_id: client_id,
    status: 'ACTIVE',
    page: 1,
    size: 100,
  };

  const fetchLocationData = async () => {
    try {
      const response = await getLocation(payload);

      if (response.status === 200) {
        const location = response.data.location_list;

        setDataLocation(location);
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchChannelData();
    fetchLocationData();
    resetSelectedChannels();
  }, [activeTab]);

  return (
    <>
      <UncontrolledDropdown>
        <div className="ps-4 pe-4 ms-1 me-1">
          <DropdownToggle
            tag="a"
            className="ms-2 me-2 fw-semibold"
            style={{ cursor: 'default' }}
          >
            <div
              style={{ cursor: 'pointer' }}
              className="d-flex align-items-center justify-content-center"
            >
              <Icon name="filter"></Icon>
              <span>&nbsp;Filter</span>
            </div>
          </DropdownToggle>
        </div>
        <DropdownMenu
          end
          className="filter-wg dropdown-menu"
          style={{ overflow: 'visible', width: 500 }}
        >
          <div className="dropdown-body dropdown-body-rg">
            {/* channel */}
            <div>
              <span className="sub-title dropdown-title">CHANNEL</span>
              <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
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
                        border: `1px solid ${selectedChannels?.some(
                          (ch) => ch.id === channel.channel_id
                        ) ? '#203864' : '#ccc'}`,
                        borderRadius: '5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
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
            {/* lovations */}
            <div className="mt-3">
              <span className="sub-title dropdown-title">LOKASI</span>
              <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
                {location.map((location) => (
                  <Col key={location.id} size="3">
                    <div
                      style={{
                        backgroundColor: (selectedLocation || []).some(
                          (loc) => loc.id === location.id
                        )
                          ? '#E7EAEE'
                          : '#fff',
                        color: '#4C4F54',
                        border: `1px solid ${(selectedLocation || []).some(
                          (loc) => loc.id === location.id
                        ) ? '#203864' : '#ccc'}`,
                        borderRadius: '5px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleLocationClick(location)}
                      className="text-truncate"
                    >
                      {location.name}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            {/* mapping status */}
            <div className="mt-3">
              <span className="sub-title dropdown-title">MAPPING STATUS</span>
              <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
                <Col size="3">
                  <div
                    style={{
                      backgroundColor: selectedMappingStatus.some(
                        (selected) => selected.id === 5
                      )
                        ? '#E7EAEE'
                        : '#fff',
                      color: '#4C4F54',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                    className="border rounded-2 p-2 center"
                    onClick={() => handleMappingStatusClick(5)}
                  >
                    Connected
                  </div>
                </Col>
                <Col size="3">
                  <div
                    style={{
                      backgroundColor: selectedMappingStatus.some(
                        (selected) => selected.id === 6
                      )
                        ? '#E7EAEE'
                        : '#fff',
                      color: '#4C4F54',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                    className="border rounded-2 p-2 center"
                    onClick={() => handleMappingStatusClick(6)}
                  >
                    No Mapping
                  </div>
                </Col>
                <Col size="3">
                  <div
                    style={{
                      backgroundColor: selectedMappingStatus.some(
                        (selected) => selected.id === 1
                      )
                        ? '#E7EAEE'
                        : '#fff',
                      color: '#4C4F54',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                    className="border rounded-2 p-2 center"
                    onClick={() => handleMappingStatusClick(1)}
                  >
                    Authorizing
                  </div>
                </Col>
                <Col size="5">
                  <div
                    style={{
                      backgroundColor: selectedMappingStatus.some(
                        (selected) => selected.id === 4
                      )
                        ? '#E7EAEE'
                        : '#fff',
                      color: '#4C4F54',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                    className="border rounded-2 p-2 center"
                    onClick={() => handleMappingStatusClick(4)}
                  >
                    Problem Authorizing
                  </div>
                </Col>
              </Row>
            </div>
            {/* order integration */}
            <div className="mt-3">
              <span className="sub-title dropdown-title">
                INTEGRASI PESANAN
              </span>
              <Row className="gx-2 gy-2" style={{ marginTop: -5 }}>
                <Col size="3">
                  <div
                    style={{
                      backgroundColor: selectedOrderstatus.some(
                        (selectedOrder) =>
                          selectedOrder.id === 1 && selectedOrder.isActive
                      )
                        ? '#E7EAEE'
                        : '#fff',
                      color: '#4C4F54',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                    className="border rounded-2 p-2 center"
                    onClick={() => handleOrderStatus(1)}
                  >
                    Aktif
                  </div>
                </Col>
                <Col size="3">
                  <div
                    style={{
                      backgroundColor: selectedOrderstatus.some(
                        (selectedOrder) =>
                          selectedOrder.id === 2 && selectedOrder.isActive
                      )
                        ? '#E7EAEE'
                        : '#fff',
                      color: '#4C4F54',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                    className="border rounded-2 p-2 center"
                    onClick={() => handleOrderStatus(2)}
                  >
                    Non Aktif
                  </div>
                </Col>
              </Row>
            </div>
          </div>
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

export default FilterTableStore;
