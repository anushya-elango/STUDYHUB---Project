import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// ── Design tokens (shared system) ────────────────────────────────────────────
const T = {
  cyan:   '#00f5d4',
  purple: '#7c3aed',
  amber:  '#f59e0b',
  green:  '#10b981',
  red:    '#ef4444',
  blue:   '#3b82f6',
  pink:   '#ec4899',
  text:   '#f1f5f9',
  muted:  '#475569',
  dim:    '#1e293b',
  glass: {
    background: 'rgba(12,18,36,0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  },
  glow: c => `0 0 24px ${c}44, 0 0 60px ${c}18`,
};

const GlassCard = ({ children, style = {} }) => (
  <div style={{ ...T.glass, borderRadius: 20, ...style }}>{children}</div>
);

function MatchedMentorPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [userProfile,  setUserProfile]  = useState(null);
  const [mentor,       setMentor]       = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [newMessage,   setNewMessage]   = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef(null);
  const chatEndRef     = useRef(null);
  const [activeTest,       setActiveTest]       = useState(null);
  const [quizAnswers,      setQuizAnswers]       = useState({});
  const [score,            setScore]             = useState(null);
  const [testScores,       setTestScores]        = useState({ 1:null, 2:null, 3:null, 4:null });
  const [completedTests,   setCompletedTests]    = useState(new Set());
  const [creditPoints,     setCreditPoints]      = useState(0);
  const [completedCourses, setCompletedCourses]  = useState([]);
  const [creditAlreadyAwarded, setCreditAlreadyAwarded] = useState(false);

  const testColors = { 1: T.blue, 2: T.purple, 3: T.pink, 4: T.amber };

  const quizData = {
    1:[{question:"What is React?",options:["Library","Database","Language","Server"],answer:"Library"},{question:"What hook is used for state?",options:["useEffect","useState","useRef","useMemo"],answer:"useState"},{question:"JSX stands for?",options:["Java Syntax","JavaScript XML","JSON XML","None"],answer:"JavaScript XML"},{question:"React is developed by?",options:["Google","Facebook","Microsoft","Amazon"],answer:"Facebook"},{question:"Which command creates React app?",options:["npm create","npx create-react-app","react start","npm install react"],answer:"npx create-react-app"}],
    2:[{question:"What is HTML used for?",options:["Styling","Structure","Database","Logic"],answer:"Structure"},{question:"CSS is used for?",options:["Logic","Styling","Backend","Security"],answer:"Styling"},{question:"Which tag creates link?",options:["<a>","<p>","<div>","<img>"],answer:"<a>"},{question:"Which property changes text color?",options:["font-size","background","color","border"],answer:"color"},{question:"HTML stands for?",options:["Hyper Text Markup Language","High Text Machine Language","Hyper Tool Multi Language","None"],answer:"Hyper Text Markup Language"}],
    3:[{question:"Java is?",options:["Frontend","Backend","Both","None"],answer:"Both"},{question:"Which keyword creates class?",options:["function","class","define","object"],answer:"class"},{question:"OOP means?",options:["Object Oriented Programming","Online Object Process","Only Object Programming","None"],answer:"Object Oriented Programming"},{question:"JVM stands for?",options:["Java Virtual Machine","Java Verified Mode","Joint Virtual Model","None"],answer:"Java Virtual Machine"},{question:"Java file extension?",options:[".js",".java",".class",".html"],answer:".java"}],
    4:[{question:"What is Database?",options:["Storage","Design","Style","Code"],answer:"Storage"},{question:"SQL is used for?",options:["Styling","Query Data","Frontend","Security"],answer:"Query Data"},{question:"Primary key is?",options:["Unique ID","Password","Foreign Key","None"],answer:"Unique ID"},{question:"Which is NoSQL?",options:["MySQL","MongoDB","Oracle","SQL Server"],answer:"MongoDB"},{question:"Database stores?",options:["Data","Styles","Images only","Nothing"],answer:"Data"}],
  };

  const getChatKey = (a, b) => `chat_${[a,b].sort().join('_')}`;

  useEffect(() => {
    let user = null, selectedMentor = null;
    if (location.state?.userProfile && location.state?.selectedMentor) {
      user = location.state.userProfile; selectedMentor = location.state.selectedMentor;
      localStorage.setItem('studyhub_current_chat_user', JSON.stringify(user));
      localStorage.setItem('studyhub_current_chat_mentor', JSON.stringify(selectedMentor));
    } else {
      const su = localStorage.getItem('studyhub_current_chat_user');
      const sm = localStorage.getItem('studyhub_current_chat_mentor');
      if (su && sm) { user=JSON.parse(su); selectedMentor=JSON.parse(sm); }
    }
    if (user && selectedMentor) {
      setUserProfile(user); setMentor(selectedMentor);
      const saved = localStorage.getItem(getChatKey(user.email, selectedMentor.email));
      if (saved) setMessages(JSON.parse(saved));
      const sc = JSON.parse(localStorage.getItem(`studyhub_completed_tests_${user.email}`)||'[]');
      setCompletedTests(new Set(sc));
      const ss = JSON.parse(localStorage.getItem(`studyhub_test_scores_${user.email}`)||'{}');
      setTestScores(p=>({...p,...ss}));
      // ── migrate credit data ──
      const cred = JSON.parse(localStorage.getItem(`studyhub_credits_${user.email}`)||'{"points":0,"completedCourses":[]}');
      const raw = cred.completedCourses||[];
      const valid = raw.filter(c=>c.startsWith('cert_'));
      const pts = valid.length*10;
      if (valid.length!==raw.length||pts!==(cred.points||0)) localStorage.setItem(`studyhub_credits_${user.email}`,JSON.stringify({points:pts,completedCourses:valid}));
      setCreditPoints(pts); setCompletedCourses(valid);
      setCreditAlreadyAwarded(valid.includes(`cert_${selectedMentor.email}`));
    }
  }, [location.state]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()||!userProfile||!mentor) return;
    const msg = { text:newMessage.trim(), senderEmail:userProfile.email, senderName:userProfile.name, time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), id:Date.now() };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(getChatKey(userProfile.email,mentor.email), JSON.stringify(updated));
    setNewMessage('');
  };

  const startVideoCall = async () => {
    if (!userProfile||!mentor) { alert('User not loaded'); return; }
    try {
      const appID=1649377355, serverSecret='c4bed822e56807860b4e33f2f46d670d';
      const roomID=`room_${[userProfile.email,mentor.email].sort().join('_')}`;
      const kitToken=ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,roomID,Date.now().toString(),userProfile.name);
      const zp=ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({ container:document.getElementById('videoContainer'), scenario:{mode:ZegoUIKitPrebuilt.OneONoneCall}, showPreJoinView:true, turnOnCameraWhenJoining:true, turnOnMicrophoneWhenJoining:true, showScreenSharingButton:true });
    } catch(err) { console.error(err); alert('Video call failed.'); }
  };

  const handleAnswer = (qi, opt) => setQuizAnswers(p=>({...p,[qi]:opt}));

  const calculateScore = () => {
    let correct=0;
    quizData[activeTest].forEach((q,i)=>{ if(quizAnswers[i]===q.answer) correct++; });
    const nc=new Set(completedTests); nc.add(activeTest); setCompletedTests(nc);
    localStorage.setItem(`studyhub_completed_tests_${userProfile.email}`,JSON.stringify([...nc]));
    const ns={...testScores,[activeTest]:correct}; setTestScores(ns);
    localStorage.setItem(`studyhub_test_scores_${userProfile.email}`,JSON.stringify(ns));
    setScore(correct);
    setTimeout(()=>{ setActiveTest(null); setQuizAnswers({}); setScore(null); },2200);
  };

  const allTestsCompleted = completedTests.size===4;

  const tryAwardCreditPoints = () => {
    if (!userProfile||!mentor) return false;
    const key = `cert_${mentor.email}`;
    if (completedCourses.includes(key)) return false;
    const np=creditPoints+10, nc=[...completedCourses,key];
    setCreditPoints(np); setCompletedCourses(nc); setCreditAlreadyAwarded(true);
    localStorage.setItem(`studyhub_credits_${userProfile.email}`,JSON.stringify({points:np,completedCourses:nc}));
    return true;
  };

  const downloadCertificate = async () => {
    const canvas = await html2canvas(certificateRef.current);
    const link = document.createElement('a');
    link.download=`${userProfile.name}_Certificate.png`; link.href=canvas.toDataURL(); link.click();
    const awarded = tryAwardCreditPoints();
    alert(awarded ? '🎉 Certificate downloaded!\n🏆 +10 Credit Points added!' : '🎉 Downloaded again!\n(Points already awarded for this course)');
  };

  const isTestAvailable = n => n===1||completedTests.has(n-1);

  if (!mentor||!userProfile) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#060a16', fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16, color:T.cyan, fontFamily:'Orbitron,sans-serif' }}>⟁</div>
        <p style={{ color:T.muted, fontSize:16 }}>Loading…</p>
        <button onClick={()=>navigate('/profile')} style={{ marginTop:20, padding:'10px 24px', borderRadius:10, background:`${T.cyan}14`, border:`1px solid ${T.cyan}44`, color:T.cyan, cursor:'pointer', fontFamily:'Orbitron,sans-serif', fontSize:13 }}>← Back</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', fontFamily:'DM Sans, sans-serif', position:'relative' }}>
      {/* Background */}
      <div style={{ position:'fixed', inset:0, backgroundImage:"url('/background.jpeg')", backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed', zIndex:0 }} />
      <div style={{ position:'fixed', inset:0, background:'rgba(4,8,20,0.82)', zIndex:1 }} />

      <div style={{ position:'relative', zIndex:2, padding:'24px 28px', maxWidth:1380, margin:'0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <button onClick={()=>navigate('/profile')}
            style={{ display:'flex', alignItems:'center', gap:8, background:`linear-gradient(135deg,${T.cyan}22,${T.violet}22)`, border:`1px solid ${T.cyan}66`, color:T.cyan, borderRadius:10, padding:'9px 18px', cursor:'pointer', fontSize:13, fontWeight:700 }}>
            ← Back
          </button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Orbitron,sans-serif', color:T.cyan, fontSize:18, fontWeight:900, letterSpacing:2, textShadow:`0 0 30px ${T.cyan}66` }}>
              ⟁ {mentor.name?.toUpperCase()} CHATROOM
            </div>
            <div style={{ color:T.muted, fontSize:11, marginTop:2 }}>{mentor.knowsSkills}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:`${T.amber}12`, border:`1px solid ${T.amber}33`, borderRadius:12, padding:'9px 18px', boxShadow:T.glow(T.amber) }}>
            <span style={{ fontSize:18 }}>🏆</span>
            <div>
              <div style={{ fontFamily:'Orbitron,sans-serif', color:T.amber, fontSize:16, fontWeight:900 }}>{creditPoints}</div>
              <div style={{ color:T.muted, fontSize:10 }}>PTS</div>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID: Video + Chat ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

          {/* Video */}
          <GlassCard style={{ padding:24, display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:T.green, boxShadow:`0 0 8px ${T.green}` }} />
              <h2 style={{ fontFamily:'Orbitron,sans-serif', color:T.text, fontSize:13, letterSpacing:1 }}>LIVE VIDEO CLASS</h2>
            </div>
            <div id="videoContainer" style={{ width:'100%', height:360, borderRadius:14, overflow:'hidden', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.06)' }} />
            <button onClick={startVideoCall}
              style={{ marginTop:14, padding:'12px', borderRadius:12, background:`linear-gradient(135deg,${T.green},${T.cyan})`, color:'#0a0e1a', border:'none', cursor:'pointer', fontFamily:'Orbitron,sans-serif', fontSize:13, letterSpacing:1, boxShadow:`0 0 24px ${T.green}44` }}>
              ▶ JOIN VIDEO CLASS
            </button>
          </GlassCard>

          {/* Chat */}
          <GlassCard style={{ padding:24, display:'flex', flexDirection:'column', height:460 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:T.purple, boxShadow:`0 0 8px ${T.purple}` }} />
              <h2 style={{ fontFamily:'Orbitron,sans-serif', color:T.text, fontSize:13, letterSpacing:1 }}>MESSAGES</h2>
            </div>
            <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, paddingRight:4, marginBottom:14 }}>
              {messages.length===0
                ? <div style={{ textAlign:'center', color:T.dim, marginTop:60, fontSize:13 }}>Start the conversation…</div>
                : messages.map(msg => {
                  const isMe = msg.senderEmail===userProfile.email;
                  return (
                    <div key={msg.id} style={{ display:'flex', justifyContent:isMe?'flex-end':'flex-start' }}>
                      <div style={{ maxWidth:'75%', padding:'10px 14px', borderRadius:isMe?'16px 16px 4px 16px':'16px 16px 16px 4px', background:isMe?`linear-gradient(135deg,${T.cyan}cc,${T.purple}cc)`:'rgba(255,255,255,0.06)', border:isMe?'none':'1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontSize:11, fontWeight:700, color:isMe?'#0a0e1a88':T.muted, marginBottom:4 }}>{msg.senderName}</div>
                        <div style={{ color:isMe?'#0a0e1a':T.text, fontSize:13 }}>{msg.text}</div>
                        <div style={{ fontSize:10, color:isMe?'#0a0e1a66':T.dim, marginTop:4, textAlign:'right' }}>{msg.time}</div>
                      </div>
                    </div>
                  );
                })
              }
              <div ref={chatEndRef} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <input value={newMessage} onChange={e=>setNewMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()}
                placeholder="Type a message…"
                style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'11px 14px', color:T.text, fontFamily:'DM Sans,sans-serif', fontSize:13, outline:'none' }} />
              <button onClick={sendMessage}
                style={{ padding:'11px 20px', borderRadius:10, background:`linear-gradient(135deg,${T.cyan},${T.purple})`, color:'#0a0e1a', border:'none', cursor:'pointer', fontWeight:700, fontSize:14 }}>
                ➤
              </button>
            </div>
          </GlassCard>
        </div>

        {/* ── PRACTICE TESTS ── */}
        <GlassCard style={{ padding:28, marginBottom:20 }}>
          <h3 style={{ fontFamily:'Orbitron,sans-serif', color:T.text, fontSize:14, letterSpacing:2, textAlign:'center', marginBottom:22 }}>◈ PRACTICE TESTS</h3>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 }}>
            {[1,2,3,4].map(n => {
              const avail = isTestAvailable(n);
              const done  = completedTests.has(n);
              const c     = testColors[n];
              return (
                <button key={n} onClick={()=>avail&&setActiveTest(n)} disabled={!avail}
                  style={{ padding:'14px 0', borderRadius:14, border:`1.5px solid ${avail?c:'rgba(255,255,255,0.06)'}`, background:avail?`${c}14`:'rgba(255,255,255,0.03)', color:avail?c:T.dim, cursor:avail?'pointer':'not-allowed', fontFamily:'Orbitron,sans-serif', fontSize:13, letterSpacing:1, boxShadow:avail?T.glow(c):'none', transition:'all 0.2s', opacity:avail?1:0.4 }}>
                  TEST {n} {done?'✓':''}
                  {done&&testScores[n]!=null&&<div style={{fontSize:10,marginTop:4,color:`${c}cc`}}>{testScores[n]}/5</div>}
                </button>
              );
            })}
          </div>

          {/* Progress */}
          {completedTests.size>0 && (
            <div style={{ marginBottom:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:T.muted, marginBottom:6 }}>
                <span>Progress</span><span style={{color:T.cyan}}>{completedTests.size}/4 tests</span>
              </div>
              <div style={{ height:4, background:'rgba(255,255,255,0.05)', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(completedTests.size/4)*100}%`, background:`linear-gradient(90deg,${T.cyan},${T.purple})`, transition:'width 0.5s ease', boxShadow:`0 0 10px ${T.cyan}66`, borderRadius:99 }} />
              </div>
            </div>
          )}

          <button onClick={()=>setShowCertificate(true)} disabled={!allTestsCompleted}
            style={{ width:'100%', padding:'14px', borderRadius:14, border:`1.5px solid ${allTestsCompleted?T.green:'rgba(255,255,255,0.06)'}`, background:allTestsCompleted?`${T.green}14`:'rgba(255,255,255,0.03)', color:allTestsCompleted?T.green:T.dim, cursor:allTestsCompleted?'pointer':'not-allowed', fontFamily:'Orbitron,sans-serif', fontSize:13, letterSpacing:1, boxShadow:allTestsCompleted?T.glow(T.green):'none', transition:'all 0.2s' }}>
            {!allTestsCompleted ? '🔒 COMPLETE ALL TESTS FIRST' : creditAlreadyAwarded ? '🎓 DOWNLOAD CERTIFICATE AGAIN' : '🎓 DOWNLOAD CERTIFICATE (+10 PTS)'}
          </button>
        </GlassCard>

        {/* ── ACTIVE TEST ── */}
        {activeTest && (
          <GlassCard style={{ padding:28 }}>
            <h2 style={{ fontFamily:'Orbitron,sans-serif', color:testColors[activeTest], fontSize:14, letterSpacing:2, marginBottom:22, textShadow:T.glow(testColors[activeTest]) }}>
              ◈ TEST {activeTest} — QUIZ
            </h2>
            {quizData[activeTest].map((q,qi) => (
              <div key={qi} style={{ marginBottom:22, padding:18, borderRadius:14, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color:T.text, fontWeight:600, marginBottom:12, fontSize:14 }}>{qi+1}. {q.question}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {q.options.map((opt,oi) => {
                    const selected = quizAnswers[qi]===opt;
                    const c = testColors[activeTest];
                    return (
                      <label key={oi} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, border:`1px solid ${selected?c:'rgba(255,255,255,0.07)'}`, background:selected?`${c}14`:'rgba(255,255,255,0.03)', cursor:'pointer', color:selected?c:T.muted, fontSize:13, transition:'all 0.15s' }}>
                        <input type="radio" name={`q${qi}`} value={opt} onChange={()=>handleAnswer(qi,opt)} style={{accentColor:c}} />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <button onClick={calculateScore}
                style={{ padding:'12px 32px', borderRadius:12, background:`linear-gradient(135deg,${T.green},${T.cyan})`, color:'#0a0e1a', border:'none', cursor:'pointer', fontFamily:'Orbitron,sans-serif', fontSize:13, letterSpacing:1, boxShadow:`0 0 24px ${T.green}44` }}>
                ◉ SUBMIT TEST
              </button>
              {score!==null && (
                <div style={{ fontFamily:'Orbitron,sans-serif', color:score>=4?T.green:T.amber, fontSize:16, textShadow:T.glow(score>=4?T.green:T.amber) }}>
                  SCORE: {score}/5 {score===5?'🏆':score>=3?'✓':''}
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>

      {/* ── CERTIFICATE MODAL ── */}
      {showCertificate && allTestsCompleted && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.90)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:24 }}>
          <div style={{ ...T.glass, borderRadius:24, padding:36, maxWidth:460, width:'100%', border:`1px solid ${T.green}28`, boxShadow:`0 0 60px ${T.green}14`, textAlign:'center' }}>

            {/* Certificate preview */}
            <div ref={certificateRef} style={{ marginBottom:24, padding:28, borderRadius:18, background:'linear-gradient(135deg,#0a0e1a,#0f172a)', border:`2px solid ${T.cyan}44` }}>
              <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:20, fontWeight:900, letterSpacing:2, marginBottom:16, background:`linear-gradient(135deg,${T.cyan},${T.purple})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SKILL SWAP</div>
              <div style={{ color:T.muted, fontSize:11, letterSpacing:3, marginBottom:20 }}>CERTIFICATE OF COMPLETION</div>
              <div style={{ fontFamily:'Orbitron,sans-serif', color:T.text, fontSize:22, fontWeight:900, marginBottom:12 }}>{userProfile.name}</div>
              <div style={{ color:T.muted, fontSize:13, marginBottom:6 }}>Completed all 4 training tests</div>
              <div style={{ color:T.muted, fontSize:13, marginBottom:16 }}>Mentor: <span style={{color:T.cyan}}>{mentor.name}</span></div>
              <div style={{ color:T.dim, fontSize:11 }}>{new Date().toLocaleDateString()}</div>
            </div>

            {!creditAlreadyAwarded ? (
              <div style={{ marginBottom:20, padding:14, borderRadius:14, background:`${T.amber}0e`, border:`1px solid ${T.amber}33` }}>
                <p style={{ color:T.amber, fontWeight:600, fontSize:13 }}>🏆 Download to earn +10 Credit Points!</p>
                <p style={{ color:T.muted, fontSize:11, marginTop:4 }}>{creditPoints} pts → {creditPoints+10} pts</p>
              </div>
            ) : (
              <div style={{ marginBottom:20, padding:12, borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ color:T.muted, fontSize:12 }}>✅ Credit points already awarded for this course</p>
              </div>
            )}

            <button onClick={downloadCertificate}
              style={{ width:'100%', padding:'13px', borderRadius:12, background:`linear-gradient(135deg,${T.green},${T.cyan})`, color:'#0a0e1a', border:'none', cursor:'pointer', fontFamily:'Orbitron,sans-serif', fontSize:13, letterSpacing:1, boxShadow:`0 0 28px ${T.green}44`, marginBottom:12 }}>
              ⬇ {creditAlreadyAwarded?'DOWNLOAD CERTIFICATE':'DOWNLOAD & EARN +10 PTS'}
            </button>
            <button onClick={()=>setShowCertificate(false)}
              style={{ background:'none', border:'none', color:T.red, cursor:'pointer', fontSize:13, fontFamily:'DM Sans,sans-serif' }}>
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchedMentorPage;