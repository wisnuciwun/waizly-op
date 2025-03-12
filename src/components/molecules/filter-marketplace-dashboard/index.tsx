/* eslint-disable no-unused-vars */
// React & Next import
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getMarketPlaceLogo } from './data-filter';

// style
import { styles } from './styles';

// component
import { SkeletonLoading } from '@/components/atoms';

interface dataDataMarketplace {
  channel_id: number;
  channel_name: string;
  count: number;
}

interface Props {
  data: dataDataMarketplace[];
  onFilterChange: (selectedIds: number[]) => void;
  loading?: boolean;
}

function FilterMarketplace({ data, onFilterChange, loading }: Props) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedItems, setClickedItems] = useState([]);

  const handleHoverItem = (id: number | null) => {
    setHoveredItem(id);
  };

  const handleClickFilterMarketplace = (id: number) => {
    const updatedClickedItems = clickedItems.includes(id)
      ? clickedItems.filter((itemId) => itemId !== id)
      : [...clickedItems, id];
    setClickedItems(updatedClickedItems);
    onFilterChange(updatedClickedItems);
  };

  useEffect(() => {
    if (!loading || loading) {
      setHoveredItem(null);
    }
  }, [loading]);

  return (
    <div className="d-flex flex-wrap">
      {loading ? (
        <>
          {[...Array(7)].map((_, index) => (
            <div className="my-1" style={styles.WrapperLogo} key={index}>
              <SkeletonLoading width={38} height={27} />
            </div>
          ))}
        </>
      ) : (
        <>
          {data && data.map((item: dataDataMarketplace, idx: number) => (
            <div
              className="custom-wrapper-filtermarketplace my-1"
              style={
                clickedItems.includes(item?.channel_id)
                  ? { ...styles.WrapperLogo, ...styles.WrapperLogoFocus }
                  : styles.WrapperLogo
              }
              onClick={() => handleClickFilterMarketplace(item?.channel_id)}
              onMouseEnter={() => handleHoverItem(item?.channel_id)}
              onMouseLeave={() => handleHoverItem(null)}
              key={idx}
            >
              {hoveredItem === item?.channel_id ? (
                <>
                  <div className="d-flex align-items-center">
                    <Image
                      src={getMarketPlaceLogo(item?.channel_name).logo}
                      width={22}
                      alt="logo-marketplace"
                    />
                    <span className="text-truncate" style={styles.Wrappercount}>
                      {item?.count ?? '-'} Toko
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src={getMarketPlaceLogo(item?.channel_name).logo}
                    width={22}
                    alt="logo-marketplace"
                  />
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default FilterMarketplace;
