/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['medio-waizly.s3.ap-southeast-1.amazonaws.com'],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  transpilePackages: ['crypto-js'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
  env: {
    REACT_APP_API_BASE_URL: 'https://dev.medio.id/api/engine/v1/',
    REACT_APP_API_BASE_URL_V2: 'https://dev.medio.id/api/engine/v2/',
    REACT_APP_API_BASE_URL_SIT_MEDIO:
      'https://sit.bebaskirim.com/api/dashboard/engine/v2/',
    SECRET_KEY_CRYPTO:
      'KFbkPh7HHHe7FNfMld2FOO2FDVWrzBbGgL2WzLVh2oRtJkPyUFuXRxwJlrIY5aqj0EfFks54Vecw35nYLDzCdwtmEhzJK6ZE75CQ6lAJpEtWGsXnQxq1jyQ81qij2xPY',
    GTM_ID: 'G-63GYPHBGC8',
    REACT_APP_EMAIL_ADDRESS: 'hello@ethix.id',
    REACT_APP_EMAIL_SUBJECT: 'Bebas Kirim - Permintaan Registrasi Bebas Kirim',
    REACT_APP_EMAIL_TEMPLATE:
      'Halo Ethix Commercial Team,\n\nSaya tertarik untuk menggunakan aplikasi Bebas Kirim.\nDapatkah saya mendapatkan informasi mengenai registrasi akun/harga/cara penggunaan dari aplikasi Bebas Kirim?\n\nTolong hubungi saya melalui\nNo. HP (Telp/WhatsApp): [isi dengan No. WhatsApp agar Tim Bebas Kirim dapat menghubungi Anda]\nTerima Kasih',
  },
  generateBuildId: async () => {
    return `${new Date().getTime()}`;
  },
};

module.exports = nextConfig;
