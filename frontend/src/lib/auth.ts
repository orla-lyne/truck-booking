export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
}

export const saveAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuth = (): { token: string | null; user: User | null } => {
  if (typeof window === 'undefined') return { token: null, user: null };
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return { token, user: user ? (JSON.parse(user) as User) : null };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};