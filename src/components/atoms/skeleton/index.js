import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const SkeletonLoading = ({ width, height, ...props }) => {
  return (
    <>
      <Skeleton width={width} height={height} {...props}></Skeleton>
    </>
  );
};

export default SkeletonLoading;
