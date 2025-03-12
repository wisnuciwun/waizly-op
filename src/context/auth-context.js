/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isAuthRoute, feature } from './constantRoute';
import { UseDelay } from '@/utils/formater';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCompleteProfile, setIsCompleteProfile] = useState('');

  const token = useSelector((state) => state.auth.token);
  const completeProfile = useSelector(
    (state) => state.auth.user.is_complete_profile
  );

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      setIsCompleteProfile(completeProfile);
    } else {
      setIsLoggedIn(false);
    }
  }, [token, completeProfile]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isCompleteProfile,
        setIsCompleteProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const accessPage = () => {
  const menus = useSelector((state) => state.auth.menu);


  let list = [
    '/order/download',
    '/order/upload',
    '/order/completed/[id]',
    '/produk/detail-produk',
    '/produk/detail-produk/variant',
    '/pesanan/sinkron-pesanan',
    '/toko-terintegrasi/riwayat-toko',
    '/toko-terintegrasi/riwayat-toko-lainnya',
    '/order/list-table/semua',
    '/log-perubahan',
    '/inventory/list-table/[type]',
    '/inventory/stok',
    '/inventory/create',
    '/inventory/detail',
    '/inventory/edit',
    '/inventory/add-sku',
    '/inventory/inbound/detail-inbound',
    '/inventory/outbound/detail-outbound',
    '/inventory/detail-stock/[id]',
    '/produk/shopee',
    '/produk/[type]',
    '/inventory/transfer/form',
    '/inventory/transfer/detail-transfer',
    '/register-account',
    '/inventory/adjustment/form',
    '/inventory/adjustment/detail-adjustment',
  ];

  if (menus && menus.length > 0) {
    menus.forEach((data) => {
      if (data.link) {
        list.push(data.link);
      }
      if (data.feature?.length > 0) {
        data.feature.forEach((value) => {
          if (feature(value)) {
            if (typeof feature(value) == 'object') {
              feature(value).forEach((data) => {
                list.push(data);
              });
            } else {
              list.push(feature(value));
            }
          }
        });
      }
      if (data.subMenu && data.subMenu.length > 0) {
        data.subMenu.forEach((value) => {
          list.push(value.link);
        });
      }
    });
  }
  return list;
};

export const PrivateRoute = ({ children }) => {
  // const { isLoggedIn, isCompleteProfile } = useAuth();
  const token = useSelector((state) => state.auth.token);
  const firstLogin = useSelector((state) => state.auth.firstLogin);
  const completeProfile = useSelector(
    (state) => state.auth.user.is_complete_profile
  );
  const shopifyValue = useSelector((state) => state.product.shopifyValue);

  const menu = accessPage();
  const router = useRouter();
  // if (!completeProfile && token) {
  //   if (router.asPath !== "/complete-profile") {
  //     router.replace("/complete-profile");
  //   }

  //   return children;
  // }
  // console.log('ini path', router.pathname);

  if (completeProfile && token) {
    if (shopifyValue?.store_url) {
      router.push('/toko-terintegrasi/tambah-toko');
    } else if (router.pathname === '/' || isAuthRoute(router)) {
      router.push('/dashboard');
    } else if (router.asPath === '/forgot-password') {
      // todo
    } else {
      if (!menu.includes(router.asPath) && !menu.includes(router.pathname)) {
        router.replace('/dashboard');
      }
    }

    return children;
  } else if (!completeProfile && token && !firstLogin) {
    if (router.asPath !== '/complete-profile') {
      router.replace('/complete-profile');
    }

    return children;
  } else {
    if (router.asPath === '/404' || router.asPath === '/') {
      UseDelay(3000);
      router.push('/login');
    }
    return children;
  }
};
