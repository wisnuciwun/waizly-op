/* eslint-disable react-hooks/exhaustive-deps */
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Icon, Col, Row } from '@/components';
import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import { getStore } from '@/services/storeIntegration/index';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const FilterTableStore = ({
  onChangeMapping,
  onSelectedStoreIdsChange,
  resetPayload,
  channel
}) => {
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [dataStore, setDataStore] = useState([]);
  const [selectedStoreIds, setSelectedStoreIds] = useState([]);
  const [searchInput, setSearchInput] = useState(null);

  const handleChangeTypeMapping = (id) => {
    let newMapping;

    if (selectedMapping === id || selectedMapping === 'all') {
      setSelectedMapping(null);
      newMapping = 'all';
    } else {
      setSelectedMapping(id);
      newMapping = id === 1 ? true : false; // Change this line
    }

    if (onChangeMapping) {
      onChangeMapping(newMapping);
    }
  };

  const handleChangeStoreNameOp = (storeId) => {
    const isSelected = selectedStoreIds.includes(storeId);
    const updatedSelectedStoreIds = isSelected
      ? selectedStoreIds.filter((id) => id !== storeId)
      : [...selectedStoreIds, storeId];

    setSelectedStoreIds(updatedSelectedStoreIds);

    // Call the function to update the selected store IDs in the parent component
    if (onSelectedStoreIdsChange) {
      onSelectedStoreIdsChange(updatedSelectedStoreIds);
    }
  };  

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      setSearchInput(searchInput); // Fix this line
      fetchDataStore();
    }
  };

  const resetSelectedChannels = () => {
    setSelectedMapping([null]);
  };

  const resetPayloadData = () => {
    setSelectedMapping([null]);

    const checkboxes = document.querySelectorAll('.custom-control-input');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    setSelectedStoreIds([]);

    setTimeout(() => {
      let orderStatusElements = document.querySelectorAll('.order-status-item');
      orderStatusElements.forEach((element) => {
        element.style.backgroundColor = '#E7EAEE';
      });
    }, 0);

    resetPayload();
  };

  const { client_id } = useSelector((state) => state.auth.user);

  const fetchDataStore = async () => {
    try {
      const response = await getStore({
        client_id: client_id,
        channel: [channel],
        location: [],
        status: [],
        order_api: null,
        search: {
          store_name_op: searchInput,
          store_name_channel: null,
        },
        page: 1,
        size: 1000,
      });

      if (response.status === 200) {
        setDataStore(response?.data?.store_list);
      } else {
        console.error('Error in response:', response.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchDataStore();
    resetSelectedChannels();
  }, []);

  return (
    <>
      <UncontrolledDropdown>
        <DropdownToggle tag="a" className="mt-2">
          {/* <Button> */}
          <Styles.ContainerFilter>
            <Icon style={{marginTop: 4}} name="filter"></Icon> 
            <Styles.Text>{'Filter'}</Styles.Text>
          </Styles.ContainerFilter>
            
          {/* </Button> */}
        </DropdownToggle>
        <DropdownMenu
          end
          className="filter-wg dropdown-menu"
          style={{ overflow: 'visible', width: 500 }}
        >
          <div className="dropdown-body dropdown-body-rg">
            {/* order integration */}
            <div className="mt-3">
              <span
                className="sub-title dropdown-title"
                style={{ color: '#4C4F54'}}
              >
                HUBUNGAN MASTER SKU
              </span>
              <div className={'d-flex'}>
                <div
                  style={{
                    backgroundColor:
                      selectedMapping === 1 || selectedMapping === 'all'
                        ? '#E7EAEE'
                        : '#fff',
                    color: '#4C4F54',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    marginRight: 8
                  }}
                  className="border rounded-2 p-2 center"
                  onClick={() => handleChangeTypeMapping(1)}
                >
                  {'Terhubung'}
                </div>
                <div
                  style={{
                    backgroundColor:
                      selectedMapping === 2 || selectedMapping === 'all'
                        ? '#E7EAEE'
                        : '#fff',
                    color: '#4C4F54',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                  className="border rounded-2 p-2 center"
                  onClick={() => handleChangeTypeMapping(2)}
                >
                  {'Tidak Terhubung'}
                </div>
              </div>
              <Row style={{marginTop: 0 }} className="gx-6 gy-4">
                <div style={{marginTop: 20}}>
                  <span
                    className="sub-title dropdown-title"
                    style={{ color: '#4C4F54', }}
                  >
                    TOKO
                  </span>
                  <div className="form-control-wrap">
                    <div className="form-icon form-icon-right">
                      <Icon name="search" style={{ color: '#203864', backgroundColor: '#ffffff' }}></Icon>
                    </div>
                    <Input
                      type="text"
                      className="form-control shadow-none"
                      placeholder="Search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleSearchEnter}
                      style={{ marginTop: '10px'}}
                    />
                  </div>
                </div>
                <div
                  style={{
                    overflowY: 'auto',
                    maxHeight: '110px',
                    marginTop: '20px',
                  }}
                >
                  {dataStore.length > 0 ? (
                    dataStore.map((store, index) => (
                      <Col size="12" key={index}>
                        <div className="form-group" style={{ marginTop: 20}}>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={`includeDel-${store.id}`}
                              defaultChecked={selectedStoreIds.includes(
                                store.id
                              )}
                              onChange={() => handleChangeStoreNameOp(store.id)}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`includeDel-${store.id}`}
                              style={{ color: '#4C4F54', paddingLeft: 6}}
                            >
                              {store.store_name_op}
                            </label>
                          </div>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      Data not available
                    </div>
                  )}
                </div>
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
              onClick={resetPayloadData}
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
    margin-left: -2px;
  `,
  Text: styled.text`
    font-size: 14px;
    font-weight: 700;
    color: #203864;
  `
};

export default FilterTableStore;
