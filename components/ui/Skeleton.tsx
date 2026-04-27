import React from "react"

export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`skeleton bg-slate-800 ${className}`}
      {...props}
    />
  )
}

export function SkeletonText({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={`h-4 rounded ${className}`} {...props} />
}

export function SkeletonCard({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 border border-slate-700 bg-slate-800/50 rounded-2xl flex flex-col gap-4 ${className}`} {...props}>
      <SkeletonText className="w-1/3 h-6" />
      <SkeletonText className="w-full" />
      <SkeletonText className="w-4/5" />
      <SkeletonText className="w-2/3" />
    </div>
  )
}

export function SkeletonRow({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center gap-4 py-4 border-b border-slate-800/50 ${className}`} {...props}>
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonText className="w-1/4 h-3" />
        <SkeletonText className="w-1/2 h-4" />
        <SkeletonText className="w-1/3 h-3" />
      </div>
      <Skeleton className="w-16 h-6 rounded-full shrink-0" />
    </div>
  )
}
