'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuth, logout, User } from '@/lib/auth';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { user } = getAuth();
    setUser(user);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">🚚 TruckGo</Link>
        <div className="flex gap-3 items-center text-sm">
          {!user && (
            <>
              <Link href="/login" className="px-3 py-2 hover:text-blue-600">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign up</Link>
            </>
          )}
          {user && (
            <>
              {user.role === 'CUSTOMER' && (
                <Link href="/booking" className="px-3 py-2 hover:text-blue-600">Book</Link>
              )}
              {user.role === 'DRIVER' && (
                <Link href="/driver" className="px-3 py-2 hover:text-blue-600">Dashboard</Link>
              )}
              <span className="hidden sm:inline text-gray-600">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}