// //next
// import Image from "next/image";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// //component
// import { Head, ModalConfirm } from "@/components";
// import { Button } from "@/components";
// import { FormInput } from "@/components/atoms/form-input";

// //layout
// import Content from "@/layout/content/Content";

// //third party
// import * as yup from "yup";
// import { useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import {
//   Button as ButtonConnect,
//   Col,
//   Form,
//   FormFeedback,
//   FormGroup,
//   Input,
//   Label,
//   Row,
//   Spinner,
// } from "reactstrap";

// //utils
// import UseCurrencyInput from "@/utils/useCurrencyInput";

// //assets
// import ilustrationCamera from "@/assets/images/illustration/ilustration-camera.svg";
// import ilustrationNoData from "@/assets/images/illustration/ilustration-nodata.svg";
// import ilustrationClicked from "@/assets/images/illustration/ilustration-card-clicked.svg";
// import successGif from "@/assets/gift/success-create-sku.gif";
// import verificationYesNo from "@/assets/gift/verification-yes-no.gif";

// //api
// import {
//   changeInfoBundling,
//   createBundling,
//   createSingle,
//   getDetailBundling,
//   getDetailMasterSku,
//   getMasterSku,
//   updateMasterSku,
// } from "@/services/master";
// import { handleErrorFormMasterSku } from "@/utils/errorsHandle";
// import { handleInputNumeric } from "@/utils/handleInput";
// import AddBundlingSku from "@/components/organism/master-sku/add-bundling-sku";
// import { IconTrashOutlined } from "@/assets/images/icon/trash-outlined";
// import SyncProductStore from "@/layout/master-sku/sync-product-store"

// import watchImage from "@/assets/images/dummy/watch.svg";
// import { IconCircleClose } from "@/assets/images/icon/circle-close";
// import { ProductSku } from "@/components/organism";
// import { ProductListingProps } from "@/utils/type/product";

// const schema = yup.object().shape({
//   name_sku: yup
//     .string()
//     .required("Harap isi Nama SKU")
//     .max(255, "Nama SKU maksimal 255 character")
//     .transform((value) => value.trim()),
//   code_sku: yup
//     .string()
//     .required("Harap isi Kode SKU")
//     .max(50, "Code SKU maksimal 50 character")
//     .transform((value) => value.trim()),
//   reference_price: yup
//     .string()
//     .nullable()
//     .transform((defaultValue, valueChange) =>
//       defaultValue === "" ? null : valueChange
//     )
//     .max(15, "Harga Referensi maksimal 12 character"),
//   product_weight: yup
//     .string()
//     .nullable()
//     .transform((defaultValue, valueChange) =>
//       defaultValue === "" ? null : valueChange
//     )
//     .max(8, "Berat Produk maksimal 8 character"),
//   product_length: yup
//     .string()
//     .max(8, "Panjang Produk maksimal 8 character")
//     .transform((value) => value.trim()),
//   product_width: yup
//     .string()
//     .max(8, "Lebar Produk maksimal 8 character")
//     .transform((value) => value.trim()),
//   product_height: yup
//     .string()
//     .max(8, "Tinggi Produk maksimal 8 character")
//     .transform((value) => value.trim()),
// });

// function FormMasterSKU({ }) {
//   const textSuccesCreate = "Berhasil Menambahkan Master SKU Bundling!";
//   const textSuccesEdit = "Berhasil Memperbarui Master SKU Bundling!";

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const actionParams = searchParams.get("action");
//   const idSearch = searchParams.get("id");

//   // redux
//   const { user } = useSelector((state) => state.auth);

//   const [textTypeAction, setTextTypeAction] = useState("");
//   const [isDisabledButton, setIsDisabledButton] = useState(true);
//   const [modalConfirmation, setModalConfirmation] = useState(false);
//   const [modalSucces, setModalSucces] = useState(false);
//   const [loadingButton, setLoadingButton] = useState(false);
//   const [temporaryDataEdit, setTemporaryDataEdit] = useState({});
//   const [isForm, setIsForm] = useState(true);
//   const [selectedArrValues, setSelectedArrValues] = useState([]);
//   const [tempSelectedArrValues, setTempSelectedArrValues] = useState([]);
//   const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
//   const [quantityValues, setQuantityValues] = useState({});
//   const [placeHolderNull, setIsPlaceHolderNull] = useState({
//     product_weight: true,
//     product_length: true,
//     product_width: true,
//     product_height: true,
//   });
//   const [listItem, setListItem] = useState([]);
//   const [pageInfo, setPageInfo] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [paginationModel, setPaginationModel] = useState({ page: 1, size: 10 });
//   const [selectedPageSize, setSelectedPageSize] = useState(10);
//   const [selectedSearchOption, setSelectedSearchOption] = useState("name");
//   const [search, setSearch] = useState("");
//   const [comparisonData, setComparisonData] = useState({})
//   const [selectedCheckboxesId, setSelectedCheckboxesId] = useState([])
//   const [comparisonDataArr, setComparisonDataArr] = useState([])

