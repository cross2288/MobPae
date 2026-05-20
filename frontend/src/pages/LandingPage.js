import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, TrendingUp, Shield, Clock, CheckCircle2, Users, Building2, Wallet,
  Sparkles, Star, Zap, Lock, BarChart3, ChevronDown, X
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Button } from '../components/ui/button';

// Animated counter hook
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
};

// Sample chart data
const adoptionData = [
  { month: 'Jan', employees: 1200 },
  { month: 'Feb', employees: 2400 },
  { month: 'Mar', employees: 4100 },
  { month: 'Apr', employees: 6800 },
  { month: 'May', employees: 9500 },
  { month: 'Jun', employees: 13200 },
  { month: 'Jul', employees: 18400 },
  { month: 'Aug', employees: 25100 },
];

const disbursementData = [
  { month: 'Jan', amount: 12 },
  { month: 'Feb', amount: 28 },
  { month: 'Mar', amount: 45 },
  { month: 'Apr', amount: 67 },
  { month: 'May', amount: 89 },
  { month: 'Jun', amount: 124 },
];

const useCaseData = [
  { name: 'Medical', value: 32, color: '#1D4ED8' },
  { name: 'Education', value: 24, color: '#3B82F6' },
  { name: 'Home', value: 18, color: '#60A5FA' },
  { name: 'Travel', value: 14, color: '#93C5FD' },
  { name: 'Other', value: 12, color: '#DBEAFE' },
];

