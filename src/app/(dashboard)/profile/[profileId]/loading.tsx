"use client";

import { Spinner, Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-gray-500 to-stone-600">
      {/* Skeleton loader for placeholder content */}
      <div className="w-80 space-y-4">
        <Skeleton className="h-20 bg-white/20" />
      </div>

      {/* Spinner for Global Loading */}
      <Spinner className="my-8" color="white" size="lg" />

      {/* Skeleton loader for placeholder content */}
      <div className="w-80 space-y-4">
        <Skeleton className="h-10 bg-white/20" />
        <Skeleton className="h-10 bg-white/20" />
        <Skeleton className="h-10 bg-white/20" />
      </div>
    </div>
  );
}
