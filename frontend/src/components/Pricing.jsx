import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRazorpay } from 'react-razorpay';
import { Check, Sparkles, Crown, Rocket, FlaskConical, Loader2 } from 'lucide-react';
import { plans as fallbackPlans, demoPlan as fallbackDemo } from '../mock';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const tierIcons = { Starter: Rocket, Pro: Sparkles, Enterprise: Crown };

export default function Pricing() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { Razorpay, error: rzpScriptError } = useRazorpay();

  const [plans, setPlans] = useState(fallbackPlans);
  const [demo, setDemo] = useState(fallbackDemo);
  const [selected, setSelected] = useState({ Starter: 0, Pro: 0, Enterprise: 0 });
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    api.get('/plans').then((r) => {
      const mapped = r.data.map((p) => ({
        ...p,
        options: p.options.map((o) => ({ period: o.period, price: `$${o.price_usd}`, detail: o.detail })),
      }));
      if (mapped.length) setPlans(mapped);
    }).catch(() => {});
    api.get('/plans/demo').then((r) => {
      setDemo({
        name: r.data.name,
        price: `$${r.data.price_usd}`,
        duration: r.data.duration,
        limit: r.data.limit,
        perks: r.data.perks,
      });
    }).catch(() => {});
  }, []);

  const launchCheckout = async ({ plan_id, option_index, demo: isDemo, label }) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need an account to purchase a plan.' });
      navigate('/login', { state: { from: '/#pricing' } });
      return;
    }
    setBusy(label);
    try {
      const orderRes = await api.post('/payments/create-order',
        isDemo ? { demo: true } : { plan_id, option_index });
      const data = orderRes.data;

      if (rzpScriptError || !Razorpay) {
        toast({ title: 'Razorpay unavailable', description: 'Could not load Razorpay checkout. Try again later.' });
        setBusy(null);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount_paise,
        currency: data.currency,
        order_id: data.order_id,
        name: 'TradeLens',
        description: `${data.plan_label} · $${data.amount_usd}`,
        prefill: { email: user.email, name: user.name },
        theme: { color: '#22d3ee' },
        handler: async (resp) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            if (verifyRes.data.success) {
              toast({
                title: 'Payment successful',
                description: `License ${verifyRes.data.license.key} issued.`,
              });
              navigate('/dashboard');
            }
          } catch (e) {
            const det = e?.response?.data?.detail;
            const description = Array.isArray(det)
              ? det.map((x) => x.msg || x.message || JSON.stringify(x)).join(', ')
              : (typeof det === 'string' ? det : 'Please contact support.');
            toast({
              title: 'Verification failed',
              description,
            });
          } finally {
            setBusy(null);
          }
        },
        modal: {
          ondismiss: () => setBusy(null),
        },
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        toast({ title: 'Payment failed', description: resp?.error?.description || 'Try again.' });
        setBusy(null);
      });
      rzp.open();
    } catch (e) {
      const det = e?.response?.data?.detail;
      const detail = Array.isArray(det)
        ? det.map((x) => x.msg || x.message || JSON.stringify(x)).join(', ')
        : (typeof det === 'string' ? det : 'Could not initiate checkout.');
      toast({ title: 'Checkout error', description: detail });
      setBusy(null);
    }
  };

  return (
    <section id="pricing" className="tl-section">
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
        <span className="tl-eyebrow">Enterprise-ready Pricing</span>
        <h2 className="tl-h2">Choose your <span className="accent">trading plan</span></h2>
        <p className="tl-sub" style={{ margin: '0 auto' }}>
          Transparent pricing that scales with your strategy volume. Charged in INR via Razorpay.
        </p>
      </div>

      <div style={styles.grid}>
        {plans.map((p) => {
          const Icon = tierIcons[p.name] || Rocket;
          const sel = selected[p.name] ?? 0;
          const opt = p.options[sel];
          const label = `${p.name}-${sel}`;
          const isBusy = busy === label;
          return (
            <div key={p.name} className="tl-card"
              style={{
                ...styles.card,
                borderColor: p.popular ? 'rgba(34, 211, 238, 0.4)' : 'rgba(94, 234, 212, 0.12)',
                boxShadow: p.popular ? '0 30px 60px -28px rgba(34, 211, 238, 0.5)' : 'none',
                transform: p.popular ? 'translateY(-6px)' : 'none'
              }}>
              {p.popular && <div style={styles.popular}>Most Popular</div>}

              <div style={styles.tierHead}>
                <div style={styles.tierIcon}><Icon size={18} color="#5eead4" /></div>
                <div>
                  <h3 style={styles.tierName}>{p.name}</h3>
                  <p style={styles.tierTag}>{p.tag}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                {p.options.map((o, idx) => (
                  <button key={o.period}
                    onClick={() => setSelected(s => ({ ...s, [p.name]: idx }))}
                    style={{
                      ...styles.optionBtn,
                      background: sel === idx ? 'rgba(20, 184, 166, 0.14)' : 'rgba(8, 12, 16, 0.55)',
                      borderColor: sel === idx ? 'rgba(94, 234, 212, 0.45)' : 'rgba(94, 234, 212, 0.1)',
                      color: sel === idx ? '#5eead4' : '#cbd5e1'
                    }}>
                    <span style={styles.optionPeriod}>{o.period}</span>
                    <span style={styles.optionPrice}>{o.price}</span>
                    <span style={styles.optionDetail}>{o.detail}</span>
                  </button>
                ))}
              </div>

              <ul style={styles.features}>
                {p.features.map((f, i) => (
                  <li key={i} style={styles.featureRow}>
                    <Check size={14} color="#5eead4" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => launchCheckout({ plan_id: p.id, option_index: sel, label })}
                disabled={isBusy}
                className={p.popular ? 'tl-btn tl-btn-primary' : 'tl-btn tl-btn-ghost'}
                style={{ width: '100%', marginTop: 'auto' }}>
                {isBusy ? <Loader2 size={14} className="tl-spin" /> : `Buy ${opt.period} — ${opt.price}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Demo card */}
      <div className="tl-card grid grid-cols-1 lg:grid-cols-[1fr_2fr_auto] text-center lg:text-left" style={styles.demoWrap}>
        <div>
          <span className="tl-eyebrow">
            <FlaskConical size={12} /> Try Before You Buy
          </span>
          <h3 style={styles.demoTitle}>{demo.name}</h3>
          <p style={styles.demoTag}>Test every premium feature, risk-free.</p>
        </div>

        <div style={styles.demoMid} className="justify-center lg:justify-start">
          <div style={styles.demoBlock}>
            <div style={styles.demoLab}>{demo.duration}</div>
            <div style={styles.demoPrice}>{demo.price}</div>
            <div style={styles.demoLab}>{demo.limit}</div>
          </div>
          <ul style={styles.demoList} className="items-center lg:items-start">
            {demo.perks.map((p, i) => (
              <li key={i} style={styles.featureRow}>
                <Check size={14} color="#5eead4" /> <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => launchCheckout({ demo: true, label: 'demo' })}
          disabled={busy === 'demo'}
          className="tl-btn tl-btn-primary"
          style={{ alignSelf: 'center', minWidth: 220 }}>
          {busy === 'demo' ? <Loader2 size={14} className="tl-spin" /> : `Try Demo — ${demo.price}`}
        </button>
      </div>
      <style>{`.tl-spin { animation: tl-spin 1s linear infinite; } @keyframes tl-spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 },
  card: { position: 'relative', padding: '32px 26px 28px', display: 'flex', flexDirection: 'column', gap: 18, transition: 'transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease', minHeight: 560 },
  popular: { position: 'absolute', top: -12, right: 22, padding: '5px 12px', borderRadius: 999, background: 'linear-gradient(120deg, #22d3ee, #14b8a6)', color: '#062024', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' },
  tierHead: { display: 'flex', gap: 12, alignItems: 'center' },
  tierIcon: { width: 40, height: 40, borderRadius: 10, background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(94, 234, 212, 0.18)', display: 'grid', placeItems: 'center' },
  tierName: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 600, color: '#f1f5f9', letterSpacing: '-0.01em' },
  tierTag: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  optionRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  optionBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 6px', borderRadius: 10, border: '1px solid', cursor: 'pointer', transition: 'all 180ms ease', fontFamily: 'Inter, sans-serif' },
  optionPeriod: { fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'inherit' },
  optionPrice: { fontFamily: 'JetBrains Mono, monospace', fontSize: 17, fontWeight: 600, color: 'inherit' },
  optionDetail: { fontSize: 11, color: 'inherit', opacity: 0.85 },
  features: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9, flex: 1 },
  featureRow: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6 },
  demoWrap: { marginTop: 36, padding: '34px 32px', gap: 28, alignItems: 'center', background: 'linear-gradient(120deg, rgba(20, 184, 166, 0.12), rgba(8, 12, 16, 0.85))', border: '1px solid rgba(94, 234, 212, 0.22)' },
  demoTitle: { fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 600, color: '#f1f5f9', margin: '12px 0 6px', letterSpacing: '-0.02em' },
  demoTag: { fontSize: 14, color: '#94a3b8' },
  demoMid: { display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' },
  demoBlock: { padding: '18px 22px', borderRadius: 12, background: 'rgba(8, 12, 16, 0.6)', border: '1px solid rgba(94, 234, 212, 0.18)', minWidth: 180 },
  demoLab: { fontSize: 11.5, color: '#5eead4', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 6 },
  demoPrice: { fontFamily: 'JetBrains Mono, monospace', fontSize: 30, fontWeight: 600, color: '#f1f5f9', marginBottom: 6 },
  demoList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }
};
