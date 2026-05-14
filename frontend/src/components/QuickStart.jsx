import { Compass, Lock, Rocket, BarChart3, Check } from 'lucide-react';
import { steps, sysReq, markets } from '../mock';

const stepIcons = [Compass, Lock, Rocket, BarChart3];

export default function QuickStart() {
  return (
    <section id="start" className="tl-section">
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
        <span className="tl-eyebrow">Quick Start Guide</span>
        <h2 className="tl-h2">Go live in <span className="accent">4 simple steps</span></h2>
        <p className="tl-sub" style={{ margin: '0 auto' }}>
          From signup to your first backtest in under three minutes. Designed for individual traders and full desks.
        </p>
      </div>

      <div style={styles.stepsGrid}>
        {steps.map((s, i) => {
          const Icon = stepIcons[i];
          return (
            <div key={s.num} className="tl-card" style={styles.stepCard}>
              <div style={styles.iconRow}>
                <div style={styles.iconBox}><Icon size={20} color="#5eead4" /></div>
                <span style={styles.num}>{s.num}</span>
              </div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <a href="#pricing" className="tl-btn tl-btn-primary">Browse Plans</a>
      </div>

      <div style={styles.specGrid}>
        <div className="tl-card" style={styles.specCol}>
          <h4 style={styles.specTitle}>Platform Specs</h4>
          {sysReq.map((r) => (
            <div key={r.label} style={styles.specRow}>
              <span style={styles.specK}>{r.label}</span>
              <span style={styles.specV}>{r.value}</span>
            </div>
          ))}
        </div>
        <div className="tl-card" style={styles.specCol}>
          <h4 style={styles.specTitle}>Supported Markets</h4>
          {markets.map((m) => (
            <div key={m} style={styles.marketRow}>
              <Check size={14} color="#5eead4" />
              <span>{m}</span>
            </div>
          ))}
        </div>
        <div className="tl-card" style={{ ...styles.specCol, background: 'linear-gradient(150deg, rgba(20, 184, 166, 0.14), rgba(8, 12, 16, 0.7))' }}>
          <h4 style={styles.specTitle}>Onboarding Support Included</h4>
          <p style={styles.specDesc}>
            All plans include guided onboarding via email and Slack — available within minutes of activation.
            Pro and Enterprise plans add dedicated success managers.
          </p>
          <a href="#pricing" className="tl-btn tl-btn-ghost" style={{ marginTop: 8 }}>View Plans</a>
        </div>
      </div>
    </section>
  );
}

const styles = {
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16
  },
  stepCard: {
    padding: '26px 22px',
    transition: 'transform 220ms ease, border-color 220ms ease',
    cursor: 'default'
  },
  iconRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBox: {
    width: 42, height: 42, borderRadius: 10,
    background: 'rgba(20, 184, 166, 0.1)',
    border: '1px solid rgba(94, 234, 212, 0.18)',
    display: 'grid', placeItems: 'center'
  },
  num: {
    fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
    color: '#5eead4', letterSpacing: '0.16em',
    padding: '4px 10px', borderRadius: 999,
    border: '1px solid rgba(94, 234, 212, 0.18)'
  },
  stepTitle: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 19, fontWeight: 600, color: '#f1f5f9',
    margin: '22px 0 10px', letterSpacing: '-0.01em'
  },
  stepDesc: { fontSize: 14, lineHeight: 1.7, color: '#94a3b8' },
  specGrid: {
    marginTop: 48,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 16
  },
  specCol: { padding: '26px 22px' },
  specTitle: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 16, fontWeight: 600, color: '#f1f5f9',
    marginBottom: 16, letterSpacing: '-0.01em'
  },
  specRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px dashed rgba(94, 234, 212, 0.08)',
    fontSize: 13
  },
  specK: { color: '#94a3b8' },
  specV: { color: '#e6edf3', fontFamily: 'JetBrains Mono, monospace' },
  marketRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 0', color: '#cbd5e1', fontSize: 14
  },
  specDesc: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 14 }
};
