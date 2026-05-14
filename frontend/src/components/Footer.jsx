import { Activity, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const cols = [
  {
    title: 'Platform',
    items: ['Backtesting', 'Live Analytics', 'API Access', 'Indicators Library', 'Risk Engine']
  },
  {
    title: 'Company',
    items: ['About', 'Customers', 'Careers', 'Press', 'Contact']
  },
  {
    title: 'Resources',
    items: ['Documentation', 'API Reference', 'Changelog', 'Status', 'Security']
  }
];

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.brandCol}>
          <div style={styles.brandRow}>
            <div style={styles.logoBox}>
              <Activity size={18} color="#062024" strokeWidth={2.5} />
            </div>
            <span style={styles.brand}>TradeLens</span>
          </div>
          <p style={styles.desc}>
            Tick-precise analytics and backtesting for serious traders. Built for speed, accuracy, and trust.
          </p>
          <div style={styles.socials}>
            {[Twitter, Github, Linkedin, Mail].map((I, i) => (
              <a key={i} href="#" style={styles.socialBtn}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(94, 234, 212, 0.5)'; e.currentTarget.style.background = 'rgba(20, 184, 166, 0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(94, 234, 212, 0.18)'; e.currentTarget.style.background = 'rgba(8, 12, 16, 0.6)'; }}>
                <I size={15} color="#5eead4" />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <h4 style={styles.colTitle}>{c.title}</h4>
            <ul style={styles.colList}>
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" style={styles.link}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#5eead4'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={styles.bottom}>
        <span>© {new Date().getFullYear()} TradeLens, Inc. All rights reserved.</span>
        <div style={styles.bottomLinks}>
          <a href="#" style={styles.bottomLink}>Terms</a>
          <a href="#" style={styles.bottomLink}>Privacy</a>
          <a href="#" style={styles.bottomLink}>Cookies</a>
          <span style={styles.statusInline}>
            <span className="tl-livedot" style={{ width: 6, height: 6 }} />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    position: 'relative', zIndex: 1,
    borderTop: '1px solid rgba(94, 234, 212, 0.1)',
    background: 'linear-gradient(180deg, rgba(6, 8, 11, 0) 0%, rgba(8, 14, 18, 0.7) 100%)',
    padding: '60px 24px 28px'
  },
  inner: {
    maxWidth: 1240, margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.4fr repeat(3, 1fr)',
    gap: 40
  },
  brandCol: {},
  brandRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 },
  logoBox: {
    width: 32, height: 32, borderRadius: 9,
    background: 'linear-gradient(120deg, #22d3ee, #14b8a6)',
    display: 'grid', placeItems: 'center'
  },
  brand: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 19, fontWeight: 600, color: '#f1f5f9', letterSpacing: '-0.02em'
  },
  desc: { fontSize: 14, color: '#94a3b8', lineHeight: 1.7, maxWidth: 320 },
  socials: { marginTop: 18, display: 'flex', gap: 10 },
  socialBtn: {
    width: 36, height: 36, borderRadius: 9,
    background: 'rgba(8, 12, 16, 0.6)',
    border: '1px solid rgba(94, 234, 212, 0.18)',
    display: 'grid', placeItems: 'center',
    transition: 'all 180ms ease', cursor: 'pointer'
  },
  colTitle: {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 14, fontWeight: 600, color: '#f1f5f9',
    textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16
  },
  colList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  link: { color: '#94a3b8', fontSize: 14, textDecoration: 'none', transition: 'color 180ms ease' },
  bottom: {
    maxWidth: 1240, margin: '40px auto 0',
    paddingTop: 22, borderTop: '1px solid rgba(94, 234, 212, 0.08)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14,
    fontSize: 13, color: '#64748b'
  },
  bottomLinks: { display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' },
  bottomLink: { color: '#64748b', textDecoration: 'none', fontSize: 13 },
  statusInline: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#5eead4',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    paddingLeft: 18, borderLeft: '1px solid rgba(94, 234, 212, 0.18)'
  }
};
