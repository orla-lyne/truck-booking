'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import Button from '@/components/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'CUSTOMER' as 'CUSTOMER' | 'DRIVER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      saveAuth(data.token, data.user);
      router.push(data.user.role === 'DRIVER' ? '/driver' : '/booking');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h1>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {(['CUSTOMER', 'DRIVER'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setForm({ ...form, role: r })}
            className={`py-2 rounded-lg border-2 font-medium text-sm ${
              form.role === r
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-600 bg-white'
            }`}
          >
            {r === 'CUSTOMER' ? '👤 Customer' : '🚚 Driver'}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'phone', 'password'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              required
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                field === 'name' ? 'Jane Doe'
                : field === 'email' ? 'you@example.com'
                : field === 'phone' ? '6XX XXX XXX'
                : '••••••••'
              }
            />
          </div>
        ))}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <Button loading={loading} type="submit">Create account</Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Have an account? <Link href="/login" className="text-blue-600 font-medium">Sign in</Link>
      </p>
    </div>
  );
}