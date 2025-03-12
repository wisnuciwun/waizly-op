// Next
import { Icon } from '@/components'; // Assuming this is the correct import path
import colors from '@/utils/colors';
// third party
import classnames from 'classnames';
import Image from 'next/image';
import { Nav, NavItem, NavLink } from 'reactstrap';

const Tabs = ({
  tabsData,
  activeTab,
  onTabChange,
  tabCounts,
  labelStyleOverride = {},
}) => {
  const handleTabChange = (selectedTab) => {
    if (onTabChange) {
      onTabChange(selectedTab);
    }
  };

  return (
    <>
      <Nav tabs>
        {tabsData.map((item, index) => (
          <NavItem style={{ paddingRight: 24 }} key={item.id}>
            <NavLink
              className={classnames({ active: activeTab === item.type })}
              onClick={() => handleTabChange(item.type)}
            >
              {item.type !== 'all' &&
                (!item.customIcon ? (
                  <Icon
                    name={item.icon}
                    style={{ fontSize: 20 }}
                    width={20}
                    height={20}
                    color={colors.black}
                  />
                ) : (
                  <Image
                    src={item.icon}
                    width={18}
                    style={{ marginRight: 10 }}
                    alt="product-sku"
                  />
                ))}
              <span
                style={{
                  color: activeTab === item.type ? '#203864' : 'inherit',
                  fontSize: 14,
                  ...labelStyleOverride,
                }}
              >
                {item.label} {tabCounts && `(${tabCounts[index] ?? '0'})`}
              </span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </>
  );
};

export default Tabs;
