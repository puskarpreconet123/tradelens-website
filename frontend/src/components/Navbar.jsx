import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { label: 'Platform', href: '#preview' },
  { label: 'How it works', href: '#start' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const handleClickOutside = (e) => {
      if (open && headerRef.current && !headerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024 && open) setOpen(false);
    };

    window.addEventListener('scroll', onScroll);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  return (
    <>
      <div style={styles.statusBar}>
        <span className="tl-livedot" />
        <span style={styles.statusText}>TradeLens — Live Markets</span>
      </div>
      <header ref={headerRef} style={{
        ...styles.header,
        background: scrolled ? 'rgba(6, 8, 11, 0.75)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(94, 234, 212, 0.1)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none'
      }}>
        <div style={styles.inner}>
          <Link to="/" style={styles.brandRow}>
            <div style={styles.logoBox}>
              <Activity size={18} color="#062024" strokeWidth={2.5} />
            </div>
            <span style={styles.brand}>TradeLens</span>
          </Link>
          <nav className="hidden lg:flex" style={styles.nav}>
            {links.map(l => (
              <a key={l.href} href={l.href} style={styles.navLink}
                 onMouseEnter={(e) => e.currentTarget.style.color = '#5eead4'}
                 onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-10" style={styles.right}>
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <button onClick={() => navigate('/dashboard')} className="tl-btn tl-btn-primary" style={{ height: 40, padding: '0 16px' }}>
                  <LayoutDashboard size={14} /> Dashboard
                </button>
              ) : (
                <>
                  <Link to="/login" className="tl-btn tl-btn-ghost" style={{ height: 40, padding: '0 16px' }}>
                    Sign in
                  </Link>
                  <a href="#pricing" className="tl-btn tl-btn-primary" style={{ height: 40, padding: '0 18px' }}>
                    Get Access
                  </a>
                </>
              )}
            </div>
            <button className="lg:hidden" style={styles.menuBtn} onClick={() => setOpen(o => !o)} aria-label="menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <div style={styles.mobile}>
            {links.map(l => (
              <a key={l.href} href={l.href} style={styles.mobileLink} onClick={() => setOpen(false)}>
                {l.label} <ChevronRight size={14} className="opacity-40" />
              </a>
            ))}
            {!user && (
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/login" className="tl-btn tl-btn-ghost" style={{ height: 44 }} onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <a href="#pricing" className="tl-btn tl-btn-primary" style={{ height: 44 }} onClick={() => setOpen(false)}>
                  Get Access
                </a>
              </div>
            )}
            {user && (
              <button onClick={() => { navigate('/dashboard'); setOpen(false); }} className="tl-btn tl-btn-primary mt-4" style={{ height: 44 }}>
                <LayoutDashboard size={14} /> Dashboard
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
}

const styles = {
  statusBar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 51,
    height: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    background: 'linear-gradient(90deg, rgba(20, 184, 166, 0.15), rgba(34, 211, 238, 0.15))',
    borderBottom: '1px solid rgba(94, 234, 212, 0.18)',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11, color: '#a7f3d0', letterSpacing: '0.16em', textTransform: 'uppercase'
  },
  statusText: { fontWeight: 500 },
  header: {
    position: 'fixed', top: 28, left: 0, right: 0, zIndex: 50,
    transition: 'background 220ms ease, border-color 220ms ease'
  },
  inner: {
    maxWidth: 1240, margin: '0 auto', padding: '14px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoBox: {
    width: 34, height: 34, borderRadius: 9,
    background: 'linear-gradient(120deg, #22d3ee, #14b8a6)',
    display: 'grid', placeItems: 'center',
    boxShadow: '0 8px 22px -8px rgba(34, 211, 238, 0.55)'
  },
  brand: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: '#f1f5f9'
  },
  nav: { gap: 30, alignItems: 'center' },
  navLink: {
    color: '#cbd5e1', fontSize: 14, fontWeight: 500,
    textDecoration: 'none', transition: 'color 180ms ease'
  },
  right: { gap: 10, alignItems: 'center' },
  menuBtn: {
    display: 'flex',
    background: 'transparent', border: '1px solid rgba(94, 234, 212, 0.2)',
    color: '#e6edf3', width: 38, height: 38, borderRadius: 9, cursor: 'pointer',
    justifyContent: 'center', alignItems: 'center'
  },
  mobile: {
    display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 24px 18px',
    background: 'rgba(6, 8, 11, 0.98)',
    borderBottom: '1px solid rgba(94, 234, 212, 0.1)',
    position: 'absolute', top: '100%', left: 0, right: 0,
    animation: 'tl-slideDown 300ms ease-out both',
    backdropFilter: 'blur(20px)',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto'
  },
  mobileLink: {
    color: '#e6edf3', textDecoration: 'none', fontSize: 15, padding: '14px 0',
    borderBottom: '1px solid rgba(94, 234, 212, 0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  }
};
