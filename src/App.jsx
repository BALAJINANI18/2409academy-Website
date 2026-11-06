import React, { useEffect, useMemo, useState } from 'react';
import { Menu, X, ArrowUpRight, Code2, Braces, Layers3, BrainCircuit, Database, Cloud, Play, CheckCircle2, Mail, Phone, Youtube, Instagram, Github, Linkedin, ChevronDown, Terminal, Sparkles, GraduationCap, Search, Filter, Trophy, Check, RotateCcw, ChevronRight, Clock, BookOpen } from 'lucide-react';
import logo from './assets/logo.png';
import founder from './assets/founder.jpg';
import Explore from './Explore.jsx';
import JavaCourse from './JavaCourse.jsx';
import Admin from './Admin.jsx';

const courses = [
  { icon: Code2, tag: 'FOUNDATIONS', title: 'Java Programming', desc: 'Build strong programming fundamentals with Java, OOP, collections and practical coding.', level: 'Beginner friendly', color: 'orange' },
  { icon: Braces, tag: 'PROBLEM SOLVING', title: 'Data Structures & Algorithms', desc: 'Learn patterns, analyze complexity and solve problems with a structured approach.', level: 'Beginner → Advanced', color: 'white' },
  { icon: Layers3, tag: 'BACKEND DEVELOPMENT', title: 'Spring Boot', desc: 'Create REST APIs, connect databases and understand how backend applications work.', level: 'Project based', color: 'orange' },
  { icon: BrainCircuit, tag: 'NEXT-GEN TECH', title: 'Python & AI / ML', desc: 'Explore Python, data tools and machine-learning concepts through hands-on learning.', level: 'Learning path', color: 'white' },
  { icon: Database, tag: 'CORE SKILLS', title: 'SQL & Databases', desc: 'Understand relational data, write useful queries and design clean database structures.', level: 'Practical essentials', color: 'orange' },
  { icon: Cloud, tag: 'ENGINEERING', title: 'Git, GitHub & Cloud', desc: 'Learn version control and get introduced to the tools used to ship software.', level: 'Build your workflow', color: 'white' },
];
const faqs = [
  ['Is 2409 Academy for beginners?', 'Yes. The learning paths are designed to help beginners build foundations first, then move toward practical projects and problem-solving.'],
  ['Will lessons be available in Telugu?', 'The goal is to make technical learning accessible through Telugu + English explanations. Follow the channel and website for upcoming lesson announcements.'],
  ['Are courses available to enroll in right now?', 'This is the academy’s first website launch. Course pages are currently learning-path previews; contact us to ask about upcoming lessons and batches.'],
  ['What should I learn first?', 'Start with programming fundamentals, then practise DSA consistently. Add SQL, Git and projects as your confidence grows.'],
];
const dsaProblems = [
  { id: 1, title: 'Two Sum', topic: 'Arrays & Hashing', difficulty: 'Easy', time: '15–20 min', prompt: 'Given an array of integers and a target, return the indices of two numbers that add up to the target.', example: 'nums = [2, 7, 11, 15], target = 9 → [0, 1]', hint: 'A brute-force solution checks every pair. Can you store numbers you have already seen and look for the complement?', approach: ['Clarify the output: return indices, not the values.', 'Brute force: check every pair; this takes O(n²) time.', 'Optimise with a hash map: for each number x, look for target - x.', 'If the complement is present, return both indices; otherwise store x and its index.', 'Complexity: O(n) average time and O(n) extra space.'], pattern: 'Hash map' },
  { id: 2, title: 'Contains Duplicate', topic: 'Arrays & Hashing', difficulty: 'Easy', time: '10–15 min', prompt: 'Return true if any value appears at least twice in the array; otherwise return false.', example: '[1, 2, 3, 1] → true', hint: 'A set stores only unique values. What does it mean if inserting a value does not increase the set size?', approach: ['Understand that any repeated value is enough.', 'Brute force compares every pair in O(n²).', 'Use a set to remember values already visited.', 'If the current value is already in the set, return true; otherwise add it.', 'If the loop ends, return false. Average time O(n), space O(n).'], pattern: 'Hash set' },
  { id: 3, title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', time: '20–25 min', prompt: 'Given daily prices, choose one day to buy and a later day to sell for maximum profit. Return the maximum profit.', example: '[7, 1, 5, 3, 6, 4] → 5', hint: 'As you move from left to right, keep track of the cheapest price seen so far.', approach: ['You must buy before you sell.', 'Maintain minPrice, the lowest price seen so far.', 'For each price, calculate price - minPrice as a possible profit.', 'Update the best profit, then update minPrice.', 'One pass gives O(n) time and O(1) extra space.'], pattern: 'Track a running minimum' },
  { id: 4, title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', time: '15–20 min', prompt: 'Determine whether brackets in a string are correctly opened and closed in the right order.', example: '"{[()]}" → true; "([)]" → false', hint: 'The last bracket opened must be the first one closed. Which data structure follows that rule?', approach: ['Use a stack for opening brackets.', 'When you see an opening bracket, push it.', 'When you see a closing bracket, the stack must not be empty.', 'Pop and check that the pair matches; reject mismatches.', 'At the end, the stack must be empty. Time O(n), space O(n).'], pattern: 'Stack' },
  { id: 5, title: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', time: '15–20 min', prompt: 'Find the index of a target in a sorted array, returning -1 if it is absent.', example: 'nums = [-1, 0, 3, 5, 9, 12], target = 9 → 4', hint: 'Compare the target with the middle element. Each comparison lets you discard half the remaining range.', approach: ['Binary search requires sorted input.', 'Set left = 0 and right = n - 1.', 'Calculate mid safely as left + (right - left) // 2.', 'If nums[mid] matches, return mid; otherwise discard the half that cannot contain target.', 'Stop when left > right. Time O(log n), extra space O(1).'], pattern: 'Divide and conquer' },
  { id: 6, title: 'Reverse a Linked List', topic: 'Linked List', difficulty: 'Easy', time: '20–25 min', prompt: 'Reverse the direction of a singly linked list and return the new head.', example: '1 → 2 → 3 → null becomes 3 → 2 → 1 → null', hint: 'Keep three references: previous, current, and next. Save next before changing current.next.', approach: ['Start previous = null and current = head.', 'Save current.next in next so the rest of the list is not lost.', 'Point current.next to previous.', 'Move previous to current and current to next.', 'When current is null, previous is the new head. Time O(n), space O(1).'], pattern: 'Pointer manipulation' },
  { id: 7, title: 'Maximum Subarray', topic: 'Dynamic Programming', difficulty: 'Medium', time: '25–35 min', prompt: 'Find the largest sum of any non-empty contiguous subarray.', example: '[-2,1,-3,4,-1,2,1,-5,4] → 6', hint: 'At each position, decide whether to extend the current subarray or start a new one here.', approach: ['A subarray must be contiguous.', 'Track currentSum and bestSum, initialised to the first element.', 'For each next number, choose max(number, currentSum + number).', 'Update bestSum with the largest currentSum seen.', 'Kadane’s algorithm runs in O(n) time and O(1) extra space.'], pattern: 'Kadane’s algorithm' },
  { id: 8, title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', time: '20–25 min', prompt: 'Merge two sorted linked lists into one sorted linked list.', example: '1 → 2 → 4 and 1 → 3 → 4 → 1 → 1 → 2 → 3 → 4 → 4', hint: 'Use a dummy node and repeatedly attach whichever current node has the smaller value.', approach: ['Create a dummy node and a tail pointer.', 'Compare the current nodes of both lists.', 'Attach the smaller node to tail and advance that list.', 'When one list ends, attach the remaining nodes.', 'Return dummy.next. Time O(m+n), extra space O(1) for an iterative merge.'], pattern: 'Two pointers' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authMessage, setAuthMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('2409-academy-user') || 'null'); } catch { return null; } });
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeProblem, setActiveProblem] = useState(1);
  const [topicFilter, setTopicFilter] = useState('All topics');
  const [difficultyFilter, setDifficultyFilter] = useState('All levels');
  const [searchTerm, setSearchTerm] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState('Java');
  const [editorMessage, setEditorMessage] = useState('');
  const [drafts, setDrafts] = useState(() => { try { return JSON.parse(localStorage.getItem('2409-code-drafts') || '{}'); } catch { return {}; } });
  const [solvedIds, setSolvedIds] = useState(() => { try { return JSON.parse(localStorage.getItem('2409-solved-problems') || '[]'); } catch { return []; } });
  useEffect(() => { localStorage.setItem('2409-solved-problems', JSON.stringify(solvedIds)); }, [solvedIds]);
  useEffect(() => { localStorage.setItem('2409-code-drafts', JSON.stringify(drafts)); }, [drafts]);
  const starterCode = (problem, language) => {
    if (language === 'Python') return `# ${problem.title}\n# Write your solution below\ndef solve():\n    pass\n`;
    if (language === 'JavaScript') return `// ${problem.title}\nfunction solve() {\n  // Write your solution here\n}\n`;
    return `// ${problem.title}\nclass Solution {\n    // Write your solution here\n}\n`;
  };
  const topics = ['All topics', ...new Set(dsaProblems.map(problem => problem.topic))];
  const filteredProblems = useMemo(() => dsaProblems.filter(problem => (topicFilter === 'All topics' || problem.topic === topicFilter) && (difficultyFilter === 'All levels' || problem.difficulty === difficultyFilter) && problem.title.toLowerCase().includes(searchTerm.toLowerCase())), [topicFilter, difficultyFilter, searchTerm]);
  const currentProblem = dsaProblems.find(problem => problem.id === activeProblem) || dsaProblems[0];
  const editorKey = `${currentProblem.id}-${editorLanguage}`;
  const editorCode = drafts[editorKey] ?? starterCode(currentProblem, editorLanguage);
  const progressPercent = Math.round((solvedIds.length / dsaProblems.length) * 100);
  const toggleSolved = id => setSolvedIds(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
  const closeMenu = () => setMenuOpen(false);
  const logout = () => {
    try { localStorage.removeItem('2409-academy-token'); localStorage.removeItem('2409-academy-user'); } catch {}
    setUser(null); setAuthMessage(''); closeMenu();
  };
  useEffect(() => {
    let token = null;
    try { token = localStorage.getItem('2409-academy-token'); } catch {}
    if (!token) return;
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${apiBase}/api/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.status === 401) { logout(); return null; } return r.ok ? r.json() : null; })
      .then(profile => { if (profile) { setUser(profile); try { localStorage.setItem('2409-academy-user', JSON.stringify(profile)); } catch {} } })
      .catch(() => {});
  }, []);
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  if (currentPath === '/explore') return <Explore />;
  if (currentPath === '/java') return <JavaCourse />;
  if (currentPath === '/admin') return <Admin />;

  return <div className="site-shell">
    <div className="topline"><span className="pulse"/> BUILD YOUR SKILLS, ONE LINE OF CODE AT A TIME <span className="topline-right">TELUGU + ENGLISH</span></div>
    <header className="navbar">
      <a className="brand" href="#home" onClick={closeMenu}><img src={logo} alt="2409 Academy logo"/><span className="brand-text"><b>2409 <em>ACADEMY</em></b><small>CODE · LEARN · BUILD · LEAD</small></span></a>
      <button className="mobile-toggle" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="/explore" onClick={closeMenu}>Explore</a><a href="#programs" onClick={closeMenu}>Learning paths</a><a href="#approach" onClick={closeMenu}>Our approach</a><a href="#founder" onClick={closeMenu}>Founder</a><a href="#faq" onClick={closeMenu}>FAQs</a>
        {user ? <>{user.role === 'ADMIN' && <a href="/admin" onClick={closeMenu}>Admin</a>}<span className="nav-user" title={user.email}>Hi, {String(user.fullName || user.email || 'student').trim().split(' ')[0]}</span><button className="nav-auth" onClick={logout}>Log out</button></> : <><button className="nav-auth" onClick={() => { setAuthMode('login'); setAuthOpen(true); closeMenu(); }}>Log in</button><button className="nav-cta" onClick={() => { setAuthMode('signup'); setAuthOpen(true); closeMenu(); }}>Sign up <ArrowUpRight size={16}/></button></>}
      </nav>
    </header>

    <main>
      <section className="hero section-wrap" id="home">
        <div className="hero-brand-watermark" aria-hidden="true"><img src={logo} alt="" /></div>
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> THE NEXT LINE STARTS HERE</div>
          <h1>Learn today.<br/> <span>Code tomorrow.</span><br/>Lead forever.</h1>
          <p className="hero-desc">Turn curiosity into capability. Learn programming, solve real problems, build projects, and grow into the developer you want to become.</p>
          <div className="hero-actions"><a className="btn btn-primary" href="#programs">Explore learning paths <ArrowUpRight size={18}/></a><a className="btn btn-secondary" href="#approach"><Play size={16}/> How we learn</a></div>
          <div className="hero-proof"><div className="proof-icon"><Terminal size={19}/></div><div><strong>Learn by doing</strong><span>Concepts · Practice · Projects</span></div><div className="proof-divider"/><div className="proof-languages"><b>తెలుగు</b><span>+</span><b>English</b></div></div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-glow"/>
          <div className="code-window"><div className="window-bar"><div><i/><i/><i/></div><span>developer.java</span><span className="window-lock">● LIVE LEARNING</span></div><div className="code-content"><span className="line-no">01</span><code><i>public class</i> <b>Developer</b> {'{'}</code><span className="line-no">02</span><code>&nbsp;&nbsp;<i>public static void</i> <b>main</b>() {'{'}</code><span className="line-no">03</span><code>&nbsp;&nbsp;&nbsp;&nbsp;learn(<strong>"every day"</strong>);</code><span className="line-no">04</span><code>&nbsp;&nbsp;&nbsp;&nbsp;build(<strong>"real things"</strong>);</code><span className="line-no">05</span><code>&nbsp;&nbsp;&nbsp;&nbsp;grow<span className="orange">++</span>;</code><span className="line-no">06</span><code>&nbsp;&nbsp;{'}'}</code><span className="line-no">07</span><code>{'}'} <span className="cursor">▌</span></code></div><div className="window-footer"><span><span className="status-dot"/> BUILDING YOUR FUTURE</span><span>2409.ACADEMY</span></div></div>
          <div className="float-card float-java"><span className="float-symbol">☕</span><div><b>JAVA</b><small>Strong foundations</small></div></div>
          <div className="float-card float-dsa"><Braces size={22}/><div><b>DSA</b><small>Think in patterns</small></div></div>
          <div className="hero-stamp"><span>2409</span><small>ACADEMY</small></div>
        </div>
        <div className="hero-bottomline"><span>01 / LEARN</span><div/><span>02 / BUILD</span><div/><span>03 / LEAD</span></div>
      </section>

      <section className="ticker" aria-label="Academy values"><div className="ticker-track">{Array.from({length:2}).map((_,i)=><React.Fragment key={i}><span>CODE WITH PURPOSE</span><b>✳</b><span>LEARN WITH CLARITY</span><b>✳</b><span>BUILD WITH CONFIDENCE</span><b>✳</b><span>GROW EVERY DAY</span><b>✳</b></React.Fragment>)}</div></section>

      <section className="section-wrap programs section-pad" id="programs">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR LEARNING STARTS HERE</div><h2>Skills that move<br/><span>you forward.</span></h2></div><p>Clear explanations. Consistent practice. Useful projects. Build a foundation that grows with your ambitions.</p></div>
        <div className="course-grid">{courses.map((course, i)=>{const Icon=course.icon; return <article className="course-card" key={course.title} role="button" tabIndex={0} onClick={() => { if (course.title === 'Java Programming') window.location.href = '/java'; else setSelectedCourse(course); }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (course.title === 'Java Programming') window.location.href = '/java'; else setSelectedCourse(course); } }} onMouseMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`); }}><div className="card-top"><div className={`course-icon ${course.color}`}><Icon size={23}/></div><span className="course-index">0{i+1}</span></div><div className="course-tag">{course.tag}</div><h3>{course.title}</h3><p>{course.desc}</p><div className="course-bottom">{course.title === 'Java Programming' ? <span className="coming-label java-live-label"><CheckCircle2 size={12}/> Full course available</span> : <span className="coming-label"><Clock size={12}/> Available soon</span>}<span className="course-open">{course.title === 'Java Programming' ? 'Start learning' : 'Explore'} <ArrowUpRight size={16}/></span></div></article>})}</div>
        <p className="availability-note"><Sparkles size={15}/> The complete Java course is live now. Other learning paths are being prepared and will be available soon.</p>
      </section>



      <section className="approach section-pad" id="approach"><div className="section-wrap approach-inner"><div className="approach-copy"><div className="eyebrow"><span className="eyebrow-line"/> THE 2409 METHOD</div><h2>Not just watching.<br/><span>Actually building.</span></h2><p>Technology becomes easier when you connect concepts to practice. Our learning philosophy keeps the path simple and practical.</p><a className="text-link" href="#contact">Start your learning journey <ArrowUpRight size={17}/></a></div><div className="steps"><div className="step"><div className="step-number">01</div><div className="step-icon"><GraduationCap size={22}/></div><div><h3>Understand</h3><p>Break down concepts with clear, beginner-friendly explanations.</p></div></div><div className="step"><div className="step-number">02</div><div className="step-icon"><Code2 size={22}/></div><div><h3>Practise</h3><p>Strengthen your thinking with exercises and coding challenges.</p></div></div><div className="step"><div className="step-number">03</div><div className="step-icon"><Layers3 size={22}/></div><div><h3>Build</h3><p>Apply what you learn in projects you can explain and improve.</p></div></div><div className="step"><div className="step-number">04</div><div className="step-icon"><ArrowUpRight size={22}/></div><div><h3>Grow</h3><p>Keep learning, share your work and prepare for your next step.</p></div></div></div></div></section>

      <section className="founder section-wrap section-pad" id="founder"><div className="founder-image-wrap"><div className="founder-frame"/><img src={founder} alt="Portrait of 2409 Academy founder Balaji" className="founder-image"/><div className="founder-image-caption"><span className="status-dot"/><div className="founder-caption-copy"><strong>DUDEM SRI BALAJI</strong><span>Founder &amp; CEO · 2409 Academy</span></div></div></div><div className="founder-copy"><div className="eyebrow"><span className="eyebrow-line"/> A NOTE FROM THE FOUNDER</div><h2>Built for learners.<br/><span>Driven by possibility.</span></h2><p className="founder-quote">“The hardest choices require the strongest will.”</p><p className="founder-bio">I’m Balaji, founder of 2409 Academy. I’m building a learning community focused on making technology more approachable through practical explanations, consistent coding and project-based learning.</p><div className="founder-signature"><div><strong>DUDEM SRI BALAJI</strong><span>Founder &amp; CEO, 2409 Academy</span></div><div className="signature-mark">24<span>/</span>09</div></div><div className="founder-socials"><a href="https://github.com/BALAJINANI18" target="_blank" rel="noreferrer"><Github size={18}/> <span>GitHub <small>@BALAJINANI18</small></span><ArrowUpRight size={15}/></a><a href="https://www.linkedin.com/in/balajinani/" target="_blank" rel="noreferrer"><Linkedin size={18}/> <span>LinkedIn <small>Connect professionally</small></span><ArrowUpRight size={15}/></a></div><a className="btn btn-secondary founder-contact" href="mailto:balajidudam23@gmail.com">Connect with the founder <ArrowUpRight size={17}/></a></div></section>

      <section className="faq-section section-pad" id="faq"><div className="section-wrap faq-layout"><div><div className="eyebrow"><span className="eyebrow-line"/> GOOD QUESTIONS</div><h2>Before you<br/><span>get started.</span></h2><p className="faq-intro">A few helpful answers for your first step with 2409 Academy.</p></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq-item ${openFaq===i?'active':''}`} key={q}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)} aria-expanded={openFaq===i}><span><i>0{i+1}</i>{q}</span><ChevronDown size={19}/></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>

      <section className="cta-wrap section-wrap" id="contact"><div className="cta-card"><div className="cta-orb"/><div className="eyebrow"><span className="eyebrow-line"/> YOUR NEXT CHAPTER</div><h2>Ready to write your<br/><span>next line of code?</span></h2><p>Follow the journey, ask a question, or reach out about upcoming learning paths.</p><div className="cta-actions"><a className="btn btn-primary" href="mailto:balajidudam23@gmail.com?subject=Hello%202409%20Academy">Let’s connect <ArrowUpRight size={18}/></a><a className="btn btn-secondary" href="tel:+919515626088"><Phone size={16}/> Call the academy</a></div><div className="cta-email"><Mail size={15}/> balajidudam23@gmail.com <span>·</span> +91 95156 26088</div></div></section>
    </main>

    {authOpen && <div className="auth-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setAuthOpen(false); }}><section className="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="auth-close" onClick={() => setAuthOpen(false)} aria-label="Close">×</button><div className="auth-brand"><img src={logo} alt="2409 Academy"/><span>2409 <b>ACADEMY</b></span></div><div className="eyebrow"><span className="eyebrow-line"/> STUDENT ACCOUNT</div><h2 id="auth-title">{authMode === 'login' ? 'Welcome back.' : 'Start learning.'}</h2><p>{authMode === 'login' ? 'Log in to access your learning journey.' : 'Create an account to explore courses and learn with us.'}</p><div className="auth-tabs"><button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Log in</button><button className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>Sign up</button></div><form onSubmit={async event => {
      event.preventDefault();
      setAuthMessage('');
      setAuthLoading(true);
      const form = new FormData(event.currentTarget);
      const payload = { email: String(form.get('email') || '').trim(), password: String(form.get('password') || '') };
      if (authMode === 'signup') payload.fullName = String(form.get('fullName') || '').trim();
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${apiBase}/api/auth/${authMode === 'signup' ? 'register' : 'login'}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (data.message) throw new Error(data.message);
          throw new Error(response.status >= 500 ? 'The server is not available right now. Make sure the backend is running on port 8080, then try again.' : 'Unable to authenticate. Please try again.');
        }
        try {
          if (data.token) localStorage.setItem('2409-academy-token', data.token);
          if (data.user) localStorage.setItem('2409-academy-user', JSON.stringify(data.user));
        } catch {}
        if (data.user) setUser(data.user);
        setAuthMessage(authMode === 'signup' ? 'Account created successfully! You are now logged in.' : 'Login successful! Welcome back.');
        setTimeout(() => { setAuthOpen(false); setAuthMessage(''); }, 1300);
      } catch (error) {
        setAuthMessage(error instanceof TypeError ? 'Could not reach the server. Make sure the backend is running on port 8080, then try again.' : (error.message || 'Something went wrong. Please try again.'));
      } finally { setAuthLoading(false); }
    }}>{authMode === 'signup' && <label>Full name<input name="fullName" type="text" placeholder="Enter your name" required/></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" required/></label><label>Password<input name="password" type="password" placeholder="At least 8 characters" minLength="8" required/></label><button className="btn btn-primary auth-submit" type="submit" disabled={authLoading}>{authLoading ? 'Please wait…' : authMode === 'login' ? 'Log in' : 'Create account'} <ArrowUpRight size={17}/></button></form>{authMessage && <p role="status" className="auth-preview-note">{authMessage}</p>}<div className="auth-preview-note">Secure account access powered by 2409 Academy.</div></section></div>}

    {selectedCourse && <div className="course-modal-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedCourse(null);}}><section className="course-modal" role="dialog" aria-modal="true" aria-labelledby="course-modal-title"><button className="modal-close" onClick={()=>setSelectedCourse(null)} aria-label="Close course details"><X size={20}/></button><div className="modal-emblem"><Sparkles size={25}/></div><div className="course-tag">{selectedCourse.tag}</div><h2 id="course-modal-title">{selectedCourse.title}</h2><div className="coming-soon-badge"><Clock size={15}/> COURSE AVAILABLE SOON</div><p>{selectedCourse.desc}</p><div className="modal-roadmap"><strong>Planned learning experience</strong><span><CheckCircle2 size={15}/> Structured lessons and notes</span><span><CheckCircle2 size={15}/> Hands-on exercises and mini projects</span><span><CheckCircle2 size={15}/> Telugu + English explanations</span><span><CheckCircle2 size={15}/> Progress tracking as the course launches</span></div><a className="btn btn-primary modal-notify" href={`mailto:balajidudam23@gmail.com?subject=${encodeURIComponent('Notify me — '+selectedCourse.title)}&body=${encodeURIComponent('Hello 2409 Academy, please notify me when '+selectedCourse.title+' becomes available.')}`}>Notify me when available <ArrowUpRight size={17}/></a><small className="modal-note">This course is not open for enrollment yet. Contact the academy to express interest.</small></section></div>}

    <footer className="footer"><div className="section-wrap footer-inner"><a className="footer-brand" href="#home"><img src={logo} alt=""/><span><b>2409 <em>ACADEMY</em></b><small>CODE · LEARN · BUILD · LEAD</small></span></a><p>Empowering students. Building developers. Creating futures.</p><div className="social-links"><a href="mailto:balajidudam23@gmail.com" aria-label="Email"><Mail size={18}/></a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={18}/></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18}/></a><a href="https://github.com/BALAJINANI18" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18}/></a><a href="https://www.linkedin.com/in/balajinani/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18}/></a></div></div><div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} 2409 Academy. All rights reserved.</span><a href="#home">Back to top ↑</a></div></footer>
  </div>
}
export default App;
