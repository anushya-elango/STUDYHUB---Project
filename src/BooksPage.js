import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
  :root { --cyan:#00f0ff; --violet:#a259ff; --green:#00ffb3; --amber:#ffb800; --danger:#ff3c6f; --glass:rgba(6,10,28,0.78); --border:rgba(0,240,255,0.14); --text:#eef2ff; --muted:rgba(180,200,240,0.5); }
  .bp * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
  .bp h1,.bp h2,.bp h3 { font-family:'Syne',sans-serif; }
  .glass { background:var(--glass); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid var(--border); }
  .overlay { position:fixed; inset:0; background:rgba(4,8,20,0.62); z-index:0; pointer-events:none; }
  .book-card { background:rgba(6,10,28,0.88); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.07); border-radius:18px; cursor:pointer; transition:transform .22s,box-shadow .22s,border-color .22s; overflow:hidden; }
  .book-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,0.45); }
  .btn-cyan { background:linear-gradient(135deg,#00f0ff,#0099bb); color:#000; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-cyan:hover { box-shadow:0 0 22px rgba(0,240,255,0.45); transform:translateY(-1px); }
  .btn-violet { background:linear-gradient(135deg,#a259ff,#6c2fff); color:#fff; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-violet:hover { box-shadow:0 0 22px rgba(162,89,255,0.45); transform:translateY(-1px); }
  .btn-danger { background:linear-gradient(135deg,#ff3c6f,#c0003c); color:#fff; font-weight:700; border:none; cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-danger:hover { box-shadow:0 0 18px rgba(255,60,111,0.4); }
  .btn-ghost { background:rgba(255,255,255,0.05); color:var(--muted); border:1px solid rgba(255,255,255,0.09); cursor:pointer; transition:all .2s; font-family:'DM Sans',sans-serif; }
  .btn-ghost:hover { background:rgba(255,255,255,0.09); color:var(--text); }
  .page-text { font-family:'Lora',Georgia,serif; line-height:1.85; color:#1a1a2e; font-size:1rem; white-space:pre-wrap; }
  .inp { background:rgba(0,0,0,0.4); border:1px solid rgba(0,240,255,0.14); color:var(--text); border-radius:12px; padding:13px 20px 13px 48px; font-size:0.9rem; transition:border-color .2s; font-family:'DM Sans',sans-serif; width:100%; }
  .inp::placeholder { color:rgba(180,200,240,0.3); }
  .inp:focus { outline:none; border-color:var(--cyan); box-shadow:0 0 0 3px rgba(0,240,255,0.08); }
  @keyframes up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .anim { animation:up .38s ease both; }
  .page-flip { transition:opacity .25s,transform .25s; }
`;

const BOOKS = [
  { id:1, title:"React Mastery",       author:"John Doe",      category:"React",          icon:"⚛️", accent:"#22d3ee",
    pages:[`Chapter 1: Introduction to React\n\nReact is a powerful JavaScript library used to build user interfaces, especially for single-page applications. It was developed by Facebook to make UI development faster and more efficient.\n\nWhy React?\n• Component-based architecture\n• Virtual DOM for fast rendering\n• Reusable UI components\n• Strong community support\n\nTo create a new React application, run:\n\nnpx create-react-app my-app\n\nThis command sets up a complete React project with all necessary configurations.`,`Chapter 2: Understanding JSX\n\nJSX stands for JavaScript XML. It allows you to write HTML-like code inside JavaScript.\n\nExample:\n\n<h1>Hello World</h1>\n\nJSX makes UI code easier to understand and write. Under the hood, JSX is converted into React.createElement() calls.\n\nRules of JSX:\n• Must return a single parent element\n• Use className instead of class\n• Close all tags properly`,`Chapter 3: Components in React\n\nComponents are the building blocks of React applications. They allow you to split the UI into independent, reusable pieces.\n\nThere are two types:\n1. Functional Components\n2. Class Components\n\nExample of a Functional Component:\n\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}`,`Chapter 4: Managing State\n\nState is a built-in object that stores data that may change over time.\n\nIn functional components, we use the useState hook:\n\nconst [count, setCount] = useState(0);\n\nWhen state changes, React re-renders the component automatically.`,`Chapter 5: React Hooks\n\nHooks are special functions introduced in React 16.8.\n\nCommon Hooks:\n• useState()\n• useEffect()\n• useContext()\n• useRef()\n\nExample:\n\nuseEffect(() => {\n  console.log("Mounted");\n}, []);\n\nHooks simplify code and promote better logic reuse.`] },
  { id:2, title:"Python Pro",           author:"Jane Smith",    category:"Python",         icon:"🐍", accent:"#f7c948",
    pages:[`Chapter 1: Introduction to Python\n\nPython is a high-level, interpreted programming language known for its simplicity and readability.\n\nYour first program:\n\nprint("Hello World!")\n\nPython is widely used in web development, data science, AI, and automation.`,`Chapter 2: Data Types and Lists\n\nPython supports multiple data types:\n• int, float, string, list, dictionary\n\nExample List:\n\nfruits = ['apple', 'banana', 'mango']\n\nLists are ordered and changeable collections.`,`Chapter 3: Functions\n\nFunctions allow reusable code blocks.\n\ndef greet(name):\n    return "Hello " + name\n\nFunctions improve modularity and readability.`,`Chapter 4: Object-Oriented Programming\n\nPython supports OOP concepts like classes and objects.\n\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n\nOOP helps structure large applications efficiently.`,`Chapter 5: Modules and Libraries\n\nPython has powerful built-in modules.\n\nimport math\nprint(math.sqrt(16))\n\nLibraries make development faster and more efficient.`] },
  { id:3, title:"JavaScript Ninja",    author:"Bob Wilson",    category:"JavaScript",     icon:"⚡", accent:"#fde047",
    pages:[`Chapter 1: Variables\n\nJavaScript uses:\n• let\n• const\n• var\n\nconst is block-scoped and cannot be reassigned. Prefer const and let over var in modern JavaScript.`,`Chapter 2: Arrow Functions\n\nArrow functions provide shorter syntax.\n\nconst greet = () => {\n  console.log("Hello");\n}\n\nThey do not bind their own 'this', making them ideal for callbacks.`,`Chapter 3: Promises\n\nPromises handle asynchronous operations.\n\nfetch("api/data")\n  .then(res => res.json())\n  .then(data => console.log(data))\n\nPromises avoid callback hell.`,`Chapter 4: Closures\n\nClosures allow a function to access outer variables.\n\nfunction outer() {\n  let count = 0;\n  return function() { count++; }\n}\n\nClosures preserve state between calls.`,`Chapter 5: Modules\n\nModern JS uses ES Modules.\n\nexport default function App() {}\nimport App from './App';\n\nModules improve code organization and reusability.`] },
  { id:4, title:"Node.js Expert",      author:"Charlie Davis", category:"Node.js",        icon:"🚀", accent:"#34d399",
    pages:[`Chapter 1: Introduction to Node.js\n\nNode.js allows JavaScript to run on the server.\n\nnpm init -y\n\nNode is built on Chrome's V8 engine, enabling fast server-side JavaScript.`,`Chapter 2: Express Framework\n\nExpress simplifies backend development.\n\napp.get("/", (req, res) => {\n  res.send("Hello World");\n});\n\nIt helps build REST APIs quickly and cleanly.`,`Chapter 3: Middleware\n\nMiddleware functions execute during request processing.\n\napp.use(express.json());\n\nThey modify request and response objects before reaching route handlers.`,`Chapter 4: REST APIs\n\nREST uses HTTP methods:\n• GET — fetch data\n• POST — create data\n• PUT — update data\n• DELETE — remove data\n\nAPIs connect frontend and backend seamlessly.`,`Chapter 5: Async/Await\n\nAsync/Await simplifies asynchronous code.\n\nasync function fetchData() {\n  const data = await getData();\n  return data;\n}\n\nCleaner and more readable than promise chains.`] },
  { id:5, title:"MongoDB Basics",      author:"Eve Green",     category:"Database",       icon:"🗄️", accent:"#4ade80",
    pages:[`Chapter 1: Introduction to MongoDB\n\nMongoDB is a NoSQL database that stores data in JSON-like documents, making it flexible and scalable for modern applications.`,`Chapter 2: Insert Operations\n\ndb.users.insertOne({\n  name: "John",\n  age: 25\n})\n\nDocuments are flexible and schema-less, adapting to your data model.`,`Chapter 3: Mongoose Schema\n\nconst userSchema = new mongoose.Schema({\n  name: String,\n  email: { type: String, required: true }\n});\n\nMongoose adds structure and validation to MongoDB.`,`Chapter 4: CRUD Operations\n\n• Create — insertOne / insertMany\n• Read — find / findOne\n• Update — updateOne / updateMany\n• Delete — deleteOne / deleteMany\n\nCRUD forms the backbone of all database operations.`,`Chapter 5: Relationships\n\nMongoDB supports:\n• Embedding — nest documents inside documents\n• Referencing — use IDs to link documents\n\nChoose embedding for small, read-heavy data and referencing for large, changing data.`] },
  { id:6, title:"Data Science Guide",  author:"Alice Brown",   category:"Data Science",   icon:"📊", accent:"#f472b6",
    pages:[`Chapter 1: Introduction to Pandas\n\nimport pandas as pd\ndf = pd.read_csv('data.csv')\n\nPandas is the go-to library for structured data analysis in Python.`,`Chapter 2: Exploring Data\n\ndf.head()      # First 5 rows\ndf.info()      # Column types\ndf.describe()  # Statistics\n\nAlways explore your dataset before cleaning or modeling.`,`Chapter 3: Data Cleaning\n\n• Remove null values — df.dropna()\n• Handle duplicates — df.drop_duplicates()\n• Fix data types — df.astype()\n\nClean data directly improves model accuracy and reliability.`,`Chapter 4: Data Visualization\n\nimport matplotlib.pyplot as plt\nplt.plot(df['sales'])\nplt.show()\n\nVisualization helps identify trends, outliers, and patterns in data.`,`Chapter 5: Machine Learning Basics\n\nfrom sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\nScikit-learn makes ML accessible with a clean, consistent API.`] },
  { id:7, title:"HTML & CSS Pro",      author:"Mike Johnson",  category:"Web Design",     icon:"🎨", accent:"#fb923c",
    pages:[`Chapter 1: HTML5 Semantics\n\n<header>, <nav>, <main>\n<section>, <article>, <footer>\n\nSemantic tags improve SEO, accessibility, and code readability.`,`Chapter 2: CSS Grid\n\ndisplay: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 20px;\n\nGrid creates complex two-dimensional layouts with minimal code.`,`Chapter 3: Flexbox\n\ndisplay: flex;\njustify-content: space-between;\nalign-items: center;\n\nFlexbox is perfect for one-dimensional alignment and spacing.`,`Chapter 4: Animations\n\n@keyframes slideIn {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\nAnimations add life and polish to interfaces.`,`Chapter 5: Tailwind CSS\n\nUtility-first CSS framework.\n\n<div class="flex bg-blue-500 text-white p-4 rounded-xl">\n\nTailwind enables rapid UI development without leaving your HTML.`] },
  { id:8, title:"Docker Mastery",      author:"Sara Lee",      category:"DevOps",         icon:"🐳", accent:"#60a5fa",
    pages:[`Chapter 1: Docker Basics\n\ndocker run hello-world\ndocker ps\n\nContainers package applications with all their dependencies, ensuring consistent environments.`,`Chapter 2: Dockerfile\n\nFROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["node", "index.js"]\n\nDockerfiles define how to build container images step by step.`,`Chapter 3: Docker Compose\n\ndocker-compose up\ndocker-compose down\n\nCompose manages multi-container applications with a single YAML file.`,`Chapter 4: Volumes\n\ndocker volume create mydata\n\nVolumes store persistent data outside the container lifecycle, surviving restarts and rebuilds.`,`Chapter 5: Multi-stage Builds\n\nFROM node:18 AS builder\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\n\nReduce final image size by separating build and runtime stages.`] },
  { id:9, title:"Git Expert",          author:"Tom Clark",     category:"Version Control", icon:"🐙", accent:"#94a3b8",
    pages:[`Chapter 1: Git Init\n\ngit init\ngit add .\ngit commit -m "Initial commit"\n\nGit creates a local repository to track every change in your project.`,`Chapter 2: Branching\n\ngit branch feature/login\ngit checkout feature/login\n# or shorthand:\ngit checkout -b feature/login\n\nBranches allow parallel development without affecting the main codebase.`,`Chapter 3: Merging\n\ngit checkout main\ngit merge feature/login\n\nMerging combines the work from different branches into one unified history.`,`Chapter 4: Rebase\n\ngit rebase main\n\nRebasing rewrites commit history for a cleaner, linear project timeline. Use carefully on shared branches.`,`Chapter 5: Pull Requests\n\nPull Requests on GitHub allow:\n• Code review before merging\n• Discussion and feedback\n• Automated CI/CD checks\n\nPRs are the standard collaboration workflow in modern teams.`] },
  { id:10, title:"AWS Essentials",     author:"Lisa Wang",     category:"Cloud",          icon:"☁️", accent:"#fbbf24",
    pages:[`Chapter 1: EC2\n\nElastic Compute Cloud provides scalable virtual servers in the cloud.\n\naws ec2 run-instances --image-id ami-xxx --instance-type t2.micro\n\nEC2 is the foundation of most AWS architectures.`,`Chapter 2: S3\n\nSimple Storage Service stores files, backups, and static websites securely.\n\naws s3 cp file.txt s3://my-bucket/\n\nS3 offers 99.999999999% durability with low cost.`,`Chapter 3: RDS\n\nManaged relational database service supporting MySQL, PostgreSQL, and more.\n\nRDS handles backups, patching, and failover automatically so you can focus on your application.`,`Chapter 4: Lambda\n\nServerless computing — run code without managing servers.\n\nexports.handler = async (event) => {\n  return { statusCode: 200, body: "Hello!" };\n};\n\nPay only for execution time, not idle servers.`,`Chapter 5: VPC\n\nVirtual Private Cloud isolates your AWS resources in a dedicated network.\n\nKey components:\n• Subnets (public & private)\n• Security Groups\n• Internet Gateway\n\nVPC gives you full control over your cloud network topology.`] },
];

export default function BooksPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [flipping, setFlipping] = useState(false);

  const filtered = BOOKS.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const openBook = (b) => { setSelected(b); setPage(0); };
  const closeBook = () => { setSelected(null); setPage(0); };

  const turnPage = (dir) => {
    if (flipping) return;
    const next = page + dir;
    if (next < 0 || next >= selected.pages.length) return;
    setFlipping(true);
    setTimeout(() => { setPage(next); setFlipping(false); }, 250);
  };

  const downloadPDF = () => {
    const content = selected.pages.join('\n\n─────────────────────\n\n');
    const el = document.createElement('a');
    el.href = URL.createObjectURL(new Blob([content], { type:'text/plain' }));
    el.download = `${selected.title}.txt`;
    document.body.appendChild(el); el.click(); document.body.removeChild(el);
  };

  // ── READER VIEW ──
  if (selected) {
    const acc = selected.accent;
    const prog = Math.round(((page+1)/selected.pages.length)*100);
    return (
      <div className="bp" style={{minHeight:'100vh',backgroundImage:"url('/background.jpeg')",backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed'}}>
        <style>{THEME}</style>
        <div className="overlay"/>
        <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:'28px 24px'}}>

          {/* READER NAV */}
          <nav className="anim" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <button onClick={closeBook} className="btn-ghost" style={{padding:'10px 20px',borderRadius:12,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:6}}>← Library</button>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontFamily:'Syne',fontWeight:700,fontSize:'1rem',color:acc}}>{selected.icon} {selected.title}</span>
              <span style={{fontSize:'0.75rem',color:'var(--muted)',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',padding:'3px 12px',borderRadius:99}}>Ch. {page+1}/{selected.pages.length}</span>
            </div>
            <button onClick={downloadPDF} className="btn-danger" style={{padding:'10px 20px',borderRadius:12,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:6}}>📥 Download</button>
          </nav>

          {/* PROGRESS BAR */}
          <div style={{height:3,background:'rgba(255,255,255,0.07)',borderRadius:99,marginBottom:22,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${prog}%`,background:`linear-gradient(90deg,${acc},var(--violet))`,borderRadius:99,boxShadow:`0 0 8px ${acc}66`,transition:'width .5s ease'}}/>
          </div>

          {/* BOOK SPREAD */}
          <div className="anim" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,background:'#fff',borderRadius:20,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.5)',minHeight:'65vh',animationDelay:'0.06s'}}>

            {/* LEFT PAGE */}
            <div style={{background:'linear-gradient(160deg,#fffdf7,#fef9ec)',borderRight:'2px solid #e8e0cc',padding:'48px 44px',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative'}}>
              <div style={{position:'absolute',top:16,left:20,fontSize:'0.72rem',color:'#aaa',fontFamily:'Lora,serif',fontStyle:'italic'}}>{selected.title}</div>
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',paddingTop:24}}>
                <p className={`page-text page-flip${flipping?' opacity-0':''}`} style={{opacity:flipping?0:1}}>{selected.pages[page]}</p>
              </div>
              <div style={{textAlign:'center',color:'#bbb',fontSize:'0.8rem',fontFamily:'Lora,serif',marginTop:24}}>{page*2+1}</div>
            </div>

            {/* RIGHT PAGE */}
            <div style={{background:'linear-gradient(160deg,#fef9ec,#fdf6e3)',padding:'48px 44px',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative'}}>
              <div style={{position:'absolute',top:16,right:20,fontSize:'0.72rem',color:'#aaa',fontFamily:'Lora,serif',fontStyle:'italic'}}>by {selected.author}</div>
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',paddingTop:24}}>
                {page+1 < selected.pages.length
                  ? <p className="page-text" style={{opacity:flipping?0:1,transition:'opacity .25s'}}>{selected.pages[page+1]}</p>
                  : <div style={{textAlign:'center'}}>
                      <div style={{fontSize:40,marginBottom:12}}>✨</div>
                      <p style={{fontFamily:'Lora,Georgia,serif',fontStyle:'italic',fontSize:'1.2rem',color:'#888'}}>The End</p>
                      <p style={{color:'#aaa',fontSize:'0.82rem',marginTop:8}}>{selected.title}</p>
                    </div>
                }
              </div>
              <div style={{textAlign:'center',color:'#bbb',fontSize:'0.8rem',fontFamily:'Lora,serif',marginTop:24}}>{page*2+2}</div>
            </div>
          </div>

          {/* NAVIGATION CONTROLS */}
          <div className="glass anim" style={{borderRadius:16,padding:'16px 24px',marginTop:16,display:'flex',alignItems:'center',justifyContent:'space-between',animationDelay:'0.1s'}}>
            <button onClick={()=>turnPage(-1)} disabled={page===0||flipping} className={page===0?'btn-ghost':'btn-violet'} style={{padding:'11px 26px',borderRadius:11,fontSize:'0.88rem',opacity:page===0?0.35:1,cursor:page===0?'not-allowed':'pointer'}}>← Prev</button>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <div style={{display:'flex',gap:5}}>
                {selected.pages.map((_,i)=>(
                  <button key={i} onClick={()=>{if(!flipping){setFlipping(true);setTimeout(()=>{setPage(i);setFlipping(false);},250);}}} style={{width:i===page?24:8,height:8,borderRadius:99,background:i===page?acc:'rgba(255,255,255,0.15)',border:'none',cursor:'pointer',transition:'all .25s',padding:0}}/>
                ))}
              </div>
              <span style={{color:'var(--muted)',fontSize:'0.72rem'}}>{prog}% read</span>
            </div>
            <button onClick={()=>turnPage(1)} disabled={page>=selected.pages.length-1||flipping} className={page>=selected.pages.length-1?'btn-ghost':'btn-cyan'} style={{padding:'11px 26px',borderRadius:11,fontSize:'0.88rem',opacity:page>=selected.pages.length-1?0.35:1,cursor:page>=selected.pages.length-1?'not-allowed':'pointer'}}>Next →</button>
          </div>
        </div>
      </div>
    );
  }

  // ── LIBRARY VIEW ──
  return (
    <div className="bp" style={{minHeight:'100vh',backgroundImage:"url('/background.jpeg')",backgroundSize:'cover',backgroundPosition:'center',backgroundAttachment:'fixed'}}>
      <style>{THEME}</style>
      <div className="overlay"/>
      <div style={{position:'relative',zIndex:1,maxWidth:1280,margin:'0 auto',padding:'32px 24px'}}>

        {/* NAV */}
        <nav className="anim" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
          <button onClick={()=>navigate('/profile')} className="btn-ghost" style={{padding:'10px 22px',borderRadius:12,fontSize:'0.85rem',display:'flex',alignItems:'center',gap:6}}>← Profile</button>
          <div className="glass" style={{borderRadius:16,padding:'9px 24px',textAlign:'center'}}>
            <h1 style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.2rem',background:'linear-gradient(135deg,var(--amber),var(--danger))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',margin:0}}>📚 Books Library</h1>
          </div>
          <button onClick={()=>navigate('/mentors')} className="btn-violet" style={{padding:'10px 22px',borderRadius:12,fontSize:'0.85rem'}}>👨‍🏫 Mentors</button>
        </nav>

        {/* SEARCH */}
        <div className="anim" style={{maxWidth:560,margin:'0 auto 28px',position:'relative',animationDelay:'0.05s'}}>
          <span style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',fontSize:18,pointerEvents:'none'}}>🔍</span>
          <input type="text" placeholder="Search by title, author, or category…" value={search} onChange={e=>setSearch(e.target.value)} className="inp"/>
          <span style={{position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',color:'var(--muted)',fontSize:'0.75rem',fontWeight:600,pointerEvents:'none'}}>{filtered.length}/{BOOKS.length}</span>
        </div>

        {/* GRID */}
        {filtered.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16}}>
            {filtered.map((book,i)=>(
              <div key={book.id} className="book-card anim" onClick={()=>openBook(book)} style={{animationDelay:`${0.07+i*0.04}s`,'--hover-border':book.accent}} onMouseOver={e=>e.currentTarget.style.borderColor=book.accent+'44'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>
                {/* Accent strip */}
                <div style={{height:4,background:`linear-gradient(90deg,${book.accent},${book.accent}44)`}}/>
                <div style={{padding:'20px 18px'}}>
                  <div style={{width:52,height:52,borderRadius:14,background:`${book.accent}18`,border:`1px solid ${book.accent}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,marginBottom:14}}>{book.icon}</div>
                  <h2 style={{fontFamily:'Syne',fontWeight:700,fontSize:'0.95rem',color:'var(--text)',marginBottom:4,lineHeight:1.3}}>{book.title}</h2>
                  <p style={{color:'var(--muted)',fontSize:'0.76rem',marginBottom:10}}>by {book.author}</p>
                  <span style={{display:'inline-block',fontSize:'0.7rem',fontWeight:700,padding:'3px 10px',borderRadius:99,background:`${book.accent}18`,color:book.accent,border:`1px solid ${book.accent}33`,marginBottom:14}}>{book.category}</span>
                  <button className="btn-cyan" style={{width:'100%',padding:'9px',borderRadius:9,fontSize:'0.82rem'}}>📖 Open Book</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass anim" style={{borderRadius:20,padding:'60px 40px',textAlign:'center',maxWidth:480,margin:'0 auto'}}>
            <div style={{fontSize:48,marginBottom:16}}>📭</div>
            <h2 style={{fontFamily:'Syne',fontWeight:700,color:'var(--text)',marginBottom:8}}>No books found</h2>
            <p style={{color:'var(--muted)',fontSize:'0.88rem'}}>Try searching React, Python, Docker, or another topic</p>
          </div>
        )}
      </div>
    </div>
  );
}