//   const [listSyncProduct, setListSyncProduct] = useState<ProductListingProps[] | null>(null);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     setError,
//     clearErrors,
//     trigger,
//     setValue,
//   } = useForm({
//     mode: "onBlur",
//     resolver: yupResolver(schema),
//   });

//   const [
//     showNameSku,
//     showCodeSku,
//     showProductHeight,
//     showProductLength,
//     showProductWeight,
//     showProductWidth,
//     showReferenceNumber,
//   ] = watch([
//     "name_sku",
//     "code_sku",
//     "product_height",
//     "product_length",
//     "product_weight",
//     "product_width",
//     "reference_price",
//   ]);
//   const isObjectErrorNull = Object.keys(errors).length === 0;

//   const checkTypeAction = (action) => {
//     switch (action) {
//       case "add":
//         return setTextTypeAction("Tambah Bundling SKU");
//       case "edit":
//         return setTextTypeAction("Detail Master SKU");
//       default:
//         return setTextTypeAction("");
//     }
//   };

//   const handledimensionFill = () => {
//     if (
//       showProductLength?.length > 0 ||
//       showProductWidth?.length > 0 ||
//       showProductHeight?.length > 0
//     ) {
//       if (!showProductHeight) {
//         setError("product_height", {
//           type: "manual",
//           message: "Harap mengisi Tinggi Produk",
//         });
//       } else {
//         clearErrors("product_height");
//       }
//       if (!showProductWidth) {
//         setError("product_width", {
//           type: "manual",
//           message: "Harap mengisi Lebar Produk",
//         });
//       } else {
//         clearErrors("product_width");
//       }
//       if (!showProductLength) {
//         setError("product_length", {
//           type: "manual",
//           message: "Harap mengisi Panjang Produk",
//         });
//       } else {
//         clearErrors("product_length");
//       }
//     } else {
//       clearErrors("product_height");
//       clearErrors("product_width");
//       clearErrors("product_length");
//     }
//   };

//   useEffect(() => {
//     handledimensionFill();
//   }, [
//     showProductWidth?.length,
//     showProductHeight?.length,
//     showProductLength?.length,
//   ]);

//   const handleBackButton = () => {
//     if (actionParams === "add") {
//       if (
//         showNameSku?.length > 0 ||
//         showCodeSku?.length > 0 ||
//         showProductHeight?.length > 0 ||
//         showProductLength?.length > 0 ||
//         showProductWeight?.length > 0 ||
//         showProductWidth?.length > 0 ||
//         showReferenceNumber?.length > 0 ||
//         selectedCheckboxes?.length > 0
//       )
//         return clearErrors(), setModalConfirmation(true);
//       return router.push("/master-sku");
//     } else {
//       if (
//         showNameSku?.length !== temporaryDataEdit?.name?.length ||
//         showCodeSku?.length !== temporaryDataEdit?.sku?.length ||
//         (showProductWeight?.length !=
//           temporaryDataEdit?.weight?.toString()?.length &&
//           showProductWeight.length > 0) ||
//         (showReferenceNumber?.length !=
//           temporaryDataEdit?.reference_price?.toString()?.length &&
//           showReferenceNumber.length > 0) ||
//         (showProductHeight?.length !=
//           temporaryDataEdit?.height?.toString()?.length &&
//           showProductHeight.length > 0) ||
//         (showProductLength?.length !=
//           temporaryDataEdit?.length?.toString()?.length &&
//           showProductLength.length > 0) ||
//         (showProductWidth?.length !=
//           temporaryDataEdit?.width?.toString()?.length &&
//           showProductWidth.length > 0)
//       )
//         return clearErrors, setModalConfirmation(true);
//       return router.push("/master-sku");
//     }
//   };

//   const handleClickCancelled = () => setModalConfirmation(false);
//   const handleClickYes = () => router.push("/master-sku");

//   const fetchDataDetail = async (id) => {
//     try {
//       const response = await getDetailBundling(id);
//       const dataResponse = response?.data?.bundling;
//       const dataResponseArr = response?.data;

//       if (response?.status === 200) {
//         setTemporaryDataEdit(dataResponse);
//         setValue("name_sku", dataResponse?.name);
//         setValue("code_sku", dataResponse?.sku);
//         setValue("reference_price", dataResponse?.reference_price?.toString());
//         dataResponse?.weight !== 0
//           ? setValue("product_weight", dataResponse?.weight?.toString())
//           : setIsPlaceHolderNull((prevState) => ({
//             ...prevState,
//             product_weight: false,
//           }));
//         dataResponse?.length !== 0
//           ? setValue("product_length", dataResponse?.length?.toString())
//           : setIsPlaceHolderNull((prevState) => ({
//             ...prevState,
//             product_length: false,
//           }));
//         dataResponse?.width !== 0
//           ? setValue("product_width", dataResponse?.width?.toString())
//           : setIsPlaceHolderNull((prevState) => ({
//             ...prevState,
//             product_width: false,
//           }));
//         dataResponse?.height !== 0
//           ? setValue("product_height", dataResponse?.height?.toString())
//           : setIsPlaceHolderNull((prevState) => ({
//             ...prevState,
//             product_height: false,
//           }));
//         setSelectedCheckboxes(dataResponseArr?.items);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (typeof router.query.id !== "undefined" && router.query.id !== null) {
//       fetchDataDetail(idSearch);
//     }
//   }, [router.query.id]);

