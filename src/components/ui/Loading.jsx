const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
      </div>
      
      {/* Search and filters skeleton */}
      <div className="flex gap-4">
        <div className="h-10 w-80 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
      </div>
      
      {/* Table skeleton */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="border-b border-white/10 p-6">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-5 bg-white/10 rounded animate-pulse" />
            <div className="h-5 bg-white/10 rounded animate-pulse" />
            <div className="h-5 bg-white/10 rounded animate-pulse" />
            <div className="h-5 bg-white/10 rounded animate-pulse" />
            <div className="h-5 bg-white/10 rounded animate-pulse" />
            <div className="h-5 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Table rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border-b border-white/5 p-6">
            <div className="grid grid-cols-6 gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-white/10 rounded animate-pulse" />
                <div className="w-8 h-8 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;