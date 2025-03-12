/* eslint-disable no-unused-vars */
// Next & React
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { isEqual } from 'lodash';

// Utils
import { getOptionAddBundlingSku } from '@/utils/getSelectOption';

// Component
import {
  DropdownOption,
  Icon,
  Button,
  PaginationComponent,
  BlockTitle,
  ModalConfirm,
} from '@/components';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

// Asset
import { IconTrashOutlined } from '@/assets/images/icon/trash-outlined';
import ilustrationCamera from '@/assets/images/illustration/ilustration-camera.svg';
import emptyAddBundling from '@/assets/images/empty/empty-add-bundling-sku.svg';
import Nodata from '@/assets/images/illustration/no-data.svg';
import verificationYesNo from '@/assets/gift/verification-yes-no.gif';

// Third party
import { FormInput } from '@/components/atoms/form-input';

function AddBundlingSku({
  handleBackForm,
  quantityValues,
  simpanAction,
  register,
  checkboxOptions,
  handleRemoveFromList,
  handleCheckboxChange,
  selectedCheckboxes,
  handleChangeValue,
  errors,
  quantityObject,
  pageInfo,
  selectedPageSize,
  handlePageChange,
  currentPage,
  handlePageSizeChange,
  setSearch,
  search,
  selectedSearchOption,
  setSelectedSearchOption,
  handleSearchEnter,
  selectedCheckboxesId,
  tempSelectedArrValues,
  setTempSelectedArrValues,
  setComparisonData,
  setComparisonDataArr,
  comparisonDataArr
}) {
  const [isValueChange, setIsValueChange] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const textTypeAction = 'Tambahkan Single SKU ke Bundling SKU';

  const hasZeroValue = Object.values(quantityObject).includes(0);
  const lengthObject =
    Object.keys(quantityObject).length === selectedCheckboxes.length
      ? true
      : false;

  const handleClickActionShow = () => {
    setModalConfirmation(prev => !prev);
  };

  const handleClickYes = () => {
    handleBackForm();
  };

  useEffect(() => {
    if (isEqual(selectedCheckboxes, comparisonDataArr)) {
      setIsValueChange(false);
    } else {
      setIsValueChange(true);
    }
  }, [selectedCheckboxes, comparisonDataArr]);

  return (
    <>
      <div className="wrapper-bg-light">
        <p className="text-primary" style={{ fontSize: 12 }}>
          MASTER SKU&nbsp; / &nbsp;TAMBAH BUNDLING SKU&nbsp; / &nbsp;
          <span style={{ color: '#BDC0C7', fontSize: 12 }}>{textTypeAction}</span>
        </p>
        <BlockTitle fontSize={32}>{textTypeAction}</BlockTitle>
        <p style={{ color: '#4C4F54', fontSize: 12 }}>
          Pilih Single SKU untuk digabungkan menjadi Bundling SKU
        </p>

        <Form>
          <div className="mt-5">
            <div className="d-flex">
              <div className="form-wrap">
                <DropdownOption
                  className="filter-dropdown"
                  options={getOptionAddBundlingSku}
                  optionLabel={'name'}
                  placeholder={'Pilih'}
                  value={selectedSearchOption}
                  onChange={(e) => setSelectedSearchOption(e.target.value)}
                />
              </div>
              <div className="form-control-wrap">
                <div className="form-icon form-icon-right">
                  <Icon
                    name="search"
                    className="pt-1"
                    style={{ color: '#203864', backgroundColor: '#ffffff' }}
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

          <Row xs="2" className="mt-5">
            <Col xs="12" lg="6">
              <div
                style={{
                  border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                  height: 500,
                  overflowY: 'auto',
                }}
              >
                {checkboxOptions.length > 0 ? (
                  checkboxOptions.map((option, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                      }}
                    >
                      <div
                        style={{
                          padding: '1px 24px',
                          display: 'flex',
                          // justifyContent: "space-between",
                          height: 110,
                        }}
                      >
                        <div style={{ display: 'flex', alignSelf: 'center', width: '90%' }}>
                          <Image
                            width={44}
                            height={44}
                            src={ilustrationCamera}
                            style={{ alignSelf: 'center' }}
                            alt="Image Product"
                          />
                          <div style={{ marginLeft: 14, width: '80%' }}>
                            <p className="text-header-bold text-truncate" style={{ maxWidth: '100%' }} >
                              {option?.name}
                            </p>
                            <p
                              className="text-header-text-sub-connect-product text-truncate"
                              style={{ marginTop: '-12px', maxWidth: '100%' }}
                            >
                              Kode SKU: {option?.sku}
                            </p>
                          </div>
                        </div>
                        <div style={{ alignSelf: 'center', width: '10%' }}>
                          <FormGroup style={{ margin: 0 }} check inline>
                            <Input
                              type="checkbox"
                              value={selectedCheckboxesId.includes(option?.id)}
                              checked={selectedCheckboxesId.includes(option?.id)}
                              onChange={() => handleCheckboxChange(option)}
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      className="d-flex flex-column text-center gap-3"
                      style={{ marginTop: 170 }}
                    >
                      <Image
                        width={120}
                        height={80}
                        src={Nodata}
                        style={{ alignSelf: 'center' }}
                        alt="Image Product"
                      />
                      <p style={{ color: '#4C4F54', fontSize: 13 }}>
                        Data tidak ditemukan
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className={'dataTables_wrapper mt-4 mb-2'}>
                <div className="d-flex flex-column justify-content-center align-items-center g-2">
                  <div className="text-start">
                    {checkboxOptions.length > 0 && (
                      <PaginationComponent
                        itemPerPage={selectedPageSize}
                        totalItems={pageInfo?.total_record}
                        paginate={handlePageChange}
                        currentPage={currentPage}
                      />
                    )}
                  </div>
                  <div className="text-center w-100">
                    {checkboxOptions.length > 0 ? (
                      <div className="datatable-filter text-end">
                        <div
                          className="dataTables_length text-center mt-1"
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
                                value={selectedPageSize}
                                onChange={(e) => handlePageSizeChange(e)}
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
                    ) : null}
                  </div>
                </div>
              </div>
            </Col>

            <Col xs="12" lg="6">
              <div
                style={{
                  border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                  height: 500,
                  overflowY: 'auto',
                }}
              >
                {selectedCheckboxes.length > 0 ? (
                  selectedCheckboxes.map((option, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid var(--Text-Black-Medium, #E9E9EA)',
                      }}
                    >
                      <div
                        style={{
                          padding: '16px 24px',
                          display: 'flex',
                          height: 110,
                        }}
                      >
                        <div style={{ width: '90%', display: 'flex', }}>
                          <div style={{ alignSelf: 'center', marginRight: 16 }} >
                            <Image
                              width={44}
                              height={44}
                              src={ilustrationCamera}
                              alt="Image Product"
                              style={{ minWidth: 44, minHeight: 44 }}
                            />
                          </div>
                          <div style={{ marginRight: 10, width: '80%', }}>
                            <p className="text-header-bold text-truncate">
                              {option?.name}
                            </p>
                            <Row style={{ height: 20 }}>
                              <Col xs={5} style={{ alignSelf: 'center' }}>
                                <p className="text-header-text-sub-connect-product text-truncate">
                                  Kode SKU: {option?.sku}
                                </p>
                              </Col>
                              <Col xs={7}>
                                <FormGroup row>
                                  <Label
                                    for="exampleEmail"
                                    xs={3}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'end',
                                      fontSize: 12,
                                      padding: 0,
                                      alignSelf: 'end',
                                    }}
                                  >
                                    Jumlah
                                    <span style={{ color: '#FF6E5D' }}>*</span>
                                  </Label>
                                  <Col xs={9}>
                                    <FormInput
                                      name={option?.id}
                                      register={register}
                                      invalid={errors?.[option?.id]}
                                      onChange={(e) => {
                                        handleChangeValue(e, option?.id);
                                        setIsValueChange(true);
                                      }}
                                      maxLength={8}
                                      onBlur={(e) => handleChangeValue(e, option.id)}
                                    />
                                    {errors?.[option?.id] && (
                                      <span
                                        style={{ fontSize: 10 }}
                                        className="mt-1 text-danger position-absolute"
                                      >
                                        {errors?.[option?.id].message}
                                      </span>
                                    )}
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                        </div>
                        <div style={{ alignSelf: 'center', marginTop: 12, width: '10%' }}>
                          <div onClick={() => handleRemoveFromList(option?.id)}>
                            <IconTrashOutlined />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      className="d-flex flex-column text-center gap-3"
                      style={{ marginTop: 170 }}
                    >
                      <Image
                        width={90}
                        height={80}
                        src={emptyAddBundling}
                        style={{ alignSelf: 'center' }}
                        alt="Image Product"
                      />
                      <p style={{ color: '#4C4F54', fontSize: 13 }}>
                        Kamu belum menambahkan Single SKU apapun ke Bundling SKU
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}
              >
                <p style={{ fontSize: 12 }}>Terpilih : {selectedCheckboxes?.length}</p>
                <p className="text-sub-connect-product" style={{ width: quantityValues < 2 ? 220 : 120, fontSize: 12 }}>
                  Total Quantity : {quantityValues}
                  {(quantityValues < 2) && (selectedCheckboxes?.length > 0) && (
                    <p
                      style={{ fontSize: 12 }}
                      className={'mt-1 text-sub-connect-product text-danger position-absolute d-block'}
                    >
                      Total quantity Single SKU minimal 2
                    </p>
                  )}
                </p>
              </div>
            </Col>
          </Row>
          <div
            style={{
              gap: 16,
              display: 'flex',
              marginTop: 40,
              justifyContent: 'end',
            }}
          >
            <Button
              onClick={() => isValueChange ? handleClickActionShow() : handleBackForm()}
              type="button"
              className={'justify-center text-primary'}
              style={{ height: 43, width: 180, fontSize: 14 }}
            >
              Batal
            </Button>
            <Button
              onClick={(props) => {
                setComparisonData(quantityValues);
                setComparisonDataArr(selectedCheckboxes);
                simpanAction(props);
              }}
              className={`btn-primary justify-center ${hasZeroValue ||
                quantityValues < 2 ||
                !lengthObject ||
                !isValueChange
                ? 'btn-disabled'
                : 'btn-primary'
                }`}
              color="primary"
              disabled={
                hasZeroValue ||
                quantityValues < 2 ||
                !lengthObject ||
                !isValueChange
              }
              style={{ height: 43, width: 180, fontSize: 14 }}
            >
              {'Simpan'}
            </Button>
          </div>
        </Form >
      </div >

      {modalConfirmation && (
        <ModalConfirm
          icon={verificationYesNo}
          modalContentStyle={{ width: 350 }}
          widthImage={350}
          heightImage={320}
          modalBodyStyle={{
            borderTopLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginTop: '-100px',
            height: '185px',
            paddingLeft: 24,
            paddingRight: 24
          }}
          title={'Apakah Kamu Yakin?'}
          subtitle={
            'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={handleClickActionShow}
          handleClickYes={handleClickYes}
          stylesCustomTitle={{
            paddingTop: 0
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )
      }
    </>
  );
}

export default AddBundlingSku;