//   const fetchGetMasterSku = async () => {
//     try {
//       const res = await getMasterSku({
//         client_id: user?.client_id,
//         type: "single",
//         sku: selectedSearchOption === "sku" ? search : null,
//         name: selectedSearchOption === "name" ? search : null,
//         sort_by: null,
//         sort_type: null,
//         page: paginationModel.page,
//         size: paginationModel.size,
//       });
//       const newArray = res?.data?.products?.map((item) => {
//         return { ...item, id: String(item.id) };
//       });
//       setPageInfo(res?.data?.page_info);
//       setListItem(newArray);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // handle page size change
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const handlePageSizeChange = (e) => {
//     const newSize = parseInt(e.target.value, 10);
//     setSelectedPageSize(newSize);
//     setPaginationModel((prev) => ({ ...prev, size: newSize, page: 1 }));
//     setCurrentPage(1);
//   };

//   // handle page change
//   const handlePageChange = (pageNumber) => {
//     paginate(pageNumber);
//     setPaginationModel((prev) => ({ ...prev, page: pageNumber }));
//   };

//   // handle enter search
//   const handleSearchEnter = (e) => {
//     if (e.key === "Enter") {
//       fetchGetMasterSku();
//     }
//   };

//   useEffect(() => {
//     fetchGetMasterSku();
//   }, [currentPage, paginationModel.page, paginationModel.size]);

//   const handleRemoveFromList = (id) => {
//     const removeValue = selectedCheckboxes.filter((item) => item?.id !== id);
//     const removeValueId = selectedCheckboxesId.filter(item => item !== id)
//     delete quantityValues[id];
//     setValue(id, "");
//     setSelectedCheckboxes(removeValue);
//     setSelectedCheckboxesId(removeValueId);
//   };

//   const handleCheckboxChange = (value) => {
//     if (selectedCheckboxes.includes(value)) {
//       return (
//         setSelectedCheckboxes(
//           selectedCheckboxes.filter((item) => item !== value)
//         ),
//         setSelectedCheckboxesId(selectedCheckboxesId.filter((item) => item !== value?.id)),
//         setValue(value?.id, "")
//       );
//     }
//     return (
//       setSelectedCheckboxesId([...selectedCheckboxesId, value?.id]),
//       setSelectedCheckboxes([...selectedCheckboxes, value]),
//       setValue(value?.id, "")
//     );
//   };

//   const handleChangeValue = (event, name) => {
//     const { value } = event.target;
//     const numericValue = value.startsWith("0")
//       ? ""
//       : value.replace(/[^0-9]/g, "");
//     setQuantityValues({
//       ...quantityValues,
//       [name]: Number(value),
//     });

//     if (numericValue == "" || numericValue == 0) {
//       setError(name, {
//         type: "manual",
//         message: "Jumlah SKU Minimal 1",
//       })
//       setValue(name, numericValue);
//     } else {
//       trigger(name);
//       setValue(name, numericValue);
//     }
//   };

//   const checkPrevious = () => {
//     const commonKeys = Object.keys(comparisonData).filter(key => quantityValues.hasOwnProperty(key));
//     return commonKeys.every(key => comparisonData[key] === quantityValues[key]);
//   }

//   const handleBackForm = () => {
//     if (!checkPrevious() || comparisonDataArr?.length !== 0 || Object.keys(comparisonData).length !== 0) {
//       setSelectedCheckboxes([])
//       setSelectedCheckboxesId([])
//       setQuantityValues(prev => {
//         return { ...prev, ...comparisonData };
//       });
//       Object.keys(comparisonData).forEach((key) => {
//         setValue(key, Number(comparisonData[key]));
//       })
//       const uniqueItems = comparisonDataArr.filter(comparedItem => !selectedCheckboxes.some(selectedCheckbox => selectedCheckbox.id === comparedItem.id));
//       setSelectedCheckboxesId((prev) => Array.from(new Set([...comparisonDataArr.map((idItem) => idItem?.id)])));
//       setSelectedCheckboxes(comparisonDataArr)
//       setIsForm((prev) => !prev);
//     } else {
//       setIsForm((prev) => !prev);
//       setSelectedCheckboxes([]);
//       setSelectedCheckboxesId([])
//       setQuantityValues({});
//     }
//   };

//   const valuesQuantity = Object.values(quantityValues);
//   const sumQuantity = valuesQuantity.reduce((acc, value) => acc + value, 0);
//   const hasZeroValue = Object.values(quantityValues).includes(0);
//   const lengthObject =
//     Object.keys(quantityValues).length === selectedCheckboxes.length
//       ? true
//       : false;

//   const checkDisableButton = () => {
//     if (actionParams === "add") {
//       if (
//         isObjectErrorNull &&
//         showNameSku &&
//         showCodeSku &&
//         selectedCheckboxes?.length > 0 &&
//         lengthObject &&
//         !hasZeroValue &&
//         sumQuantity >= 2
//       )
//         return setIsDisabledButton(false);
//       return setIsDisabledButton(true);
//     } else {
//       if ((showNameSku !== temporaryDataEdit?.name ||
//         showCodeSku !== temporaryDataEdit?.sku ||
//         (showProductWeight != temporaryDataEdit?.weight?.toString() && showProductWeight?.length > 0) ||
//         (showReferenceNumber != temporaryDataEdit?.reference_price?.toString() &&
//           showReferenceNumber.length > 0) ||
//         (showProductHeight != temporaryDataEdit?.height?.toString() &&
//           showProductHeight.length > 0) ||
//         (showProductLength != temporaryDataEdit?.length?.toString() &&
//           showProductLength.length > 0) ||
//         (showProductWidth != temporaryDataEdit?.width?.toString() &&
//           showProductWidth.length > 0)) && isObjectErrorNull
//       ) return setIsDisabledButton(false);
//       return setIsDisabledButton(true);
//     }
//   };

//   const onSubmit = async (data) => {
//     try {
//       setLoadingButton(true);
//       const currencyPriceToNumber =
//         data?.reference_price !== null
//           ? parseInt(data?.reference_price.replaceAll(".", ""))
//           : 0;

//       const bundling_detail_arr = Object.entries(quantityValues).map(
//         ([productId, quantity]) => ({
//           product_id: parseInt(productId),
//           quantity: quantity,
//         })
//       );

//       const requestBody = {
//         bundling_name: data?.name_sku,
//         sku: data?.code_sku,
//         barcode: data?.code_sku,
//         publish_price: currencyPriceToNumber,
//         weight_in_gram: parseInt(data?.product_weight ?? 0),
//         client_id: user?.client_id,
//         dimension: {
//           length: Boolean(data?.product_length)
//             ? parseInt(data?.product_length)
//             : 0,
//           width: Boolean(data?.product_width)
//             ? parseInt(data?.product_width)
//             : 0,
//           height: Boolean(data?.product_height)
//             ? parseInt(data?.product_height)
//             : 0,
//         },
//         bundling_detail: bundling_detail_arr,
//       };

//       actionParams === "edit" && delete requestBody?.bundling_detail;

//       const url =
//         actionParams === "add"
//           ? createBundling(requestBody)
//           : changeInfoBundling(idSearch, requestBody);
//       const response = await url;
//       if (response?.status === 201 || response?.status === 200) {
//         setModalSucces(true);
//         await UseDelay(2000);
//         router.push("/master-sku");
//       }
//     } catch (error) {
//       handleErrorFormMasterSku(error, data, setError);
//     } finally {
//       setLoadingButton(false);
//     }
//   };

//   const handleSubmitListBundling = () => {
//     setComparisonData(quantityValues)
//     setComparisonDataArr(selectedCheckboxes)
//     setIsForm((prev) => !prev)
//   }

//   const handleClickActivityHistory = (id) => {
//     router.push({
//       pathname: "/master-sku/activity-history",
//       query: { id },
//     });
//   };

//   const renderForm = () => (
//     <Form noValidate onSubmit={handleSubmit(onSubmit)}>
      
//     </Form>
//   )

//   useEffect(() => {
//     if (typeof router.query.id !== "undefined" && router.query.id !== null) {
//       fetchDataDetail(idSearch);
//     }
//   }, [router.query.id]);

//   useEffect(() => {
//     checkDisableButton();
//   }, [
//     isObjectErrorNull,
//     showNameSku,
//     showCodeSku,
//     selectedCheckboxes,
//     lengthObject,
//     hasZeroValue,
//     sumQuantity,
//     actionParams,
//     showProductHeight,
//     showProductLength,
//     showProductWeight,
//     showProductWidth,
//     showReferenceNumber
//   ]);

//   useEffect(() => {
//     if (actionParams) return checkTypeAction(actionParams);
//   }, [actionParams]);

//   useEffect(() => {
//     checkPrevious()
//   }, [quantityValues, comparisonData])

//   return (
//     <>
//       <Head title="Master SKU" />
//       <Content>
//         {isForm ? (
//           <Form noValidate onSubmit={handleSubmit(onSubmit)}>
//             <div className="wrapper-bg-light">
//               <p className="text-header-sm">
//                 MASTER SKU /{" "}
//                 <span className="text-header-sm-seconds">{textTypeAction}</span>
//               </p>
//               <p className="text-header-xl">{textTypeAction}</p>
//               <Row>
//                 <Col xs="4">
//                   <div className="wrapper-gif-camera">
//                     <div>
//                       <Image src={ilustrationCamera} height={200} width={200} />
//                     </div>
//                   </div>
//                 </Col>
//                 <Col xs="8">
//                   <FormGroup className="mb-4">
//                     <Label htmlFor="name_sku">
//                       Nama SKU<span style={{ color: "#FF6E5D" }}>*</span>
//                     </Label>
//                     <FormInput
//                       invalid={Boolean(errors?.name_sku)}
//                       name="name_sku"
//                       register={register}
//                       placeholder="Masukkan Nama SKU"
//                       onChange={(e) => {
//                         setValue("name_sku", e.target.value);
//                         trigger("name_sku");
//                       }}
//                       maxLength={255}
//                     />
//                     <FormFeedback>
//                       <span
//                         className="text-danger position-absolute"
//                         style={{ fontSize: 12 }}
//                       >
//                         {errors["name_sku"]?.message}
//                       </span>
//                     </FormFeedback>
//                   </FormGroup>
//                   <FormGroup className="mb-4">
//                     <Label htmlFor="code_sku">
//                       Kode SKU<span style={{ color: "#FF6E5D" }}>*</span>
//                     </Label>
//                     <FormInput
//                       invalid={Boolean(errors?.code_sku)}
//                       register={register}
//                       name="code_sku"
//                       placeholder="Masukkan Kode SKU"
//                       onChange={(e) => {
//                         setValue("code_sku", e.target.value);
//                         trigger("code_sku");
//                       }}
//                       maxLength={50}
//                       disabled={actionParams === "edit"}
//                     />
//                     <FormFeedback>
//                       <span
//                         className="text-danger position-absolute"
//                         style={{ fontSize: 12 }}
//                       >
//                         {errors["code_sku"]?.message}
//                       </span>
//                     </FormFeedback>
//                   </FormGroup>
//                   <FormGroup className="mb-4">
//                     <Label htmlFor="reference_price">Harga Referensi</Label>
//                     <div className="form-control-wrap">
//                       <div className="form-icon form-icon-left">
//                         <span style={{ fontSize: 12 }}>Rp</span>
//                       </div>
//                       <FormInput
//                         invalid={Boolean(errors?.reference_price)}
//                         register={register}
//                         name="reference_price"
//                         placeholder="Masukkan Harga Referensi"
//                         onChange={(e) => {
//                           UseCurrencyInput(e, setValue, "reference_price", 12);
//                           trigger("reference_price");
//                         }}
//                         maxLength={15}
//                       />
//                       <FormFeedback>
//                         <span
//                           className="text-danger position-absolute"
//                           style={{ fontSize: 12 }}
//                         >
//                           {errors["reference_price"]?.message}
//                         </span>
//                       </FormFeedback>
//                     </div>
//                   </FormGroup>
//                 </Col>
//               </Row>
//               <Row className="mt-3">
//                 <Col sm="12" lg="3">
//                   <FormGroup>
//                     <Label htmlFor="product_weight" className="form-label">
//                       Berat Produk
//                     </Label>
//                     <div className="form-control-wrap">
//                       <div className="form-icon form-icon-right">
//                         <span style={{ fontSize: 12 }}>gram</span>
//                       </div>
//                       <FormInput
//                         invalid={Boolean(errors?.product_weight)}
//                         placeholder={
//                           placeHolderNull?.product_weight
//                             ? "Masukkan Berat Produk"
//                             : "0"
//                         }
//                         register={register}
//                         name="product_weight"
//                         onChange={(e) => {
//                           handleInputNumeric(e, setValue, "product_weight");
//                           trigger("product_weight");
//                         }}
//                         maxLength={8}
//                       />
//                       <FormFeedback>
//                         <span
//                           className="text-danger position-absolute"
//                           style={{ fontSize: 12 }}
//                         >
//                           {errors["product_weight"]?.message}
//                         </span>
//                       </FormFeedback>
//                     </div>
//                   </FormGroup>
//                 </Col>
//                 <Col sm="12" lg="3">
//                   <FormGroup>
//                     <Label htmlFor="product_length" className="form-label">
//                       Panjang Produk
//                     </Label>
//                     <div className="form-control-wrap">
//                       <div className="form-icon form-icon-right">
//                         <span style={{ fontSize: 12 }}>cm</span>
//                       </div>
//                       <FormInput
//                         invalid={Boolean(errors?.product_length)}
//                         placeholder={
//                           placeHolderNull?.product_length
//                             ? "Masukkan Panjang Produk"
//                             : "0"
//                         }
//                         register={register}
//                         name="product_length"
//                         onChange={(e) => {
//                           handleInputNumeric(e, setValue, "product_length");
//                         }}
//                         onBlur={() => handledimensionFill()}
//                         maxLength={8}
//                       />
//                       <FormFeedback>
//                         <span
//                           className="text-danger position-absolute"
//                           style={{ fontSize: 12 }}
//                         >
//                           {errors["product_length"]?.message}
//                         </span>
//                       </FormFeedback>
//                     </div>
//                   </FormGroup>
//                 </Col>
//                 <Col sm="12" lg="3">
//                   <FormGroup>
//                     <Label htmlFor="product_width" className="form-label">
//                       Lebar Produk
//                     </Label>
//                     <div className="form-control-wrap">
//                       <div className="form-icon form-icon-right">
//                         <span style={{ fontSize: 12 }}>cm</span>
//                       </div>
//                       <FormInput
//                         invalid={Boolean(errors?.product_width)}
//                         placeholder={
//                           placeHolderNull?.product_width
//                             ? "Masukkan Lebar Produk"
//                             : "0"
//                         }
//                         register={register}
//                         name="product_width"
//                         onChange={(e) => {
//                           handleInputNumeric(e, setValue, "product_width");
//                         }}
//                         onBlur={() => handledimensionFill()}
//                         maxLength={8}
//                       />
//                       <FormFeedback>
//                         <span
//                           className="text-danger position-absolute"
//                           style={{ fontSize: 12 }}
//                         >
//                           {errors["product_width"]?.message}
//                         </span>
//                       </FormFeedback>
//                     </div>
//                   </FormGroup>
//                 </Col>
//                 <Col sm="12" lg="3">
//                   <FormGroup>
//                     <Label htmlFor="product_height" className="form-label">
//                       Tinggi Produk
//                     </Label>
//                     <div className="form-control-wrap">
//                       <div className="form-icon form-icon-right">
//                         <span style={{ fontSize: 12 }}>cm</span>
//                       </div>
//                       <FormInput
//                         placeholder={
//                           placeHolderNull?.product_height
//                             ? "Masukkan Tinggi Produk"
//                             : "0"
//                         }
//                         register={register}
//                         name="product_height"
//                         invalid={Boolean(errors?.product_height)}
//                         onChange={(e) => {
//                           handleInputNumeric(e, setValue, "product_height");
//                         }}
//                         onBlur={() => handledimensionFill()}
//                         maxLength={8}
//                       />
//                       <FormFeedback>
//                         <span
//                           className="text-danger position-absolute"
//                           style={{ fontSize: 12 }}
//                         >
//                           {errors["product_height"]?.message}
//                         </span>
//                       </FormFeedback>
//                     </div>
//                   </FormGroup>
//                 </Col>
//               </Row>

//               <div style={{ marginTop: 40 }}>
//                 <p className="text-header-sm" style={{ fontSize: 14 }}>
//                   Tambahkan Single SKU ke Bundling SKU
//                   <span style={{ color: "#FF6E5D" }}>*</span>
//                 </p>
//                 <p className="text-sub-connect-product" style={{ fontSize: 12 }}>
//                   Tambahkan beberapa Single SKU untuk membuat Bundling SKU
//                 </p>
//                 {actionParams === "add" ? (
//                   <div className="border-connect-product">
//                     {selectedCheckboxes.length > 0 ? (
//                       <div className="row g-2">
//                         <div className="col-lg-4 col-sm-12">
//                           <div
//                             style={{
//                               border:
//                                 "1px dashed var(--Colors-Blue-100, #203864)",
//                               display: "flex",
//                               padding: "16px 24px",
//                               borderRadius: 4,
//                               justifyContent: "space-between",
//                               height: 114,
//                             }}
//                           >
//                             <div
//                               style={{
//                                 gap: 20,
//                               }}
//                             >
//                               <div style={{ display: "flex" }}>
//                                 <Image
//                                   src={ilustrationClicked}
//                                   width={50}
//                                   height={43}
//                                   alt="illustration"
//                                 />
//                                 <p
//                                   className="text-header-sm"
//                                   style={{
//                                     textAlign: "start",
//                                     fontSize: 14,
//                                     paddingLeft: 10,
//                                   }}
//                                 >
//                                   Tambah Hubungan Produk Toko
//                                 </p>
//                               </div>
//                               <p
//                                 style={{ textAlign: "start", fontWeight: 400, maxWidth: '90%' }}
//                                 className="text-header-sm text-truncate"
//                               >
//                                 Klik tombol ”+” untuk menambahkan
//                               </p>
//                             </div>
//                             <div onClick={() => {
//                               setComparisonData(quantityValues)
//                               setComparisonDataArr(selectedCheckboxes)
//                               handleSubmitListBundling()
//                             }
//                             }>
//                               <IconCircleClose />
//                             </div>
//                           </div>
//                         </div>
//                         {selectedCheckboxes.map((option) => (
//                           <div className="col-lg-4 col-sm-12" key={option.id}>
//                             <div
//                               style={{
//                                 padding: "10px 16px",
//                                 border:
//                                   "1px solid var(--Text-Black-Medium, #E9E9EA)",
//                                 height: 114,
//                                 borderRadius: 4,
//                               }}
//                             >
//                               <div style={{ display: 'flex' }}>
//                                 <div style={{ display: 'flex', gap: 20, width: '80%' }}>
//                                   <Image
//                                     width={40}
//                                     height={40}
//                                     src={watchImage}
//                                     alt="Image Product"
//                                   />
//                                   <p
//                                     className="text-header-bold text-truncate"
//                                     style={{
//                                       marginBottom: 8,
//                                       textAlign: "start",
//                                       maxWidth: '80%'
//                                     }}
//                                   >
//                                     {option?.name}
//                                   </p>
//                                 </div>
//                                 <div style={{ width: '20%' }}>
//                                   <span
//                                     onClick={() =>
//                                       handleRemoveFromList(option?.id)
//                                     }
//                                   >
//                                     <IconTrashOutlined />
//                                   </span>
//                                 </div>
//                               </div>
//                               <div style={{ display: 'flex' }}>
//                                 <div style={{ width: '50%' }}>
//                                   <p className="text-header-text-sub-connect-product text-truncate" style={{ marginTop: 16, maxWidth: '80%' }}>
//                                     Kode SKU: {option?.sku}
//                                   </p>
//                                 </div>
//                                 <div style={{ width: '50%' }}>
//                                   <FormGroup row>
//                                     <Label
//                                       for="exampleEmail"
//                                       lg={3}
//                                       sm={3}
//                                       style={{
//                                         display: "flex",
//                                         justifyContent: "end",
//                                         fontSize: 12,
//                                         padding: 0,
//                                         alignSelf: "end",
//                                       }}
//                                     >
//                                       Jumlah
//                                       <span style={{ color: "#FF6E5D" }}>
//                                         *
//                                       </span>
//                                     </Label>
//                                     <Col lg={9} sm={9}>
//                                       <FormInput
//                                         name={option.id}
//                                         register={register}
//                                         invalid={errors?.[option.id]}
//                                         onChange={(e) => {
//                                           handleChangeValue(e, option.id);
//                                         }}
//                                         onBlur={(e) => handleChangeValue(e, option.id)}
//                                       />
//                                     </Col>
//                                     {errors?.[option.id] && (
//                                       <span
//                                         style={{ fontSize: 10 }}
//                                         className="mt-1 text-danger"
//                                       >
//                                         {errors?.[option.id].message}
//                                       </span>
//                                     )}
//                                   </FormGroup>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <>
//                         <Image
//                           src={ilustrationNoData}
//                           width={150}
//                           height={100}
//                           alt="illustration"
//                         />
//                         <p className="text-header-text-sub-connect-product">
//                           Kamu belum menambahkan SKU Toko apa pun ke Master
//                           Produk ini
//                         </p>
//                         <ButtonConnect
//                           onClick={handleSubmitListBundling}
//                           color="primary"
//                           style={{ height: 43, fontSize: 14 }}
//                         >
//                           Tambah Single SKU
//                         </ButtonConnect>
//                       </>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="border-connect-product">
//                     <div className="row g-2">
//                       {selectedCheckboxes.map((item, index) => (
//                         <div key={index} className="col-lg-4 col-sm-12" >
//                           <div
//                             style={{
//                               padding: "10px 16px",
//                               border:
//                                 "1px solid var(--Text-Black-Medium, #E9E9EA)",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                               }}
//                             >
//                               <div style={{ marginRight: 10 }}>
//                                 <Image
//                                   width={40}
//                                   height={40}
//                                   src={watchImage}
//                                   alt="Image Product"
//                                   style={{ minWidth: 44, minHeight: 44 }}
//                                 />
//                               </div>
//                               <div style={{ marginRight: 8, width: '100%' }}>
//                                 <p
//                                   className="text-header-bold text-truncate"
//                                   style={{
//                                     marginBottom: 8,
//                                     textAlign: "start",
//                                     fontWeight: 700,
//                                     maxWidth: '80%'
//                                   }}
//                                 >
//                                   {item?.name}
//                                 </p>
//                               </div>
//                             </div>
//                             <div
//                               style={{
//                                 display: "flex",
//                                 justifyContent: "space-between",
//                               }}
//                             >
//                               <p className="text-header-text-sub-connect-product text-truncate" style={{ maxWidth: '70%' }}>
//                                 Kode SKU : {item?.sku}
//                               </p>
//                               <p className="text-header-text-sub-connect-product">
//                                 Jumlah : {item?.quantity}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {actionParams === "add" && (
//                   <>
//                     <p
//                       className="text-sub-connect-product"
//                       style={{ margin: 0, fontSize: 12 }}
//                     >
//                       Total Quantity : {Boolean(sumQuantity) ? sumQuantity : 0}
//                     </p>
//                     {(sumQuantity < 2) && (selectedCheckboxes?.length > 0) && (
//                       <span
//                         style={{ fontSize: 12 }}
//                         className={`mt-1 text-danger position-absolute d-block`}
//                       >
//                         Total quantity Single SKU minimal 2
//                       </span>
//                     )}
//                   </>
//                 )}
//               </div>

//               <div style={{ marginTop: 40 }}>
//                 <p className="text-header-sm" style={{ fontSize: 14 }}>
//                   Hubungkan dengan Produk Toko
//                 </p>
//                 <p className="text-sub-connect-product" style={{ fontSize: 12 }}>
//                   Hubungkan Master SKU kamu dari Daftar Produk sehingga kamu
//                   dapat mengintegrasikan stok toko kamu
//                 </p>
//                 <ProductSku
//                   list={listSyncProduct}
//                   border={'dashed'}
//                   onAddProduct={()=> {}}
//                   onDeleteProduct={()=> {}}
//                 />
//                 {/* <div className="border-connect-product">
//                   <Image
//                     src={ilustrationNoData}
//                     width={150}
//                     height={100}
//                     alt="illustration"
//                   />
//                   <p className="text-header-text-sub-connect-product">
//                     Kamu belum menghubungkan SKU Toko apa pun ke Master Produk
//                     ini
//                   </p>
//                   <ButtonConnect
//                     disabled
//                     className="btn-disabled"
//                     color="primary"
//                     style={{ height: 43 }}
//                   >
//                     Hubungkan Produk Toko
//                   </ButtonConnect>
//                 </div> */}
//               </div>

//               <div
//                 className={`${typeof router.query.id !== "undefined" &&
//                   router.query.id !== null
//                   ? "d-block"
//                   : "d-none"
//                   }`}
//               >
//                 <Button
//                   type="button"
//                   onClick={() =>
//                     handleClickActivityHistory(idSearch)
//                   }
//                   className="p-0 mt-5 text-decoration-underline text-primary"
//                   style={{ fontSize: 12 }}
//                 >
//                   Lihat Riwayat Aktivitas
//                 </Button>

//                 <div
//                   className="d-flex justify-content-between align-items-center"
//                   style={{
//                     marginTop: 30,
//                   }}
//                 >
//                   <div className="d-flex gap-3">
//                     <p
//                       style={{ color: "#4C4F54", fontSize: 13, fontWeight: 700 }}
//                     >
//                       Waktu Dibuat:&nbsp;
//                       <span style={{ fontWeight: 100 }}>
//                         {temporaryDataEdit?.created_at ?? "-"}
//                       </span>
//                     </p>
//                     <p
//                       style={{ color: "#4C4F54", fontSize: 13, fontWeight: 700 }}
//                     >
//                       Terakhir Diperbarui:&nbsp;
//                       <span style={{ fontWeight: 100 }}>
//                         {temporaryDataEdit?.updated_at ?? "-"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>


//               <div
//                 style={{
//                   gap: 16,
//                   display: "flex",
//                   marginTop: 40,
//                   justifyContent: "end",
//                 }}
//               >
//                 <Button
//                   type="button"
//                   className={"justify-center"}
//                   style={{ height: 43, width: 180, fontSize: 14 }}
//                   onClick={handleBackButton}
//                 >
//                   Kembali
//                 </Button>
//                 <Button
//                   type="submit"
//                   disabled={isDisabledButton}
//                   className={`${isDisabledButton ? "btn-disabled" : "btn-primary"
//                     } justify-center`}
//                   color="primary"
//                   style={{ height: 43, width: 180, fontSize: 14 }}
//                 >
//                   {loadingButton ? (
//                     <Spinner size="sm" color="light" />
//                   ) : (
//                     "Simpan"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </Form>
//         ) : (
//           <>
//              <AddBundlingSku
//             tempSelectedArrValues={tempSelectedArrValues}
//             setTempSelectedArrValues={setTempSelectedArrValues}
//             checkboxOptions={listItem}
//             handleRemoveFromList={handleRemoveFromList}
//             handleBackForm={handleBackForm}
//             handleCheckboxChange={handleCheckboxChange}
//             selectedCheckboxes={selectedCheckboxes}
//             handleChangeValue={handleChangeValue}
//             errors={errors}
//             register={register}
//             quantityValues={sumQuantity}
//             simpanAction={handleSubmitListBundling}
//             quantityObject={quantityValues}
//             pageInfo={pageInfo}
//             selectedPageSize={selectedPageSize}
//             handlePageChange={handlePageChange}
//             currentPage={currentPage}
//             handlePageSizeChange={handlePageSizeChange}
//             setSearch={setSearch}
//             search={search}
//             handleSearchEnter={handleSearchEnter}
//             selectedSearchOption={selectedSearchOption}
//             setSelectedSearchOption={setSelectedSearchOption}
//             selectedCheckboxesId={selectedCheckboxesId}
//             setComparisonDataArr={setComparisonDataArr}
//             setComparisonData={setComparisonData}
//             comparisonDataArr={comparisonDataArr}
//           />
//             {/* <SyncProductStore
//               listSelected={listSyncProduct}
//               onSaveProduct={(value) => setListSyncProduct(value)}
//               onCancel={() => {}}
//             /> */}
//           </>
         
//         )}
//       </Content >

//       {modalConfirmation && (
//         <ModalConfirm
//           icon={verificationYesNo}
//           modalContentStyle={{ width: 350 }}
//           widthImage={350}
//           heightImage={320}
//           modalBodyStyle={{
//             borderTopLeftRadius: "60%",
//             borderTopRightRadius: "60%",
//             borderBottomLeftRadius: 6,
//             borderBottomRightRadius: 6,
//             marginTop: "-100px",
//             height: "185px",
//           }}
//           title={"Apakah Kamu Yakin?"}
//           subtitle={
//             "Jika kamu kembali, data yang telah kamu isi akan hilang dan tidak tersimpan"
//           }
//           buttonConfirmation
//           useTimer={false}
//           handleClickCancelled={handleClickCancelled}
//           handleClickYes={handleClickYes}
//         />
//       )
//       }

//       {
//         modalSucces && (
//           <ModalConfirm
//             icon={successGif}
//             widthImage={350}
//             heightImage={320}
//             modalContentStyle={{ width: 350 }}
//             modalBodyStyle={{
//               borderTopLeftRadius: "60%",
//               borderTopRightRadius: "60%",
//               borderBottomLeftRadius: 6,
//               borderBottomRightRadius: 6,
//               marginTop: "-100px",
//               height: "135px",
//             }}
//             title={actionParams === "add" ? textSuccesCreate : textSuccesEdit}
//           />
//         )
//       }
//     </>
//   );
// }

// export default FormMasterSKU;
