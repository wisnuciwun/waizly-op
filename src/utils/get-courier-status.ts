import { StaticImageData } from 'next/image';
import sicepat from '@/assets/images/courier/sicepat.png';
import jnt from '@/assets/images/courier/jnt.png';
import shopee from '@/assets/images/courier/shopee-express.png';
import jne from '@/assets/images/courier/jne.png';
import gosend from '@/assets/images/courier/gosend.png';
import grab from '@/assets/images/courier/grab-express.png';
import ninja from '@/assets/images/courier/ninja.png';
import anteraja from '@/assets/images/courier/anteraja.png';
import sap from '@/assets/images/courier/sap.png';
import idExpress from '@/assets/images/courier/id-express.png';
import lion from '@/assets/images/courier/lion.png';
import pos from '@/assets/images/courier/pos.png';
import tiki from '@/assets/images/courier/tiki.png';
import sentral from '@/assets/images/courier/sentral.png';
import dethix from '@/assets/images/courier/dethix.png';
import defaultLogo from '@/assets/images/courier/courier-fast.svg';

// get status logo
export function getCourierLogo(courierLogo: string) {
  let logo: StaticImageData;
  let width: number;

  switch (courierLogo) {
    case 'SICEPAT':
      logo = sicepat;
      width = 80;
      break;
    case 'JNT':
      logo = jnt;
      width = 80;
      break;
    case 'SHOPEE EXPRESS':
      logo = shopee;
      width = 70;
      break;
    case 'JNE':
      logo = jne;
      width = 65;
      break;
    case 'GOSEND':
      logo = gosend;
      width = 70;
      break;
    case 'GRAB':
      logo = grab;
      width = 70;
      break;
    case 'NINJA EXPRESS':
      logo = ninja;
      width = 70;
      break;
    case 'ANTER AJA':
      logo = anteraja;
      width = 70;
      break;
    case 'SAP':
      logo = sap;
      width = 70;
      break;
    case 'ID EXPRESS':
      logo = idExpress;
      width = 70;
      break;
    case 'LION PARCEL':
      logo = lion;
      width = 70;
      break;
    case 'POS INDONESIA':
      logo = pos;
      width = 50;
      break;
    case 'TIKI':
      logo = tiki;
      width = 50;
      break;
    case 'SENTRAL CARGO':
      logo = sentral;
      width = 50;
      break;
    case 'DETHIX':
      logo = dethix;
      width = 80;
      break;
    default:
      logo = defaultLogo;
      width = 50;
      break;
  }

  return { logo, width };
}

// get status color
export function getCourierStatus(courierStatus: string) {
  let background: string;
  let textcolor: string;

  switch (courierStatus.toUpperCase()) {
    case 'REGULER':
    case 'REGULAR':
    case 'REGULAR DARAT':
    case 'REG':
      background = '#E2FFEC';
      textcolor = '#36C068';
      break;
    case 'ONE DAY':
    case 'SAME DAY':
    case 'YES':
    case 'ONE DAY SERVICE':
    case 'SAME DAY SERVICE':
    case 'BEST':
    case 'SPS':
      background = '#D5FDFF';
      textcolor = '#00A7E1';
      break;
    case 'EXPRESS':
    case 'SIUNT':
      background = '#E2FFEC';
      textcolor = '#36C068';
      break;
    case 'JTR':
    case 'CARGO':
    case 'KARGO KILAT':
      background = '#FFF2C6';
      textcolor = '#FFB703';
      break;
    default:
      background = '#203864';
      textcolor = 'white';
      break;
  }

  return { background, textcolor };
}
