interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, loading, variant = 'primary', className = '', ...rest }: Props) {
  const base = 'w-full py-3 rounded-lg font-semibold transition disabled:opacity-50';
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  return (
    <button {...rest} disabled={loading || rest.disabled} className={`${base} ${styles[variant]} ${className}`}>
      {loading ? 'Please wait...' : children}
    </button>
  );
}