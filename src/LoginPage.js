import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ setIsLoggedIn, setUserEmail }) {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage]     = useState('');
  const [showChat, setShowChat]   = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendChat = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const msg = chatInput.trim();
    setChatMessages(p => [...p, { role: 'user', content: msg }]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const r = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const d = await r.json();
      setChatMessages(p => [...p, { role: 'assistant', content: d.reply }]);
    } catch {
      setChatMessages(p => [...p, { role: 'assistant', content: '⚠️ Server offline. Run: ollama run phi' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      let users = JSON.parse(localStorage.getItem('studyhub_users') || '[]');
      if (!users.find(u => u.email === 'admin@gmail.com')) {
        users.push({ email: 'admin@gmail.com', password: 'admin123', name: 'Admin', isAdmin: true, joined: new Date().toLocaleDateString() });
        localStorage.setItem('studyhub_users', JSON.stringify(users));
      }
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('studyhub_currentUser', JSON.stringify(user));
        setUserEmail(email);
        setIsLoggedIn(true);
        const h = JSON.parse(localStorage.getItem('studyhub_login_history') || '[]');
        h.push({ email, date: new Date().toDateString(), time: new Date().toLocaleTimeString(), action: user.isAdmin ? 'Admin login' : 'User login' });
        localStorage.setItem('studyhub_login_history', JSON.stringify(h));
        setMessage('success');
        setTimeout(() => navigate(user.isAdmin ? '/admin' : '/profile'), 1000);
      } else {
        setMessage('error');
      }
    } catch {
      setMessage('error');
    } finally {
      setIsLoading(false);
    }
  };

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
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: .5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes btnShine {
          0%   { left: -80%; }
          100% { left: 120%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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

        /* decorative circles */
        .brand-panel .deco-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
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

        /* subtle dot pattern */
        .brand-panel::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, #c7d2fe 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          animation: fadeUp 0.5s ease both;
        }
        .brand-logo img {
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1.5px solid #e0e7ff;
          box-shadow: 0 2px 8px rgba(99,102,241,0.15);
        }
        .brand-logo .name {
          font-size: 18px; font-weight: 800;
          color: #1e293b; letter-spacing: -.02em;
        }
        .brand-logo .name em { color: #6366f1; font-style: normal; }

        .brand-mid {
          position: relative;
          animation: fadeUp 0.6s ease 0.1s both;
        }

        .tag-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 13px;
          border-radius: 99px;
          background: #ede9fe;
          border: 1px solid #c4b5fd;
          color: #7c3aed;
          font-size: 11.5px; font-weight: 700; letter-spacing: .05em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .tag-pill .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #7c3aed;
          position: relative;
        }
        .tag-pill .live-dot::after {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          border: 1.5px solid #7c3aed;
          animation: pulse-ring 1.4s ease-out infinite;
        }

        .brand-headline {
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.18;
          letter-spacing: -.03em;
          margin-bottom: 18px;
        }
        .brand-headline .accent {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-desc {
          font-size: 15px;
          color: #64748b;
          line-height: 1.75;
          max-width: 400px;
          margin-bottom: 40px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e2e8f0;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 36px;
          max-width: 420px;
        }
        .stat-cell {
          background: white;
          padding: 18px 16px;
          text-align: center;
        }
        .stat-cell .val {
          font-size: 1.55rem; font-weight: 800;
          color: #0f172a; letter-spacing: -.03em;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-cell .lbl {
          font-size: 11px; font-weight: 600;
          color: #94a3b8; letter-spacing: .05em;
          text-transform: uppercase;
        }

        .feature-list {
          display: flex; flex-direction: column; gap: 12px;
        }
        .feature-item {
          display: flex; align-items: center; gap: 12px;
          font-size: 14px; color: #475569; font-weight: 500;
        }
        .feature-item .fi-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }

        .brand-bottom {
          position: relative;
          font-size: 12px; color: #94a3b8;
          animation: fadeUp 0.6s ease 0.2s both;
        }
        .brand-bottom .trust-badges {
          display: flex; align-items: center; gap: 16px;
        }
        .trust-badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: #64748b; font-weight: 500;
        }
        .trust-badge svg { opacity: .6; }

        /* ── RIGHT AUTH PANEL ── */
        .auth-panel {
          width: min(480px, 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 52px;
          background: #ffffff;
          box-shadow: -4px 0 32px rgba(0,0,0,0.04);
          animation: fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.1s both;
          position: relative;
        }

        .auth-header { margin-bottom: 36px; }
        .auth-title {
          font-size: 1.65rem; font-weight: 800;
          color: #0f172a; letter-spacing: -.03em;
          margin-bottom: 6px;
        }
        .auth-sub {
          font-size: 14px; color: #94a3b8;
        }
        .auth-sub a {
          color: #6366f1; font-weight: 600;
          text-decoration: none;
        }
        .auth-sub a:hover { text-decoration: underline; }

        .field-group { margin-bottom: 16px; }
        .field-label {
          display: block;
          font-size: 12px; font-weight: 700;
          color: #374151; letter-spacing: .05em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .field-input {
          width: 100%;
          padding: 12px 15px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .field-input::placeholder { color: #94a3b8; }
        .field-input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .alert {
          padding: 11px 14px;
          border-radius: 9px;
          font-size: 13.5px; font-weight: 500;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .alert.ok  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .alert.err { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

        .btn-primary {
          position: relative; overflow: hidden;
          width: 100%; padding: 13px;
          border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-size: 15px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: .01em;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          transition: transform .2s, box-shadow .2s, opacity .2s;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.4);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: .55; cursor: not-allowed; }
        .btn-primary::after {
          content: '';
          position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-20deg);
          animation: btnShine 3.5s ease-in-out infinite 1s;
        }

        .spinner {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          vertical-align: middle;
          margin-right: 6px;
        }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 18px 0;
          color: #cbd5e1; font-size: 12px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #f1f5f9;
        }

        .btn-outline {
          width: 100%; padding: 12px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: white;
          font-size: 14px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #374151; cursor: pointer;
          transition: border-color .2s, background .2s, transform .2s;
        }
        .btn-outline:hover {
          border-color: #c7d2fe;
          background: #f5f3ff;
          transform: translateY(-1px);
        }

        .auth-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          font-size: 11.5px; color: #94a3b8;
        }
        .auth-footer a {
          color: #94a3b8; text-decoration: none;
        }
        .auth-footer a:hover { color: #6366f1; }

        /* ── CHAT ── */
        .fab {
          position: fixed; bottom: 26px; right: 26px; z-index: 9999;
          width: 50px; height: 50px; border-radius: 50%; border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-size: 20px; cursor: pointer;
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
          display: flex; align-items: center; justify-content: center;
          transition: transform .2s, box-shadow .2s;
        }
        .fab:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(99,102,241,0.55); }

        .chat-box {
          position: fixed; bottom: 88px; right: 26px; z-index: 9999;
          width: 348px; height: 450px;
          border-radius: 18px; overflow: hidden;
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.13);
          display: flex; flex-direction: column;
          animation: fadeUp .25s ease both;
        }
        .chat-head {
          padding: 15px 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-weight: 700; font-size: 14.5px;
          display: flex; align-items: center; gap: 8px;
        }
        .chat-online {
          margin-left: auto; font-size: 11px; font-weight: 500;
          opacity: .8; display: flex; align-items: center; gap: 4px;
        }
        .chat-online::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80; display: block;
        }
        .chat-msgs {
          flex: 1; overflow-y: auto; padding: 14px;
          display: flex; flex-direction: column; gap: 9px;
          background: #f8fafc;
        }
        .chat-msgs::-webkit-scrollbar { width: 3px; }
        .chat-msgs::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
        .chat-empty {
          margin: auto; text-align: center; color: #94a3b8;
          font-size: 13.5px;
        }
        .chat-empty div { font-size: 2rem; margin-bottom: 6px; }
        .bub-u {
          align-self: flex-end;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; padding: 9px 13px;
          border-radius: 14px 14px 3px 14px;
          font-size: 13px; max-width: 82%;
        }
        .bub-b {
          align-self: flex-start;
          background: white; border: 1px solid #e2e8f0;
          color: #374151; padding: 9px 13px;
          border-radius: 14px 14px 14px 3px;
          font-size: 13px; max-width: 82%;
        }
        .dots { display: flex; gap: 4px; padding: 2px; }
        .dots span {
          width: 6px; height: 6px; border-radius: 50%;
          background: #a5b4fc;
          animation: float 0.8s ease-in-out infinite;
        }
        .dots span:nth-child(2) { animation-delay: .18s; }
        .dots span:nth-child(3) { animation-delay: .36s; }
        .chat-foot {
          padding: 10px; border-top: 1px solid #f1f5f9;
          background: white; display: flex; gap: 8px;
        }
        .chat-inp {
          flex: 1; padding: 10px 13px; border-radius: 9px;
          border: 1.5px solid #e2e8f0; background: #f8fafc;
          font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a; outline: none;
        }
        .chat-inp:focus { border-color: #a5b4fc; background: white; }
        .chat-inp::placeholder { color: #94a3b8; }
        .chat-send {
          padding: 0 15px; border-radius: 9px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-weight: 700; font-size: 14px;
          transition: opacity .2s;
        }
        .chat-send:disabled { opacity: .4; cursor: not-allowed; }

        /* ── MODAL ── */
        .overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal {
          background: white; border-radius: 20px;
          padding: 36px; max-width: 600px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.15);
          animation: fadeUp .3s ease both;
        }
        .modal::-webkit-scrollbar { width: 4px; }
        .modal::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .modal-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 28px; padding-bottom: 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .modal-top h2 {
          font-size: 1.5rem; font-weight: 800;
          color: #0f172a; letter-spacing: -.025em;
          margin-bottom: 4px;
        }
        .modal-top p { font-size: 13.5px; color: #64748b; }
        .modal-close {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: #f8fafc; cursor: pointer; color: #64748b;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
          transition: background .2s;
        }
        .modal-close:hover { background: #f1f5f9; color: #0f172a; }
        .m-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
          margin-bottom: 24px;
        }
        .m-card {
          padding: 18px; border-radius: 12px;
          border: 1.5px solid #f1f5f9;
          background: #fafafa;
        }
        .m-card .m-icon { font-size: 1.5rem; margin-bottom: 10px; }
        .m-card h4 { font-size: 13.5px; font-weight: 700; margin-bottom: 8px; }
        .m-card ul { list-style: none; }
        .m-card li { font-size: 12.5px; color: #64748b; padding: 2px 0; }
        .m-card li::before { content: '✓ '; color: #6366f1; font-weight: 700; }
        .modal-foot {
          padding-top: 20px; border-top: 1px solid #f1f5f9;
          display: flex; justify-content: flex-end; gap: 10px;
        }

        @media (max-width: 768px) {
          .brand-panel { display: none; }
          .auth-panel  { width: 100%; padding: 40px 28px; }
          .m-grid      { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">

        {/* ════════════ LEFT BRAND PANEL ════════════ */}
        <div className="brand-panel">
          <div className="deco-circle deco-c1" />
          <div className="deco-circle deco-c2" />
          <div className="deco-circle deco-c3" />

          {/* Logo */}
          <div className="brand-logo">
            <img src="/study-bg1.jpeg" alt="StudyHub" />
            <div className="name">Study<em>Hub</em></div>
          </div>

          {/* Main copy */}
          <div className="brand-mid">
            <div className="tag-pill">
              <span className="live-dot" />
              AI-Powered Platform
            </div>

            <h1 className="brand-headline">
              Learn Smarter.<br />
              <span className="accent">Grow Faster.</span>
            </h1>

            <p className="brand-desc">
              StudyHub gives students and professionals a modern space to master skills, track progress, and connect with AI-driven mentorship — all in one place.
            </p>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-cell">
                <div className="val">12K+</div>
                <div className="lbl">Learners</div>
              </div>
              <div className="stat-cell">
                <div className="val">340+</div>
                <div className="lbl">Skill Paths</div>
              </div>
              <div className="stat-cell">
                <div className="val">98%</div>
                <div className="lbl">Satisfaction</div>
              </div>
            </div>

            {/* Features */}
            <div className="feature-list">
              {[
                { bg: '#ede9fe', color: '#7c3aed', icon: '🤖', label: 'Phi AI Assistant — 24/7 coding & career help' },
                { bg: '#ecfdf5', color: '#059669', icon: '🏆', label: 'Earn verified certificates for every skill' },
                { bg: '#eff6ff', color: '#2563eb', icon: '💬', label: 'Real-time mentor chat with history saved' },
                { bg: '#fff7ed', color: '#d97706', icon: '📊', label: 'Adaptive assessments that track your growth' },
              ].map(f => (
                <div className="feature-item" key={f.label}>
                  <div className="fi-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust row */}
          <div className="brand-bottom">
            <div className="trust-badges">
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                SOC 2 Compliant
              </div>
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Data Encrypted
              </div>
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ RIGHT AUTH PANEL ════════════ */}
        <div className="auth-panel">
          <div className="auth-header">
            <div className="auth-title">Sign in</div>
            <p className="auth-sub">
              New to StudyHub?{' '}
              <a href="#" onClick={e => { e.preventDefault(); navigate('/register'); }}>
                Create a free account
              </a>
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label className="field-label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="field-input"
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="field-input"
                required
              />
            </div>

            {message === 'success' && (
              <div className="alert ok">✅ Login successful! Redirecting…</div>
            )}
            {message === 'error' && (
              <div className="alert err">❌ Invalid email or password.</div>
            )}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? <><span className="spinner" />Signing in…</> : 'Sign in to StudyHub →'}
            </button>
          </form>

          <div className="divider">or</div>

          <button className="btn-outline" onClick={() => navigate('/register')}>
            ✨ Create a new account
          </button>

          <div className="auth-footer">
            <a href="#" onClick={e => { e.preventDefault(); setShowAbout(true); }}>About StudyHub</a>
            <span>© 2025 StudyHub</span>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* ════════════ CHAT BUTTON ════════════ */}
      <button className="fab" onClick={() => setShowChat(s => !s)}>
        {showChat ? '✕' : '💬'}
      </button>

      {showChat && (
        <div className="chat-box">
          <div className="chat-head">
            🤖 StudyHub AI
            <span className="chat-online">Phi · Online</span>
          </div>
          <div className="chat-msgs">
            {chatMessages.length === 0 && (
              <div className="chat-empty">
                <div>👋</div>
                <p>Ask me about coding,<br />careers, or skill paths.</p>
              </div>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'bub-u' : 'bub-b'}>
                {m.content}
              </div>
            ))}
            {isChatLoading && (
              <div className="bub-b">
                <div className="dots"><span /><span /><span /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-foot">
            <input
              className="chat-inp"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendChat()}
              placeholder="Ask anything…"
              disabled={isChatLoading}
            />
            <button className="chat-send" onClick={sendChat} disabled={!chatInput.trim() || isChatLoading}>→</button>
          </div>
        </div>
      )}

      {/* ════════════ ABOUT MODAL ════════════ */}
      {showAbout && (
        <div className="overlay" onClick={() => setShowAbout(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <h2>🏆 About StudyHub</h2>
                <p>AI-Powered Mentorship Platform · v2.0</p>
              </div>
              <button className="modal-close" onClick={() => setShowAbout(false)}>✕</button>
            </div>

            <div className="m-grid">
              {[
                { icon: '✨', title: 'AI Mentorship', color: '#7c3aed', items: ['Smart skill-based matching', 'Dynamic assessments', 'Python / React / Java tests', 'Professional certificates'] },
                { icon: '💬', title: 'Live Chat',     color: '#2563eb', items: ['Real-time conversations', 'Request / accept system', 'Full chat history'] },
                { icon: '📊', title: 'Progress Tracking', color: '#059669', items: ['4-stage assessments', 'Test progress auto-saved', 'Gold certificate download'] },
                { icon: '🤖', title: 'AI Assistant (Phi)', color: '#d97706', items: ['24/7 coding help', 'Career guidance', 'Skill recommendations'] },
              ].map(c => (
                <div className="m-card" key={c.title} style={{ borderColor: c.color + '30' }}>
                  <div className="m-icon">{c.icon}</div>
                  <h4 style={{ color: c.color }}>{c.title}</h4>
                  <ul>{c.items.map(it => <li key={it}>{it}</li>)}</ul>
                </div>
              ))}
            </div>

            <div className="modal-foot">
              <button className="btn-outline" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => setShowAbout(false)}>Close</button>
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => setShowAbout(false)}>Get Started →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}