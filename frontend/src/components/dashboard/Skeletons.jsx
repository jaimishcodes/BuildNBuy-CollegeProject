import React from 'react';

export const PropertyCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-52 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-3 w-1/2" />
      <div className="flex gap-3 pt-2">
        <div className="skeleton h-3 w-12" />
        <div className="skeleton h-3 w-12" />
        <div className="skeleton h-3 w-12" />
      </div>
    </div>
  </div>
);

export const ContractorCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-40 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  </div>
);

export const GridSkeleton = ({ Item = PropertyCardSkeleton, count = 6, cols = 'md:grid-cols-2 lg:grid-cols-3' }) => (
  <div className={`grid grid-cols-1 ${cols} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <Item key={i} />
    ))}
  </div>
);
