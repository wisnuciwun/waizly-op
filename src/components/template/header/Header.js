/* eslint-disable no-unused-vars */
import classNames from 'classnames';
import { Toggle, Icon } from '@/components';
// import Logo from "@/layout/logo/Logo";
import User from './dropdown/user/User';
import { DropdownToggle } from 'reactstrap';

import { useTheme, useThemeUpdate } from '@/layout/provider/Theme';

const Header = ({ fixed, className, ...props }) => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();

  const headerClass = classNames({
    'nk-header': true,
    'nk-header-fixed': fixed,
    ['is-light']: theme?.header === 'white',
    [`is-${theme?.header}`]:
      theme?.header !== 'white' && theme?.header !== 'light',
    [`${className}`]: className,
  });
  return (
    <div className={headerClass}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ms-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
              icon="menu"
              click={themeUpdate?.sidebarVisibility}
            />
          </div>
          {/* <div className="nk-header-brand d-xl-none">
            <Logo />
          </div> */}
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              <li className="me-n1">
                <DropdownToggle
                  tag="a"
                  disabled={true}
                  // onClick={(ev) => ev.preventDefault()}
                  className="nk-quick-nav-icon"
                >
                  <div className="icon-status icon-status-na">
                    <Icon name="comments"></Icon>
                  </div>
                </DropdownToggle>
              </li>
              {/* TODO */}
              {/* <li className="notification-dropdown me-n1">
                <Notification />
              </li> */}
              <li className="user-dropdown">
                <User />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
