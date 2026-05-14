import { useState } from 'react';
import { LineChart, Code2, ShieldCheck, ArrowUpRight, CircleDot } from 'lucide-react';
import { dashboardData } from '../mock';

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: LineChart },
  { key: 'api', label: 'API Demo', icon: Code2 },
  { key: 'security', label: 'Security', icon: ShieldCheck }
];

export default function SoftwarePreview() {
  const [active, setActive] = useState('dashboard');

  return (
    <section id="preview" className="tl-section">
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
        <span className="tl-eyebrow">Platform Preview</span>
        <h2 className="tl-h2">A <span className="accent">trader-grade</span> dashboard</h2>
        <p className="tl-sub" style={{ margin: '0 auto' }}>
          Real-time analytics, multi-market backtests, and audit-ready risk monitoring — unified in one workspace.
        </p>
      </div>

      <div className="tl-card" style={styles.frame}>
        {/* Window chrome */}
        <div style={styles.chrome}>
          <div style={styles.chromeLeft}>
            <div style={{ ...styles.dot, background: '#ef4444' }} />
            <div style={{ ...styles.dot, background: '#f59e0b' }} />
            <div style={{ ...styles.dot, background: '#22c55e' }} />
          </div>
          <div style={styles.chromeMid}>
            <CircleDot size={12} color="#22d3ee" />
            tradelens.app / workspace / momentum-rsi
          </div>
          <div style={styles.chromeTag}>v4.2 · Pro</div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = active === t.key;
            return (
              <button key={t.key} onClick={() => setActive(t.key)}
                style={{
                  ...styles.tabBtn,
                  background: isActive ? 'rgba(20, 184, 166, 0.12)' : 'transparent',
                  color: isActive ? '#5eead4' : '#94a3b8',
                  borderColor: isActive ? 'rgba(94, 234, 212, 0.35)' : 'transparent'
                }}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div style={styles.body}>
          {active === 'dashboard' && <DashboardPane />}
          {active === 'api' && <ApiPane />}
          {active === 'security' && <SecurityPane />}
        </div>

        {/* Footer features */}
        <div style={styles.footFeat}>
          {dashboardData.features.map((f, i) => (
            <div key={i} style={styles.featPill}>
              <span className="tl-livedot" style={{ width: 6, height: 6 }} />
              {f}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPane() {
  return (
    <div style={paneStyles.grid}>
      <div style={paneStyles.col}>
        <div style={paneStyles.cardTitle}>
          <span>Strategy Configuration</span>
          <span style={paneStyles.tagMint}>Live</span>
        </div>
        {dashboardData.config.map((c) => (
          <div key={c.label} style={paneStyles.kv}>
            <span style={paneStyles.kvK}>{c.label}</span>
            <span style={paneStyles.kvV}>{c.value}</span>
          </div>
        ))}

        <div style={paneStyles.chartBox}>
          <svg viewBox="0 0 400 120" width="100%" height="120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,90 L25,82 L50,86 L75,70 L100,76 L125,60 L150,66 L175,48 L200,54 L225,38 L250,46 L275,30 L300,36 L325,22 L350,28 L375,14 L400,18 L400,120 L0,120 Z"
              fill="url(#g1)" />
            <path d="M0,90 L25,82 L50,86 L75,70 L100,76 L125,60 L150,66 L175,48 L200,54 L225,38 L250,46 L275,30 L300,36 L325,22 L350,28 L375,14 L400,18"
              fill="none" stroke="#22d3ee" strokeWidth="1.8" />
          </svg>
          <div style={paneStyles.chartMeta}>
            <span>Equity Curve</span>
            <span style={{ color: '#5eead4' }}>+18.4% YTD</span>
          </div>
        </div>
      </div>

      <div style={paneStyles.col}>
        <div style={paneStyles.cardTitle}>
          <span>System Status</span>
          <span style={paneStyles.tagMint}>
            <span className="tl-livedot" style={{ width: 6, height: 6 }} /> All Systems Operational
          </span>
        </div>
        <div style={paneStyles.sysLine}>
          Latency: <b style={{ color: '#e6edf3' }}>{dashboardData.system.latency}ms</b>
          {' │ '} Uptime: <b style={{ color: '#e6edf3' }}>{dashboardData.system.uptime}</b>
        </div>

        <div style={paneStyles.metrics}>
          {dashboardData.metrics.map((m) => (
            <div key={m.label} style={paneStyles.metricCard}>
              <div style={paneStyles.metricVal}>{m.value}</div>
              <div style={paneStyles.metricLab}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={paneStyles.depthBox}>
          <div style={paneStyles.depthTitle}>Order Book Depth (Live)</div>
          {[
            { side: 'BID', px: '38,412.50', sz: '2.84', pct: 78 },
            { side: 'BID', px: '38,410.20', sz: '1.62', pct: 55 },
            { side: 'ASK', px: '38,415.10', sz: '1.95', pct: 62 },
            { side: 'ASK', px: '38,418.40', sz: '3.10', pct: 84 }
          ].map((r, i) => (
            <div key={i} style={paneStyles.depthRow}>
              <span style={{ color: r.side === 'BID' ? '#5eead4' : '#fb7185', width: 36, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{r.side}</span>
              <span style={{ color: '#e6edf3', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, width: 90 }}>{r.px}</span>
              <span style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, width: 50 }}>{r.sz}</span>
              <div style={paneStyles.depthBarOuter}>
                <div style={{
                  ...paneStyles.depthBarInner,
                  width: `${r.pct}%`,
                  background: r.side === 'BID'
                    ? 'linear-gradient(90deg, rgba(34, 211, 238, 0.45), rgba(34, 211, 238, 0.1))'
                    : 'linear-gradient(90deg, rgba(251, 113, 133, 0.45), rgba(251, 113, 133, 0.1))'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApiPane() {
  const code = `POST /v1/backtest
Authorization: Bearer tl_live_***
Content-Type: application/json

{
  "strategy": "momentum_rsi_14",
  "market": "NASDAQ:AAPL",
  "resolution": "1m",
  "start": "2018-01-01",
  "end": "2024-12-31",
  "capital": 500000
}

→ 200 OK
{
  "run_id": "bt_8a72f31c",
  "sharpe": 1.87,
  "max_drawdown": -8.4,
  "trades": 1284,
  "net_pnl": 142890.55,
  "duration_ms": 1187
}`;
  return (
    <div style={apiStyles.wrap}>
      <pre style={apiStyles.pre}><code>{code}</code></pre>
      <div style={apiStyles.side}>
        <div style={apiStyles.sideCard}>
          <div style={apiStyles.sideLab}>Endpoint</div>
          <div style={apiStyles.sideVal}>api.tradelens.app/v1</div>
        </div>
        <div style={apiStyles.sideCard}>
          <div style={apiStyles.sideLab}>Auth</div>
          <div style={apiStyles.sideVal}>OAuth 2.0 + Bearer</div>
        </div>
        <div style={apiStyles.sideCard}>
          <div style={apiStyles.sideLab}>Latency p50</div>
          <div style={apiStyles.sideVal}>87 ms</div>
        </div>
        <a href="#pricing" className="tl-btn tl-btn-ghost" style={{ width: '100%', justifyContent: 'space-between' }}>
          Read full API docs <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}

function SecurityPane() {
  const items = [
    { lab: 'Encryption at rest', val: 'AES-256-GCM' },
    { lab: 'Encryption in transit', val: 'TLS 1.3' },
    { lab: 'Compliance', val: 'SOC 2 Type II' },
    { lab: 'Audit logging', val: 'Immutable, 7y retention' },
    { lab: 'Access control', val: 'SSO + 2FA + RBAC' },
    { lab: 'Data residency', val: 'US / EU regions' }
  ];
  return (
    <div style={secStyles.grid}>
      {items.map((i) => (
        <div key={i.lab} style={secStyles.card}>
          <ShieldCheck size={18} color="#5eead4" />
          <div>
            <div style={secStyles.lab}>{i.lab}</div>
            <div style={secStyles.val}>{i.val}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  frame: { padding: 0, overflow: 'hidden' },
  chrome: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 18px',
    borderBottom: '1px solid rgba(94, 234, 212, 0.08)',
    background: 'rgba(8, 12, 16, 0.6)'
  },
  chromeLeft: { display: 'flex', gap: 6 },
  dot: { width: 11, height: 11, borderRadius: 999 },
  chromeMid: {
    flex: 1, textAlign: 'center',
    fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#94a3b8',
    display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center'
  },
  chromeTag: {
    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5eead4',
    padding: '4px 10px', borderRadius: 999,
    background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(94, 234, 212, 0.2)'
  },
  tabs: {
    display: 'flex', gap: 8, padding: '14px 18px 0',
    borderBottom: '1px solid rgba(94, 234, 212, 0.06)'
  },
  tabBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '8px 14px', borderRadius: '8px 8px 0 0',
    border: '1px solid transparent', borderBottom: 'none',
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
    transition: 'all 180ms ease', fontFamily: 'Inter, sans-serif'
  },
  body: { padding: '26px 24px' },
  footFeat: {
    display: 'flex', flexWrap: 'wrap', gap: 10,
    padding: '18px 22px', borderTop: '1px solid rgba(94, 234, 212, 0.06)',
    background: 'rgba(8, 12, 16, 0.5)'
  },
  featPill: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 12px', borderRadius: 999,
    background: 'rgba(20, 184, 166, 0.06)',
    border: '1px solid rgba(94, 234, 212, 0.12)',
    fontSize: 12.5, color: '#cbd5e1'
  }
};

const paneStyles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 },
  col: { display: 'flex', flexDirection: 'column', gap: 14 },
  cardTitle: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: 13, color: '#cbd5e1', fontWeight: 500,
    paddingBottom: 8, borderBottom: '1px solid rgba(94, 234, 212, 0.08)'
  },
  tagMint: {
    fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5eead4',
    display: 'inline-flex', alignItems: 'center', gap: 6
  },
  kv: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px dashed rgba(94, 234, 212, 0.08)'
  },
  kvK: { color: '#94a3b8', fontSize: 13 },
  kvV: { color: '#e6edf3', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 },
  chartBox: {
    marginTop: 8, padding: 14,
    background: 'rgba(8, 12, 16, 0.6)',
    border: '1px solid rgba(94, 234, 212, 0.1)',
    borderRadius: 10
  },
  chartMeta: {
    display: 'flex', justifyContent: 'space-between',
    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
    color: '#94a3b8', marginTop: 8
  },
  sysLine: {
    fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
    color: '#94a3b8', paddingBottom: 6
  },
  metrics: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 },
  metricCard: {
    padding: '14px 12px',
    background: 'rgba(8, 12, 16, 0.6)',
    border: '1px solid rgba(94, 234, 212, 0.1)',
    borderRadius: 10, textAlign: 'center'
  },
  metricVal: {
    fontFamily: 'JetBrains Mono, monospace', fontSize: 17,
    color: '#5eead4', fontWeight: 600
  },
  metricLab: { fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 },
  depthBox: {
    marginTop: 8, padding: 12,
    background: 'rgba(8, 12, 16, 0.6)',
    border: '1px solid rgba(94, 234, 212, 0.1)',
    borderRadius: 10
  },
  depthTitle: {
    fontSize: 11, color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.14em', marginBottom: 10,
    fontFamily: 'JetBrains Mono, monospace'
  },
  depthRow: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0'
  },
  depthBarOuter: { flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 999, overflow: 'hidden' },
  depthBarInner: { height: '100%', borderRadius: 999 }
};

const apiStyles = {
  wrap: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 },
  pre: {
    margin: 0, padding: 18,
    background: '#06090d',
    border: '1px solid rgba(94, 234, 212, 0.12)',
    borderRadius: 12,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12.5, lineHeight: 1.7, color: '#cbd5e1',
    overflowX: 'auto'
  },
  side: { display: 'flex', flexDirection: 'column', gap: 10 },
  sideCard: {
    padding: '14px 16px',
    background: 'rgba(8, 12, 16, 0.6)',
    border: '1px solid rgba(94, 234, 212, 0.12)',
    borderRadius: 10
  },
  sideLab: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.14em' },
  sideVal: { fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#e6edf3', marginTop: 6 }
};

const secStyles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 },
  card: {
    display: 'flex', gap: 12, padding: '14px 16px',
    background: 'rgba(8, 12, 16, 0.6)',
    border: '1px solid rgba(94, 234, 212, 0.12)',
    borderRadius: 10
  },
  lab: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' },
  val: { fontFamily: 'JetBrains Mono, monospace', fontSize: 13.5, color: '#e6edf3', marginTop: 4 }
};
