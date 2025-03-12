/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

//services
import { getDetailUser, updateDetailProfile } from '@/services/profile';

//third party
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    Col,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Row,
    Spinner,
} from 'reactstrap';

//layout
import Content from '@/layout/content/Content';

//components
import { DropdownOption, Head, ModalConfirm, MultiSelectOption } from '@/components';

//gif
import successGif from '@/assets/gift/success-create-sku.gif';

//utils
import { UseDelay } from '@/utils/formater';
import { getChannel, getLevelOrder, getProduct } from '@/utils/getSelectOption';
import { getUser } from '@/services/auth';
import { setUser } from '@/redux/action/auth';

const schema = yup.object().shape({
    bisnis_name: yup
        .string()
        .required('Harap mengisi Nama Bisnis')
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
    full_name: yup
        .string()
        .required('Harap mengisi Nama Lengkap')
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
    phone: yup
        .string()
        .required('Harap mengisi No. Handphone')
        .min(7, 'Masukan minimal 7 angka'),
    // levelorder: yup.string().required("Pilih minimal 1 level order"),
    product: yup.array().required('Harap memilih Produk').min(1, 'Harap memilih minimal 1 Produk'),
    channel: yup.array().required('Harap memilih Platform').min(1, 'Harap memilih minimal 1 Platform'),
});

