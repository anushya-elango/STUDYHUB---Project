import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  cyan:   '#00f5d4',
  purple: '#7c3aed',
  amber:  '#f59e0b',
  green:  '#10b981',
  text:   '#f1f5f9',
  muted:  '#475569',
  glass: {
    background: 'rgba(12,18,36,0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.07)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  },
  glow: c => `0 0 24px ${c}44, 0 0 60px ${c}18`,
};

const videoCategories = [
  {
    title: "Python Basics", icon: "🐍", accent: '#f59e0b',
    videos: [
      { id: "https://www.youtube.com/embed/rfscVS0vtbw",  title: "Python Full Course for Beginners" },
      { id: "https://www.youtube.com/embed/_uQrJ0TkZlc",  title: "Python Tutorial – Python for Beginners" },
      { id: "https://www.youtube.com/embed/Z1Yd7upQsXY",  title: "Python Lists, Tuples & Dictionaries" },
    ],
  },
  {
    title: "Java Fundamentals", icon: "☕", accent: '#ef4444',
    videos: [
      { id: "https://www.youtube.com/embed/eIrMbAQSU34", title: "Java Tutorial for Beginners" },
      { id: "https://www.youtube.com/embed/xk4_1vDrzzo", title: "Java Full Course" },
      { id: "https://www.youtube.com/embed/A74TOX803D0", title: "Java OOP" },
    ],
  },
  {
    title: "React Tutorial", icon: "⚛️", accent: '#00f5d4',
    videos: [
      { id: "https://www.youtube.com/embed/SqcY0GlETPk", title: "React for Beginners" },
      { id: "https://www.youtube.com/embed/w7ejDZ8SWv8", title: "React JS Crash Course" },
      { id: "https://www.youtube.com/embed/4UZrsTqkcW4", title: "React Hooks Explained" },
    ],
  },
  {
    title: "JavaScript", icon: "🌐", accent: '#facc15',
    videos: [
      { id: "https://www.youtube.com/embed/W6NZfCO5SIk", title: "JavaScript for Beginners" },
      { id: "https://www.youtube.com/embed/hdI2bqOjy3c", title: "JavaScript Crash Course" },
      { id: "https://www.youtube.com/embed/PkZNo7MFNFg", title: "Learn JS – Full Course" },
    ],
  },
  {
    title: "SQL & Databases", icon: "🗄️", accent: '#7c3aed',
    videos: [
      { id: "https://www.youtube.com/embed/HXV3zeQKqGY", title: "SQL Full Database Course" },
      { id: "https://www.youtube.com/embed/7S_tz1z_5bA", title: "MySQL for Beginners" },
      { id: "https://www.youtube.com/embed/ztHopE5Wnpc", title: "SQL Joins Explained" },
    ],
  },
  {
    title: "MongoDB", icon: "🐘", accent: '#10b981',
    videos: [
      { id: "https://www.youtube.com/embed/c2M-rlkkT5o",  title: "MongoDB Crash Course" },
      { id: "https://www.youtube.com/embed/-56x56UppqQ",  title: "MongoDB for Beginners" },
      { id: "https://www.youtube.com/embed/ofme2o29ngU",  title: "MongoDB Full Course" },
    ],
  },
  {
    title: "AWS Basics", icon: "☁️", accent: '#f59e0b',
    videos: [
      { id: "https://www.youtube.com/embed/NhDYbskXRgc", title: "AWS Cloud Practitioner" },
      { id: "https://www.youtube.com/embed/3hLmDS179YE", title: "AWS for Beginners" },
      { id: "https://www.youtube.com/embed/IT1X42D1KeA", title: "AWS Core Services" },
    ],
  },
  {
    title: "Machine Learning", icon: "🤖", accent: '#ec4899',
    videos: [
      { id: "https://www.youtube.com/embed/i_LwzRVP7bg", title: "ML for Beginners" },
      { id: "https://www.youtube.com/embed/7eh4d6sabA0", title: "Python ML Tutorial" },
      { id: "https://www.youtube.com/embed/aircAruvnKk", title: "Neural Networks Explained" },
    ],
  },
  {
    title: "Docker & DevOps", icon: "🐳", accent: '#3b82f6',
    videos: [
      { id: "https://www.youtube.com/embed/fqMOX6JJhGo", title: "Docker for Beginners" },
      { id: "https://www.youtube.com/embed/HG6yIjZapSA", title: "Docker Compose Tutorial" },
      { id: "https://www.youtube.com/embed/kTp5xUtcalw", title: "DevOps Full Course" },
    ],
  },
  {
    title: "Git & GitHub", icon: "🔧", accent: '#94a3b8',
    videos: [
      { id: "https://www.youtube.com/embed/RGOj5yH7evk", title: "Git & GitHub for Beginners" },
      { id: "https://www.youtube.com/embed/SWYqp7iY_Tc", title: "Git Tutorial" },
      { id: "https://www.youtube.com/embed/HVsySz-h9r4", title: "Git Crash Course" },
    ],
  },
];

