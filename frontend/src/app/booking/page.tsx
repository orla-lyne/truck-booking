'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getAuth } from '@/lib/auth';
import type { Ride, TruckSize } from '@/lib/types';

const SIZES: { value: TruckSize; label: string; emoji: string }[] = [
  { value: 'SMALL', label: 'Small', emoji: '🛻' },
  { value: 'MEDIUM', label: 'Medium', emoji: '🚚' },
  { value: 'LARGE', label: 'Large', emoji: '🚛' },
];

export default function BookingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    distanceKm: '',
    truckSize: 'SMALL' as TruckSize,
  });
  const [price, setPrice] = useState<number | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { user } = getAuth();
    if (!user) return router.push('/login');
    if (user.role !== 'CUSTOMER') return router.push('/driver');
    loadRides();
  }, [router]);

  const loadRides = async () => {
    try {
      const { data } = await api.get('/rides/my');
      setRides(data.rides);
    } catch {}
  };

  const estimate = async () => {
    setError('');
    if (!form.distanceKm) return setError('Enter distance');
    try {
      const { data } = await api.post('/rides/estimate', {
        distanceKm: Number(form.distanceKm),
        truckSize: form.truckSize,
      });
      setPrice(data.price);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Estimate failed');
    }
  };

  const book = async () => {
    setError('');
    setLoading(true);
    try {
      const { data: trucks } = await api.get('/drivers/available-trucks');
      const truck = trucks.trucks?.find((t: any) => t.size === form.truckSize);
      if (!truck) throw new Error('No trucks of this size available right now');

      await api.post('/rides', {
        pickupLocation: form.pickupLocation,
        dropoffLocation: form.dropoffLocation,
        distanceKm: Number(form.distanceKm),
        truckId: truck.id,
      });
      setPrice(null);
      setForm({ pickupLocation: '', dropoffLocation: '', distanceKm: '', truckSize: 'SMALL' });
      loadRides();
    } catch (e: any) {
      setError(e.response?.data?.error || e.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const statusColor: Record<string, string> = {
    REQUESTED: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Book a truck</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup location</label>
          <input
            value={form.pickupLocation}
            onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
            className={inputClass}
            placeholder="e.g. Bastos, Yaoundé"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Drop-off location</label>
          <input
            value={form.dropoffLocation}
            onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
            className={inputClass}
            placeholder="e.g. Biyem-Assi, Yaoundé"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
          <input
            type="number"
            value={form.distanceKm}
            onChange={(e) => setForm({ ...form, distanceKm: e.target.value })}
            className={inputClass}
            placeholder="e.g. 10"
          />
        </div>

        <p className="text-sm font-medium text-gray-700 mb-2">Truck size</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {SIZES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm({ ...form, truckSize: t.value })}
              className={`py-3 rounded-lg border-2 text-sm font-medium ${
                form.truckSize === t.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 bg-white'
              }`}
            >
              <div className="text-xl">{t.emoji}</div>
              {t.label}
            </button>
          ))}
        </div>

        {price !== null && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-green-800 font-semibold text-center">
            Estimated price: {price.toLocaleString()} FCFA
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={estimate}
            type="button"
            className="flex-1 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
          >
            Calculate price
          </button>
          <button
            onClick={book}
            disabled={!price || loading}
            type="button"
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book now'}
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">My bookings</h2>
      {rides.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
      <div className="space-y-3">
        {rides.map((r) => (
          <div
            key={r.id}
            className="bg-white p-4 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between gap-2"
          >
            <div>
              <p className="font-medium text-gray-900">
                {r.pickupLocation} → {r.dropoffLocation}
              </p>
              <p className="text-sm text-gray-500">
                {r.truck?.size} • {r.distanceKm} km • {r.price.toLocaleString()} FCFA
              </p>
            </div>
            <span
              className={`text-xs self-start px-2 py-1 rounded-full font-semibold ${statusColor[r.status]}`}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}