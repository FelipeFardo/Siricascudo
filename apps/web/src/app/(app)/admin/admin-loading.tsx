import Image from 'next/image'

export default function PageLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50">
      <div className="relative">
        <Image
          src="/logo.svg"
          alt="Restaurant Logo"
          width={150}
          height={150}
          className="animate-pulse"
        />
      </div>
      <p className="mt-4 animate-pulse text-xl font-semibold text-amber-800">
        Preparando sua experiência...
      </p>
    </div>
  )
}