export const LandingPage = () => {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const employeesCount = useCounter(125000);
  const companiesCount = useCounter(450);
  const disbursedCount = useCounter(842);
  const satisfactionCount = useCounter(97);

  return (
    <div className="min-h-screen font-ibm bg-slate-50" data-testid="landing-page">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2" data-testid="logo">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-outfit font-semibold text-slate-900">Mob Pae</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-700">
            <a href="#product" className="hover:text-primary transition-colors">Product</a>
            <a href="#impact" className="hover:text-primary transition-colors">Impact</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-primary hidden sm:inline-flex" data-testid="employer-login-nav">Sign In</Button>
            </Link>
            <Button
              onClick={() => setShowEnquiry(true)}
              className="rounded-full bg-primary hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-md"
              data-testid="employee-login-nav"
            >
              Get Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#0A1128' }}
        data-testid="hero-section"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/7c8cee12-4131-4033-8d27-b496ae48e677/images/8ee0b9798720e266ea39481c07dd54f2c90752d02b0ff8c57570421ef390504b.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1128]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="h-4 w-4 text-blue-300" />
                <span className="text-sm text-slate-300">Trusted by 450+ companies across India</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-outfit font-medium tracking-tight text-white mb-6 leading-[1.05]" data-testid="hero-title">
                Salary on demand.<br />
                <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">Built for modern teams.</span>
              </h1>
              <p className="text-lg text-slate-300 max-w-xl mb-10 leading-relaxed" data-testid="hero-subtitle">
                Mob Pae empowers your workforce with instant access to earned wages. Reduce financial stress, boost retention, and offer the benefit employees actually use.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Button
                  onClick={() => setShowEnquiry(true)}
                  size="lg"
                  className="rounded-full bg-primary hover:bg-blue-700 text-base px-8 py-6 transition-all hover:-translate-y-0.5 shadow-xl shadow-blue-900/50"
                  data-testid="enquire-now-btn"
                >
                  Enquire Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 border-white/30 bg-white/5 text-white hover:bg-white hover:text-slate-900 text-base px-8 py-6 transition-all hover:-translate-y-0.5"
                    data-testid="get-started-btn"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>RBI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-400" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span>Instant Setup</span>
                </div>
              </div>
            </div>

            {/* Right - Dashboard preview / floating cards */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-8 -left-8 w-64 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-slate-400">Available Now</span>
                  <Wallet className="h-4 w-4 text-blue-300" />
                </div>
                <div className="text-3xl font-outfit font-semibold text-white mb-1">₹15,000</div>
                <div className="text-xs text-slate-400">of ₹50,000 monthly salary</div>
                <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div className="relative ml-12 mt-12 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl p-8 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">This Month</p>
                    <h3 className="text-2xl font-outfit font-medium text-slate-900">Adoption Growth</h3>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100">
                    <TrendingUp className="h-3 w-3 text-green-700" />
                    <span className="text-xs font-medium text-green-700">+34%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={adoptionData.slice(-6)}>
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="employees" stroke="#1D4ED8" strokeWidth={3} fill="url(#heroGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="absolute -bottom-6 -right-6 w-56 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-2xl rotate-[4deg] hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Request Approved</p>
                    <p className="text-sm font-medium text-white">₹8,500 disbursed</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400">2 mins ago • by John Doe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Trust Bar */}
      <section className="relative -mt-12 z-20 px-6" data-testid="stats-section">
        <div className="max-w-6xl mx-auto rounded-3xl bg-white shadow-[0_24px_60px_rgba(10,17,40,0.12)] border border-slate-100 p-8 sm:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatTile value={`${employeesCount.toLocaleString()}+`} label="Active Employees" />
            <StatTile value={`${companiesCount}+`} label="Partner Companies" />
            <StatTile value={`₹${disbursedCount}Cr+`} label="Disbursed YTD" />
            <StatTile value={`${satisfactionCount}%`} label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-24 bg-slate-50" data-testid="product-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">The Product</p>
            <h2 className="text-3xl sm:text-5xl font-outfit font-medium tracking-tight text-slate-900 mb-6">
              Built for both sides of the table
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              A single platform that gives employers control and employees freedom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={TrendingUp}
              title="Instant Access"
              description="Employees access earned salary 24/7. No queues, no paperwork, no waiting for payday."
              metric="< 60 seconds"
              metricLabel="Avg request time"
              testId="product-card-1"
            />
            <FeatureCard
              icon={Shield}
              title="Employer Controlled"
              description="You set advance limits, approve requests, and track everything in one premium dashboard."
              metric="100%"
              metricLabel="Approval control"
              testId="product-card-2"
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Track adoption, disbursements, and employee financial wellness in beautiful charts."
              metric="Live"
              metricLabel="Updates"
              testId="product-card-3"
            />
          </div>
        </div>
      </section>

      {/* Impact / Charts Section */}
      <section id="impact" className="py-24 bg-white" data-testid="impact-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">Real Impact</p>
            <h2 className="text-3xl sm:text-5xl font-outfit font-medium tracking-tight text-slate-900 mb-6">
              Numbers that move the needle
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              See how Mob Pae is changing the way India gets paid.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Adoption Chart */}
            <div className="lg:col-span-2 rounded-3xl bg-slate-50 border border-slate-100 p-8" data-testid="adoption-chart">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Adoption Curve</p>
                  <h3 className="text-2xl font-outfit font-medium text-slate-900">Employee growth over 8 months</h3>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100">
                  <TrendingUp className="h-4 w-4 text-green-700" />
                  <span className="text-sm font-medium text-green-700">+1,990%</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={adoptionData}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: '#0A1128', border: 'none', borderRadius: 12, color: 'white'
                    }}
                  />
                  <Area type="monotone" dataKey="employees" stroke="#1D4ED8" strokeWidth={3} fill="url(#grad1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Use Cases Pie */}
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-8" data-testid="usecase-chart">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Top Use Cases</p>
              <h3 className="text-xl font-outfit font-medium text-slate-900 mb-6">Where employees spend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={useCaseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {useCaseData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {useCaseData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-700">{d.name}</span>
                    <span className="text-slate-500 ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disbursement Bar */}
            <div className="lg:col-span-3 rounded-3xl bg-[#0A1128] p-8 text-white" data-testid="disbursement-chart">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-300 mb-2">Monthly Disbursement</p>
                  <h3 className="text-2xl font-outfit font-medium">₹ Crores disbursed this year</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-outfit font-semibold">₹842 Cr</p>
                  <p className="text-sm text-slate-400">Total YTD</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={disbursementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: '#F8FAFC', border: 'none', borderRadius: 12, color: '#0F172A'
                    }}
                  />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">How It Works</p>
            <h2 className="text-3xl sm:text-5xl font-outfit font-medium tracking-tight text-slate-900 mb-6">
              Three steps. That's it.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {[
              { num: '01', title: 'Employer Onboards', desc: 'Submit an enquiry and get approved by our team within 24 hours.', icon: Building2 },
              { num: '02', title: 'Add Employees', desc: 'Upload your workforce and set personalised advance limits.', icon: Users },
              { num: '03', title: 'Instant Advances', desc: 'Employees request, you approve, advance is disbursed.', icon: Zap }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-xl" data-testid={`step-${i + 1}`}>
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-outfit font-semibold text-xl shadow-lg">
                    {step.num}
                  </div>
                  <Icon className="h-10 w-10 text-primary mb-6 mt-6" />
                  <h3 className="text-xl font-outfit font-medium mb-3 text-slate-900">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <BenefitColumn
              title="For Employers"
              accent="bg-blue-50 text-blue-700"
              tag="Reduce attrition by 28%"
              items={[
                { title: 'Improve Retention', desc: 'Companies report 28% lower attrition after rolling out Mob Pae.' },
                { title: 'Zero Setup Cost', desc: 'No upfront fees. No payroll integration headaches. Live in 48 hours.' },
                { title: 'Auto Reconciliation', desc: 'Advances auto-deduct from payroll — no manual work for HR.' },
                { title: 'Wellness Metrics', desc: 'See financial wellness trends across your entire workforce.' }
              ]}
              testId="employer-benefits"
            />
            <BenefitColumn
              title="For Employees"
              accent="bg-green-50 text-green-700"
              tag="Used by 87% within 30 days"
              items={[
                { title: 'No Interest, Ever', desc: 'It\'s your earned salary. No interest charges, no hidden fees.' },
                { title: 'No Credit Check', desc: 'Eligibility based on your earned salary, not your credit score.' },
                { title: '24/7 Access', desc: 'Request advances anytime — weekends, holidays, emergencies.' },
                { title: 'Private & Secure', desc: 'Your employer sees only what they need. Bank-level encryption.' }
              ]}
              testId="employee-benefits"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">Loved by teams</p>
            <h2 className="text-3xl sm:text-5xl font-outfit font-medium tracking-tight text-slate-900 mb-6">
              Don't take our word for it
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Mob Pae paid for itself in 3 months. Our HR team has more time, our employees are happier, and our retention has never been better."
              name="Priya Sharma"
              role="VP People, Lumen Tech"
              avatar="https://images.unsplash.com/photo-1778692258270-bc0e80e975c0?crop=entropy&cs=srgb&fm=jpg&w=200&q=80"
            />
            <TestimonialCard
              quote="I used to dread end-of-month. Now I just request what I need, get it instantly, and the rest comes on payday. Game changer."
              name="Rahul Mehta"
              role="Software Engineer, Acme Corp"
              avatar="https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=srgb&fm=jpg&w=200&q=80"
            />
            <TestimonialCard
              quote="The dashboard is beautiful and the analytics actually help me run my business better. This is what fintech should feel like."
              name="Anjali Verma"
              role="Founder, Verma Industries"
              avatar="https://images.unsplash.com/photo-1778692258270-bc0e80e975c0?crop=entropy&cs=srgb&fm=jpg&w=200&q=80"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-5xl font-outfit font-medium tracking-tight text-slate-900 mb-6">
              Got questions?
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Is this a loan? Do employees pay interest?', a: 'No. Mob Pae is salary advance, not a loan. Employees access only what they\'ve already earned. Zero interest, zero hidden fees.' },
              { q: 'How long does employer onboarding take?', a: 'Most employers go live within 48 hours. Submit an enquiry, our team reviews, and we set up your account.' },
              { q: 'What\'s the advance limit?', a: 'Employers set the limit per employee — typically 20-40% of monthly salary. You have full control.' },
              { q: 'Is this RBI compliant?', a: 'Yes. Mob Pae is built to be fully RBI compliant. No NBFC partnership needed in our MVP — advances are employer-backed.' },
              { q: 'What if an employee leaves?', a: 'Any outstanding advance is settled in their final settlement. Mob Pae handles the reconciliation automatically.' }
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden"
                data-testid={`faq-${i}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
                  data-testid={`faq-button-${i}`}
                >
                  <span className="font-medium text-slate-900">{item.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed" data-testid={`faq-answer-${i}`}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50" data-testid="cta-section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl bg-[#0A1128] overflow-hidden p-12 sm:p-20 text-center">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/7c8cee12-4131-4033-8d27-b496ae48e677/images/8ee0b9798720e266ea39481c07dd54f2c90752d02b0ff8c57570421ef390504b.png)',
                backgroundSize: 'cover'
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-outfit font-medium text-white mb-6 max-w-2xl mx-auto">
                Ready to pay your team the way they want?
              </h2>
              <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
                Join 450+ companies using Mob Pae. Setup takes 48 hours. No credit card needed.
              </p>
              <Button
                onClick={() => setShowEnquiry(true)}
                size="lg"
                className="rounded-full bg-white text-slate-900 hover:bg-slate-100 text-base px-10 py-6 transition-all hover:-translate-y-0.5 shadow-xl"
                data-testid="cta-enquire-btn"
              >
                Talk to Sales <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1128] text-slate-300 py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-outfit font-semibold text-white">Mob Pae</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm text-slate-400">
                Empowering India's workforce with on-demand salary access. Built with care, secured with care.
              </p>
            </div>
            <FooterCol title="Product" items={['For Employers', 'For Employees', 'Pricing', 'Security']} />
            <FooterCol title="Company" items={['About', 'Blog', 'Careers', 'Press']} />
            <FooterCol title="Legal" items={['Privacy', 'Terms', 'Compliance', 'Contact']} />
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>&copy; 2026 Mob Pae. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> RBI Compliant</span>
              <span className="flex items-center gap-1.5"><Lock className="h-4 w-4" /> SOC 2 Type II</span>
            </div>
          </div>
        </div>
      </footer>

      {showEnquiry && <EnquiryModal onClose={() => setShowEnquiry(false)} />}
    </div>
  );
};

// ===========================
// Components
// ===========================
const StatTile = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl sm:text-4xl font-outfit font-semibold text-slate-900 mb-2">{value}</div>
    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, metric, metricLabel, testId }) => (
  <div className="group rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-xl" data-testid={testId}>
    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
      <Icon className="h-6 w-6 text-primary group-hover:text-white" />
    </div>
    <h3 className="text-2xl font-outfit font-medium mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
    <div className="pt-6 border-t border-slate-100">
      <div className="text-2xl font-outfit font-semibold text-slate-900">{metric}</div>
      <div className="text-xs text-slate-500 mt-1">{metricLabel}</div>
    </div>
  </div>
);

const BenefitColumn = ({ title, tag, accent, items, testId }) => (
  <div data-testid={testId}>
    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${accent} mb-4`}>{tag}</div>
    <h2 className="text-3xl sm:text-4xl font-outfit font-medium tracking-tight text-slate-900 mb-8">{title}</h2>
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-slate-900 mb-1">{item.title}</h4>
            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TestimonialCard = ({ quote, name, role, avatar }) => (
  <div className="rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-xl">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-slate-700 leading-relaxed mb-6">"{quote}"</p>
    <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <p className="font-medium text-slate-900">{name}</p>
        <p className="text-sm text-slate-500">{role}</p>
      </div>
    </div>
  </div>
);

const FooterCol = ({ title, items }) => (
  <div>
    <h4 className="font-medium text-white mb-4">{title}</h4>
    <ul className="space-y-2 text-sm">
      {items.map((item, i) => (
        <li key={i}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
      ))}
    </ul>
  </div>
);

// Enquiry Modal (unchanged)
const EnquiryModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    company_name: '', contact_person_name: '', work_email: '', phone_number: '',
    city: '', industry: '', number_of_employees: '', payroll_cycle: '',
    payroll_software: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/enquiry/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, number_of_employees: parseInt(formData.number_of_employees) })
      });
      if (!response.ok) throw new Error('Failed to submit enquiry');
      setSuccess(true);
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" data-testid="enquiry-modal">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-2">Get Started</p>
              <h2 className="text-2xl sm:text-3xl font-outfit font-medium">Talk to Sales</h2>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 rounded-lg hover:bg-slate-100" data-testid="close-modal-btn">
              <X className="w-6 h-6 text-slate-700" />
            </button>
          </div>
          {success ? (
            <div className="text-center py-10" data-testid="success-message">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-outfit font-medium mb-2">Enquiry Submitted!</h3>
              <p className="text-slate-600">We'll get back to you within 24-48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="enquiry-form">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Company Name *" testId="company-name-input" value={formData.company_name} onChange={v => setFormData({ ...formData, company_name: v })} />
                <Input label="Contact Person *" testId="contact-person-input" value={formData.contact_person_name} onChange={v => setFormData({ ...formData, contact_person_name: v })} />
                <Input label="Work Email *" type="email" testId="work-email-input" value={formData.work_email} onChange={v => setFormData({ ...formData, work_email: v })} />
                <Input label="Phone *" type="tel" testId="phone-number-input" value={formData.phone_number} onChange={v => setFormData({ ...formData, phone_number: v })} />
                <Input label="City *" testId="city-input" value={formData.city} onChange={v => setFormData({ ...formData, city: v })} />
                <Input label="Industry *" testId="industry-input" value={formData.industry} onChange={v => setFormData({ ...formData, industry: v })} />
                <Input label="Number of Employees *" type="number" testId="num-employees-input" value={formData.number_of_employees} onChange={v => setFormData({ ...formData, number_of_employees: v })} />
                <div>
                  <label className="block text-sm font-medium mb-2">Payroll Cycle *</label>
                  <select required value={formData.payroll_cycle} onChange={(e) => setFormData({ ...formData, payroll_cycle: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent" data-testid="payroll-cycle-select">
                    <option value="">Select</option>
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <Input label="Payroll Software (Optional)" testId="payroll-software-input" required={false} value={formData.payroll_software} onChange={v => setFormData({ ...formData, payroll_software: v })} />
              <div>
                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent" data-testid="message-textarea" />
              </div>
              {error && <p className="text-red-600 text-sm" data-testid="error-message">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full rounded-xl py-6 text-base bg-primary hover:bg-blue-700" data-testid="submit-enquiry-btn">
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, type = 'text', required = true, value, onChange, testId }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent" data-testid={testId} />
  </div>
);
