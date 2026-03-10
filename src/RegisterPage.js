import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [message, setMessage]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getUsers = () => JSON.parse(localStorage.getItem('studyhub_users') || '[]');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (formData.password !== formData.confirm) {
      setMessage('error:Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setMessage('error:Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === formData.email)) {
      setMessage('error:Email already registered. Please sign in.');
      setIsLoading(false);
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      registeredAt: new Date().toISOString(),
      joined: new Date().toLocaleDateString(),
    };
    users.push(newUser);
    localStorage.setItem('studyhub_users', JSON.stringify(users));
    setMessage('success');
    setTimeout(() => navigate('/'), 1500);
    setIsLoading(false);
  };

  const isOk  = message === 'success';
  const isErr = message.startsWith('error:');
  const errText = isErr ? message.replace('error:', '') : '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: .5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes btnShine {
          0%   { left: -80%; }
          100% { left: 120%; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes gradMove {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        .page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #f8fafc;
        }

        /* ── LEFT BRAND PANEL ── */
        .brand-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 60px;
          background: linear-gradient(150deg, #ffffff 0%, #f0f4ff 50%, #e8f0fe 100%);
          border-right: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          animation: slideRight 0.6s cubic-bezier(.16,1,.3,1) both;
        }
        .brand-panel::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, #c7d2fe 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
        }
        .deco-circle { position: absolute; border-radius: 50%; pointer-events: none; }
        .deco-c1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%);
          top: -80px; right: -80px;
        }
        .deco-c2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
          bottom: 60px; left: -60px;
        }
        .deco-c3 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%);
          bottom: 200px; right: 80px;
        }

        .brand-logo {
          display: flex; align-items: center; gap: 10px;
          position: relative;
          animation: fadeUp 0.5s ease both;
        }
        .brand-logo img {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1.5px solid #e0e7ff;
          box-shadow: 0 2px 8px rgba(99,102,241,0.15);
        }
        .brand-logo .name { font-size: 18px; font-weight: 800; color: #1e293b; letter-spacing: -.02em; }
        .brand-logo .name em { color: #6366f1; font-style: normal; }

        .brand-mid { position: relative; animation: fadeUp 0.6s ease 0.1s both; }

        .tag-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 13px; border-radius: 99px;
          background: #ede9fe; border: 1px solid #c4b5fd;
          color: #7c3aed; font-size: 11.5px; font-weight: 700;
          letter-spacing: .05em; text-transform: uppercase; margin-bottom: 24px;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #7c3aed; position: relative;
        }
        .live-dot::after {
          content: ''; position: absolute; inset: -3px;
          border-radius: 50%; border: 1.5px solid #7c3aed;
          animation: pulse-ring 1.4s ease-out infinite;
        }

        .brand-headline {
          font-size: clamp(2rem, 3vw, 2.8rem); font-weight: 800;
          color: #0f172a; line-height: 1.18; letter-spacing: -.03em;
          margin-bottom: 18px;
        }
        .brand-headline .accent {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: gradMove 4s ease infinite;
        }

        .brand-desc {
          font-size: 15px; color: #64748b; line-height: 1.75;
          max-width: 400px; margin-bottom: 40px;
        }

        .steps-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
        .step-item  { display: flex; align-items: flex-start; gap: 14px; }
        .step-num {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-size: 12px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .step-text strong { display: block; font-size: 13.5px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
        .step-text span   { font-size: 12.5px; color: #94a3b8; }

        .stats-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 1px; background: #e2e8f0;
          border: 1px solid #e2e8f0; border-radius: 14px;
          overflow: hidden; max-width: 420px;
        }
        .stat-cell { background: white; padding: 16px; text-align: center; }
        .stat-cell .val { font-size: 1.45rem; font-weight: 800; color: #0f172a; letter-spacing: -.03em; line-height: 1; margin-bottom: 3px; }
        .stat-cell .lbl { font-size: 11px; font-weight: 600; color: #94a3b8; letter-spacing: .05em; text-transform: uppercase; }

        .brand-bottom { position: relative; animation: fadeUp 0.6s ease 0.2s both; }
        .trust-badges { display: flex; align-items: center; gap: 16px; }
        .trust-badge  { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #64748b; font-weight: 500; }

        /* ── RIGHT AUTH PANEL ── */
        .auth-panel {
          width: min(500px, 100%);
          display: flex; flex-direction: column; justify-content: center;
          padding: 52px;
          background: #ffffff;
          box-shadow: -4px 0 32px rgba(0,0,0,0.04);
          animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.1s both;
          overflow-y: auto;
        }

        .auth-header { margin-bottom: 30px; }
        .auth-title  { font-size: 1.65rem; font-weight: 800; color: #0f172a; letter-spacing: -.03em; margin-bottom: 6px; }
        .auth-sub    { font-size: 14px; color: #94a3b8; }
        .auth-sub a  { color: #6366f1; font-weight: 600; text-decoration: none; }
        .auth-sub a:hover { text-decoration: underline; }

        /* 2-col row for name + email */
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field-group { margin-bottom: 15px; }
        .field-label {
          display: block; font-size: 12px; font-weight: 700;
          color: #374151; letter-spacing: .05em; text-transform: uppercase; margin-bottom: 7px;
        }
        .field-input {
          width: 100%; padding: 12px 15px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: #f8fafc;
          font-size: 14.5px; font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a; outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .field-input::placeholder { color: #94a3b8; }
        .field-input:focus {
          border-color: #6366f1; background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .field-input.err-input { border-color: #fca5a5; }

        /* password strength bar */
        .strength-bar { margin-top: 8px; display: flex; gap: 4px; }
        .strength-seg {
          flex: 1; height: 3px; border-radius: 99px;
          background: #e2e8f0; transition: background .3s;
        }
        .strength-lbl { font-size: 11px; color: #94a3b8; margin-top: 4px; }

        .alert {
          padding: 11px 14px; border-radius: 9px;
          font-size: 13.5px; font-weight: 500; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .alert.ok  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .alert.err { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

        .btn-primary {
          position: relative; overflow: hidden;
          width: 100%; padding: 13px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-size: 15px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: .01em;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          transition: transform .2s, box-shadow .2s, opacity .2s;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: .55; cursor: not-allowed; }
        .btn-primary::after {
          content: ''; position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-20deg);
          animation: btnShine 3.5s ease-in-out infinite 1s;
        }

        .spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.4); border-top-color: white;
          border-radius: 50%; animation: spin .7s linear infinite;
          vertical-align: middle; margin-right: 6px;
        }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0; color: #cbd5e1; font-size: 12px;
        }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }

        .btn-outline {
          width: 100%; padding: 12px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: white;
          font-size: 14px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #374151; cursor: pointer;
          transition: border-color .2s, background .2s, transform .2s;
        }
        .btn-outline:hover { border-color: #c7d2fe; background: #f5f3ff; transform: translateY(-1px); }

        .auth-footer {
          margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9;
          display: flex; justify-content: space-between;
          font-size: 11.5px; color: #94a3b8;
        }
        .auth-footer a { color: #94a3b8; text-decoration: none; }
        .auth-footer a:hover { color: #6366f1; }

        .terms-note {
          font-size: 11.5px; color: #94a3b8; text-align: center;
          margin-top: 12px; line-height: 1.6;
        }
        .terms-note a { color: #6366f1; text-decoration: none; }

        @media (max-width: 768px) {
          .brand-panel { display: none; }
          .auth-panel  { width: 100%; padding: 40px 28px; }
          .field-row   { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">

        {/* ════════════ LEFT BRAND PANEL ════════════ */}
        <div className="brand-panel">
          <div className="deco-circle deco-c1" />
          <div className="deco-circle deco-c2" />
          <div className="deco-circle deco-c3" />

          <div className="brand-logo">
            <img src="/study-bg1.jpeg" alt="StudyHub" />
            <div className="name">Study<em>Hub</em></div>
          </div>

          <div className="brand-mid">
            <div className="tag-pill">
              <span className="live-dot" />
              Join 12,000+ Learners
            </div>

            <h1 className="brand-headline">
              Start Your<br />
              <span className="accent">Learning Journey.</span>
            </h1>

            <p className="brand-desc">
              Create your free account in seconds and unlock AI-powered mentorship, skill assessments, live chat, and professional certificates.
            </p>

            {/* How it works steps */}
            <div className="steps-list">
              {[
                { n: '1', title: 'Create your account',    sub: 'Free forever — no credit card needed' },
                { n: '2', title: 'Pick your skill path',   sub: 'Python, React, Java, Data Science & more' },
                { n: '3', title: 'Learn with AI guidance', sub: 'Phi AI assistant available 24/7' },
                { n: '4', title: 'Earn your certificate',  sub: 'Download and share your achievement' },
              ].map(s => (
                <div className="step-item" key={s.n}>
                  <div className="step-num">{s.n}</div>
                  <div className="step-text">
                    <strong>{s.title}</strong>
                    <span>{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="stats-grid">
              <div className="stat-cell"><div className="val">12K+</div><div className="lbl">Learners</div></div>
              <div className="stat-cell"><div className="val">340+</div><div className="lbl">Skill Paths</div></div>
              <div className="stat-cell"><div className="val">98%</div><div className="lbl">Satisfaction</div></div>
            </div>
          </div>

          <div className="brand-bottom">
            <div className="trust-badges">
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                SOC 2 Compliant
              </div>
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Data Encrypted
              </div>
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ RIGHT AUTH PANEL ════════════ */}
        <div className="auth-panel">
          <div className="auth-header">
            <div className="auth-title">Create your account</div>
            <p className="auth-sub">
              Already have an account?{' '}
              <a href="#" onClick={e => { e.preventDefault(); navigate('/'); }}>Sign in here</a>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name + Email row */}
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <input
                  name="name" type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="field-input"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Email</label>
                <input
                  name="email" type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`field-input${isErr ? ' err-input' : ''}`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                name="password" type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="field-input"
                required
                disabled={isLoading}
              />
              {/* Strength bar */}
              {formData.password.length > 0 && (() => {
                const len = formData.password.length;
                const strength = len < 6 ? 1 : len < 10 ? 2 : len < 14 ? 3 : 4;
                const colors   = ['#ef4444','#f97316','#eab308','#22c55e'];
                const labels   = ['Too short','Weak','Good','Strong'];
                return (
                  <>
                    <div className="strength-bar">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="strength-seg" style={{ background: i <= strength ? colors[strength-1] : '#e2e8f0' }} />
                      ))}
                    </div>
                    <div className="strength-lbl" style={{ color: colors[strength-1] }}>{labels[strength-1]}</div>
                  </>
                );
              })()}
            </div>

            {/* Confirm password */}
            <div className="field-group">
              <label className="field-label">Confirm Password</label>
              <input
                name="confirm" type="password"
                value={formData.confirm}
                onChange={handleChange}
                placeholder="Re-enter password"
                className={`field-input${formData.confirm && formData.confirm !== formData.password ? ' err-input' : ''}`}
                required
                disabled={isLoading}
              />
              {formData.confirm && formData.confirm !== formData.password && (
                <div style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4 }}>Passwords don't match</div>
              )}
            </div>

            {/* Alerts */}
            {isOk && (
              <div className="alert ok">✅ Account created! Redirecting to login…</div>
            )}
            {isErr && (
              <div className="alert err">❌ {errText}</div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !formData.email || !formData.password || !formData.name || formData.password !== formData.confirm}
            >
              {isLoading
                ? <><span className="spinner" />Creating account…</>
                : 'Create Account →'
              }
            </button>
          </form>

          <p className="terms-note">
            By creating an account you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>

          <div className="divider">or</div>

          <button className="btn-outline" onClick={() => navigate('/')}>
            ← Back to Sign In
          </button>

          <div className="auth-footer">
            <span>© 2025 StudyHub</span>
            <a href="#">Privacy Policy</a>
            <a href="#">Help Center</a>
          </div>
        </div>
      </div>
    </>
  );
}