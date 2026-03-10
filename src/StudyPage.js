import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root { --cyan:#00f0ff; --violet:#a259ff; --green:#00ffb3; --amber:#ffb800; --danger:#ff3c6f; --glass:rgba(6,10,28,0.78); --border:rgba(0,240,255,0.14); --text:#eef2ff; --muted:rgba(180,200,240,0.5); }
  .sp * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
  .sp h1,.sp h2,.sp h3 { font-family:'Syne',sans-serif; }
  .glass { background:var(--glass); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid var(--border); }
  .glass2 { background:rgba(255,255,255,0.04); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.07); }
  .overlay { position:fixed; inset:0; background:rgba(4,8,20,0.62); z-index:0; pointer-events:none; }
  .btn-cyan { background:linear-gradient(135deg,#00f0ff,#0099bb); color:#000; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-cyan:hover { box-shadow:0 0 22px rgba(0,240,255,0.45); transform:translateY(-1px); }
  .btn-violet { background:linear-gradient(135deg,#a259ff,#6c2fff); color:#fff; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-violet:hover { box-shadow:0 0 22px rgba(162,89,255,0.45); transform:translateY(-1px); }
  .btn-danger { background:linear-gradient(135deg,#ff3c6f,#c0003c); color:#fff; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-danger:hover { box-shadow:0 0 18px rgba(255,60,111,0.4); transform:translateY(-1px); }
  .btn-ghost { background:rgba(255,255,255,0.05); color:var(--muted); border:1px solid rgba(255,255,255,0.09); cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-ghost:hover { background:rgba(255,255,255,0.09); color:var(--text); }
  .session-card { background:rgba(6,10,28,0.85); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.07); border-radius:18px; padding:22px; cursor:pointer; transition:transform .22s,box-shadow .22s,border-color .22s; }
  .session-card:hover { transform:translateY(-4px); box-shadow:0 12px 36px rgba(0,0,0,0.4); border-color:rgba(0,240,255,0.22); }
  .glow-bar { border-radius:99px; transition:width .6s ease; }
  @keyframes up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .anim { animation:up .38s ease both; }
  @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(0,255,179,0.35)} 50%{box-shadow:0 0 0 12px rgba(0,255,179,0)} }
  .active-pulse { animation:pulse-ring 2s infinite; }
`;

export default function StudyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studyTime, setStudyTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const userEmail = localStorage.getItem('studyhub_currentUser') || 'default';
  const [userStudyData, setUserStudyData] = useState({ totalStudyTime:0, sessions:{} });

  const studySessions = [
    { id:1, title:'React Hooks Mastery',    icon:'⚛️', estimatedTime:10080, color:'#22d3ee' },
    { id:2, title:'Python Advanced',         icon:'🐍', estimatedTime:5400,  color:'#f7c948' },
    { id:3, title:'JavaScript ES6+',         icon:'⚡', estimatedTime:11700, color:'#fde047' },
    { id:4, title:'Daily Coding Challenge',  icon:'💻', estimatedTime:2700,  color:'#a78bfa' },
    { id:5, title:'Project Practice',        icon:'🚀', estimatedTime:15600, color:'#00ffb3' },
    { id:6, title:'Algorithm Practice',      icon:'🧠', estimatedTime:7800,  color:'#f472b6' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem(`studyhub_studydata_${userEmail}`);
    if (saved) { const p=JSON.parse(saved); setUserStudyData(p); setStudyTime(p.totalStudyTime||0); }
  }, [userEmail]);

  useEffect(() => { localStorage.setItem(`studyhub_studydata_${userEmail}`, JSON.stringify(userStudyData)); }, [userStudyData, userEmail]);

  useEffect(() => {
    let iv;
    if (isActive) { iv = setInterval(()=>{ setStudyTime(t=>{ const n=t+1; setUserStudyData(p=>({...p,totalStudyTime:n})); return n; }); },1000); }
    return ()=>clearInterval(iv);
  }, [isActive]);

  useEffect(() => {
    if (location.state?.readingTime) {
      const { bookId, timeSpent } = location.state.readingTime;
      setUserStudyData(prev=>({ ...prev, sessions:{...prev.sessions,[bookId]:(prev.sessions?.[bookId]||0)+timeSpent}, totalStudyTime:prev.totalStudyTime+timeSpent }));
      setStudyTime(p=>p+timeSpent);
    }
  }, [location.state]);

  const fmt = (s) => { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60; if(h>0)return `${h}h ${m}m`; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; };
  const getProg = (id, est) => Math.min(((userStudyData.sessions?.[id]||0)/est)*100, 100);

  const handleSessionClick = (s) => {
    const map={1:1,2:2,3:3};
    if(map[s.id]) navigate('/books',{state:{fromStudy:true,sessionId:s.id,bookId:map[s.id]}});
  };

  const resetSession = () => { if(confirm('Reset session timer?')){ setStudyTime(0); setIsActive(false); } };
  const resetAll = () => { if(confirm('Reset ALL study data? Cannot be undone!')){ localStorage.removeItem(`studyhub_studydata_${userEmail}`); setUserStudyData({totalStudyTime:0,sessions:{}}); setStudyTime(0); setIsActive(false); } };

  const totalEst = studySessions.reduce((a,b)=>a+b.estimatedTime,0);
  const totalDone = Object.values(userStudyData.sessions||{}).reduce((a,b)=>a+b,0);
  const overallPct = Math.round((totalDone/totalEst)*100);
  const activeSessions = Object.keys(userStudyData.sessions||{}).length;

  return (
    <div className="sp" style={{minHeight:'100vh',backgroundImage:"url('/background.jpeg')",backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed'}}>
      <style>{THEME}</style>
      <div className="overlay"/>
      <div style={{position:'relative',zIndex:1,maxWidth:1200,margin:'0 auto',padding:'32px 24px'}}>

        {/* NAV */}
        <nav className="anim" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
          <button onClick={()=>navigate('/profile')} className="btn-ghost" style={{padding:'10px 22px',borderRadius:12,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:6}}>← Profile</button>
          <div className="glass" style={{borderRadius:16,padding:'9px 24px'}}>
            <h1 style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.2rem',background:'linear-gradient(135deg,var(--cyan),var(--violet))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:0}}>🎯 Study Dashboard</h1>
          </div>
          <button onClick={()=>navigate('/books')} className="btn-violet" style={{padding:'10px 22px',borderRadius:12,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:6}}>📚 Books</button>
        </nav>

        {/* TIMER CARD */}
        <div className="glass anim" style={{borderRadius:22,padding:'32px',marginBottom:28,textAlign:'center',animationDelay:'0.06s'}}>
          <p style={{color:'var(--muted)',fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>Session Timer</p>

          {/* Big clock */}
          <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'4.5rem',letterSpacing:'-0.02em',background:'linear-gradient(135deg,var(--cyan),var(--violet))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',lineHeight:1,marginBottom:8}}>{fmt(studyTime)}</div>
          <p style={{color:'var(--muted)',fontSize:'0.82rem',marginBottom:24}}>Total lifetime: <span style={{color:'var(--green)',fontWeight:700}}>{fmt(userStudyData.totalStudyTime)}</span></p>

          {/* Controls */}
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={resetSession} className="btn-danger" style={{padding:'12px 22px',borderRadius:12,fontSize:'0.88rem',display:'flex',alignItems:'center',gap:6}}>🔄 Reset</button>
            <button onClick={()=>setIsActive(!isActive)} className={isActive?'btn-danger':'btn-cyan'} style={{padding:'14px 36px',borderRadius:14,fontSize:'1rem',display:'flex',alignItems:'center',gap:8,...(isActive?{}:{})}} id="startbtn">
              {isActive?'⏸ Pause':'▶ Start'}
            </button>
            <button onClick={resetAll} className="btn-ghost" style={{padding:'12px 18px',borderRadius:12,fontSize:'0.85rem'}} title="Reset All Data">🗑️</button>
          </div>

          {/* Active indicator */}
          {isActive && <div style={{marginTop:16,display:'inline-flex',alignItems:'center',gap:8,background:'rgba(0,255,179,0.07)',border:'1px solid rgba(0,255,179,0.2)',borderRadius:99,padding:'6px 16px'}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:'var(--green)',display:'inline-block'}} className="active-pulse"/>
            <span style={{color:'var(--green)',fontSize:'0.78rem',fontWeight:600}}>Recording session</span>
          </div>}
        </div>

        {/* STATS ROW */}
        <div className="anim" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:28,animationDelay:'0.1s'}}>
          {[{l:'Total Study Time',v:fmt(userStudyData.totalStudyTime),c:'var(--cyan)'},{l:'Overall Completion',v:`${overallPct}%`,c:'var(--violet)'},{l:'Active Sessions',v:activeSessions,c:'var(--green)'}].map(({l,v,c})=>(
            <div className="glass2" key={l} style={{borderRadius:16,padding:'18px 20px',textAlign:'center'}}>
              <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.7rem',color:c}}>{v}</div>
              <div style={{color:'var(--muted)',fontSize:'0.75rem',fontWeight:600,marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>

        {/* SESSION CARDS */}
        <div className="anim" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16,animationDelay:'0.14s'}}>
          {studySessions.map((s,i)=>{
            const prog=getProg(s.id,s.estimatedTime);
            const actual=userStudyData.sessions?.[s.id]||0;
            const barColor = prog===100?'var(--green)':prog>50?s.color:'var(--amber)';
            return(
              <div key={s.id} className="session-card" onClick={()=>handleSessionClick(s)} style={{animationDelay:`${0.15+i*0.05}s`}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                  <div style={{width:46,height:46,borderRadius:13,background:`${s.color}18`,border:`1px solid ${s.color}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{s.icon}</div>
                  <div>
                    <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:'0.92rem',color:'var(--text)',margin:0,marginBottom:2}}>{s.title}</h3>
                    <span style={{fontSize:'0.7rem',color:'var(--muted)'}}>{fmt(actual)} / {fmt(s.estimatedTime)}</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{height:5,background:'rgba(255,255,255,0.07)',borderRadius:99,overflow:'hidden',marginBottom:10}}>
                  <div className="glow-bar" style={{height:'100%',width:`${prog}%`,background:barColor,boxShadow:`0 0 8px ${barColor}66`}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'0.78rem',fontWeight:700,color:barColor}}>{Math.round(prog)}%</span>
                  <span style={{fontSize:'0.72rem',color:'var(--muted)'}}>👆 Click to study</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}