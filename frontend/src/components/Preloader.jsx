import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 2000;
    const tick = (t) => {
      const p = Math.min(100, ((t - start) / dur) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="tl-pre" style={styles.wrap}>
      <div style={styles.brandRow}>
        <div style={styles.logoBox}>
          <Activity size={22} color="#062024" strokeWidth={2.5} />
        </div>
        <div>
          <div style={styles.brand}>TradeLens</div>
          <div style={styles.tag}>Loading secure environment...</div>
        </div>
      </div>
      <div style={styles.barOuter}>
        <div style={{ ...styles.barInner, width: `${progress}%` }} />
      </div>
      <div style={styles.percent}>{Math.round(progress)}%</div>
    </div>
  );
}

const styles = {
  wrap: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(circle at center, #0a141a 0%, #06080b 70%)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    animation: 'tl-fadeUp 400ms ease'
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 14 },
  logoBox: {
    width: 44, height: 44, borderRadius: 12,
    background: 'linear-gradient(120deg, #22d3ee, #14b8a6)',
    display: 'grid', placeItems: 'center',
    boxShadow: '0 0 30px rgba(34,211,238,0.45)'
  },
  brand: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: '#f1f5f9'
  },
  tag: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 11, letterSpacing: '0.18em',
    color: '#5eead4', textTransform: 'uppercase'
  },
  barOuter: {
    width: 280, height: 4, background: 'rgba(94, 234, 212, 0.1)',
    borderRadius: 999, overflow: 'hidden',
    border: '1px solid rgba(94, 234, 212, 0.18)'
  },
  barInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #22d3ee, #5eead4)',
    borderRadius: 999,
    transition: 'width 80ms linear',
    boxShadow: '0 0 12px rgba(34, 211, 238, 0.7)'
  },
  percent: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 12, color: '#94a3b8', letterSpacing: '0.1em'
  }
};
