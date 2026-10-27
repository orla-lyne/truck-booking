import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-4">
        Move anything, <span className="text-blue-600">anywhere</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Book a truck in seconds. Verified drivers, transparent pricing.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/booking" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Book a Truck</Link>
        <Link href="/register?role=DRIVER" className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50">Become a Driver</Link>
      </div>
    </div>
  );
}