export default function SectionSkeleton() {
  return (
    <div className="py-24 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 animate-pulse select-none">
      {/* Skeleton header */}
      <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
        <div className="h-4 w-32 bg-gold-accent/15 rounded-full" />
        <div className="h-10 w-64 bg-plum-primary/10 rounded-2xl" />
        <div className="w-24 h-1 bg-gold-accent/20 rounded-full mt-1" />
        <div className="h-4 w-full sm:w-96 bg-gray-200/60 rounded-full mt-2" />
      </div>

      {/* Skeleton cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="h-[360px] rounded-3xl bg-plum-dark/5 border border-gray-100/50 flex flex-col justify-end p-6 gap-3 shadow-inner"
          >
            <div className="h-6 w-3/4 bg-plum-primary/10 rounded-xl" />
            <div className="h-4 w-full bg-gray-200/60 rounded-full" />
            <div className="h-4 w-5/6 bg-gray-200/60 rounded-full" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="h-10 bg-gold-accent/10 rounded-xl" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
