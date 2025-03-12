import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';

export const usePermissions = () => {
  const {pathname} = useRouter();
  const {menu} = useSelector((state: any) => state.auth);
  const basePath = pathname?.match(/^\/[^/]+/)[0];
  const findPermissions = menu.find((menus: any) => menus.link === basePath);
  const allowPermissions = findPermissions?.feature;
  return allowPermissions;
};
