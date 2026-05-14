import { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { faqs } from '../mock';

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="tl-section">
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
        <span className="tl-eyebrow">FAQ</span>
        <h2 className="tl-h2">Common <span className="accent">questions</span></h2>
        <p className="tl-sub" style={{ margin: '0 auto' }}>
          Everything you might want to know about TradeLens, data, and onboarding.
        </p>
      </div>

      <div style={styles.list}>
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="tl-card" style={{ ...styles.item, borderColor: isOpen ? 'rgba(94, 234, 212, 0.35)' : 'rgba(94, 234, 212, 0.1)' }}>
              <button style={styles.head} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span style={styles.q}>{f.q}</span>
                <span style={styles.toggle}>
                  {isOpen ? <Minus size={16} color="#5eead4" /> : <Plus size={16} color="#5eead4" />}
                </span>
              </button>
              <div style={{
                ...styles.bodyWrap,
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                opacity: isOpen ? 1 : 0
              }}>
                <div style={{ overflow: 'hidden' }}>
                  <p style={styles.body}>{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.cta}>
        <MessageCircle size={18} color="#5eead4" />
        <span>Need a custom answer?</span>
        <a href="#pricing" className="tl-btn tl-btn-ghost" style={{ height: 38, padding: '0 16px' }}>
          Talk to sales
        </a>
      </div>
    </section>
  );
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 880, margin: '0 auto' },
  item: { padding: 0, overflow: 'hidden', transition: 'border-color 220ms ease' },
  head: {
    width: '100%', textAlign: 'left',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    gap: 16,
    padding: '20px 22px',
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#f1f5f9', fontFamily: 'Inter, sans-serif'
  },
  q: { fontSize: 15.5, fontWeight: 500, letterSpacing: '-0.005em' },
  toggle: {
    width: 30, height: 30, borderRadius: 999,
    border: '1px solid rgba(94, 234, 212, 0.25)',
    display: 'grid', placeItems: 'center',
    background: 'rgba(20, 184, 166, 0.06)'
  },
  bodyWrap: {
    display: 'grid',
    transition: 'grid-template-rows 280ms ease, opacity 280ms ease'
  },
  body: {
    margin: 0, padding: '0 22px 22px',
    fontSize: 14.5, lineHeight: 1.75, color: '#94a3b8'
  },
  cta: {
    marginTop: 32,
    display: 'inline-flex', alignItems: 'center', gap: 14,
    padding: '14px 20px', borderRadius: 999,
    background: 'rgba(20, 184, 166, 0.06)',
    border: '1px solid rgba(94, 234, 212, 0.2)',
    color: '#cbd5e1', fontSize: 14,
    margin: '32px auto 0',
    width: 'fit-content'
  }
};
