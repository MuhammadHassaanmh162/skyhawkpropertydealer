/** Thin wrapper that applies the global `.skeleton` shimmer class */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

/** One property card skeleton — mirrors PropertyCard layout exactly */
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-warm-border shadow-card">
      {/* Image */}
      <div className="skeleton aspect-[4/3] w-full rounded-none" />

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        {/* Location */}
        <Skeleton className="h-3 w-1/2 rounded-lg" />

        {/* Specs row */}
        <div className="flex gap-4 pt-1">
          <Skeleton className="h-3 w-16 rounded-lg" />
          <Skeleton className="h-3 w-14 rounded-lg" />
          <Skeleton className="h-3 w-14 rounded-lg" />
        </div>

        {/* Divider */}
        <div className="h-px bg-warm-border" />

        {/* Price */}
        <Skeleton className="h-5 w-1/3 rounded-lg" />
      </div>
    </div>
  );
}

/** Grid of N card skeletons */
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for the full property detail page */
export function PropertyDetailSkeleton() {
  return (
    <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="container-max">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Gallery */}
            <Skeleton className="w-full h-[260px] sm:h-[400px] lg:h-[460px] rounded-2xl" />
            {/* Thumbs */}
            <div className="flex gap-2">
              {[0,1,2,3].map((i) => <Skeleton key={i} className="w-[84px] h-[62px] sm:w-[100px] sm:h-[74px] shrink-0 rounded-xl" />)}
            </div>

            {/* Badges + title */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-9 w-2/3 rounded-xl" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>

            {/* Price box */}
            <Skeleton className="h-24 w-full rounded-2xl" />

            {/* Details grid */}
            <Skeleton className="h-40 w-full rounded-2xl" />

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          </div>

          {/* Right — contact card */}
          <div className="lg:w-80 shrink-0">
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the properties list page */
export function PropertiesPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-20 pb-6 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="container-max space-y-2">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-10 w-56 rounded-xl" />
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container-max flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter sidebar */}
          <div className="lg:w-64 shrink-0 space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          {/* Grid */}
          <div className="flex-1 min-w-0">
            <PropertyGridSkeleton count={9} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the home page */
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar placeholder */}
      <div className="h-[68px] border-b border-warm-border bg-white" />

      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Hero headline */}
        <div className="pt-10 pb-8 space-y-3">
          <Skeleton className="h-12 w-2/3 rounded-xl" />
          <Skeleton className="h-12 w-1/2 rounded-xl" />
        </div>

        {/* Hero image */}
        <Skeleton className="w-full h-[240px] sm:h-[380px] lg:h-[520px] rounded-3xl mb-6" />

        {/* Search bar */}
        <Skeleton className="h-16 w-full max-w-3xl rounded-2xl mb-10" />
      </div>

      {/* Featured grid */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max">
          <div className="flex justify-center mb-8 gap-2">
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
          <PropertyGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
