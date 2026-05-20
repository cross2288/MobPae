import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Clock, CheckCircle2, Users, Building2, Wallet } from 'lucide-react';
import { Button } from '../components/ui/button';

export const LandingPage = () => {
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <div className="min-h-screen font-ibm" data-testid="landing-page">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-outfit font-semibold text-slate-900" data-testid="logo">Mob Pae</div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-primary" data-testid="employer-login-nav">Employer Login</Button>
            </Link>
            <Link to="/login">
              <Button className="rounded-full bg-primary hover:bg-primary/90 transition-all hover:-translate-y-0.5" data-testid="employee-login-nav">Employee Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" 
        style={{ backgroundColor: '#0A1128' }}
        data-testid="hero-section"
      >
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/7c8cee12-4131-4033-8d27-b496ae48e677/images/8ee0b9798720e266ea39481c07dd54f2c90752d02b0ff8c57570421ef390504b.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'lighten'
          }}
        ></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-6xl font-outfit font-medium tracking-tight text-white mb-6" data-testid="hero-title">
            Empower Your Workforce with<br />Instant Salary Advances
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed" data-testid="hero-subtitle">
            Mob Pae is the employer-backed platform that gives your employees financial flexibility when they need it most.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              onClick={() => setShowEnquiry(true)} 
              size="lg" 
              className="rounded-full bg-primary hover:bg-primary/90 text-base px-8 py-6 transition-all hover:-translate-y-0.5"
              data-testid="enquire-now-btn"
            >
              Enquire Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-slate-900 text-base px-8 py-6 transition-all hover:-translate-y-0.5"
                data-testid="get-started-btn"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Explanation */}
      <section className="py-20 bg-white" data-testid="product-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-outfit font-medium tracking-tight text-slate-900 mb-4" data-testid="product-title">
              The Modern Way to Manage Salary Advances
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Mob Pae connects employers and employees through a seamless platform for salary advance management.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 transition-all hover:-translate-y-1" data-testid="product-card-1">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-outfit font-medium mb-3">Instant Access</h3>
              <p className="text-slate-600 leading-relaxed">Employees get quick access to earned salary without waiting for payday.</p>
            </div>
            <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 transition-all hover:-translate-y-1" data-testid="product-card-2">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-outfit font-medium mb-3">Employer Backed</h3>
              <p className="text-slate-600 leading-relaxed">All advances are approved and backed by employers, ensuring security.</p>
            </div>
            <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 transition-all hover:-translate-y-1" data-testid="product-card-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-outfit font-medium mb-3">No Hidden Fees</h3>
              <p className="text-slate-600 leading-relaxed">Transparent process with no surprise charges or complex terms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-outfit font-medium tracking-tight text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Three simple steps to get started with Mob Pae
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="step-1">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-outfit font-semibold mx-auto mb-6">1</div>
              <h3 className="text-xl font-outfit font-medium mb-3">Employer Onboards</h3>
              <p className="text-slate-600 leading-relaxed">Company submits an enquiry and gets approved by our team.</p>
            </div>
            <div className="text-center" data-testid="step-2">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-outfit font-semibold mx-auto mb-6">2</div>
              <h3 className="text-xl font-outfit font-medium mb-3">Add Employees</h3>
              <p className="text-slate-600 leading-relaxed">Employers add their workforce and set advance limits.</p>
            </div>
            <div className="text-center" data-testid="step-3">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-outfit font-semibold mx-auto mb-6">3</div>
              <h3 className="text-xl font-outfit font-medium mb-3">Request & Approve</h3>
              <p className="text-slate-600 leading-relaxed">Employees request advances, employers approve instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-outfit font-medium tracking-tight text-slate-900 mb-6">Benefits for Employers</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3" data-testid="employer-benefit-1">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Improve Employee Retention</h4>
                    <p className="text-slate-600">Provide financial wellness benefits that employees value.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3" data-testid="employer-benefit-2">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Easy Management</h4>
                    <p className="text-slate-600">Simple dashboard to track all advance requests and approvals.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3" data-testid="employer-benefit-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Zero Financial Risk</h4>
                    <p className="text-slate-600">Advances are deducted from payroll automatically.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-outfit font-medium tracking-tight text-slate-900 mb-6">Benefits for Employees</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3" data-testid="employee-benefit-1">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Financial Flexibility</h4>
                    <p className="text-slate-600">Access your earned salary before payday when you need it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3" data-testid="employee-benefit-2">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">No Credit Checks</h4>
                    <p className="text-slate-600">Advances based on your earned salary, not credit score.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3" data-testid="employee-benefit-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Simple Process</h4>
                    <p className="text-slate-600">Request advances in minutes through our easy-to-use platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-outfit font-semibold text-white mb-4">Mob Pae</div>
              <p className="text-sm leading-relaxed">Empowering employees with financial flexibility.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">For Employers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Employees</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 Mob Pae. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <EnquiryModal onClose={() => setShowEnquiry(false)} />
      )}
    </div>
  );
};

const EnquiryModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person_name: '',
    work_email: '',
    phone_number: '',
    city: '',
    industry: '',
    number_of_employees: '',
    payroll_cycle: '',
    payroll_software: '',
    message: ''
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
        body: JSON.stringify({
          ...formData,
          number_of_employees: parseInt(formData.number_of_employees)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }

      setSuccess(true);
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" data-testid="enquiry-modal">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-outfit font-medium">Employer Enquiry</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-900" data-testid="close-modal-btn">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {success ? (
            <div className="text-center py-8" data-testid="success-message">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Enquiry Submitted!</h3>
              <p className="text-slate-600">We'll get back to you within 24-48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="enquiry-form">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="company-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_person_name}
                    onChange={(e) => setFormData({...formData, contact_person_name: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="contact-person-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.work_email}
                    onChange={(e) => setFormData({...formData, work_email: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="work-email-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="phone-number-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="city-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry *</label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="industry-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Employees *</label>
                  <input
                    type="number"
                    required
                    value={formData.number_of_employees}
                    onChange={(e) => setFormData({...formData, number_of_employees: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="num-employees-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payroll Cycle *</label>
                  <select
                    required
                    value={formData.payroll_cycle}
                    onChange={(e) => setFormData({...formData, payroll_cycle: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    data-testid="payroll-cycle-select"
                  >
                    <option value="">Select</option>
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payroll Software (Optional)</label>
                <input
                  type="text"
                  value={formData.payroll_software}
                  onChange={(e) => setFormData({...formData, payroll_software: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="payroll-software-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="message-textarea"
                />
              </div>
              {error && <p className="text-red-600 text-sm" data-testid="error-message">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-6 text-base bg-primary hover:bg-primary/90"
                data-testid="submit-enquiry-btn"
              >
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};