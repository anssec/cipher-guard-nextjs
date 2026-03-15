"use client";

import React from "react";

const SkeletonLoader = () => {
  const numberOfLoader = 10;
  return (
    <div className="mt-4 overflow-y-hidden">
      {Array.from({ length: numberOfLoader }).map((_, index) => (
        <div
          key={index}
          className="w-full flex animate-pulse items-center justify-between py-2.5 px-4 transition-all cursor-pointer"
        >
          <div className="w-7 h-6">
            <p className="w-6 h-6 bg-neutral-300 rounded-full"></p>
          </div>
          <div className="w-full mx-3 flex flex-col gap-1">
            <p className="max-w-full bg-neutral-300 h-4 rounded-md"></p>
            <p className="w-3/6 bg-neutral-300 h-4 rounded-md"></p>
          </div>
          <div className="w-7 h-6">
            <p className="w-6 h-6 bg-neutral-300 rounded-md"></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
