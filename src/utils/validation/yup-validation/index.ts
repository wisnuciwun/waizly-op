import * as yup from 'yup';

export const schemaInventoryTransfer = yup.object().shape({
    origin_warehouse: yup
      .string()
      .trim()
      .required('Harap mengisi Gudang Asal'),
    destination_warehouse: yup
      .string()
      .trim()
      .required('Harap mengisi Gudang Tujuan'),
    trasnfer_date: yup.string(),
    external_id: yup.string(),
    stock_source: yup
      .string()
      .trim()
      .required('Harap mengisi Sumber Stok'),
    note: yup.string(),
  });

export const schemaInventoryAdjustment = yup.object().shape({
    origin_warehouse: yup
      .string()
      .trim()
      .required('Harap mengisi Gudang Asal'),
    adjustment_date: yup.string(),
    external_id: yup.string(),
    stock_source: yup
      .string()
      .trim()
      .required('Harap mengisi Sumber Stok'),
    note: yup.string(),
  });

export const schemaSettingWerehouse = yup.object().shape({
  pic: yup
    .string()
    .required('Harap mengisi Nama Penanggung Jawab')
    .test(
      'no-leading-space',
      'Karakter pertama tidak boleh di awali dengan spasi',
      (value) => {
        if (value && /^\s/.test(value)) {
          return false;
        }

        return true;
      }
    ),
  phone: yup
    .string()
    .required('Harap mengisi No. Handphone Penanggung Jawab')
    .min(7, 'Masukan minimal 7 angka')
    .transform((value) => value.trim()),
  location_code: yup
    .string()
    .required('Harap mengisi Kode Gudang')
    .test(
      'no-leading-space',
      'Karakter pertama tidak boleh di awali dengan spasi',
      (value) => {
        if (value && /^\s/.test(value)) {
          return false;
        }

        return true;
      }
    ),
  location_name: yup
    .string()
    .required('Harap mengisi Nama Gudang')
    .test(
      'no-leading-space',
      'Karakter pertama tidak boleh di awali dengan spasi',
      (value) => {
        if (value && /^\s/.test(value)) {
          return false;
        }

        return true;
      }
    ),
  location_type: yup.string().required('Harap mengisi Tipe Gudang'),
  province_id: yup.string().required('Harap mengisi Provinsi'),
  city_id: yup.string().required('Harap mengisi Kabupaten/Kota'),
  district_id: yup.string().required('Harap mengisi Kecamatan'),
  sub_district_id: yup.string().required('Harap mengisi Kelurahan'),
  postal_code: yup
    .string()
    .required('Harap mengisi Kode Pos')
    .min(5, 'Masukan minimal 5 angka'),
  full_address: yup
    .string()
    .required('Harap mengisi Detail Alamat')
    .test(
      'no-leading-space',
      'Karakter pertama tidak boleh di awali dengan spasi',
      (value) => {
        if (value && /^\s/.test(value)) {
          return false;
        }

        return true;
      }
    )
    .min(10, 'Masukan minimal 10 karakter'),
});