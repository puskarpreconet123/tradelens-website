import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, LogOut, Copy, Check, Play, Loader2, TrendingUp, ShieldCheck, Receipt } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import api from '../lib/api';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeLicense, setActiveLicense] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({
    strategy: 'momentum_rsi_14',
    market: 'NASDAQ:AAPL',
    capital: 100000,
    start: '2020-01-01',
    end: '2024-12-31'
  });

  useEffect(() => {
    if (!loading && !user) navigate('/login', { state: { from: '/dashboard' } });
  }, [loading, user, navigate]);

  const loadAll = async () => {
    try {
      const [a, l, o] = await Promise.all([
        api.get('/licenses/active'),
        api.get('/licenses'),
        api.get('/orders')
      ]);
      setActiveLicense(a.data);
      setLicenses(l.data);
      setOrders(o.data);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => { if (user) loadAll(); }, [user]);

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    } catch {}
  };

  const runBacktest = async () => {
    if (!activeLicense) {
      toast({ title: 'No active license', description: 'Please purchase a plan first.' });
      return;
    }
    setRunning(true);
    setResult(null);
    try {
      const res = await api.post('/backtest/run', form);
      setResult(res.data);
      await loadAll();
      toast({ title: 'Backtest complete', description: `Run ${res.data.run_id} · Sharpe ${res.data.sharpe}` });
    } catch (e) {
      const detail = e?.response?.data?.detail;
      const description = Array.isArray(detail)
        ? detail.map((x) => x.msg || x.message || JSON.stringify(x)).join(', ')
        : (typeof detail === 'string' ? detail : 'Try again.');
      toast({ title: 'Backtest failed', description });
    } finally {
      setRunning(false);
    }
  };

  if (loading || !user) return <div style={s.loadingWrap}><Loader2 className="tl-spin" color="#5eead4" /></div>;

  return (
    <div style={s.app}>
      <div className="tl-bg-grid" />
      <div className="tl-bg-glow tl-bg-glow-a" />
      <div className="tl-bg-glow tl-bg-glow-b" />

      <header style={s.header}>
        <Link to="/" style={s.brand}>
          <div style={s.logo}><Activity size={18} color="#062024" strokeWidth={2.5} /></div>
          <span style={s.brandText}>TradeLens</span>
        </Link>
        <div style={s.userRow}>
          <span style={s.userName}>{user.name}</span>
          <span style={s.userEmail}>{user.email}</span>
          <button onClick={() => { logout(); navigate('/'); }} className="tl-btn tl-btn-ghost" style={{ height: 38, padding: '0 14px' }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.hero}>
          <span className="tl-eyebrow">Workspace</span>
          <h1 style={s.h1}>Welcome, <span style={s.h1Accent}>{user.name.split(' ')[0]}</span></h1>
          <p style={s.heroSub}>Manage your licenses, run backtests, and review your order history.</p>
        </div>

        {/* Active License */}
        <div className="tl-card" style={s.licenseCard}>
          <div style={s.licenseHead}>
            <div style={s.licenseIcon}><ShieldCheck size={20} color="#5eead4" /></div>
            <div style={{ flex: 1 }}>
              <div style={s.licenseTitle}>Active License</div>
              {activeLicense ? (
                <div style={s.licenseMeta}>{activeLicense.plan_name} · {activeLicense.period} · expires {new Date(activeLicense.expires_at).toLocaleDateString()}</div>
              ) : (
                <div style={s.licenseMeta}>No active license. <Link to="/#pricing" style={s.altLink}>Browse plans →</Link></div>
              )}
            </div>
            <div style={s.licenseStatus}>
              <span className="tl-livedot" style={{ width: 6, height: 6 }} />
              {activeLicense ? 'ACTIVE' : 'INACTIVE'}
            </div>
          </div>

          {activeLicense && (
            <div style={s.keysRow}>
              <KeyBox label="License Key" value={activeLicense.key} onCopy={() => copy(activeLicense.key, 'lic')} copied={copied === 'lic'} />
              <KeyBox label="API Key" value={activeLicense.api_key} onCopy={() => copy(activeLicense.api_key, 'api')} copied={copied === 'api'} />
              <div style={s.usageBox}>
                <div style={s.usageLab}>Backtest Usage</div>
                <div style={s.usageVal}>
                  {activeLicense.backtests_used} / {activeLicense.backtests_limit >= 999999 ? '∞' : activeLicense.backtests_limit}
                </div>
                <div style={s.usageBarOuter}>
                  <div style={{
                    ...s.usageBarInner,
                    width: activeLicense.backtests_limit >= 999999
                      ? '12%'
                      : `${Math.min(100, (activeLicense.backtests_used / activeLicense.backtests_limit) * 100)}%`
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Backtest panel */}
        <div className="tl-card" style={s.panel}>
          <div style={s.panelHead}>
            <TrendingUp size={18} color="#5eead4" />
            <h2 style={s.panelTitle}>Run a Backtest</h2>
          </div>

          <div style={s.formGrid}>
            <Field label="Strategy" value={form.strategy} onChange={(v) => setForm({ ...form, strategy: v })} />
            <Field label="Market" value={form.market} onChange={(v) => setForm({ ...form, market: v })} />
            <Field label="Capital (USD)" type="number" value={form.capital} onChange={(v) => setForm({ ...form, capital: Number(v) })} />
            <Field label="Start" type="date" value={form.start} onChange={(v) => setForm({ ...form, start: v })} />
            <Field label="End" type="date" value={form.end} onChange={(v) => setForm({ ...form, end: v })} />
            <button onClick={runBacktest} disabled={running || !activeLicense} className="tl-btn tl-btn-primary" style={{ alignSelf: 'flex-end', height: 44 }}>
              {running ? <><Loader2 size={14} className="tl-spin" /> Running…</> : <><Play size={14} /> Run backtest</>}
            </button>
          </div>

          {result && (
            <div style={s.result}>
              <div style={s.resultMetrics}>
                <Metric label="Sharpe" value={result.sharpe} />
                <Metric label="Max Drawdown" value={`${result.max_drawdown}%`} />
                <Metric label="Trades" value={result.trades.toLocaleString()} />
                <Metric label="Net P&L" value={`$${result.net_pnl.toLocaleString()}`} accent />
                <Metric label="Duration" value={`${result.duration_ms}ms`} />
              </div>
              <EquityCurve data={result.equity_curve} />
              <div style={s.runId}>Run ID: <code>{result.run_id}</code></div>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="tl-card" style={s.panel}>
          <div style={s.panelHead}>
            <Receipt size={18} color="#5eead4" />
            <h2 style={s.panelTitle}>Order History</h2>
          </div>
          {orders.length === 0 ? (
            <div style={s.empty}>No orders yet. <Link to="/#pricing" style={s.altLink}>Browse plans →</Link></div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Plan</th>
                  <th style={s.th}>Period</th>
                  <th style={s.th}>Amount</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={s.td}>{new Date(o.created_at).toLocaleString()}</td>
                    <td style={s.td}>{o.plan_name}</td>
                    <td style={s.td}>{o.period}</td>
                    <td style={s.td}>${o.amount_usd}</td>
                    <td style={s.td}>
                      <span style={{ ...s.statusPill, ...(o.status === 'paid' ? s.statusPaid : s.statusPending) }}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* All Licenses */}
        {licenses.length > 0 && (
          <div className="tl-card" style={s.panel}>
            <div style={s.panelHead}>
              <ShieldCheck size={18} color="#5eead4" />
              <h2 style={s.panelTitle}>All Licenses</h2>
            </div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Issued</th>
                  <th style={s.th}>Plan</th>
                  <th style={s.th}>License Key</th>
                  <th style={s.th}>Backtests</th>
                  <th style={s.th}>Expires</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((l) => (
                  <tr key={l.id}>
                    <td style={s.td}>{new Date(l.issued_at).toLocaleDateString()}</td>
                    <td style={s.td}>{l.plan_name} · {l.period}</td>
                    <td style={s.td}><code>{l.key}</code></td>
                    <td style={s.td}>{l.backtests_used} / {l.backtests_limit >= 999999 ? '∞' : l.backtests_limit}</td>
                    <td style={s.td}>{new Date(l.expires_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <style>{`.tl-spin { animation: tl-spin 1s linear infinite; } @keyframes tl-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function KeyBox({ label, value, onCopy, copied }) {
  return (
    <div style={s.keyBox}>
      <div style={s.keyLab}>{label}</div>
      <div style={s.keyRow}>
        <code style={s.keyVal}>{value}</code>
        <button onClick={onCopy} style={s.copyBtn}>
          {copied ? <Check size={13} color="#5eead4" /> : <Copy size={13} color="#94a3b8" />}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label style={s.field}>
      <span style={s.fieldLab}>{label}</span>
      <input style={s.input} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div style={s.metric}>
      <div style={s.metricLab}>{label}</div>
      <div style={{ ...s.metricVal, color: accent ? '#5eead4' : '#f1f5f9' }}>{value}</div>
    </div>
  );
}

function EquityCurve({ data }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 600, h = 160;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 16) - 8;
    return `${x},${y}`;
  }).join(' ');
  const lastVal = data[data.length - 1];
  const change = ((lastVal - data[0]) / data[0] * 100).toFixed(2);

  return (
    <div style={s.chartWrap}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <defs>
          <linearGradient id="eq" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`${points} ${w},${h} 0,${h}`} fill="url(#eq)" stroke="none" />
        <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="1.8" />
      </svg>
      <div style={s.chartMeta}>
        <span>Equity Curve</span>
        <span style={{ color: change >= 0 ? '#5eead4' : '#fb7185' }}>{change >= 0 ? '+' : ''}{change}%</span>
      </div>
    </div>
  );
}

const s = {
  app: { minHeight: '100vh', background: '#06080b', color: '#e6edf3', position: 'relative', overflow: 'hidden' },
  loadingWrap: { minHeight: '100vh', background: '#06080b', display: 'grid', placeItems: 'center' },
  header: {
    position: 'sticky', top: 0, zIndex: 10,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 28px',
    background: 'rgba(6, 8, 11, 0.85)',
    borderBottom: '1px solid rgba(94, 234, 212, 0.12)',
    backdropFilter: 'blur(14px)'
  },
  brand: { display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logo: { width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(120deg, #22d3ee, #14b8a6)', display: 'grid', placeItems: 'center' },
  brandText: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 19, fontWeight: 600, color: '#f1f5f9', letterSpacing: '-0.02em' },
  userRow: { display: 'flex', alignItems: 'center', gap: 14 },
  userName: { fontSize: 14, color: '#e6edf3', fontWeight: 500 },
  userEmail: { fontSize: 12.5, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' },
  main: { maxWidth: 1180, margin: '0 auto', padding: '40px 28px 80px', position: 'relative', zIndex: 1 },
  hero: { marginBottom: 28 },
  h1: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 38, fontWeight: 600, color: '#f1f5f9', letterSpacing: '-0.025em', margin: '14px 0 8px' },
  h1Accent: { background: 'linear-gradient(120deg, #22d3ee, #5eead4)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' },
  heroSub: { color: '#94a3b8', fontSize: 15 },

  licenseCard: { padding: 26, marginBottom: 22 },
  licenseHead: { display: 'flex', alignItems: 'center', gap: 14 },
  licenseIcon: { width: 44, height: 44, borderRadius: 10, background: 'rgba(20, 184, 166, 0.12)', border: '1px solid rgba(94, 234, 212, 0.2)', display: 'grid', placeItems: 'center' },
  licenseTitle: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 600, color: '#f1f5f9' },
  licenseMeta: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  licenseStatus: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5eead4', letterSpacing: '0.16em', display: 'inline-flex', alignItems: 'center', gap: 8 },
  keysRow: { marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 },
  keyBox: { padding: '14px 16px', background: 'rgba(8, 12, 16, 0.6)', border: '1px solid rgba(94, 234, 212, 0.12)', borderRadius: 10 },
  keyLab: { fontSize: 11, color: '#5eead4', textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace' },
  keyRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 8 },
  keyVal: { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#e6edf3', wordBreak: 'break-all' },
  copyBtn: { background: 'transparent', border: '1px solid rgba(94, 234, 212, 0.18)', borderRadius: 6, padding: 6, cursor: 'pointer' },
  usageBox: { padding: '14px 16px', background: 'rgba(8, 12, 16, 0.6)', border: '1px solid rgba(94, 234, 212, 0.12)', borderRadius: 10 },
  usageLab: { fontSize: 11, color: '#5eead4', textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace' },
  usageVal: { fontFamily: 'JetBrains Mono, monospace', fontSize: 17, color: '#f1f5f9', marginTop: 8 },
  usageBarOuter: { height: 5, background: 'rgba(94, 234, 212, 0.08)', borderRadius: 999, overflow: 'hidden', marginTop: 10 },
  usageBarInner: { height: '100%', background: 'linear-gradient(90deg, #22d3ee, #5eead4)', borderRadius: 999 },

  panel: { padding: 26, marginBottom: 22 },
  panelHead: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 },
  panelTitle: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 19, fontWeight: 600, color: '#f1f5f9', margin: 0 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, alignItems: 'end' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  fieldLab: { fontSize: 11, color: '#5eead4', textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: 'JetBrains Mono, monospace' },
  input: { height: 42, padding: '0 12px', borderRadius: 9, background: 'rgba(8, 12, 16, 0.7)', color: '#e6edf3', border: '1px solid rgba(94, 234, 212, 0.18)', fontSize: 13.5, fontFamily: 'JetBrains Mono, monospace', outline: 'none' },

  result: { marginTop: 26, padding: 18, background: 'rgba(8, 12, 16, 0.5)', border: '1px solid rgba(94, 234, 212, 0.12)', borderRadius: 12 },
  resultMetrics: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 18 },
  metric: { padding: '12px 14px', background: 'rgba(6, 8, 11, 0.7)', borderRadius: 9, border: '1px solid rgba(94, 234, 212, 0.1)', textAlign: 'center' },
  metricLab: { fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em' },
  metricVal: { fontFamily: 'JetBrains Mono, monospace', fontSize: 17, fontWeight: 600, marginTop: 4 },
  chartWrap: { padding: 14, background: 'rgba(6, 8, 11, 0.7)', borderRadius: 9, border: '1px solid rgba(94, 234, 212, 0.1)' },
  chartMeta: { display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#94a3b8', marginTop: 6 },
  runId: { marginTop: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#64748b' },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13.5 },
  th: { textAlign: 'left', padding: '12px 12px', fontSize: 11, color: '#5eead4', textTransform: 'uppercase', letterSpacing: '0.14em', borderBottom: '1px solid rgba(94, 234, 212, 0.14)', fontFamily: 'JetBrains Mono, monospace' },
  td: { padding: '14px 12px', color: '#cbd5e1', borderBottom: '1px dashed rgba(94, 234, 212, 0.07)' },
  statusPill: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.12em' },
  statusPaid: { color: '#5eead4', background: 'rgba(20, 184, 166, 0.12)', border: '1px solid rgba(94, 234, 212, 0.3)' },
  statusPending: { color: '#fbbf24', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' },

  empty: { padding: '30px 0', color: '#94a3b8', fontSize: 14 },
  altLink: { color: '#5eead4', textDecoration: 'none', fontWeight: 500 }
};
