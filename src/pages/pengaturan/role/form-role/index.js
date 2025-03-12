/* eslint-disable react-hooks/exhaustive-deps */
//next
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

//component
import {
  Head,
  ModalConfirm,
  SkeletonLoading,
  Button,
  BlockTitle,
} from '@/components';

//layout
import Content from '@/layout/content/Content';

//third party
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEqual } from 'lodash';
import {
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from 'reactstrap';

//utils
import { UseDelay } from '@/utils/formater';
import { formatDateText } from '@/utils';

//assets
import successGif from '@/assets/gift/success-create-sku.gif';
import verificationYesNo from '@/assets/gift/verification-yes-no.gif';

// redux & api
import { useSelector } from 'react-redux';
import {
  createRole,
  listModuleRole,
  updateRole,
  getDetailRole,
} from '@/services/role';

function FormRole({}) {
  const textSuccesCreate = 'Berhasil Menambahkan Role!';
  const textSuccesEdit = 'Berhasil Memperbarui Role!';

  const [temporaryDataEdit, setTemporaryDataEdit] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [moduleRole, setModuleRole] = useState([]);
  const [textTypeAction, setTextTypeAction] = useState('');
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [modalSucces, setModalSucces] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disableFieldRoleName, setDisableFieldRoleName] = useState(false);
  const [showErrorRequired, setShowErrorRequired] = useState(false);
  const [isDisabledButton, setIsDisabledButton] = useState(false);

  // schema validation
  const schema = yup.object().shape({
    role_name: yup
      .string()
      .required('Harap mengisi Nama Role')
      .test(
        'no-leading-space',
        'Karakter pertama tidak boleh di awali dengan spasi',
        (value) => {
          if (value && /^\s/.test(value)) {
            return false;
          }

          return true;
        },
      ),
    description: yup
      .string()
      .nullable()
      .test(
        'no-leading-space',
        'Karakter pertama tidak boleh di awali dengan spasi',
        (value) => {
          if (value && /^\s/.test(value)) {
            return false;
          }

          return true;
        },
      ),
  });

  // redux
  const { client_id } = useSelector((state) => state.auth.user);
  // next route & next search params
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParams = searchParams.get('action');
  const idSearch = searchParams.get('id');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    clearErrors,
    trigger,
    setValue,
    setError,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  // handle check action type params
  const checkTypeAction = (action) => {
    switch (action) {
      case 'add':
        return setTextTypeAction('Tambah Role');
      case 'edit':
        return setTextTypeAction('Detail Role');
      default:
        return setTextTypeAction('');
    }
  };

  // handle submit form
  const onSubmit = async (data) => {
    try {
      setLoadingButton(true);

      const requestBody = {
        client_id,
        role_name: data.role_name,
        description: data.description || '',
        module_list: moduleList,
      };

      const url =
        actionParams === 'add'
          ? createRole(requestBody)
          : updateRole(idSearch, requestBody);

      const res = await url;
      if (res?.status === 201 || res?.status === 200) {
        setModalSucces(true);
        await UseDelay(2000);
        router.push('/pengaturan/role');
      }
    } catch (error) {
      // console.log("errrr", error);
      // if (error?.response?.status === 400) {
      //   router.push("/login");
      // }
      if (error.response) {
        const errorLocationName = error.response.data.errors?.trace[0];
        switch (errorLocationName) {
          case 'THE ROLE NAME FOR THIS CLIENT ALREADY BEEN TAKEN.':
            setError('role_name', {
              type: 'manual',
              message: 'Nama Role sudah pernah dipakai',
            });
            break;
          default:
            setError('role_name', {
              type: 'manual',
              message: '',
            });
            break;
        }
      }
    } finally {
      setLoadingButton(false);
    }
  };

  // fetch detail role
  const fetchDataDetail = async (roleId, clientId) => {
    try {
      const response = await getDetailRole(roleId, clientId);
      const dataResponseDetail = response?.data?.role;
      if (response?.status === 200) {
        setTemporaryDataEdit(dataResponseDetail);
        setModuleList(dataResponseDetail?.module_list || []);
        setValue('role_name', dataResponseDetail?.role_name);
        setValue('description', dataResponseDetail?.description);
        if (dataResponseDetail?.role_name === 'SELLER_OWNER') {
          setDisableFieldRoleName(true);
          setValue('role_name', 'SELLER OWNER');
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // fetch module list
  const fetchDataModuleList = async () => {
    try {
      setLoading(true);
      const response = await listModuleRole({
        client_id,
      });
      const dataResponseList = response?.data;
      setModuleRole(dataResponseList);
    } catch (error) {
      // console.log(error);
      if (error?.response?.status === 400) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // handle check condition if have value and wanna back to list werehouse
  const handleBackButton = () => {
    const formValues = watch();
    const hasValue = Object.values(formValues).some(
      (value) => value?.length > 0,
    );
    if (actionParams === 'add') {
      if (hasValue || moduleList.length !== 0) {
        setModalConfirmation(true);
      } else {
        clearErrors();
        router.push('/pengaturan/role');
      }
    } else {
      const isModuleListChanged = !isEqual(
        moduleList.sort((a, b) => a - b),
        temporaryDataEdit?.module_list
          ? temporaryDataEdit.module_list.sort((a, b) => a - b)
          : [],
      );
      const isDataChanged = Object.keys(formValues).some(
        (key) => formValues[key] !== temporaryDataEdit[key],
      );

      if (isDataChanged || isModuleListChanged) {
        clearErrors();
        setModalConfirmation(true);
      } else {
        router.push('/pengaturan/role');
      }
    }
  };

  // handle check disable button
  const handleDisableButton = () => {
    if (actionParams === 'edit') {
      // check if other form fields are changed
      const formValues = watch();
      const isDataChanged = Object.keys(formValues).some(
        (key) => formValues[key] !== temporaryDataEdit[key],
      );
      // check if moduleList is changed
      const isModuleListChanged = !isEqual(
        moduleList.sort((a, b) => a - b),
        temporaryDataEdit?.module_list
          ? temporaryDataEdit.module_list.sort((a, b) => a - b)
          : [],
      );
      setIsDisabledButton(!(isDataChanged || isModuleListChanged));
    }
  };

  // handle validation checkbox
  const handleCheckboxChange = (subModuleId) => {
    const moduleIndex = moduleRole.findIndex((moduleItem) =>
      moduleItem.sub_module.some(
        (subModuleItem) => subModuleItem.id === subModuleId,
      ),
    );

    if (moduleList.includes(subModuleId)) {
      const subModule = moduleRole[moduleIndex].sub_module.find(
        (subModuleItem) => subModuleItem.id === subModuleId,
      );

      if (subModule) {
        if (subModule.is_view) {
          // Uncheck the clicked sub module
          const updatedModuleList = moduleList.filter(
            (id) => id !== subModuleId,
          );
          setModuleList(updatedModuleList);

          // Uncheck all sub modules with is_view false if the clicked module has is_view true
          const otherSubModuleIds = moduleRole[moduleIndex].sub_module
            .filter((subModuleItem) => !subModuleItem.is_view)
            .map((subModule) => subModule.id);
          // Combine both filter operations
          const finalModuleList = updatedModuleList.filter(
            (id) => !otherSubModuleIds.includes(id),
          );
          setModuleList(finalModuleList);
          setShowErrorRequired(finalModuleList.length === 0);
        } else {
          // Uncheck only the clicked sub module
          const updatedModuleList = moduleList.filter(
            (id) => id !== subModuleId,
          );
          setModuleList(updatedModuleList);
          setShowErrorRequired(updatedModuleList.length === 0);
        }
      }
      // setShowErrorRequired(moduleList.length === 0);
    } else {
      // Check the clicked sub module
      const updatedModuleList = [...moduleList, subModuleId];
      setModuleList(updatedModuleList);

      // Check all sub modules with is_view true if the clicked module has is_view true
      const otherSubModuleIdsTrue = moduleRole[moduleIndex].sub_module
        .filter((subModuleItem) => subModuleItem.is_view)
        .map((subModule) => subModule.id);

      const otherSubModuleIdsFalse = moduleRole[moduleIndex].sub_module
        .filter((subModuleItem) => !subModuleItem.is_view)
        .map((subModule) => subModule.id);

      // if dont have sub module with is_view true cheked, checked all
      const uncheckedTrueSubModules = otherSubModuleIdsTrue.filter(
        (id) => !updatedModuleList.includes(id),
      );
      if (uncheckedTrueSubModules.length > 0) {
        setModuleList([...updatedModuleList, ...uncheckedTrueSubModules]);
      }

      // delete cheked on sub modules with is_view false if nothing data width is_view true cheked
      const checkedFalseSubModules = otherSubModuleIdsFalse.filter((id) =>
        updatedModuleList.includes(id),
      );
      if (checkedFalseSubModules.length === 0) {
        setModuleList(
          updatedModuleList.filter(
            (id) => !otherSubModuleIdsFalse.includes(id),
          ),
        );
      }
      setShowErrorRequired(updatedModuleList.length === 0);
    }
  };

  //  handle go to activity history
  const handleClickActivityHistory = (id) => {
    router.push({
      pathname: '/pengaturan/role/activity-history',
      query: { id },
    });
  };

  // handle confirm back to list werehouse or stay in form werehouse
  const handleClickCancelled = () => setModalConfirmation(false);
  const handleClickYes = () => router.push('/pengaturan/role');

  // check query to fetch data detail
  useEffect(() => {
    if (typeof router.query.id !== 'undefined' && router.query.id !== null) {
      if (idSearch === '1') {
        router.push('/pengaturan/role');
      } else {
        fetchDataDetail(idSearch, client_id);
      }
    }
  }, [router.query.id]);

  // call function fetch module list
  useEffect(() => {
    fetchDataModuleList();
  }, []);

  // handle disable button
  useEffect(() => {
    handleDisableButton();
  }, [watch(), temporaryDataEdit, moduleList]);

  // check action params
  useEffect(() => {
    if (actionParams) return checkTypeAction(actionParams);
  }, [actionParams]);

  return (
    <>
      <Head title="Role" />
      <Content>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="wrapper-bg-light">
            <p className="text-primary" style={{ fontSize: 12 }}>
              PENGATURAN&nbsp; / &nbsp;ROLE&nbsp; / &nbsp;
              <span style={{ color: '#BDC0C7' }}>{textTypeAction}</span>
            </p>
            <BlockTitle fontSize={32}>{textTypeAction}</BlockTitle>
            {/* row warehouse */}
            <Row>
              <Col xs="12">
                <FormGroup className="mb-4">
                  <Label htmlFor="role_name" className="fw-bold">
                    Nama Role
                    <span style={{ color: '#FF6E5D' }}>*</span>
                  </Label>
                  <Controller
                    name="role_name"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;

                      return (
                        <>
                          <Input
                            {...field}
                            invalid={Boolean(errors?.role_name)}
                            name="role_name"
                            register={register}
                            placeholder="Masukkan Nama Role"
                            disabled={disableFieldRoleName}
                            className="shadow-none"
                            value={value}
                            onChange={(e) => {
                              setValue('role_name', e.target.value);
                              onChange(e.target.value);
                              trigger('role_name');
                            }}
                            maxLength={150}
                          />
                        </>
                      );
                    }}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors.role_name?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col xs="12">
                <FormGroup className="mb-4">
                  <Label htmlFor="description" className="fw-bold">
                    Deskripsi
                  </Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => {
                      const { onChange, value } = field;
                      return (
                        <>
                          <>
                            <Input
                              {...field}
                              invalid={Boolean(errors?.description)}
                              register={register}
                              name="description"
                              type="textarea"
                              placeholder="Masukkan Deskripsi"
                              className="shadow-none"
                              style={{ resize: 'none' }}
                              value={value}
                              onChange={(e) => {
                                setValue('description', e.target.value);
                                onChange(e.target.value);
                                trigger('description');
                              }}
                              maxLength={500}
                            />
                          </>
                        </>
                      );
                    }}
                  />
                  <FormFeedback>
                    <span
                      className="text-danger position-absolute"
                      style={{ fontSize: 12 }}
                    >
                      {errors.description?.message}
                    </span>
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col xs="12" className="mb-4">
                <Label htmlFor="no_handphone" className="fw-bold">
                  Akses
                  <span style={{ color: '#FF6E5D' }}>*</span>
                </Label>
                <div
                  class="row p-1 mx-0"
                  style={{
                    backgroundColor: '#e7eaee',
                    borderRadius: '4px 4px 0px 0px',
                    fontSize: 13,
                  }}
                >
                  <div class="col-7 col-md-4 col-lg-3">
                    <span>Module</span>
                  </div>
                  <div class="col">
                    <span>Sub Module</span>
                  </div>
                </div>
                {loading ? (
                  <>
                    <SkeletonLoading
                      width={'100%'}
                      height={'400px'}
                      className="rounded-0"
                    />
                  </>
                ) : (
                  <>
                    {moduleRole.map((moduleItem, idx) => (
                      <div
                        class="row mx-0"
                        key={idx}
                        style={{
                          border: '1px #E9E9EA solid',
                          borderTop: 'none',
                          fontSize: 13,
                        }}
                      >
                        <div
                          class="col-7 col-md-4 col-lg-3"
                          style={{ borderRight: '1px #E9E9EA solid' }}
                        >
                          <div className="py-3">
                            <FormGroup check>
                              <Label style={{ color: '#4C4F54' }} check>
                                {moduleItem.module}
                              </Label>
                            </FormGroup>
                          </div>
                        </div>
                        <div class="col py-3">
                          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-gap-3">
                            {moduleItem?.sub_module?.map(
                              (subModuleItem, idx) => (
                                <div className="col" key={idx}>
                                  <FormGroup
                                    htmlFor={`${subModuleItem.id}`}
                                    check
                                  >
                                    <Input
                                      id={`${subModuleItem.id}`}
                                      type="checkbox"
                                      checked={
                                        moduleList.includes(subModuleItem.id) ||
                                        false
                                      }
                                      onChange={() =>
                                        handleCheckboxChange(subModuleItem.id)
                                      }
                                    />
                                    <Label style={{ color: '#4C4F54' }} check>
                                      {subModuleItem.name}
                                    </Label>
                                  </FormGroup>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {showErrorRequired && (
                      <span
                        className="text-danger position-absolute"
                        style={{ fontSize: 12 }}
                      >
                        Setidaknya memilih 1 akses yang diberikan untuk Sub
                        Account
                      </span>
                    )}
                  </>
                )}
              </Col>
            </Row>

            <div
              className={`${
                typeof router.query.id !== 'undefined' &&
                router.query.id !== null
                  ? 'd-block'
                  : 'd-none'
              }`}
            >
              <Button
                type="button"
                onClick={() =>
                  handleClickActivityHistory(temporaryDataEdit?.role_id)
                }
                className="p-0 mt-5 text-decoration-underline text-primary"
                style={{ fontSize: 12, fontWeight: 400 }}
              >
                Lihat Riwayat Aktivitas
              </Button>
            </div>
            <div
              className={`${
                typeof router.query.id !== 'undefined' &&
                router.query.id !== null
                  ? 'd-flex justify-content-between'
                  : ''
              }`}
            >
              <div
                className={`${
                  typeof router.query.id !== 'undefined' &&
                  router.query.id !== null
                    ? 'd-flex align-items-center '
                    : 'd-none'
                }`}
                style={{
                  paddingTop: 30,
                }}
              >
                <div className="d-flex">
                  <p
                    style={{
                      color: '#4C4F54',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Waktu Dibuat:&nbsp;
                    <span style={{ fontWeight: 100 }}>
                      {formatDateText(temporaryDataEdit?.created_at) ?? '-'}
                    </span>
                  </p>
                  <p
                    style={{
                      color: '#4C4F54',
                      fontSize: 13,
                      fontWeight: 700,
                      paddingLeft: 15,
                    }}
                  >
                    Terakhir Diperbarui:&nbsp;
                    <span style={{ fontWeight: 100 }}>
                      {formatDateText(temporaryDataEdit?.updated_at) ?? '-'}
                    </span>
                  </p>
                </div>
              </div>
              <div
                style={{
                  gap: 16,
                  display: 'flex',
                  marginTop: 18,
                  justifyContent: 'end',
                }}
              >
                <Button
                  type="button"
                  className="justify-center"
                  style={{
                    height: 43,
                    width: 180,
                    fontSize: 14,
                    color: '#203864',
                  }}
                  onClick={handleBackButton}
                >
                  Kembali
                </Button>
                <Button
                  type={
                    watch('role_name') === '' ||
                    isDisabledButton ||
                    loadingButton ||
                    moduleList.length === 0
                      ? 'button'
                      : 'submit'
                  }
                  disabled={
                    watch('role_name') === '' ||
                    moduleList.length === 0 ||
                    isDisabledButton
                  }
                  className={`${
                    watch('role_name') === '' ||
                    moduleList.length === 0 ||
                    isDisabledButton
                      ? 'btn-disabled'
                      : 'btn-primary'
                  } justify-center`}
                  style={{ height: 43, width: 180, fontSize: 14 }}
                >
                  {loadingButton ? (
                    <Spinner size="sm" color="light" />
                  ) : (
                    'Simpan'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Content>
      {modalConfirmation && (
        <ModalConfirm
          icon={verificationYesNo}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
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
            'Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan'
          }
          buttonConfirmation
          useTimer={false}
          handleClickCancelled={handleClickCancelled}
          handleClickYes={handleClickYes}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}

      {modalSucces && (
        <ModalConfirm
          icon={successGif}
          widthImage={350}
          heightImage={320}
          modalContentStyle={{ width: 350 }}
          modalBodyStyle={{
            borderTopLeftRadius: '60%',
            borderTopRightRadius: '60%',
            borderBottomLeftRadius: '60%',
            borderBottomRightRadius: '60%',
            marginTop: '-100px',
            height: '135px',
          }}
          title={actionParams === 'add' ? textSuccesCreate : textSuccesEdit}
          stylesCustomTitle={{
            paddingTop: 0,
          }}
          singleButtonConfirmation={false}
          textSingleButton={''}
        />
      )}
    </>
  );
}

export default FormRole;