const quickLinks = [
  { icon:'🐍', label:'Python',     url:'https://www.youtube.com/watch?v=rfscVS0vtbw', c:'#f59e0b' },
  { icon:'☕', label:'Java',       url:'https://www.youtube.com/watch?v=eIrMbAQSU34', c:'#ef4444' },
  { icon:'⚛️', label:'React',     url:'https://www.youtube.com/watch?v=SqcY0GlETPk', c:'#00f5d4' },
  { icon:'🌐', label:'JavaScript', url:'https://www.youtube.com/watch?v=W6NZfCO5SIk', c:'#facc15' },
  { icon:'🗄️', label:'SQL',       url:'https://www.youtube.com/watch?v=HXV3zeQKqGY', c:'#7c3aed' },
  { icon:'🤖', label:'ML',         url:'https://www.youtube.com/watch?v=i_LwzRVP7bg', c:'#ec4899' },
];

export default function VideosPage() {
  const navigate   = useNavigate();
  const [activeTab, setActiveTab] = useState(null);   // which category is "open" in detail view
  const [filter, setFilter] = useState('');

  const filtered = videoCategories.filter(c =>
    !filter || c.title.toLowerCase().includes(filter.toLowerCase())
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
            style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:T.muted, borderRadius:10, padding:'9px 18px', cursor:'pointer', fontSize:13 }}>
            ← Profile
          </button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Orbitron, sans-serif', color:T.cyan, fontSize:20, fontWeight:900, letterSpacing:3, textShadow:`0 0 30px ${T.cyan}66` }}>
              ▶ LEARNING HUB
            </div>
            <div style={{ color:T.muted, fontSize:11, marginTop:2 }}>{videoCategories.length} courses · {videoCategories.length*3} videos</div>
          </div>
          <div style={{ background:`${T.purple}14`, border:`1px solid ${T.purple}33`, borderRadius:10, padding:'9px 18px', fontFamily:'Orbitron,sans-serif', color:T.purple, fontSize:13 }}>
            {videoCategories.length} Courses
          </div>
        </div>

        {/* ── QUICK LAUNCH ── */}
        <div style={{ ...T.glass, borderRadius:18, padding:'16px 22px', marginBottom:20 }}>
          <div style={{ fontFamily:'Orbitron,sans-serif', color:T.muted, fontSize:10, letterSpacing:2, marginBottom:12 }}>⚡ QUICK LAUNCH</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {quickLinks.map((l,i) => (
              <button key={i} onClick={()=>window.open(l.url,'_blank')}
                style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, background:`${l.c}12`, border:`1px solid ${l.c}33`, color:l.c, cursor:'pointer', fontSize:13, fontFamily:'DM Sans,sans-serif', boxShadow:`0 0 12px ${l.c}18`, transition:'all 0.15s' }}>
                {l.icon} {l.label}
              </button>
            ))}
            {/* Search */}
            <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="🔍  Filter courses…"
              style={{ marginLeft:'auto', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 14px', color:T.text, fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif', minWidth:180 }} />
          </div>
        </div>

        {/* ── COURSE GRID ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
          {filtered.map((cat, ci) => (
            <div key={ci} style={{ ...T.glass, borderRadius:20, overflow:'hidden', border:`1px solid ${cat.accent}18`, transition:'all 0.2s', cursor:'default' }}>
              {/* Card header */}
              <div style={{ padding:'16px 20px', background:`linear-gradient(135deg,${cat.accent}14,transparent)`, borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontFamily:'Orbitron,sans-serif', color:cat.accent, fontSize:13, fontWeight:700, letterSpacing:1 }}>
                    {cat.icon} {cat.title.toUpperCase()}
                  </div>
                  <div style={{ color:T.muted, fontSize:10, marginTop:2 }}>{cat.videos.length} videos</div>
                </div>
                <div style={{ width:8, height:8, borderRadius:'50%', background:cat.accent, boxShadow:`0 0 8px ${cat.accent}` }} />
              </div>

              {/* Videos */}
              <div style={{ padding:16, display:'flex', flexDirection:'column', gap:12 }}>
                {cat.videos.map((vid, vi) => (
                  <div key={vi} style={{ borderRadius:14, overflow:'hidden', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ position:'relative', paddingBottom:'56.25%', height:0 }}>
                      <iframe
                        src={vid.id}
                        title={vid.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
                      />
                    </div>
                    <div style={{ padding:'8px 12px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ color:'#94a3b8', fontSize:11, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        <span style={{ color:cat.accent, fontWeight:700 }}>Pt {vi+1}</span> · {vid.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Open in YouTube footer */}
              <div style={{ padding:'0 16px 14px' }}>
                <button onClick={()=>window.open(cat.videos[0].id.replace('/embed/','/watch?v='),'_blank')}
                  style={{ width:'100%', padding:'9px', borderRadius:10, background:`${cat.accent}0e`, border:`1px solid ${cat.accent}2a`, color:cat.accent, cursor:'pointer', fontSize:12, fontFamily:'Orbitron,sans-serif', letterSpacing:0.5 }}>
                  ▶ OPEN IN YOUTUBE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div style={{ marginTop:40, textAlign:'center', color:T.muted, fontSize:11, paddingBottom:24 }}>
          All videos sourced from YouTube · Click any video or use Quick Launch to open full screen
        </div>
      </div>
    </div>
  );
}