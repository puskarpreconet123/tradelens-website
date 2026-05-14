import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const isLogin = mode === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = location.state?.from || '/dashboard';

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else await register(email, password, name);
      toast({ title: isLogin ? 'Welcome back' : 'Account created', description: 'Redirecting to your dashboard…' });
      navigate(redirect, { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const description = Array.isArray(detail)
        ? detail.map((e) => e.msg || e.message || JSON.stringify(e)).join(', ')
        : (typeof detail === 'string' ? detail : 'Something went wrong.');
      toast({
        title: 'Authentication failed',
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div className="tl-bg-grid" />
      <div className="tl-bg-glow tl-bg-glow-a" />
      <Link to="/" style={s.brand}>
        <div style={s.logo}><Activity size={18} color="#062024" strokeWidth={2.5} /></div>
        <span style={s.brandText}>TradeLens</span>
      </Link>
      <form onSubmit={submit} className="tl-card" style={s.card}>
        <h1 style={s.title}>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p style={s.sub}>{isLogin ? 'Sign in to access your dashboard.' : 'Start backtesting in minutes.'}</p>

        {!isLogin && (
          <label style={s.label}>
            <span style={s.lab}>Full name</span>
            <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} required minLength={1} maxLength={80} />
          </label>
        )}
        <label style={s.label}>
          <span style={s.lab}>Email</span>
          <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label style={s.label}>
          <span style={s.lab}>Password</span>
          <input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>

        <button type="submit" className="tl-btn tl-btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
          {loading ? <Loader2 size={16} className="tl-spin" /> : <>{isLogin ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></>}
        </button>

        <div style={s.alt}>
          {isLogin ? (
            <>New to TradeLens? <Link to="/register" style={s.altLink}>Create account</Link></>
          ) : (
            <>Already have an account? <Link to="/login" style={s.altLink}>Sign in</Link></>
          )}
        </div>
      </form>
      <style>{`.tl-spin { animation: tl-spin 1s linear infinite; } @keyframes tl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const s = {
  wrap: {
    minHeight: '100vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: '#06080b', padding: '40px 20px',
    position: 'relative', overflow: 'hidden'
  },
  brand: {
    position: 'absolute', top: 32, left: 32,
    display: 'inline-flex', alignItems: 'center', gap: 10,
    textDecoration: 'none', zIndex: 2
  },
  logo: {
    width: 32, height: 32, borderRadius: 9,
    background: 'linear-gradient(120deg, #22d3ee, #14b8a6)',
    display: 'grid', placeItems: 'center'
  },
  brandText: {
    fontFamily: 'Space Grotesk, sans-serif', fontSize: 19, fontWeight: 600,
    color: '#f1f5f9', letterSpacing: '-0.02em'
  },
  card: {
    width: '100%', maxWidth: 420,
    padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 14,
    position: 'relative', zIndex: 2
  },
  title: {
    fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 600,
    color: '#f1f5f9', letterSpacing: '-0.02em', margin: 0
  },
  sub: { color: '#94a3b8', fontSize: 14, margin: '0 0 14px' },
  label: { display: 'flex', flexDirection: 'column', gap: 6 },
  lab: {
    fontSize: 11.5, color: '#5eead4', letterSpacing: '0.14em',
    textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace'
  },
  input: {
    height: 44, padding: '0 14px', borderRadius: 9,
    background: 'rgba(8, 12, 16, 0.7)', color: '#e6edf3',
    border: '1px solid rgba(94, 234, 212, 0.18)',
    fontSize: 14, fontFamily: 'Inter, sans-serif',
    outline: 'none'
  },
  alt: { textAlign: 'center', fontSize: 14, color: '#94a3b8', marginTop: 14 },
  altLink: { color: '#5eead4', textDecoration: 'none', fontWeight: 500 }
};
