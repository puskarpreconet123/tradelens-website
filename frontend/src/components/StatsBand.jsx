import { bandStats } from '../mock';

export default function StatsBand() {
  return (
    <section style={styles.section}>
      <div style={styles.inner}>
        {bandStats.map((s) => (
          <div key={s.label} style={styles.card}>
            <div style={styles.val}>{s.value}</div>
            <div style={styles.lab}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '24px 24px 60px',
    maxWidth: 1240, margin: '0 auto'
  },
  inner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
    padding: '38px 28px',
    background: 'linear-gradient(120deg, rgba(15, 23, 28, 0.85), rgba(9, 14, 18, 0.85))',
    border: '1px solid rgba(94, 234, 212, 0.16)',
    borderRadius: 18,
    backdropFilter: 'blur(10px)'
  },
  card: { textAlign: 'center' },
  val: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 38, fontWeight: 600,
    background: 'linear-gradient(120deg, #22d3ee, #5eead4)',
    WebkitBackgroundClip: 'text', backgroundClip: 'text',
    color: 'transparent',
    letterSpacing: '-0.02em'
  },
  lab: {
    marginTop: 4,
    fontSize: 12.5, color: '#94a3b8',
    letterSpacing: '0.14em', textTransform: 'uppercase'
  }
};
