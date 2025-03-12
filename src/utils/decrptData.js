import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.SECRET_KEY_CRYPTO;

const useDecrypt = (params, isNumber) => {
  try {
    const paramsData = atob(params);
    const secretKey = SECRET_KEY;
    const parsedData = JSON.parse(decodeURIComponent(paramsData));

    const decryptConfig = {
      ciphertext: CryptoJS?.enc?.Base64?.parse(parsedData.ct),
      iv: CryptoJS?.enc?.Hex?.parse(parsedData.iv),
      salt: CryptoJS?.enc?.Hex?.parse(parsedData.s),
    };

    const decryptDataJson = CryptoJS?.AES?.decrypt(decryptConfig, secretKey, {
      mode: CryptoJS?.mode?.CBC,
      padding: CryptoJS?.pad?.Pkcs7,
    })?.toString(CryptoJS?.enc?.Utf8);

    if (isNumber)
      return parseInt(decryptDataJson.replace(/^"(.*)"$/, '$1', 10));
    return decryptDataJson;
  } catch (error) {
    return null;
  }
};

export default useDecrypt;
