export function CartItemSkeleton() {
  return (
    <div className="mb-4 animate-pulse space-y-4 border-b pb-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="h-6 w-8 rounded bg-gray-300"></div>
          <div className="h-6 w-32 rounded bg-gray-300"></div>
        </div>
        <div className="h-6 w-20 rounded bg-gray-300"></div>
      </div>
      <div className="flex gap-10 font-medium">
        <div className="h-6 w-16 rounded bg-gray-300"></div>
        <div className="h-6 w-16 rounded bg-gray-300"></div>
      </div>
    </div>
  )
}
