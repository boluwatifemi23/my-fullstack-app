export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-100 h-56 rounded-xl" />
      ))}
    </div>
  );
}