import { ArrowRight, ChevronDown, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { heroStats } from '../mock';

const iconMap = {
  'AES-256': ShieldCheck,
  '<10ms': Zap,
  '$2.4B+': BarChart3
};

export default function Hero() {
  return (
    <section id="top" style={styles.section} className="pt-32 sm:pt-44 pb-20 px-6 sm:px-10">
      <div style={styles.inner} className="tl-anim-up">
        <span className="tl-eyebrow">
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#22d3ee', display: 'inline-block', boxShadow: '0 0 8px #22d3ee' }} />
          Pro Trading Analytics
        </span>

        <h1 style={styles.h1}>
          Tick-Precise <br />
          <span style={styles.h1Accent}>Strategy Backtesting</span>
        </h1>

        <p style={styles.sub}>
          Institutional-grade analytics for retail and pro traders. Backtest, monitor, and deploy
          strategies on 10+ years of tick-level data with bank-grade security and a 99.99% engine uptime.
        </p>

        <div style={styles.cta}>
          <a href="#pricing" className="tl-btn tl-btn-primary">
            Get Access <ArrowRight size={16} />
          </a>
          <a href="#preview" className="tl-btn tl-btn-ghost">
            View Platform
          </a>
        </div>

        <div style={styles.stats} className="grid-cols-1 sm:grid-cols-3">
          {heroStats.map((s) => {
            const Icon = iconMap[s.value] || Zap;
            return (
              <div key={s.label} className="tl-card grid grid-cols-[auto_1fr]" style={styles.statCard}>
                <div style={styles.statIcon}>
                  <Icon size={18} color="#5eead4" />
                </div>
                <div>
                  <div style={styles.statVal}>{s.value}</div>
                  <div style={styles.statLab}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <a href="#preview" style={styles.scroll} aria-label="scroll down">
          <span style={styles.scrollText}>Scroll</span>
          <span style={styles.scrollIcon}><ChevronDown size={14} /></span>
        </a>
      </div>
    </section>
  );
}

const styles = {
  section: {
    position: 'relative',
    maxWidth: 1240, margin: '0 auto',
    minHeight: '100vh',
    display: 'flex', alignItems: 'center'
  },
  inner: { maxWidth: 980, position: 'relative' },
  h1: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 'clamp(46px, 7vw, 92px)',
    fontWeight: 600,
    letterSpacing: '-0.035em',
    lineHeight: 1.02,
    color: '#f8fafc',
    margin: '22px 0 26px'
  },
  h1Accent: {
    background: 'linear-gradient(120deg, #22d3ee, #5eead4 55%, #99f6e4)',
    WebkitBackgroundClip: 'text', backgroundClip: 'text',
    color: 'transparent', display: 'inline-block'
  },
  sub: {
    fontSize: 17, lineHeight: 1.7, color: '#94a3b8',
    maxWidth: 640, marginBottom: 36
  },
  cta: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  stats: {
    marginTop: 64,
    display: 'grid',
    gap: 14,
    maxWidth: 760
  },
  statCard: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '18px 20px',
    background: 'linear-gradient(180deg, rgba(15, 23, 28, 0.7), rgba(9, 14, 18, 0.7))',
    border: '1px solid rgba(94, 234, 212, 0.12)',
    borderRadius: 12,
    backdropFilter: 'blur(10px)'
  },
  statIcon: {
    width: 38, height: 38, borderRadius: 9,
    background: 'rgba(20, 184, 166, 0.12)',
    border: '1px solid rgba(94, 234, 212, 0.18)',
    display: 'grid', placeItems: 'center'
  },
  statVal: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 19, fontWeight: 600, color: '#f1f5f9', letterSpacing: '-0.01em'
  },
  statLab: {
    fontSize: 11.5, color: '#94a3b8', textTransform: 'uppercase',
    letterSpacing: '0.14em', marginTop: 2
  },
  scroll: {
    marginTop: 60,
    display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    color: '#5eead4', textDecoration: 'none',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase'
  },
  scrollText: {},
  scrollIcon: {
    width: 28, height: 28, borderRadius: 999,
    border: '1px solid rgba(94, 234, 212, 0.3)',
    display: 'grid', placeItems: 'center',
    animation: 'tl-pulse-dot 2.4s ease-in-out infinite'
  }
};
