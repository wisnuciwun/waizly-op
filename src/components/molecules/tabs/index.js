// Next
// third party
import classnames from 'classnames';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Icon } from '@/components/atoms';

const Tabs = ({ tabsData, activeTab, onTabChange, tabCounts }) => {
  const handleTabChange = (selectedTab) => {
    if (onTabChange) {
      onTabChange(selectedTab);
    }
  };

  return (
    <>
      <Nav tabs>
        {tabsData.map((item, index) => (
          <NavItem key={item.id}>
            <NavLink
              className={classnames({ active: activeTab === item.type })}
             
              onClick={() => handleTabChange(item.type)}
            >
              {item.type !== 'all' && (
                <Icon className={item.icon} />
              )}
              <span  style={{color: activeTab === item.type ? '#203864' : 'inherit'}}>
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
