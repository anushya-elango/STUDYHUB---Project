import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root { --cyan:#00f0ff; --violet:#a259ff; --green:#00ffb3; --amber:#ffb800; --danger:#ff3c6f; --glass:rgba(6,10,28,0.82); --border:rgba(0,240,255,0.14); --text:#eef2ff; --muted:rgba(180,200,240,0.5); }
  .ad * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
  .ad h1,.ad h2,.ad h3,.ad h4 { font-family:'Syne',sans-serif; }
  .glass { background:var(--glass); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid var(--border); }
  .glass2 { background:rgba(255,255,255,0.03); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.06); }
  .btn-cyan { background:linear-gradient(135deg,#00f0ff,#0099bb); color:#000; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-cyan:hover { box-shadow:0 0 22px rgba(0,240,255,0.45); transform:translateY(-1px); }
  .btn-violet { background:linear-gradient(135deg,#a259ff,#6c2fff); color:#fff; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-violet:hover { box-shadow:0 0 22px rgba(162,89,255,0.45); transform:translateY(-1px); }
  .btn-green { background:linear-gradient(135deg,#00ffb3,#00aa78); color:#000; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-green:hover { box-shadow:0 0 22px rgba(0,255,179,0.45); transform:translateY(-1px); }
  .btn-danger { background:linear-gradient(135deg,#ff3c6f,#c0003c); color:#fff; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-danger:hover { box-shadow:0 0 18px rgba(255,60,111,0.45); transform:translateY(-1px); }
  .btn-ghost { background:rgba(255,255,255,0.05); color:var(--muted); border:1px solid rgba(255,255,255,0.09); cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-ghost:hover { background:rgba(255,255,255,0.09); color:var(--text); }
  .stat-card { background:var(--glass); backdrop-filter:blur(16px); border:1px solid var(--border); border-radius:18px; padding:22px 18px; text-align:center; transition:transform .2s,box-shadow .2s; }
  .stat-card:hover { transform:translateY(-3px); }
  .inp { background:rgba(0,0,0,0.4); border:1px solid rgba(0,240,255,0.14); color:var(--text); border-radius:12px; padding:11px 16px; font-size:0.88rem; transition:border-color .2s; font-family:'DM Sans',sans-serif; }
  .inp::placeholder { color:rgba(180,200,240,0.3); }
  .inp:focus { outline:none; border-color:var(--cyan); box-shadow:0 0 0 3px rgba(0,240,255,0.08); }
  .table-row { border-bottom:1px solid rgba(255,255,255,0.05); transition:background .15s; }
  .table-row:hover { background:rgba(0,240,255,0.04); }
  .scroll-y { overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(0,240,255,0.15) transparent; }
  .scroll-y::-webkit-scrollbar { width:3px; }
  .scroll-y::-webkit-scrollbar-thumb { background:rgba(0,240,255,0.2); border-radius:3px; }
  @keyframes up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .anim { animation:up .38s ease both; }
  .badge { display:inline-block; padding:3px 10px; border-radius:99px; font-size:0.7rem; font-weight:700; }
  .badge-green { background:rgba(0,255,179,0.1); color:var(--green); border:1px solid rgba(0,255,179,0.25); }
  .badge-danger { background:rgba(255,60,111,0.1); color:var(--danger); border:1px solid rgba(255,60,111,0.25); }
  .badge-amber { background:rgba(255,184,0,0.1); color:var(--amber); border:1px solid rgba(255,184,0,0.25); }
  .section { background:rgba(6,10,28,0.85); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:24px; }
  .remove-btn { background:rgba(255,60,111,0.12); border:1px solid rgba(255,60,111,0.3); color:var(--danger); border-radius:7px; padding:4px 10px; font-size:0.7rem; font-weight:700; cursor:pointer; transition:all .18s; font-family:'DM Sans',sans-serif; white-space:nowrap; }
  .remove-btn:hover { background:rgba(255,60,111,0.28); box-shadow:0 0 10px rgba(255,60,111,0.3); }
`;

export default function AdminDashboard({ setIsLoggedIn }) {
  // ── Auth guard: render nothing until verified ──
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [stats, setStats] = useState({ totalUsers:0, activeToday:0, totalMatches:0, totalCertificates:0, totalChats:0 });
  const [users, setUsers] = useState([]);
  const [dailyLogins, setDailyLogins] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [removingEmail, setRemovingEmail] = useState(null); // confirm state
  const navigate = useNavigate();

  // ── Step 1: check admin IMMEDIATELY, before any render ──
  useEffect(() => {
    const cu = JSON.parse(localStorage.getItem('studyhub_currentUser') || '{}');
    const au = JSON.parse(localStorage.getItem('studyhub_user') || '{}');
    const ADMIN = 'admin@gmail.com';
    if (cu.email === ADMIN || au.email === ADMIN || cu === ADMIN || au === ADMIN) {
      setIsAdmin(true);
      setAuthChecked(true);
      loadAllData();
    } else {
      setAuthChecked(true);
      navigate('/login', { replace: true });
    }
  }, []);

  // Track admin login
  useEffect(() => {
    if (!isAdmin) return;
    const today = new Date().toDateString();
    let hist = JSON.parse(localStorage.getItem('studyhub_login_history') || '[]');
    if (!hist.some(l => l.date === today && l.email === 'admin@gmail.com')) {
      hist.push({ email:'admin@gmail.com', date:today, time:new Date().toLocaleTimeString(), action:'Admin login' });
      localStorage.setItem('studyhub_login_history', JSON.stringify(hist));
    }
  }, [isAdmin]);

  const loadAllData = () => {
    const profiles = [];
    let totalCerts = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('studyhub_profile_')) {
        try {
          const p = JSON.parse(localStorage.getItem(k));
          p.email = k.replace('studyhub_profile_', '');
          profiles.push(p);
          if (p.certificates) totalCerts += p.certificates.length;
        } catch(e) {}
      }
    }
    const hist = JSON.parse(localStorage.getItem('studyhub_login_history') || '[]');
    const today = new Date().toDateString();
    const active = hist.filter(l => l.date === today).length;
    const reqs = JSON.parse(localStorage.getItem('studyhub_requests_all') || '[]');
    const accepted = reqs.filter(r => r.status === 'accepted');
    const chatrooms = {};
    accepted.forEach(r => {
      const k = `chat_${[r.studentEmail, r.mentorEmail].sort().join('_')}`;
      const m = localStorage.getItem(k);
      if (m) chatrooms[k] = JSON.parse(m).length;
    });
    setStats({ totalUsers:profiles.length, activeToday:active, totalMatches:accepted.length, totalCertificates:totalCerts, totalChats:Object.values(chatrooms).reduce((a,b)=>a+b,0) });
    setUsers(profiles);
    setDailyLogins(hist.slice(-30));
    setRecentMatches(accepted.slice(-10));
    setCertificates(profiles.flatMap(p => p.certificates?.map(c => ({...c, owner:p.name, email:p.email})) || []));
  };

  // ── REMOVE USER: wipe all their localStorage data ──
  const removeUser = (email) => {
    if (!window.confirm(`⚠️ Remove user "${email}"?\n\nThis will permanently delete their profile, certificates, chat history, and all requests.`)) return;

    // Delete profile
    localStorage.removeItem(`studyhub_profile_${email}`);
    // Delete credit points
    localStorage.removeItem(`studyhub_credits_${email}`);
    // Delete test scores & completed tests
    localStorage.removeItem(`studyhub_test_scores_${email}`);
    localStorage.removeItem(`studyhub_completed_tests_${email}`);
    // Delete study data
    localStorage.removeItem(`studyhub_studydata_${email}`);
    // Delete login session if currently logged in as this user
    const cu = JSON.parse(localStorage.getItem('studyhub_currentUser') || '{}');
    if (cu.email === email) localStorage.removeItem('studyhub_currentUser');

    // Remove from all requests
    const reqs = JSON.parse(localStorage.getItem('studyhub_requests_all') || '[]');
    const filtered = reqs.filter(r => r.studentEmail !== email && r.mentorEmail !== email);
    localStorage.setItem('studyhub_requests_all', JSON.stringify(filtered));

    // Remove chat messages involving this user
    const keysToDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('chat_') && k.includes(email)) keysToDelete.push(k);
    }
    keysToDelete.forEach(k => localStorage.removeItem(k));

    // Remove from login history
    const hist = JSON.parse(localStorage.getItem('studyhub_login_history') || '[]');
    localStorage.setItem('studyhub_login_history', JSON.stringify(hist.filter(l => l.email !== email)));

    // Refresh data
    loadAllData();
    setRemovingEmail(null);
    alert(`✅ User "${email}" has been removed successfully.`);
  };

  const loginAsUser = () => {
    localStorage.removeItem('studyhub_currentUser');
    localStorage.removeItem('studyhub_user');
    setIsLoggedIn(false);
    navigate('/', { replace: true });
  };

  // Show nothing (blank) until auth check is done — prevents profile page flash
  if (!authChecked) return (
    <div style={{minHeight:'100vh',background:'#020612',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'Syne,sans-serif',color:'#00f0ff',fontSize:'1.1rem',opacity:0.6}}>Loading…</div>
    </div>
  );

  if (!isAdmin) return null;

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isActiveToday = (user) => {
    const today = new Date().toDateString();
    return dailyLogins.some(l => l.email === user.email && l.date === today);
  };

  const statItems = [
    { icon:'👥', label:'Total Users',   value:stats.totalUsers,        color:'var(--cyan)',   border:'rgba(0,240,255,0.25)' },
    { icon:'🟢', label:'Active Today',  value:stats.activeToday,       color:'var(--green)',  border:'rgba(0,255,179,0.25)' },
    { icon:'💬', label:'Matches',       value:stats.totalMatches,      color:'var(--violet)', border:'rgba(162,89,255,0.25)' },
    { icon:'📜', label:'Certificates',  value:stats.totalCertificates, color:'var(--amber)',  border:'rgba(255,184,0,0.25)' },
    { icon:'💭', label:'Chat Messages', value:stats.totalChats,        color:'var(--danger)', border:'rgba(255,60,111,0.25)' },
  ];

  const last7 = [...new Set(dailyLogins.map(l => l.date))].slice(-7).reverse();
  const maxLogins = Math.max(...last7.map(d => dailyLogins.filter(l => l.date === d).length), 1);

  return (
    <div className="ad" style={{minHeight:'100vh', background:'linear-gradient(135deg,#020612 0%,#06081a 50%,#0a0618 100%)'}}>
      <style>{THEME}</style>
      <div style={{position:'fixed',top:'-20%',left:'-10%',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,240,255,0.04),transparent 70%)',pointerEvents:'none',zIndex:0}}/>
      <div style={{position:'fixed',bottom:'-20%',right:'-10%',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(162,89,255,0.05),transparent 70%)',pointerEvents:'none',zIndex:0}}/>

      <div style={{position:'relative',zIndex:1,maxWidth:1300,margin:'0 auto',padding:'32px 24px'}}>

        {/* HEADER */}
        <div className="anim" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28,flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{fontFamily:'Syne',fontWeight:800,fontSize:'2rem',background:'linear-gradient(135deg,var(--amber),var(--danger))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:4}}>
              👨‍💼 Admin Dashboard
            </h1>
            <p style={{color:'var(--muted)',fontSize:'0.82rem'}}>SkillSwap Platform Analytics · {new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={loginAsUser} className="btn-violet" style={{padding:'10px 22px',borderRadius:12,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:6}}>👤 Switch to User</button>
            <button onClick={loadAllData} className="btn-green" style={{padding:'10px 22px',borderRadius:12,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:6}}>🔄 Refresh</button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="anim" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14,marginBottom:24,animationDelay:'0.06s'}}>
          {statItems.map(({icon,label,value,color,border})=>(
            <div key={label} className="stat-card" style={{borderColor:border}}>
              <div style={{fontSize:24,marginBottom:6}}>{icon}</div>
              <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.9rem',color,marginBottom:2}}>{value}</div>
              <div style={{color:'var(--muted)',fontSize:'0.72rem',fontWeight:600}}>{label}</div>
            </div>
          ))}
        </div>

        {/* SEARCH + FILTER */}
        <div className="anim" style={{display:'flex',gap:12,marginBottom:22,flexWrap:'wrap',animationDelay:'0.09s'}}>
          <div style={{position:'relative',flex:1,minWidth:220}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:16,pointerEvents:'none'}}>🔍</span>
            <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search users by name or email…" className="inp" style={{paddingLeft:38,width:'100%'}}/>
          </div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="inp" style={{minWidth:180}}>
            <option value="all">📊 All Activities</option>
            <option value="today">🟢 Active Today</option>
            <option value="matches">💬 Matches</option>
            <option value="certificates">📜 Certificates</option>
          </select>
        </div>

        {/* MAIN GRID */}
        <div className="anim" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:18,animationDelay:'0.12s'}}>

          {/* USERS TABLE */}
          <div className="section">
            <h2 style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:'var(--cyan)',marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
              👥 All Users
              <span style={{background:'rgba(0,240,255,0.1)',color:'var(--cyan)',border:'1px solid rgba(0,240,255,0.25)',borderRadius:99,padding:'2px 10px',fontSize:'0.75rem'}}>{filteredUsers.length}</span>
            </h2>
            <div className="scroll-y" style={{maxHeight:480,overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.82rem'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid rgba(0,240,255,0.12)'}}>
                    {['Name','Email','I Know / I Want','Certs','Status','Updated','Action'].map(h=>(
                      <th key={h} style={{padding:'8px 10px',color:'var(--muted)',fontWeight:700,textAlign:'left',whiteSpace:'nowrap',fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.slice(0,20).map((u,i)=>{
                    const active = isActiveToday(u);
                    return (
                      <tr key={i} className="table-row">
                        <td style={{padding:'10px 10px',color:'var(--text)',fontWeight:600,whiteSpace:'nowrap'}}>{u.name||'—'}</td>
                        <td style={{padding:'10px 10px',color:'var(--cyan)',fontSize:'0.76rem',whiteSpace:'nowrap'}}>{u.email}</td>
                        <td style={{padding:'10px 10px',maxWidth:150}}>
                          <div style={{color:'var(--green)',fontSize:'0.7rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>✅ {u.knowsSkills?.substring(0,28)||'—'}</div>
                          <div style={{color:'var(--violet)',fontSize:'0.7rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>🎯 {u.wantsSkills?.substring(0,28)||'—'}</div>
                        </td>
                        <td style={{padding:'10px 10px',textAlign:'center'}}>
                          <span className="badge badge-amber">{u.certificates?.length||0}</span>
                        </td>
                        <td style={{padding:'10px 10px',whiteSpace:'nowrap'}}>
                          <span className={`badge ${active?'badge-green':'badge-danger'}`}>{active?'● Active':'○ Inactive'}</span>
                        </td>
                        <td style={{padding:'10px 10px',color:'var(--muted)',fontSize:'0.7rem',whiteSpace:'nowrap'}}>{u.updatedAt||'—'}</td>
                        {/* ── REMOVE BUTTON ── */}
                        <td style={{padding:'10px 10px',whiteSpace:'nowrap'}}>
                          <button className="remove-btn" onClick={()=>removeUser(u.email)}>🗑 Remove</button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length===0&&(
                    <tr><td colSpan={7} style={{padding:'32px',textAlign:'center',color:'var(--muted)',fontSize:'0.85rem'}}>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>

            {/* RECENT MATCHES */}
            <div className="section" style={{flex:1}}>
              <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'0.9rem',color:'var(--green)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
                💬 Recent Matches
                <span style={{background:'rgba(0,255,179,0.1)',color:'var(--green)',border:'1px solid rgba(0,255,179,0.22)',borderRadius:99,padding:'2px 8px',fontSize:'0.7rem'}}>{recentMatches.length}</span>
              </h3>
              <div className="scroll-y" style={{maxHeight:170,display:'flex',flexDirection:'column',gap:8}}>
                {recentMatches.length===0
                  ?<p style={{color:'var(--muted)',fontSize:'0.82rem',textAlign:'center',padding:'20px 0'}}>No matches yet</p>
                  :recentMatches.map((m,i)=>(
                    <div key={i} style={{background:'rgba(0,255,179,0.04)',border:'1px solid rgba(0,255,179,0.12)',borderRadius:10,padding:'10px 14px',borderLeft:'3px solid var(--green)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                        <span style={{color:'var(--text)',fontWeight:600,fontSize:'0.82rem'}}>{m.studentName} ↔ {m.mentorName}</span>
                        <span style={{color:'var(--muted)',fontSize:'0.68rem'}}>{m.timestamp}</span>
                      </div>
                      <p style={{color:'var(--muted)',fontSize:'0.74rem',margin:0}}>{m.swapDeal}</p>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* CERTIFICATES */}
            <div className="section">
              <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'0.9rem',color:'var(--amber)',marginBottom:14}}>📜 Certificate Uploads</h3>
              <div className="scroll-y" style={{maxHeight:130,display:'flex',flexDirection:'column',gap:6}}>
                {certificates.length===0
                  ?<p style={{color:'var(--muted)',fontSize:'0.82rem',textAlign:'center',padding:'16px 0'}}>No certificates yet</p>
                  :certificates.slice(0,6).map((c,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,184,0,0.04)',border:'1px solid rgba(255,184,0,0.12)',borderRadius:9,padding:'8px 12px'}}>
                      <div>
                        <span style={{color:'var(--text)',fontWeight:600,fontSize:'0.78rem'}}>{c.owner}</span>
                        <span style={{color:'var(--muted)',fontSize:'0.72rem',marginLeft:6}}>· {c.name?.substring(0,24)}</span>
                      </div>
                      <span style={{color:'var(--muted)',fontSize:'0.68rem'}}>{c.email}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* LOGIN CHART */}
            <div className="section">
              <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'0.9rem',color:'var(--violet)',marginBottom:14}}>📈 Daily Logins (Last 7 Days)</h3>
              {last7.length===0
                ?<p style={{color:'var(--muted)',fontSize:'0.82rem',textAlign:'center',padding:'16px 0'}}>No login data yet</p>
                :<div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {last7.map((d,i)=>{
                    const count=dailyLogins.filter(l=>l.date===d).length;
                    const pct=Math.round((count/maxLogins)*100);
                    return(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{color:'var(--muted)',fontSize:'0.7rem',width:72,flexShrink:0}}>{new Date(d).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}</span>
                        <div style={{flex:1,height:6,background:'rgba(255,255,255,0.06)',borderRadius:99,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,var(--violet),var(--cyan))',borderRadius:99,boxShadow:'0 0 8px rgba(162,89,255,0.4)',transition:'width .5s ease'}}/>
                        </div>
                        <span style={{color:'var(--violet)',fontWeight:700,fontSize:'0.75rem',width:24,textAlign:'right'}}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              }
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="glass anim" style={{borderRadius:14,padding:'14px 24px',marginTop:20,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10,animationDelay:'0.2s'}}>
          <p style={{color:'var(--muted)',fontSize:'0.75rem'}}>Last refreshed: {new Date().toLocaleString()}</p>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            {[['👥',stats.totalUsers,'Users'],['🟢',stats.activeToday,'Active'],['💬',stats.totalChats,'Messages'],['📜',stats.totalCertificates,'Certificates']].map(([ic,v,l])=>(
              <span key={l} style={{color:'var(--muted)',fontSize:'0.75rem'}}>{ic} <b style={{color:'var(--text)'}}>{v}</b> {l}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}