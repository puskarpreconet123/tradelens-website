// Mock data for TradeLens landing page

export const heroStats = [
  { value: 'AES-256', label: 'Encryption' },
  { value: '<10ms', label: 'Tick Latency' },
  { value: '$2.4B+', label: 'Volume Analyzed' }
];

export const dashboardData = {
  config: [
    { label: 'Strategy', value: 'Momentum / 14D RSI' },
    { label: 'Capital', value: '$500,000.00 USD' },
    { label: 'Market', value: 'NASDAQ + Crypto' },
    { label: 'Timeframe', value: '1H Candles' }
  ],
  system: { latency: 42, uptime: '99.99%' },
  metrics: [
    { label: 'Win Rate', value: '67.8%' },
    { label: 'Avg. Backtest', value: '1.2s' },
    { label: 'Active Strategies', value: '2,847' }
  ],
  features: [
    'Sub-second backtest engine',
    'Real-time tick analytics',
    'Bank-grade data security',
    'RESTful & WebSocket API'
  ]
};

export const steps = [
  {
    num: '01',
    title: 'Choose Your Plan',
    desc: 'Select from Starter, Pro, or Enterprise tiers based on your backtesting and data volume needs.'
  },
  {
    num: '02',
    title: 'Secure Checkout',
    desc: 'Pick your billing period and complete checkout with your email and team details — no card stored.'
  },
  {
    num: '03',
    title: 'Instant Activation',
    desc: 'After payment, receive your API keys, dashboard access, and onboarding docs in under a minute.'
  },
  {
    num: '04',
    title: 'Run Your First Backtest',
    desc: 'Connect a strategy, pick a market, and analyze 10+ years of historical data in seconds.'
  }
];

export const sysReq = [
  { label: 'API Support', value: 'RESTful HTTP/2 + WS' },
  { label: 'Authentication', value: 'OAuth 2.0 + API Keys' },
  { label: 'Rate Limiting', value: '10,000 req/min' },
  { label: 'Uptime Guarantee', value: '99.99% SLA' },
  { label: 'Response Time', value: '<100ms average' }
];

export const markets = [
  'NASDAQ & NYSE Equities',
  'CME Futures',
  'FX Spot (28 pairs)',
  'Crypto Spot & Perps',
  'Options Chain Analytics'
];

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tag: 'Perfect for individual traders',
    popular: false,
    options: [
      { period: '1 day', price: '$49', detail: '50 backtests' },
      { period: '7 days', price: '$99', detail: '500 backtests' },
      { period: '1 month', price: '$299', detail: '3,000 backtests' }
    ],
    features: [
      'Up to 3,000 backtests / month',
      'Standard data resolution (1m)',
      'Email support',
      'Core indicators library',
      'Weekly data updates',
      '30-day report history',
      'Telegram / Slack alerts'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    tag: 'For growing trading desks',
    popular: true,
    options: [
      { period: '1 day', price: '$99', detail: '500 backtests' },
      { period: '7 days', price: '$199', detail: '5,000 backtests' },
      { period: '1 month', price: '$599', detail: '30,000 backtests' }
    ],
    features: [
      'Up to 30,000 backtests / month',
      'High-res tick data (1s)',
      'Priority chat support',
      'Advanced indicators + ML',
      '90-day report history',
      'Real-time data feeds',
      'Multi-account workspaces'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tag: 'Institutional-grade platform',
    popular: false,
    options: [
      { period: '1 day', price: '$799', detail: 'Unlimited' },
      { period: '7 days', price: '$1599', detail: 'Unlimited + WS' },
      { period: '1 month', price: '$9999', detail: 'Unlimited + SLA' }
    ],
    features: [
      'Unlimited backtests & strategies',
      'Tick-level historical data',
      'Dedicated success manager',
      '24/7 phone + Slack support',
      'Custom indicator development',
      '370-day report retention',
      'On-prem deployment option'
    ]
  }
];

export const demoPlan = {
  name: 'Try Demo',
  price: '$19',
  duration: '1 Hour Full Access',
  limit: '50 Backtests Included',
  perks: [
    'Run up to 50 backtests',
    'Full 1-hour access',
    'Test every Pro feature',
    'Instant activation',
    'Email onboarding'
  ]
};

export const bandStats = [
  { value: '12B+', label: 'Ticks Processed' },
  { value: '10K+', label: 'Active Traders' },
  { value: '99.9%', label: 'Engine Uptime' },
  { value: '24/7', label: 'Live Support' }
];

export const faqs = [
  {
    q: 'What is TradeLens and how does it work?',
    a: 'TradeLens is a professional-grade analytics and backtesting platform. After purchasing a license, you receive API access and a full dashboard to build, test, and monitor trading strategies across equities, FX, futures, and crypto markets — all powered by tick-level historical data.'
  },
  {
    q: 'Which markets and data feeds are supported?',
    a: 'We support NASDAQ & NYSE equities, CME futures, FX spot (28 pairs), crypto spot and perpetuals, plus a full options analytics chain. Market selection is available directly in the dashboard when configuring a backtest or live monitor.'
  },
  {
    q: 'How accurate is the historical data?',
    a: 'All backtests run on tick-level data sourced from primary venues with full corporate-action adjustment. We retain 10+ years for equities and futures, and full-history for crypto, with strict point-in-time integrity to prevent look-ahead bias.'
  },
  {
    q: 'Can I connect my own strategies via API?',
    a: 'Yes. TradeLens provides a RESTful HTTP/2 API and WebSocket streams. You can deploy strategies in Python, JavaScript, or via our visual builder, and receive real-time fills, P&L, and risk metrics back through the same API.'
  },
  {
    q: 'Is TradeLens suitable for funds and trading desks?',
    a: 'Absolutely. The Enterprise plan includes a dedicated success manager, on-prem deployment option, custom indicator development, and a signed 99.99% uptime SLA — designed for institutional trading desks and quant funds.'
  },
  {
    q: 'How do I receive my license after purchase?',
    a: 'After payment confirmation, your API keys, dashboard credentials, and onboarding guide are delivered to the email and Slack/Telegram contact you provide at checkout — typically within 60 seconds.'
  },
  {
    q: 'What happens after my license expires?',
    a: 'When your license expires, all data and reports remain in read-only mode for 30 days, after which you can renew at any time to restore full access. Previously generated backtests can always be exported as CSV or PDF.'
  },
  {
    q: 'How do I get technical support?',
    a: 'All paid plans include email support. Pro and Enterprise tiers add priority Slack and Telegram support with guaranteed response times. Live human support can be added to any plan as a $2 premium add-on at checkout.'
  }
];
