import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  :root {
    --cyan: #00f0ff; --violet: #a259ff; --green: #00ffb3; --amber: #ffb800;
    --danger: #ff3c6f; --glass: rgba(6,10,28,0.75); --glass2: rgba(255,255,255,0.04);
    --border: rgba(0,240,255,0.15); --text: #eef2ff; --muted: rgba(180,200,240,0.5);
  }
  .pr * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .pr h1,.pr h2,.pr h3,.pr h4 { font-family: 'Syne', sans-serif; }
  .glass { background: var(--glass); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border: 1px solid var(--border); }
  .glass2 { background: var(--glass2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.06); }
  .inp { background: rgba(0,0,0,0.4); border: 1px solid rgba(0,240,255,0.12); color: var(--text); border-radius: 10px; padding: 12px 16px; width: 100%; font-size: 0.9rem; transition: border-color .2s, box-shadow .2s; font-family: 'DM Sans', sans-serif; }
  .inp::placeholder { color: rgba(180,200,240,0.3); }
  .inp:focus { outline: none; border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(0,240,255,0.08); }
  .btn-cyan { background: linear-gradient(135deg,#00f0ff,#0099bb); color:#000; font-weight:700; border:none; cursor:pointer; transition: all .2s; }
  .btn-cyan:hover { box-shadow: 0 0 24px rgba(0,240,255,0.45); transform: translateY(-1px); }
  .btn-violet { background: linear-gradient(135deg,#a259ff,#6c2fff); color:#fff; font-weight:700; border:none; cursor:pointer; transition: all .2s; }
  .btn-violet:hover { box-shadow: 0 0 24px rgba(162,89,255,0.45); transform: translateY(-1px); }
  .btn-green { background: linear-gradient(135deg,#00ffb3,#00aa78); color:#000; font-weight:700; border:none; cursor:pointer; transition: all .2s; }
  .btn-green:hover { box-shadow: 0 0 24px rgba(0,255,179,0.45); transform: translateY(-1px); }
  .btn-danger { background: linear-gradient(135deg,#ff3c6f,#c0003c); color:#fff; font-weight:700; border:none; cursor:pointer; transition: all .2s; }
  .btn-danger:hover { box-shadow: 0 0 20px rgba(255,60,111,0.4); }
  .btn-ghost { background: rgba(255,255,255,0.05); color: var(--muted); border: 1px solid rgba(255,255,255,0.08); cursor:pointer; transition: all .2s; font-family:'DM Sans',sans-serif; }
  .btn-ghost:hover { background: rgba(255,255,255,0.09); color: var(--text); }
  .tag { display:inline-block; font-size:0.72rem; font-weight:700; padding:2px 10px; border-radius:20px; }
  .tag-cyan { background:rgba(0,240,255,0.1); color:var(--cyan); border:1px solid rgba(0,240,255,0.25); }
  .tag-green { background:rgba(0,255,179,0.1); color:var(--green); border:1px solid rgba(0,255,179,0.25); }
  .tag-amber { background:rgba(255,184,0,0.1); color:var(--amber); border:1px solid rgba(255,184,0,0.25); }
  .tag-violet { background:rgba(162,89,255,0.1); color:var(--violet); border:1px solid rgba(162,89,255,0.25); }
  .tag-danger { background:rgba(255,60,111,0.1); color:var(--danger); border:1px solid rgba(255,60,111,0.25); }
  .cert-valid { border:1px solid rgba(0,255,179,0.3); background:rgba(0,255,179,0.04); border-radius:12px; }
  .cert-invalid { border:1px solid rgba(255,60,111,0.3); background:rgba(255,60,111,0.04); border-radius:12px; }
  .glow-bar { background: linear-gradient(90deg,var(--cyan),var(--violet)); box-shadow:0 0 10px rgba(0,240,255,0.4); border-radius:99px; transition: width .7s ease; }
  .stat-box { background:var(--glass); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid var(--border); border-radius:16px; padding:20px; text-align:center; transition: transform .2s, box-shadow .2s; }
  .stat-box:hover { transform:translateY(-3px); box-shadow:0 8px 30px rgba(0,240,255,0.1); }
  .card-row { padding:14px 16px; border-radius:12px; transition:background .2s; }
  .card-row:hover { background:rgba(255,255,255,0.04); }
  .overlay { position:fixed; inset:0; background:rgba(4,8,20,0.55); z-index:0; pointer-events:none; }
  @keyframes up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .anim { animation: up 0.38s ease both; }
  @keyframes pg { 0%,100%{box-shadow:0 0 0 0 rgba(0,240,255,0.3)} 50%{box-shadow:0 0 0 10px rgba(0,240,255,0)} }
  .pulse { animation: pg 2.5s infinite; }
  .scroll-y { overflow-y:auto; scrollbar-width:thin; scrollbar-color:rgba(0,240,255,0.18) transparent; }
  .scroll-y::-webkit-scrollbar { width:3px; }
  .scroll-y::-webkit-scrollbar-thumb { background:rgba(0,240,255,0.2); border-radius:3px; }
`;

export default function ProfilePage({ userEmail, setIsLoggedIn }) {
  const [formData, setFormData] = useState({ name:'', knowsSkills:'', wantsSkills:'', qualification:'', number:'', certificates:[] });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [validationResults, setValidationResults] = useState([]);
  const [allCertificatesValid, setAllCertificatesValid] = useState(false);
  const [perfectMatches, setPerfectMatches] = useState([]);
  const [showMatches, setShowMatches] = useState(false);
  const [mySentRequests, setMySentRequests] = useState([]);
  const [myInboxRequests, setMyInboxRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [creditPoints, setCreditPoints] = useState(0);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingCertificate, setPendingCertificate] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentReason, setPaymentReason] = useState('certificate');
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  const skillRules = { python:['python','py','certified python','python programming','coursera python','udemy python'], javascript:['javascript','js','react','node.js','nodejs','angular','vue'], java:['java','java programming','oracle java','spring','hibernate'], react:['react','reactjs','react developer'], nodejs:['node.js','nodejs','express','express.js'], mongodb:['mongodb','mongo db','nosql'], html:['html','html5','web development'], css:['css','css3','bootstrap','tailwind'], 'data science':['data science','machine learning','ml','pandas','numpy'], 'machine learning':['machine learning','ml','tensorflow','pytorch'], sql:['sql','mysql','postgresql','database'], 'full stack':['full stack','fullstack','mern','mean'], aws:['aws','amazon web services'], docker:['docker','container'], kubernetes:['kubernetes','k8s'], git:['git','github','version control'], coursera:['coursera','coursera certificate'], udemy:['udemy','udemy certificate'], university:['university','bachelor','master','degree','diploma'] };

  useEffect(() => {
    const saved = localStorage.getItem(`studyhub_profile_${userEmail}`);
    if (saved) { try { const p=JSON.parse(saved); setFormData({name:p.name||'',knowsSkills:p.knowsSkills||'',wantsSkills:p.wantsSkills||'',qualification:p.qualification||'',number:p.number||'',certificates:Array.isArray(p.certificates)?p.certificates:[]}); setIsSubmitted(true); validateCerts(p.certificates, p.knowsSkills||''); } catch(e){} }
    const sc=JSON.parse(localStorage.getItem(`studyhub_credits_${userEmail}`)||'{"points":0,"completedCourses":[]}');
    const raw=sc.completedCourses||[]; const valid=raw.filter(c=>c.startsWith('cert_')); const pts=valid.length*10;
    if(valid.length!==raw.length||pts!==sc.points) localStorage.setItem(`studyhub_credits_${userEmail}`,JSON.stringify({points:pts,completedCourses:valid}));
    setCreditPoints(pts); setCompletedCourses(valid);
    loadRequests();
  }, [userEmail]);

  const validateCert = (cert, knows) => {
    const lk=knows.toLowerCase().trim(), ln=cert.name.toLowerCase();
    const claimed=lk.split(/[\n,\s;]+/).map(s=>s.trim()).filter(s=>s.length>2);
    let isValid=false,matchedSkills=[],reasons=[];
    for(const sk of claimed){ const rules=skillRules[sk]||[]; if(ln.includes(sk)){isValid=true;matchedSkills.push(sk);reasons.push(`Match: "${sk}"`);break;} for(const r of rules){if(ln.includes(r)){isValid=true;matchedSkills.push(sk);reasons.push(`Match: "${r}"`);break;}} if(isValid)break; }
    const credible=['coursera','udemy','university','certificate','certified'].some(k=>ln.includes(k))||cert.type.includes('pdf');
    if(!credible)reasons.push('Missing credible source');
    return {id:cert.id,isValid,matchedSkills,reasons,credible};
  };

  const validateCerts = (certs, knows=formData.knowsSkills) => {
    if(!knows||!certs||certs.length===0){setAllCertificatesValid(false);return;}
    const res=certs.map(c=>validateCert(c,knows)); setValidationResults(res); setAllCertificatesValid(res.every(r=>r.isValid));
  };

  useEffect(()=>{ if(formData.certificates.length>0&&formData.knowsSkills) validateCerts(formData.certificates); },[formData.knowsSkills,formData.certificates]);
  useEffect(()=>{ if(isSubmitted&&formData.knowsSkills&&formData.wantsSkills) findMatches(); },[isSubmitted,formData.knowsSkills,formData.wantsSkills]);

  const loadRequests = () => {
    try { const all=JSON.parse(localStorage.getItem('studyhub_requests_all')||'[]'); setMySentRequests(all.filter(r=>r.studentEmail===userEmail&&r.status==='pending')); setMyInboxRequests(all.filter(r=>r.mentorEmail===userEmail&&r.status==='pending')); setAcceptedConnections(all.filter(r=>(r.studentEmail===userEmail||r.mentorEmail===userEmail)&&r.status==='accepted')); } catch(e){}
  };

  const findMatches = () => {
    const profiles=[]; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith('studyhub_profile_')){try{const p=JSON.parse(localStorage.getItem(k));if(p.email!==userEmail)profiles.push(p);}catch(e){}}}
    const acc=JSON.parse(localStorage.getItem('studyhub_requests_all')||'[]').filter(r=>(r.studentEmail===userEmail||r.mentorEmail===userEmail)&&r.status==='accepted');
    setPerfectMatches(profiles.filter(u=>!acc.some(c=>c.studentEmail===u.email||c.mentorEmail===u.email)&&u.knowsSkills?.toLowerCase().includes(formData.wantsSkills.toLowerCase())&&formData.knowsSkills.toLowerCase().includes(u.wantsSkills?.toLowerCase())));
  };

  const sendRequest = (match) => {
    const req={id:Date.now().toString(),studentEmail:userEmail,studentName:formData.name,mentorEmail:match.email,mentorName:match.name,studentKnows:formData.knowsSkills,studentWants:formData.wantsSkills,mentorKnows:match.knowsSkills,mentorWants:match.wantsSkills,swapDeal:`You teach ${formData.wantsSkills} | They teach ${formData.knowsSkills}`,status:'pending',timestamp:new Date().toLocaleString()};
    const all=JSON.parse(localStorage.getItem('studyhub_requests_all')||'[]'); all.push(req); localStorage.setItem('studyhub_requests_all',JSON.stringify(all));
    alert(`✅ Request sent to ${match.name}!`); loadRequests();
  };

  const acceptRequest = (req) => {
    const all=JSON.parse(localStorage.getItem('studyhub_requests_all')||'[]');
    localStorage.setItem('studyhub_requests_all',JSON.stringify(all.map(r=>r.id===req.id?{...r,status:'accepted'}:r)));
    navigate('/matched-mentor',{state:{userProfile:{name:formData.name,email:userEmail,knowsSkills:formData.knowsSkills,wantsSkills:formData.wantsSkills},selectedMentor:{name:req.studentName,email:req.studentEmail,knowsSkills:req.studentKnows,wantsSkills:req.studentWants},swapDeal:req.swapDeal,isPermanent:true}});
  };

  const openChat = (conn) => {
    const partner=conn.studentEmail===userEmail?{name:conn.mentorName,email:conn.mentorEmail}:{name:conn.studentName,email:conn.studentEmail};
    navigate('/matched-mentor',{state:{userProfile:{name:formData.name,email:userEmail,knowsSkills:formData.knowsSkills,wantsSkills:formData.wantsSkills},selectedMentor:partner,swapDeal:conn.swapDeal,isPermanent:true}});
  };

  const handleEditClick = () => {
    if(creditPoints>=50){if(window.confirm(`Use 50 pts for free edit?\nPoints after: ${creditPoints-50}`)){const np=creditPoints-50;setCreditPoints(np);localStorage.setItem(`studyhub_credits_${userEmail}`,JSON.stringify({points:np,completedCourses}));setIsEditing(true);}}
    else{setPaymentReason('edit');setShowPaymentModal(true);}
  };

  const handlePaymentConfirmed = () => {
    setPaymentProcessing(true);
    setTimeout(()=>{setPaymentProcessing(false);setShowPaymentModal(false);setShowQR(false);
      if(paymentReason==='edit'){setIsEditing(true);alert('✅ Payment successful! Edit your profile.');}
      else{if(pendingCertificate){processUpload(pendingCertificate);setPendingCertificate(null);}alert('✅ Payment successful!');}
      setPaymentReason('certificate');
    },2000);
  };

  const closeModal = () => {setShowPaymentModal(false);setShowQR(false);setPendingCertificate(null);setPaymentReason('certificate');};

  const processUpload = (file) => {
    const reader=new FileReader();
    reader.onload=(e)=>{
      if(file.type.includes('pdf')){setFormData(prev=>({...prev,certificates:[...prev.certificates,{id:Date.now().toString(),name:file.name,preview:null,type:file.type,size:(file.size/1024/1024).toFixed(1)+' MB'}]}));return;}
      const img=new Image();img.onload=()=>{const c=document.createElement('canvas');let w=img.width,h=img.height;if(w>400){h=Math.round(h*400/w);w=400;}if(h>300){w=Math.round(w*300/h);h=300;}c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);setFormData(prev=>({...prev,certificates:[...prev.certificates,{id:Date.now().toString(),name:file.name,preview:c.toDataURL('image/jpeg',0.5),type:file.type,size:(file.size/1024/1024).toFixed(1)+' MB'}]}));};img.src=e.target.result;
    };reader.readAsDataURL(file);
  };

  const handleUpload = (file) => {
    if(!file.type.startsWith('image/')&&!file.type.includes('pdf')){alert('❌ Images/PDF only');return;}
    if(file.size>5*1024*1024){alert('❌ Max 5MB');return;}
    if(completedCourses.filter(c=>c.startsWith('cert_')).length>=1){setPendingCertificate(file);setPaymentReason('certificate');setShowPaymentModal(true);return;}
    processUpload(file);
  };

  const removeCert = (id) => setFormData(prev=>({...prev,certificates:prev.certificates.filter(c=>c.id!==id)}));
  const saveProfile = () => {
    if(!formData.certificates.length)return alert('❌ Upload certificate first!');
    if(!formData.name.trim()||!formData.knowsSkills.trim()||!formData.wantsSkills.trim())return alert('❌ Fill all required fields!');
    if(!allCertificatesValid)return alert('❌ Certificates must match your "I KNOW" skills!');
    const profile={...formData,certificates:formData.certificates.map(c=>({id:c.id,name:c.name,type:c.type,size:c.size,preview:c.type?.startsWith('image/')?c.preview:null})),email:userEmail,updatedAt:new Date().toLocaleDateString()};
    try{localStorage.setItem(`studyhub_profile_${userEmail}`,JSON.stringify(profile));setIsSubmitted(true);setIsEditing(false);loadRequests();alert('✅ Profile saved!');}
    catch(e){alert(e.name==='QuotaExceededError'?'❌ Storage full!':'❌ Failed to save.');}
  };

  const courseCount = completedCourses.filter(c=>c.startsWith('cert_')).length;
  const prog = Math.min(((creditPoints%50)/50)*100,100);
  const label = (txt,sub) => <label style={{display:'block',color:'var(--muted)',fontSize:'0.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:6}}>{txt}{sub&&<span style={{color:'rgba(255,80,100,0.7)',textTransform:'none',letterSpacing:'normal',fontWeight:400,marginLeft:6}}>{sub}</span>}</label>;

  return (
    <div className="pr" style={{minHeight:'100vh',backgroundImage:"url('/background.jpeg')",backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed'}}>
      <style>{THEME}</style>
      <div className="overlay"/>
      <div style={{position:'relative',zIndex:1,maxWidth:1280,margin:'0 auto',padding:'32px 24px'}}>

        {/* NAV */}
        <nav className="anim" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32}}>
          <button className="btn-danger" onClick={()=>{setIsLoggedIn(false);navigate('/');}} style={{padding:'10px 22px',borderRadius:12,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:8}}>
            <span>⏻</span><span>Logout</span>
          </button>
          <div className="glass" style={{borderRadius:16,padding:'8px 20px',display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.15rem',color:'var(--text)'}}>STUDY</span>
            <span style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.15rem',background:'linear-gradient(135deg,var(--cyan),var(--violet))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>HUB</span>
          </div>
          <div style={{display:'flex',gap:10}}>
            {[['📚','Books','/books'],['🎯','Study','/study'],['🎥','Videos','/videos']].map(([ic,lb,pt])=>(
              <button key={pt} onClick={()=>navigate(pt)} className="glass" style={{padding:'9px 18px',borderRadius:12,border:'1px solid var(--border)',color:'var(--cyan)',fontWeight:600,fontSize:'0.85rem',cursor:'pointer',background:'rgba(0,240,255,0.04)',transition:'all .2s',display:'flex',alignItems:'center',gap:6}} onMouseOver={e=>e.currentTarget.style.background='rgba(0,240,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='rgba(0,240,255,0.04)'}>
                <span>{ic}</span><span>{lb}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* CREDIT BANNER */}
        <div className="glass anim" style={{borderRadius:20,padding:'22px 28px',marginBottom:28,borderColor:'rgba(255,184,0,0.22)',animationDelay:'0.05s'}}>
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:16}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,rgba(255,184,0,0.15),rgba(255,100,0,0.15))',border:'1px solid rgba(255,184,0,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>🏆</div>
              <div>
                <p style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:'var(--amber)'}}>Credit Points</p>
                <p style={{color:'var(--muted)',fontSize:'0.78rem',marginTop:2}}>Earn <b style={{color:'var(--amber)'}}>10 pts</b> per course · Edit: <b style={{color:'var(--amber)'}}>₹200</b> or <b style={{color:'var(--green)'}}>50 pts free</b></p>
              </div>
            </div>
            <div style={{display:'flex',gap:12}}>
              {[{l:'Total Points',v:creditPoints,c:'var(--amber)'},{l:'Courses Done',v:courseCount,c:'var(--green)'}].map(({l,v,c})=>(
                <div className="glass2" key={l} style={{borderRadius:14,padding:'12px 20px',textAlign:'center',minWidth:90}}>
                  <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.9rem',color:c}}>{v}</div>
                  <div style={{color:'var(--muted)',fontSize:'0.7rem',fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {creditPoints>=50&&<div style={{marginTop:12,background:'rgba(0,255,179,0.07)',border:'1px solid rgba(0,255,179,0.18)',borderRadius:10,padding:'8px 16px',textAlign:'center',fontSize:'0.82rem',fontWeight:600,color:'var(--green)'}}>🎉 {creditPoints} pts — edit your profile FREE (uses 50 pts)</div>}
          <div style={{marginTop:16}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',color:'var(--muted)',marginBottom:6}}><span>Progress to free edit</span><span>{creditPoints%50}/50 pts</span></div>
            <div style={{height:6,background:'rgba(255,255,255,0.07)',borderRadius:99,overflow:'hidden'}}><div className="glow-bar" style={{height:'100%',width:`${prog}%`}}/></div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,alignItems:'start'}}>

          {/* LEFT: FORM */}
          <div className="glass scroll-y anim" style={{borderRadius:22,padding:'36px 32px',maxHeight:'82vh',animationDelay:'0.1s'}}>
            <div style={{textAlign:'center',marginBottom:28}}>
              <h1 style={{fontFamily:'Syne',fontWeight:800,fontSize:'2rem',background:'linear-gradient(135deg,var(--cyan),var(--violet))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:4}}>🤝 Skill Swap</h1>
              <p style={{color:'var(--muted)',fontSize:'0.82rem'}}>Connect · Learn · Grow</p>
            </div>

            {isSubmitted&&!isEditing&&(
              <div style={{marginBottom:20,padding:'16px',background:'rgba(0,0,0,0.2)',borderRadius:14,border:'1px solid rgba(0,240,255,0.08)'}}>
                <button onClick={handleEditClick} className={creditPoints>=50?'btn-cyan':'btn-violet'} style={{width:'100%',padding:'12px',borderRadius:11,fontSize:'0.9rem'}}>
                  {creditPoints>=50?'✏️ Edit Profile — Free (50 pts)':'✏️ Edit Profile (₹200)'}
                </button>
                <p style={{color:'var(--muted)',fontSize:'0.72rem',textAlign:'center',marginTop:8}}>{creditPoints>=50?`${creditPoints} pts available`:`${Math.max(0,50-creditPoints)} more pts for free edit`}</p>
              </div>
            )}

            {(!isSubmitted||isEditing)?(
              <div style={{display:'flex',flexDirection:'column',gap:18}}>
                {[{n:'name',l:'Name'},{n:'knowsSkills',l:'I Know',sub:'Certs must match',ta:true},{n:'wantsSkills',l:'I Want to Learn',ta:true}].map(f=>(
                  <div key={f.n}>{label(f.l,f.sub)}{f.ta?<textarea name={f.n} value={formData[f.n]} onChange={e=>setFormData(p=>({...p,[e.target.name]:e.target.value}))} rows={3} className="inp" style={{resize:'none'}}/>:<input name={f.n} value={formData[f.n]} onChange={e=>setFormData(p=>({...p,[e.target.name]:e.target.value}))} className="inp"/>}</div>
                ))}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {[{n:'qualification',pl:'Qualification'},{n:'number',pl:'Phone Number'}].map(f=>(
                    <input key={f.n} name={f.n} value={formData[f.n]} onChange={e=>setFormData(p=>({...p,[e.target.name]:e.target.value}))} placeholder={f.pl} className="inp"/>
                  ))}
                </div>

                {/* CERTIFICATES */}
                <div>
                  {label('Certificates','Must match skills')}
                  {formData.certificates.length>0&&(
                    <div style={{marginBottom:12,padding:'10px 14px',borderRadius:10,textAlign:'center',fontWeight:700,fontSize:'0.82rem',background:allCertificatesValid?'rgba(0,255,179,0.07)':'rgba(255,184,0,0.07)',border:`1px solid ${allCertificatesValid?'rgba(0,255,179,0.28)':'rgba(255,184,0,0.28)'}`,color:allCertificatesValid?'var(--green)':'var(--amber)'}}>
                      {allCertificatesValid?'✅ All certificates validated':'⚠️ Some certificates need attention'}
                    </div>
                  )}
                  <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={e=>{e.preventDefault();setDragging(false);}} onDrop={e=>{e.preventDefault();setDragging(false);Array.from(e.dataTransfer.files).forEach(handleUpload);}} onClick={()=>document.getElementById('cu')?.click()}
                    style={{border:`2px dashed ${dragging?'rgba(0,240,255,0.5)':'rgba(0,240,255,0.18)'}`,borderRadius:14,padding:'28px 20px',textAlign:'center',cursor:'pointer',background:dragging?'rgba(0,240,255,0.04)':'rgba(0,0,0,0.2)',transition:'all .2s'}}>
                    <div style={{fontSize:28,marginBottom:8}}>📁</div>
                    <p style={{color:'var(--text)',fontWeight:600,fontSize:'0.88rem'}}>{dragging?'Drop here':'Drag & drop certificates'}</p>
                    <p style={{color:'var(--muted)',fontSize:'0.73rem',marginTop:4}}>PDF or image · Max 5MB · Filename should contain skill name</p>
                    <input id="cu" type="file" multiple accept="image/*,application/pdf" onChange={e=>{Array.from(e.target.files).forEach(handleUpload);e.target.value='';}} style={{display:'none'}}/>
                  </div>
                  {formData.certificates.length>0&&(
                    <div style={{marginTop:14,display:'flex',flexDirection:'column',gap:10}}>
                      {formData.certificates.map(cert=>{const v=validationResults.find(r=>r.id===cert.id);return(
                        <div key={cert.id} className={v?.isValid?'cert-valid':'cert-invalid'} style={{padding:'12px',position:'relative'}}>
                          <button onClick={()=>removeCert(cert.id)} style={{position:'absolute',top:-8,right:-8,width:22,height:22,borderRadius:'50%',background:'var(--danger)',color:'#fff',border:'none',fontWeight:700,fontSize:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                          {cert.type?.startsWith('image/')?<img src={cert.preview} style={{width:'100%',height:70,objectFit:'cover',borderRadius:8,marginBottom:8}} alt={cert.name}/>:<div style={{width:'100%',height:70,background:'rgba(255,60,111,0.08)',borderRadius:8,marginBottom:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>📄</div>}
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <span style={{color:'var(--text)',fontSize:'0.78rem',fontWeight:600,maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cert.name}</span>
                            <span className={v?.isValid?'tag tag-green':'tag tag-danger'}>{v?.isValid?'VALID':'INVALID'}</span>
                          </div>
                          {v?.matchedSkills?.map(s=><span key={s} style={{display:'inline-block',marginTop:4,fontSize:'0.7rem',background:'rgba(0,240,255,0.07)',color:'var(--cyan)',padding:'2px 8px',borderRadius:6}}>✓ {s}</span>)}
                        </div>
                      );})}
                    </div>
                  )}
                </div>

                <button onClick={saveProfile} disabled={!formData.certificates.length||!allCertificatesValid} className={!formData.certificates.length||!allCertificatesValid?'':'btn-cyan pulse'} style={{padding:'14px',borderRadius:12,fontSize:'0.95rem',width:'100%',...(!formData.certificates.length||!allCertificatesValid?{background:'rgba(255,255,255,0.05)',color:'rgba(180,200,240,0.25)',border:'1px solid rgba(255,255,255,0.06)',cursor:'not-allowed'}:{})}}>
                  {!formData.certificates.length?'⚠ Upload Certificate First':!allCertificatesValid?'❌ Fix Certificates':isEditing?'💾 Update Profile':'🚀 Save Profile'}
                </button>
              </div>
            ):(
              <div className="anim" style={{textAlign:'center'}}>
                <div style={{width:72,height:72,borderRadius:18,margin:'0 auto 20px',background:'linear-gradient(135deg,rgba(0,240,255,0.1),rgba(162,89,255,0.1))',border:'1px solid rgba(0,240,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>✅</div>
                <div style={{background:'rgba(0,0,0,0.2)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:16,padding:24}}>
                  <h3 style={{fontFamily:'Syne',fontWeight:700,color:'var(--text)',marginBottom:16}}>Your Skills</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    {[{l:'I Teach',v:formData.knowsSkills,c:'var(--green)'},{l:'I Learn',v:formData.wantsSkills,c:'var(--violet)'}].map(({l,v,c})=>(
                      <div key={l} style={{background:'rgba(0,0,0,0.25)',border:`1px solid ${c}22`,borderRadius:12,padding:16}}>
                        <p style={{color:c,fontWeight:700,fontSize:'0.78rem',marginBottom:6}}>{l}</p>
                        <p style={{color:'var(--text)',fontSize:'0.88rem'}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="anim" style={{display:'flex',flexDirection:'column',gap:18,animationDelay:'0.15s'}}>
            {/* STATS */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[{ic:'🤝',l:'Matches',v:perfectMatches.length,c:'var(--cyan)'},{ic:'💬',l:'Connected',v:acceptedConnections.length,c:'var(--green)'},{ic:'📨',l:'Inbox',v:myInboxRequests.length,c:'var(--violet)'},{ic:'📤',l:'Sent',v:mySentRequests.length,c:'var(--amber)'}].map(({ic,l,v,c})=>(
                <div className="stat-box" key={l}><div style={{fontSize:22,marginBottom:4}}>{ic}</div><div style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.8rem',color:c}}>{v}</div><div style={{color:'var(--muted)',fontSize:'0.75rem',fontWeight:500}}>{l}</div></div>
              ))}
            </div>

            {/* CONNECTIONS */}
            {acceptedConnections.length>0&&(
              <div className="glass" style={{borderRadius:18,padding:'20px 22px'}}>
                <h3 style={{fontFamily:'Syne',fontWeight:700,color:'var(--green)',fontSize:'0.95rem',marginBottom:14}}>💬 Active Connections ({acceptedConnections.length})</h3>
                <div className="scroll-y" style={{maxHeight:160,display:'flex',flexDirection:'column',gap:8}}>
                  {acceptedConnections.slice(-3).map(conn=>(
                    <div key={conn.id} onClick={()=>openChat(conn)} className="card-row" style={{cursor:'pointer',background:'rgba(0,255,179,0.04)',border:'1px solid rgba(0,255,179,0.12)',borderRadius:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{color:'var(--text)',fontWeight:600,fontSize:'0.88rem'}}>{conn.studentEmail===userEmail?conn.mentorName:conn.studentName}</span>
                        <span className="tag tag-green">Connected</span>
                      </div>
                      <p style={{color:'var(--muted)',fontSize:'0.73rem',marginTop:3}}>{conn.swapDeal}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INBOX */}
            <div className="glass" style={{borderRadius:18,padding:'20px 22px'}}>
              <h3 style={{fontFamily:'Syne',fontWeight:700,color:'var(--violet)',fontSize:'0.95rem',marginBottom:14}}>📨 Inbox ({myInboxRequests.length})</h3>
              {myInboxRequests.length===0?<p style={{color:'var(--muted)',fontSize:'0.85rem',textAlign:'center',padding:'24px 0'}}>No pending requests</p>:myInboxRequests.map(req=>(
                <div key={req.id} style={{background:'rgba(162,89,255,0.05)',border:'1px solid rgba(162,89,255,0.18)',borderRadius:12,padding:16,marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{color:'var(--text)',fontWeight:700,fontSize:'0.9rem'}}>{req.studentName}</span><span className="tag tag-amber">Pending</span></div>
                  <p style={{color:'var(--muted)',fontSize:'0.78rem',marginBottom:2}}>Teaches: {req.studentKnows}</p>
                  <p style={{color:'var(--muted)',fontSize:'0.78rem',marginBottom:12}}>Wants: {req.mentorKnows}</p>
                  <button onClick={()=>acceptRequest(req)} className="btn-cyan" style={{width:'100%',padding:'10px',borderRadius:10,fontSize:'0.85rem'}}>✅ Accept & Chat</button>
                </div>
              ))}
            </div>

            {/* MATCHES */}
            <div className="glass" style={{borderRadius:18,padding:'20px 22px'}}>
              <button onClick={()=>setShowMatches(!showMatches)} className="btn-violet" style={{width:'100%',padding:'11px',borderRadius:11,fontSize:'0.88rem',marginBottom:showMatches?16:0,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                <span>🎯 Perfect Matches ({perfectMatches.length})</span><span style={{opacity:0.6,fontSize:'0.78rem'}}>{showMatches?'▲':'▼'}</span>
              </button>
              {showMatches&&(
                <div className="scroll-y" style={{maxHeight:280,display:'flex',flexDirection:'column',gap:12}}>
                  {perfectMatches.length===0?<p style={{color:'var(--muted)',textAlign:'center',padding:'20px 0',fontSize:'0.85rem'}}>No matches yet</p>:perfectMatches.map(match=>{
                    const sent=mySentRequests.some(r=>r.mentorEmail===match.email);
                    const conn=acceptedConnections.some(c=>c.studentEmail===match.email||c.mentorEmail===match.email);
                    return(
                      <div key={match.email} style={{background:'rgba(0,240,255,0.03)',border:'1px solid rgba(0,240,255,0.14)',borderRadius:12,padding:14}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                          <span style={{fontFamily:'Syne',fontWeight:700,color:'var(--text)',fontSize:'0.92rem'}}>{match.name}</span>
                          {conn?<span className="tag tag-green">✅ Connected</span>:sent?<span className="tag tag-amber">⏳ Pending</span>:<span className="tag tag-cyan">MATCH</span>}
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
                          <div><p style={{color:'var(--muted)',fontSize:'0.7rem'}}>They teach</p><p style={{color:'var(--green)',fontWeight:600,fontSize:'0.82rem'}}>{formData.wantsSkills}</p></div>
                          <div><p style={{color:'var(--muted)',fontSize:'0.7rem'}}>You teach</p><p style={{color:'var(--violet)',fontWeight:600,fontSize:'0.82rem'}}>{formData.knowsSkills}</p></div>
                        </div>
                        {conn?<button onClick={()=>openChat(match)} className="btn-cyan" style={{width:'100%',padding:'9px',borderRadius:9,fontSize:'0.82rem'}}>💬 Open Chat</button>
                        :sent?<button disabled className="btn-ghost" style={{width:'100%',padding:'9px',borderRadius:9,fontSize:'0.82rem',cursor:'not-allowed',opacity:0.5}}>⏳ Awaiting response</button>
                        :<button onClick={()=>sendRequest(match)} className="btn-violet" style={{width:'100%',padding:'9px',borderRadius:9,fontSize:'0.82rem'}}>📤 Send Request</button>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(2,5,16,0.88)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:24}}>
          <div style={{background:'rgba(6,10,28,0.98)',border:'1px solid rgba(0,240,255,0.18)',borderRadius:22,width:'100%',maxWidth:420,position:'relative',boxShadow:'0 0 80px rgba(0,240,255,0.06)',overflow:'hidden'}}>
            <button onClick={closeModal} disabled={paymentProcessing} style={{position:'absolute',top:14,right:14,width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'var(--muted)',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10,fontFamily:'inherit'}}>✕</button>
            {!showQR?(
              <div style={{padding:32}}>
                <div style={{textAlign:'center',marginBottom:24}}>
                  <div style={{fontSize:44,marginBottom:10}}>💳</div>
                  <h2 style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.3rem',color:'var(--text)',marginBottom:6}}>{paymentReason==='edit'?'Edit Profile Fee':'Course Fee'}</h2>
                  <p style={{color:'var(--muted)',fontSize:'0.78rem'}}>{paymentReason==='edit'?'₹200 required, or earn 50 pts for free':`${courseCount} course(s) done — ₹200 to unlock next`}</p>
                </div>
                <div style={{background:'rgba(255,184,0,0.05)',border:'1px solid rgba(255,184,0,0.18)',borderRadius:14,padding:'18px 20px',marginBottom:20,display:'flex',flexDirection:'column',gap:10}}>
                  {[['Unlock',paymentReason==='edit'?'Edit Profile':'Next Course','₹200','var(--amber)'],[null,'Your Points',`🏆 ${creditPoints} pts`,'var(--amber)'],...(paymentReason==='edit'?[[null,'For free edit',`50 pts (${Math.max(0,50-creditPoints)} more needed)`,'var(--cyan)']]:[])] .map(([,l,v,c],i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{color:'var(--muted)',fontSize:'0.85rem'}}>{l}</span>
                      <span style={{fontFamily:i===0?'Syne':'inherit',fontWeight:i===0?800:600,fontSize:i===0?'1.3rem':'0.88rem',color:c}}>{v}</span>
                    </div>
                  ))}
                </div>
                {pendingCertificate&&paymentReason==='certificate'&&<div style={{background:'rgba(0,240,255,0.05)',border:'1px solid rgba(0,240,255,0.15)',borderRadius:10,padding:'10px 16px',marginBottom:16,fontSize:'0.8rem',color:'var(--cyan)'}}>📁 {pendingCertificate.name}</div>}
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  <button onClick={()=>setShowQR(true)} className="btn-cyan" style={{padding:'13px',borderRadius:12,fontSize:'0.92rem',width:'100%'}}>💳 Pay ₹200 & Unlock</button>
                  <button onClick={closeModal} className="btn-ghost" style={{padding:'12px',borderRadius:12,fontSize:'0.88rem',width:'100%'}}>Cancel</button>
                </div>
              </div>
            ):(
              <div style={{padding:28}}>
                <div style={{textAlign:'center',marginBottom:20}}>
                  <div style={{fontSize:36,marginBottom:8}}>📲</div>
                  <h2 style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.2rem',color:'var(--text)',marginBottom:4}}>Scan & Pay ₹200</h2>
                  <p style={{color:'var(--muted)',fontSize:'0.76rem'}}>Use any UPI app to complete payment</p>
                </div>
                <div style={{background:'rgba(255,184,0,0.05)',border:'1px solid rgba(255,184,0,0.18)',borderRadius:16,padding:20,marginBottom:16,display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                  <div style={{background:'#fff',padding:10,borderRadius:14,boxShadow:'0 4px 20px rgba(0,0,0,0.3)'}}>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=skillswap@upi%26pn=SkillSwap%26am=200%26cu=INR%26tn=SkillSwap+Fee" alt="UPI QR" style={{width:170,height:170,borderRadius:8,display:'block'}}/>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.4rem',color:'var(--amber)'}}>₹200</p>
                    <p style={{color:'var(--muted)',fontSize:'0.76rem'}}>UPI ID: skillswap@upi</p>
                  </div>
                </div>
                <div style={{background:'rgba(0,240,255,0.04)',border:'1px solid rgba(0,240,255,0.1)',borderRadius:12,padding:'14px 16px',marginBottom:16,fontSize:'0.78rem',color:'rgba(180,200,240,0.7)',display:'flex',flexDirection:'column',gap:5}}>
                  <p style={{color:'var(--cyan)',fontWeight:700,marginBottom:4}}>How to pay</p>
                  {['Open Google Pay / PhonePe / Paytm','Tap "Scan QR" and scan the code above','Pay ₹200 and complete transaction','Click "I\'ve Paid" below to unlock'].map((s,i)=><p key={i}>{i+1}. {s}</p>)}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  <button onClick={handlePaymentConfirmed} disabled={paymentProcessing} className="btn-green" style={{padding:'13px',borderRadius:12,fontSize:'0.92rem',width:'100%',opacity:paymentProcessing?0.6:1,cursor:paymentProcessing?'not-allowed':'pointer'}}>
                    {paymentProcessing?'⏳ Verifying...':'✅ I\'ve Paid — Unlock Now'}
                  </button>
                  <button onClick={()=>setShowQR(false)} disabled={paymentProcessing} className="btn-ghost" style={{padding:'11px',borderRadius:12,fontSize:'0.85rem',width:'100%'}}>← Back</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}