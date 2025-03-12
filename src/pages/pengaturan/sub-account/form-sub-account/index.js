/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

//components
import { DropdownOption, Head, ModalConfirm } from '@/components';
import { FormInput } from '@/components/atoms/form-input';
import { Button, BlockTitle  } from '@/components';

//third party
import * as yup from 'yup';
import { Col, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupText, Label, Row, Spinner } from 'reactstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

//assets
import successGif from '@/assets/gift/success-create-sku.gif';
import verificationYesNo from '@/assets/gift/verification-yes-no.gif';

//layout
import Content from '@/layout/content/Content';

//services
import { getListRole } from '@/services/role';
import { getDataEditAccount, submitCreateSubAccount, submitEditSubAccount } from '@/services/subAccount';

//utils
import { UseDelay } from '@/utils/formater';
import { convertTimestamp } from '@/utils/convertTimeStamp';


const schema = yup.object().shape({
    email: yup
        .string()
        .required('Harap mengisi Email')
        .trim()
        .email('Pastikan email yang kamu masukkan aktif dan valid')
        .transform((value) => value.trim())
        .test(
            'valid-email',
            'Pastikan email yang kamu masukkan aktif dan valid',
            (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ),
    full_name: yup
        .string()
        .required('Harap mengisi Nama Pengguna')
        .test(
            'no-leading-space',
            'karakter pertama tidak boleh di awali dengan spasi',
            (value) => {
                if (value && /^\s/.test(value)) {
                    return false;
                }
                return true;
            }
        ),
    role_id: yup.string().required('Harap memilih Role'),
    phone: yup
        .string()
        .nullable()
        .transform((value, defaultValue) => (defaultValue === '' ? null : value))
        .min(7, 'Masukan minimal 7 angka')
    ,
});


function FormSubAccount({ }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const actionParams = searchParams.get('action');
    const idSearch = searchParams.get('id');
    const headerText = actionParams === 'add' ? 'Tambah Pengguna' : 'Detail Pengguna';

    const { client_id } = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [listRoles, setListRoles] = useState([]);
    const [loadingButton, setLoadingButton] = useState(false);
    const [modalSucces, setModalSucces] = useState(false);
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [temporaryDataEdit, setTemporaryDataEdit] = useState({});

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        clearErrors,
        watch,
        setValue,
        setError,
        register
    } = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
    });

    const isObjectErrorNull = Object.keys(errors).length === 0;


    const fetchGetListRole = async () => {
        try {
            setLoading(true);
            const response = await getListRole({
                client_id,
                page: 1,
                size: 11,
            });
            const transformedData = response?.data?.roles.filter(item => item.role_name !== 'SELLER_OWNER').map(item => {
                return { value: item.role_id, name: item.role_name };
            });
            setListRoles(transformedData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClickCancelled = () => setModalConfirmation(false);
    const handleClickYes = () => router.push('/pengaturan/sub-account');

    const handleBackButton = () => {
        const formValues = watch();
        const hasValue = Object.values(formValues).some(
            (value) => value?.length > 0
        );
        if (actionParams === 'add') {
            if (hasValue) {
                setModalConfirmation(true);
            } else {
                clearErrors();
                router.push('/pengaturan/sub-account');
            }
        } else {
            const isDataChanged = Object.keys(formValues).some(
                (key) => formValues[key] !== temporaryDataEdit[key]
            );
            if (isDataChanged) {
                clearErrors();
                setModalConfirmation(true);
            } else {
                router.push('/pengaturan/sub-account');
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoadingButton(true);
            const requestBodyData = {
                'full_name': data?.full_name,
                'email': data?.email,
                'role_id': Number(data?.role_id),
                'phone': data?.phone ?? null
            };
            const url = actionParams === 'add' ? submitCreateSubAccount(requestBodyData) : submitEditSubAccount(requestBodyData, idSearch);
            const response = await url;
            if (response?.status === 201 || response?.status === 200) {
                setModalSucces(true);
                await UseDelay(2000);
                router.push('/pengaturan/sub-account');
            }
        } catch (error) {
            if (error.response) {
                const errorFullName = error.response.data.errors?.trace[0];
                switch (errorFullName) {
                    case 'THE SUB ACCOUNT NAME FOR THIS CLIENT ALREADY BEEN TAKEN.':
                        setError('full_name', {
                            type: 'manual',
                            message: 'Nama Pengguna sudah pernah dipakai',
                        });
                        break;
                    case 'THE SUB ACCOUNT EMAIL FOR THIS CLIENT ALREADY BEEN TAKEN.':
                        setError('email', {
                            type: 'manual',
                            message: 'Email sudah pernah dipakai',
                        });
                        break;
                    default:
                        clearErrors();
                        break;
                }
            }
        } finally {
            setLoadingButton(false);
        }
    };

    const fetchDataEdit = async (id) => {
        try {
            const response = await getDataEditAccount(id);
            const convertResponse = response?.data?.user;
            setTemporaryDataEdit(convertResponse);
            setValue('email', convertResponse?.email);
            setValue('full_name', convertResponse?.full_name);
            setValue('role_id', convertResponse?.role_id);
            setValue('phone', convertResponse?.phone);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickActivityHistory = (id) => router.push({
        pathname: '/pengaturan/sub-account/activity-history',
        query: { id },
    });


    useEffect(() => {
        if (typeof router.query.id !== 'undefined' && router.query.id !== null && actionParams !== 'add') {
            fetchDataEdit(idSearch);
        }
    }, [router.query.id]);

    useEffect(() => {
        fetchGetListRole();
    }, []);

    return (
        <>
            <Head title="Form Pengguna" />
            <Content>
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <div className="wrapper-bg-light">
                        <p style={{ fontSize: 12, fontWeight: 400,  color: '#4C4F54' }}>
                            PENGATURAN / PENGGUNA /{' '}
                            <span className="text-header-sm-seconds">{headerText} </span>
                        </p>
                        <BlockTitle fontSize={32}>
                            {headerText}
                        </BlockTitle>

                        <Row>
                            <Col xs="6">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="full_name" style={{fontWeight:'bold'}}>
                                        Nama Pengguna<span className="text-color-danger">*</span>
                                    </Label>
                                    <Controller
                                        name="full_name"
                                        control={control}
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <>
                                                    <Input
                                                        onChange={(event) => {
                                                            onChange(event?.target?.value);
                                                        }}
                                                        maxLength={150}
                                                        value={value}
                                                        invalid={!!errors.full_name}
                                                        onFocus={() => {
                                                            clearErrors('full_name');
                                                        }}
                                                        {...field}
                                                        id="full_name"
                                                        type="text"
                                                        className="field-input-border-primary shadow-none"
                                                        placeholder="Masukkan Nama Pengguna"
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
                                            {errors.full_name?.message}
                                        </span>
                                    </FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col xs="6">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="email" style={{fontWeight:'bold'}}>
                                        Email<span className="text-color-danger">*</span>
                                    </Label>
                                    {actionParams === 'add' ?
                                        <>
                                            <Controller
                                                name="email"
                                                control={control}
                                                render={({ field }) => {
                                                    const { onChange, value } = field;
                                                    return (
                                                        <>
                                                            <Input
                                                                onChange={(event) => {
                                                                    onChange(event?.target?.value);
                                                                    // trigger("email")
                                                                }}
                                                                id="email"
                                                                value={value}
                                                                invalid={!!errors.email}
                                                                onFocus={() => {
                                                                    clearErrors('email');
                                                                }}
                                                                {...field}
                                                                type="email"
                                                                className="field-input-border-primary shadow-none"
                                                                placeholder="Masukkan Email"
                                                            />
                                                        </>
                                                    );
                                                }}
                                            />
                                            <span
                                                className="text-danger position-absolute"
                                                style={{ fontSize: 12 }}
                                            >
                                                {errors.email?.message}
                                            </span>
                                        </>
                                        :
                                        <FormInput
                                            register={register}
                                            disabled={true}
                                            className="shadow-none field-input-border-primary"
                                            id="email"
                                            name="email"
                                            placeholder="Masukkan Email"
                                            type="email"
                                        />
                                    }
                                </FormGroup>
                            </Col>
                            <Col xs="6">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="phone" style={{fontWeight:'bold'}}>
                                        No. Handphone 
                                    </Label>
                                    <InputGroup>
                                        <InputGroupText
                                            style={{
                                                backgroundColor: 'transparent',
                                                fontSize: 12,
                                                borderColor: errors.phone?.message ? 'red' : ''
                                            }}
                                        >
                                            +62
                                        </InputGroupText>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            render={({ field }) => {
                                                const { onChange, value } = field;
                                                const checkingZeroFirstLetter = value?.startsWith('0') ? `${value.slice(1)}` : value;
                                                return (
                                                    <>
                                                        <Input
                                                            {...field}
                                                            value={checkingZeroFirstLetter}
                                                            onChange={(e) => {
                                                                onChange(e.target.value);
                                                            }}
                                                            onInput={(e) => {
                                                                let inputValue = e.target.value;
                                                                inputValue = inputValue.replace(/^0+/, '');
                                                                e.target.value = inputValue.slice(0, 13).replace(/[^0-9]/g, '');
                                                            }}
                                                            id="phone"
                                                            onBlur={() => (value?.length == 0) && clearErrors('phone')}
                                                            invalid={!!errors.phone}
                                                            type="text"
                                                            className="field-input-border-primary shadow-none"
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
                                                {errors.phone?.message}
                                            </span>
                                        </FormFeedback>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col xs="6">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="role_id" style={{fontWeight:'bold'}}>
                                        Role<span className="text-color-danger">*</span>
                                    </Label>
                                    <Controller
                                        name="role_id"
                                        control={control}
                                        render={({ field }) => {
                                            const { value, onChange } = field;
                                            return (
                                                <DropdownOption
                                                    {...field}
                                                    value={value}
                                                    options={listRoles}
                                                    onChange={(event) => {
                                                        onChange(event?.target?.value);
                                                    }}
                                                    id="role_id"
                                                    optionLabel={'name'}
                                                    placeholder={'Pilih Role'}
                                                    className={errors.role_id ? 'p-invalid' : ''}
                                                />
                                            );
                                        }}
                                    />

                                    <span
                                        className="text-danger position-absolute"
                                        style={{ fontSize: 12 }}
                                    >
                                        {errors?.role_id?.message}
                                    </span>
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className={`d-flex ${actionParams === 'edit' ? 'justify-between' : 'justify-end'} align-center`}>
                            {actionParams === 'edit' &&
                                <div>
                                    <div
                                        className={`${typeof router.query.id !== 'undefined' &&
                                            router.query.id !== null
                                            ? 'd-block'
                                            : 'd-none'
                                            }`}
                                    >
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                handleClickActivityHistory(temporaryDataEdit?.user_id)
                                            }
                                            className="p-0 mt-5 text-decoration-underline text-primary"
                                            style={{ fontSize: 12, fontWeight: '400' }}
                                        >
                                            Lihat Riwayat Aktivitas
                                        </Button>
                                    </div>
                                    <div
                                        className={`${typeof router.query.id !== 'undefined' &&
                                            router.query.id !== null
                                            ? 'd-flex justify-content-between mt-3'
                                            : ''
                                            }`}
                                    >
                                        <div
                                            className={` ${typeof router.query.id !== 'undefined' &&
                                                router.query.id !== null
                                                ? 'd-flex justify-content-between align-items-center'
                                                : 'd-none'
                                                }`}
                                        >
                                            <div
                                                className="d-flex"
                                                style={{
                                                    paddingTop: 12,
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        color: '#4C4F54',
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Waktu Dibuat:&nbsp;
                                                    <span style={{ fontWeight: 100 }}>
                                                        {convertTimestamp(temporaryDataEdit?.created_at) ?? '-'}
                                                    </span>
                                                </p>
                                                <p
                                                    style={{
                                                        color: '#4C4F54',
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        paddingLeft: 13,
                                                    }}
                                                >
                                                    Terakhir Diperbarui:&nbsp;
                                                    <span style={{ fontWeight: 100 }}>
                                                        {convertTimestamp(temporaryDataEdit?.updated_at) ?? '-'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div
                                style={{
                                    gap: 16,
                                    display: 'flex',
                                    marginTop: 40,
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
                                    type={loadingButton ? 'button' : 'submit'}
                                    color="primary"
                                    disabled={!isValid || !isObjectErrorNull}
                                    className={`${!isValid || !isObjectErrorNull
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
                        borderTopLeftRadius: '50%',
                        borderTopRightRadius: '50%',
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                        marginTop: '-60px',
                        height: '185px',
                        width: 400,
                        marginLeft: '-25px',
                        marginBottom: 16,
                        padding: 38,
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
                        paddingTop: 0
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
                        borderBottomLeftRadius: 6,
                        borderBottomRightRadius: 6,
                        marginTop: '-100px',
                        height: actionParams === 'add' ? '180px' : '135px',
                    }}
                    title={actionParams === 'add' ? 'Berhasil Menambahkan Pengguna!' : 'Berhasil Memperbarui Pengguna!'}
                    subtitle={actionParams === 'add' ? 'Silakan cek email yang terdaftar untuk verifikasi akun dan membuat password yang baru' : ''}
                    stylesCustomTitle={{
                        paddingTop: 0
                    }}
                    singleButtonConfirmation={false}
                    textSingleButton={''}
                />
            )}
        </>
    );
}

export default FormSubAccount;