function EditProfile({ }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { client_id } = useSelector((state) => state.auth.user);

    const {
        control,
        handleSubmit,
        clearErrors,
        formState: { errors, isValid },
        setValue,
        setError
    } = useForm({ mode: 'all', resolver: yupResolver(schema) });

    const [loadingButton, setLoadingButton] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoadingButton(true);
            const requestDataBody = {
                'client': {
                    'id': client_id,
                    'name': data?.bisnis_name,
                    'full_name': data?.full_name,
                    'phone': data?.phone,
                    'level_order': data?.levelorder
                },
                'product_category': data?.product,
                'channel_category': data?.channel
            };
            const response = await updateDetailProfile(requestDataBody, client_id);
            if (response?.status === 200) {
                await UseDelay(500);
                setIsSuccess(true);
                const res = await getUser();
                dispatch(setUser(res.data.user));
                await UseDelay(2000);
                router.push('/dashboard');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingButton(false);
        }
    };


    const fetchDataDetail = async (id) => {
        try {
            const response = await getDetailUser(id);
            const shorterResponse = response?.data;
            setValue('full_name', shorterResponse?.client?.full_name);
            setValue('bisnis_name', shorterResponse?.client?.name);
            setValue('phone', shorterResponse?.client?.phone);
            setValue('email', shorterResponse?.client?.email);
            setValue('product', shorterResponse?.product_category);
            setValue('levelorder', shorterResponse?.client?.level_order);
            setValue('channel', shorterResponse?.channel_category);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDataDetail(client_id);
    }, [client_id]);

    return (
        <>
            <Head title="Edit Profile" />
            <Content>
                <div className="wrapper-bg-light">
                    <p className="text-style-header text-color-primary-text ">Informasi Bisnis</p>

                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Row xs="2" >
                            <Col xs="10" lg="6">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="full_name">
                                        Nama Lengkap<span className="text-color-danger">*</span>
                                    </Label>
                                    <Controller
                                        name="full_name"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <>
                                                    <Input
                                                        onChange={(event) =>
                                                            onChange(event?.target?.value)
                                                        }
                                                        value={value}
                                                        invalid={!!errors.full_name}
                                                        onFocus={() => {
                                                            clearErrors('full_name');
                                                        }}
                                                        {...field}
                                                        type="text"
                                                        className="field-input-border-primary shadow-none"
                                                        placeholder="Masukkan Nama Lengkap"
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
                                            {errors.full_name?.message}
                                        </span>
                                    </FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col xs="10" lg="6">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="bisnis_name">
                                        Nama Bisnis<span className="text-color-danger">*</span>
                                    </Label>
                                    <Controller
                                        name="bisnis_name"
                                        control={control}
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <>
                                                    <Input
                                                        onChange={(event) =>
                                                            onChange(event?.target?.value)
                                                        }
                                                        {...field}
                                                        value={value}
                                                        invalid={!!errors.bisnis_name}
                                                        onFocus={() => {
                                                            clearErrors('businessName');
                                                        }}
                                                        type="text"
                                                        className="field-input-border-primary shadow-none"
                                                        placeholder="Masukkan Nama Bisnis"
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
                                            {errors.bisnis_name?.message}
                                        </span>
                                    </FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col xs="10" lg="6">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="email">
                                        Email
                                    </Label>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        value={value}
                                                        className="field-input-border-primary shadow-none"
                                                        placeholder="Masukkan Email"
                                                        disabled
                                                    />
                                                </>
                                            );
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs="10" lg="6">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="phone">
                                        No Handphone<span className="text-color-danger">*</span>
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
                                                const checkingZeroFirstLetter = value?.startsWith('0') ? `${value.slice(1)}` : `${value}`;
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
                                                            onFocus={() => {
                                                                clearErrors('phone');
                                                            }}
                                                            invalid={!!errors.phone}
                                                            type="text"
                                                            className="field-input-border-primary shadow-none"
                                                            placeholder="Masukkan Nomor Handphone"
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
                        </Row>
                        <div className="divider-edit-profile" />
                        <p className="text-style-header text-color-primary-text" style={{ marginTop: '2rem', marginBottom: '2rem' }}>Detail Bisnis</p>
                        <Row xs="2" >
                            <Col xs="10" lg="4">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="name_sku" style={{ fontSize: 14 }}>
                                        Level Order
                                        <div className="text-style-sub-text-labels">Berapa perkiraan jumlah order perbulannya?</div>
                                    </Label>
                                    <Controller
                                        name="levelorder"
                                        control={control}
                                        render={({ field }) => {
                                            const { value, onChange } = field;
                                            return (
                                                <>
                                                    <DropdownOption
                                                        value={value}
                                                        options={getLevelOrder}
                                                        onChange={(event) => onChange(event?.target?.value)}
                                                        optionLabel={'name'}
                                                        placeholder={'Pilih level order'}
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
                                        </span>
                                    </FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col xs="10" lg="4">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="product" style={{ fontSize: 14 }}>
                                        Produk<span className="text-color-danger">*</span>
                                        <div className="text-style-sub-text-labels">Apa saja jenis produk yang kamu jual?</div>
                                    </Label>
                                    <Controller
                                        name="product"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <>
                                                    <MultiSelectOption
                                                        {...field}
                                                        option={getProduct}
                                                        onChange={(e) => {
                                                            onChange(e.value);
                                                        }}
                                                        display={'chip'}
                                                        optionLabel={'name'}
                                                        placeholder={'Pilih Product'}
                                                        className={errors.product ? 'p-invalid' : ''}
                                                    />
                                                </>
                                            );
                                        }}
                                    />
                                    <span
                                        className="text-danger position-absolute"
                                        style={{ fontSize: 12 }}
                                    >
                                        {errors.product?.message}
                                    </span>
                                </FormGroup>
                            </Col>
                            <Col xs="10" lg="4">
                                <FormGroup className="mb-4">
                                    <Label htmlFor="channel" style={{ fontSize: 14 }}>
                                        Platform<span className="text-color-danger">*</span>
                                        <div className="text-style-sub-text-labels">Dimana saja kamu menjual produk tersebut?</div>
                                    </Label>
                                    <Controller
                                        name="channel"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => {
                                            const { onChange, value } = field;

                                            return (
                                                <>
                                                    <MultiSelectOption
                                                        {...field}
                                                        option={getChannel}
                                                        onChange={(e) => {
                                                            onChange(e.value);
                                                        }}
                                                        className={errors.channel ? 'p-invalid' : ''}
                                                        display={'chip'}
                                                        optionLabel={'name'}
                                                        placeholder={'Pilih Platform'}
                                                    />
                                                </>
                                            );
                                        }}
                                    />
                                    <span
                                        className="text-danger position-absolute"
                                        style={{ fontSize: 12 }}
                                    >
                                        {errors.channel?.message}
                                    </span>
                                </FormGroup>
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
                                size="lg"
                                type={
                                    loadingButton || !isValid ? 'button' : 'submit'
                                }
                                disabled={!isValid}
                                color="primary"
                                className={`btn center shadow-none mt-5 ${!isValid ? 'btn-disabled' : 'btn-primary'}`}
                                style={{ height: 43, width: 180, fontSize: 14 }}
                            >
                                {loadingButton ? (
                                    <Spinner size="sm" color="light" />
                                ) : (
                                    'Simpan'
                                )}
                            </Button>
                        </div>
                    </Form>
                </div>
                {isSuccess && (
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
                            marginTop: '-125px',
                            height: '135px',
                        }}
                        title={'Berhasil Memperbarui Profil!'}
                        stylesCustomTitle={{
                            paddingTop: 0
                        }}
                        singleButtonConfirmation={false}
                        textSingleButton={''}
                    />
                )}
            </Content>
        </>
    );
}

export default EditProfile;