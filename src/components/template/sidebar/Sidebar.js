/* eslint-disable no-unused-vars */
import { useState } from 'react';
import classNames from 'classnames';
import SimpleBar from 'simplebar-react';
import Logo from '@/layout/logo/Logo';
import Menu from '@/layout/menu/Menu';
import Toggle from './Toggle';
import menuData from '@/layout/menu/MenuData';
import { MenuItem } from '@/layout/menu/Menu';


import { useTheme, useThemeUpdate } from '@/layout/provider/Theme';

const Sidebar = ({ fixed, className, ...props }) => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();

  const [mouseEnter, setMouseEnter] = useState(false);

  const handleMouseEnter = () => setMouseEnter(true);
  const handleMouseLeave = () => setMouseEnter(false);

  const classes = classNames({
    'nk-sidebar': true,
    'nk-sidebar-fixed': fixed,
    'nk-sidebar-active': theme?.sidebarVisibility,
    'nk-sidebar-mobile': theme?.sidebarMobile,
    'is-compact': theme?.sidebarCompact,
    'has-hover': theme?.sidebarCompact && mouseEnter,
    ['is-light']: theme?.sidebar === 'white',
    [`is-${theme?.sidebar}`]:
      theme?.sidebar !== 'white' && theme?.sidebar !== 'light',
    [`${className}`]: className,
  });

  return (
    <>
      <div className={classes} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
        <div className="nk-sidebar-element nk-sidebar-head">
          <div className="nk-sidebar-brand">
            <Logo />
          </div>
          <div className="nk-menu-trigger">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none me-n2"
              icon="arrow-left"
              click={() => {
                themeUpdate?.sidebarVisibility;

              }}
            />
            <Toggle
              className={`nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex mt-1 ${theme?.sidebarCompact ? 'compact-active' : ''
                }`}
              click={themeUpdate?.sidebarCompact}
              icon="chevrons-left"
            />
          </div>
        </div>
        <div
          className="nk-sidebar-content"
        >
          <SimpleBar className="nk-sidebar-menu">
            <Menu hasHover={mouseEnter} />
          </SimpleBar>
          {/* <SimpleBar className="nk-sidebar-menu"> */}
          <div style={styles.containerMenuDummy}>
          <ul className="nk-menu">
          {menuData?.map((item, idx) =>
            <MenuItem
              key={idx}
              link={item.link}
              icon={item.icon}
              text={item.text}
              sub={
                item.subMenu?.length > 0
                  ? item.text == 'Pesanan'
                    ? subMenuOrder()
                    : item.subMenu
                  : null
              }
              badge={item.badge}
              // sidebarToggle={sidebarToggle}
              // mobileView={mobileView}
            />
          )}
          </ul>
         </div>
          {/* </SimpleBar> */}

        </div>
      </div>
      {theme?.sidebarVisibility && (
        <div
          onClick={themeUpdate?.sidebarVisibility}
          className="nk-sidebar-overlay"
        ></div>
      )}
    </>
  );
};

const styles = {
  containerMenuDummy : {
    width: '100%',
    position: 'absolute',
    bottom: '0px',
    backgroundColor: 'white',
  },
};
export default Sidebar;
