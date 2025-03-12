/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import Icon from '@/components/atoms/icon';
import classNames from 'classnames';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import colors from '@/utils/colors';
import { useTheme } from '@/layout/provider/Theme';
import styled from 'styled-components';

const MenuHeading = ({ heading, hasHover }) => {
  const theme = useTheme();

  return (
    <li className="nk-menu-heading">
      <text style={styles.parentTitle} className="">
        {theme?.sidebarCompact && !hasHover ? '...' : heading}
      </text>
    </li>
  );
};

export const MenuItem = ({
  icon,
  link,
  text,
  sub,
  newTab,
  sidebarToggle,
  mobileView,
  badge,
  ...props
}) => {
  let currentUrl;
  const ignoreValueLink = [
    '/dashboard',
    '/toko-terintegrasi',
    '/master-sku',
    '/tarif-pengiriman',
    '/log-perubahan',
  ];
  const toggleActionSidebar = (e) => {
    const self = e.target.closest('.nk-menu-toggle');
    if (!self && ignoreValueLink.includes(link)) {
      let parent = document.getElementsByClassName('nk-menu-item has-sub');
      const sub = document.getElementsByClassName('nk-menu-wrap');

      for (let i = 0; i < parent.length; i++) {
        parent[i].classList.remove('active');
      }

      for (let i = 0; i < sub.length; i++) {
        sub[i].setAttribute('style', 'height: 0px');
      }

      let current = document.querySelector('.current-page');
      if (current) {
        current.classList.add('active');
      }
      // current.classList.add("active");
    }

    if (!sub && !newTab && mobileView) {
      sidebarToggle(e);
    }
    // if (!ignoreValueLink.includes(link))
    //   window.location.replace(link)
  };

  if (window.location.pathname !== undefined) {
    currentUrl = window.location.pathname;
  } else {
    currentUrl = null;
  }

  const menuHeight = (el) => {
    let totalHeight = [];
    for (let i = 0; i < el.length; i++) {
      let margin =
        parseInt(window.getComputedStyle(el[i]).marginTop.slice(0, -2)) +
        parseInt(window.getComputedStyle(el[i]).marginBottom.slice(0, -2));
      let padding =
        parseInt(window.getComputedStyle(el[i]).paddingTop.slice(0, -2)) +
        parseInt(window.getComputedStyle(el[i]).paddingBottom.slice(0, -2));
      let height = el[i].clientHeight + margin + padding;
      totalHeight.push(height);
    }
    totalHeight = totalHeight.reduce((sum, value) => (sum += value));
    return totalHeight;
  };

  const makeParentActive = (el, childHeight) => {
    let element = el.parentElement.parentElement.parentElement;
    let wrap = el.parentElement.parentElement;
    if (element.classList[0] === 'nk-menu-item') {
      element.classList.add('active');
      const subMenuHeight = menuHeight(el.parentNode.children);
      wrap.style.height = subMenuHeight + childHeight - 50 + 'px';
      makeParentActive(element);
    }
  };

  useEffect(() => {
    let element = document.getElementsByClassName(
      'nk-menu-item active current-page'
    );
    let arrayElement = [...element];
    arrayElement.forEach((dom) => {
      if (
        dom.parentElement.parentElement.parentElement.classList[0] ===
        'nk-menu-item'
      ) {
        dom.parentElement.parentElement.parentElement.classList.add('active');
        const subMenuHeight = menuHeight(dom.parentNode.children);
        dom.parentElement.parentElement.style.height = 'auto';
        makeParentActive(
          dom.parentElement.parentElement.parentElement,
          subMenuHeight
        );
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const menuToggle = (e) => {
    e.preventDefault();
    let self = e.target.closest('.nk-menu-toggle');
    let parent = self.parentElement;
    let subMenu = self.nextSibling;
    let subMenuItem = subMenu.childNodes;
    let parentSiblings = parent.parentElement.childNodes;
    let parentMenu = parent.closest('.nk-menu-wrap');
    //For Sub Menu Height
    let subMenuHeight = menuHeight(subMenuItem);
    // Get parent elements
    const getParents = (el, parentSelector) => {
      parentSelector = document.querySelector('.nk-menu');
      if (parentSelector === undefined) {
        parentSelector = document;
      }
      let parents = [];
      let p = el.parentNode;
      while (p !== parentSelector) {
        let o = p;
        parents.push(o);
        p = o.parentNode;
      }
      parents.push(parentSelector);
      return parents;
    };
    let parentMenus = getParents(self);
    if (!parent.classList.contains('active')) {
      // For Parent Siblings
      for (let j = 0; j < parentSiblings.length; j++) {
        parentSiblings[j].classList.remove('active');
        if (typeof parentSiblings[j].childNodes[1] !== 'undefined') {
          parentSiblings[j].childNodes[1].style.height = 0;
        }
      }
      if (parentMenu !== null) {
        if (!parentMenu.classList.contains('sub-opened')) {
          parentMenu.classList.add('sub-opened');

          for (let l = 0; l < parentMenus.length; l++) {
            if (typeof parentMenus !== 'undefined') {
              if (parentMenus[l].classList.contains('nk-menu-wrap')) {
                parentMenus[l].style.height =
                  parentMenus[l].clientHeight - subMenuHeight + 'px';
              }
            }
          }
        }
      }
      // For Current Element
      parent.classList.add('active');
      subMenu.style.height = subMenuHeight + 'px';
    } else {
      parent.classList.remove('active');
      if (parentMenu !== null) {
        parentMenu.classList.remove('sub-opened');
        for (let k = 0; k < parentMenus.length; k++) {
          if (typeof parentMenus !== 'undefined') {
            if (parentMenus[k].classList.contains('nk-menu-wrap')) {
              parentMenus[k].style.height =
                parentMenus[k].clientHeight - subMenuHeight + 'px';
            }
          }
        }
      }
      subMenu.style.height = 0;
    }
  };

  const menuItemClass = classNames({
    'nk-menu-item': true,
    'has-sub': sub,
    'active current-page': currentUrl === link,
  });

  return (
    <li className={menuItemClass} onClick={(e) => toggleActionSidebar(e)}>
      {newTab ? (
        <Link
          href={`${link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nk-menu-link"
        >
          {icon ? (
            <span className="nk-menu-icon">
              <Icon name={icon} />
            </span>
          ) : null}
          <text className="nk-menu-text">{text}</text>
        </Link>
      ) : (
        <Link
          href={`${link}`}
          className={`nk-menu-link ${sub ? 'nk-menu-toggle' : ''}`}
          onClick={sub ? menuToggle : null}
        >
          {icon ? (
            <span className="nk-menu-icon">
              <Icon name={icon} />
            </span>
          ) : null}
          {text === 'Inventory' ? (
            <>
              <text className='nk-menu-text' style={{ flexGrow: 0 }}>{text}</text>
              <div style={{ 
                paddingRight: 8, 
                paddingLeft: 8,
                backgroundColor: '#D5FDFF',
                borderRadius: 4,
                marginLeft: 8

              }}>
                <text style={{ color: '#00A7E1', fontSize: 12}}>{'BETA'}</text>
              </div>
            </>
          ): (
            <text className="nk-menu-text">{text}</text>
          )}
          
          
          {badge != undefined && (
            <span
              className="nk-menu-badge d-flex 
          justify-content-center align-items-center"
              style={{
                right: 0,
                marginRight: 18,
                borderRadius: badge?.toString().length > 2 ? 24 : '50%',
                minWidth: badge?.toString().length > 2 ? 41 : 26,
                padding: '12px 8.5px 12px 8.5px',
                height: 26,
                fontSize: 12,
                backgroundColor: text == 'Bermasalah' ? '#FCE9E7' : '#F5F6FA',
                color: text == 'Bermasalah' ? '#E85347' : '#526484',
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          )}
        </Link>
      )}
      {sub ? (
        <div className="nk-menu-wrap">
          <MenuSub
            sub={sub}
            sidebarToggle={sidebarToggle}
            mobileView={mobileView}
          />
        </div>
      ) : null}
    </li>
  );
};

const MenuSub = ({
  icon,
  link,
  text,
  sub,
  sidebarToggle,
  mobileView,
  ...props
}) => {
  return (
    <ul className="nk-menu-sub" style={props.style}>
      {sub.map((item, idx) => (
        <>
          {item && (
            <MenuItem
              link={item?.link || ''}
              icon={item.icon}
              text={item.text}
              sub={item.subMenu}
              key={idx}
              newTab={item.newTab}
              badge={item.badge}
              sidebarToggle={sidebarToggle}
              mobileView={mobileView}
            />
          )}
        </>
      ))}
    </ul>
  );
};

const Menu = ({ sidebarToggle, mobileView, hasHover }) => {
  const { menu } = useSelector((state) => state.auth);
  const { countOrderSidebar } = useSelector((state) => state.product);
  // use this if you need to add new dummy tab menu
  // const menu = [...useSelector((state) => state.auth.menu)];
  // if(menu != undefined && menu.length != 0 && menu.filter((v) => v.text == "Inventori").length == 0){
  //   menu.push({
  //     feature: ["Sync Produk Toko", "Tambahkan ke Master SKU"],
  //     icon: "file-docs",
  //     link: "/inventory",
  //     subMenu: [
  //       { link: "/inventory/list-table/stok", text: "Stok" },
  //     ],
  //     text: "Inventori",
  //   });
  // }

  const subMenuFilter = menu.find((v) => v.text === 'Pesanan')?.subMenu || [];
  const subMenuSemua = subMenuFilter
    ? subMenuFilter.find((v) => v.text === 'Semua')
    : {};
  let subMenuOrder = [
    subMenuSemua,
    ...subMenuFilter?.filter((v) => v !== subMenuSemua),
  ];

  if (subMenuFilter.length != 0 && countOrderSidebar?.length != 0) {
    let addCounter = subMenuOrder.map((v) => {
      let value = 0;
      if (countOrderSidebar && countOrderSidebar.length > 0) {
        value = countOrderSidebar.find((w) => w.menu == v.text)?.count;
      }

      return {
        ...v,
        badge: value > 99 ? '99+' : value,
      };
    });

    subMenuOrder = addCounter;
  }

  return (
    <>
      <ContainerMenu>
        <ul className="nk-menu">
          {menu?.map((item, idx) =>
            item.heading ? (
              <MenuHeading
                hasHover={hasHover}
                heading={item.heading}
                key={idx}
              />
            ) : (
              <>
                <MenuItem
                  key={item.text}
                  link={item.link}
                  icon={item.icon}
                  text={item.text}
                  sub={
                    item.subMenu?.length > 0
                      ? item.text == 'Pesanan'
                        ? subMenuOrder
                        : item.subMenu
                      : null
                  }
                  badge={item.badge}
                  sidebarToggle={sidebarToggle}
                  mobileView={mobileView}
                />
              </>
            )
          )}
        </ul>
      </ContainerMenu>
    </>
  );
};

const styles = {
  parentTitle: {
    fontSize: '11px',
    fontWeight: '700',
    lineHeight: '13.2px',
    color: colors.black,
    letterSpacing: '2.2px',
  },
};

const ContainerMenu = styled.div`
  // max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 65px - 80px);
  // @media (min-width: 1273px) {
  //   max-height: 470px;
  // }
`;
export default Menu;
