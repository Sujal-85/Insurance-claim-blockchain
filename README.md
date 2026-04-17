<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Insurance Claim Blockchain — README</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    --bg: #0a0e1a;
    --surface: #111827;
    --surface2: #1a2235;
    --border: #1e2d45;
    --accent: #00d4ff;
    --accent2: #7c3aed;
    --accent3: #10b981;
    --accent4: #f59e0b;
    --text: #e2e8f0;
    --muted: #64748b;
    --chain: #00d4ff22;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    line-height: 1.7;
    overflow-x: hidden;
  }

  /* ─── HERO ─── */
  .hero {
    position: relative;
    min-height: 380px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 80px 24px 60px;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 50% 0%, #00d4ff18 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 80%, #7c3aed18 0%, transparent 60%);
  }

  .chain-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    opacity: 0.06;
  }
  .chain-bg svg { width: 100%; height: 100%; }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--accent);
    border-radius: 100px;
    padding: 4px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 24px;
    position: relative;
  }
  .hero-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.4rem, 6vw, 4.2rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    position: relative;
    margin-bottom: 20px;
  }
  h1 span { color: var(--accent); }

  .hero-sub {
    font-size: 1.05rem;
    color: var(--muted);
    max-width: 560px;
    position: relative;
    margin-bottom: 36px;
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    position: relative;
  }
  .badge {
    padding: 5px 14px;
    border-radius: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
  }
  .badge-blue   { background: #00d4ff22; color: var(--accent); border: 1px solid #00d4ff44; }
  .badge-purple { background: #7c3aed22; color: #a78bfa;       border: 1px solid #7c3aed44; }
  .badge-green  { background: #10b98122; color: #34d399;       border: 1px solid #10b98144; }
  .badge-amber  { background: #f59e0b22; color: #fbbf24;       border: 1px solid #f59e0b44; }
  .badge-gray   { background: #ffffff10; color: var(--muted);  border: 1px solid #ffffff18; }

  /* ─── LAYOUT ─── */
  .container { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }

  /* ─── SECTION HEADERS ─── */
  .section { margin-top: 64px; }
  .section-label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }
  .section-label .icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }
  .icon-blue   { background: #00d4ff18; }
  .icon-purple { background: #7c3aed18; }
  .icon-green  { background: #10b98118; }
  .icon-amber  { background: #f59e0b18; }

  h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--text);
  }

  /* ─── DIVIDER ─── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 8px 0 0;
  }

  /* ─── TECH GRID ─── */
  .tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }
  .tech-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .tech-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .tech-card .tech-icon { font-size: 22px; margin-bottom: 10px; }
  .tech-card .tech-name {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 4px;
  }
  .tech-card .tech-desc { font-size: 12px; color: var(--muted); }

  /* ─── FEATURE GRID ─── */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    border-left: 3px solid var(--accent2);
  }
  .feature-card.green  { border-left-color: var(--accent3); }
  .feature-card.amber  { border-left-color: var(--accent4); }
  .feature-card.blue   { border-left-color: var(--accent); }
  .feature-card p { font-size: 13px; color: var(--muted); margin-top: 6px; }

  /* ─── FLOW DIAGRAM ─── */
  .flow {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
    overflow-x: auto;
  }
  .flow-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 110px;
    flex: 1;
  }
  .flow-num {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--accent2);
    color: #fff;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 600;
    font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 8px;
  }
  .flow-step span { font-size: 12px; color: var(--muted); }
  .flow-step strong { font-size: 13px; display: block; margin-bottom: 4px; }
  .flow-arrow {
    font-size: 18px;
    color: var(--border);
    padding: 0 6px;
    flex-shrink: 0;
    align-self: center;
    margin-bottom: 24px;
  }

  /* ─── CODE BLOCK ─── */
  pre {
    background: #050810;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 22px 24px;
    overflow-x: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    line-height: 1.8;
    color: #94a3b8;
    position: relative;
  }
  pre .c { color: var(--accent); }   /* command / key */
  pre .v { color: #34d399; }         /* value */
  pre .cmt { color: #334155; }       /* comment */
  .code-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  /* ─── FOLDER TREE ─── */
  .tree {
    background: #050810;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 22px 24px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12.5px;
    line-height: 2;
    color: #94a3b8;
  }
  .tree .dir  { color: var(--accent); }
  .tree .file { color: #64748b; }
  .tree .note { color: #7c3aed; font-style: italic; }

  /* ─── DB SCHEMA ─── */
  .schema-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }
  .schema-card {
    background: #050810;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .schema-header {
    background: var(--surface2);
    padding: 10px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .schema-body { padding: 12px 16px; }
  .schema-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    padding: 2px 0;
    color: #94a3b8;
  }
  .schema-field .type { color: #7c3aed; font-size: 10px; }

  /* ─── API TABLE ─── */
  .api-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .api-table th {
    text-align: left;
    padding: 10px 14px;
    background: var(--surface2);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }
  .api-table td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  .api-table tr:last-child td { border-bottom: none; }
  .method {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
  }
  .get    { background: #10b98122; color: #34d399; }
  .post   { background: #00d4ff22; color: var(--accent); }
  .patch  { background: #f59e0b22; color: #fbbf24; }
  .delete { background: #ef444422; color: #f87171; }
  .route  { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text); }
  .route-desc { color: var(--muted); font-size: 12px; }
  .auth-tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: #fbbf24;
    background: #f59e0b18;
    border: 1px solid #f59e0b33;
    padding: 1px 7px;
    border-radius: 4px;
  }

  /* ─── SMART CONTRACT ─── */
  .contract-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media(max-width:600px){.contract-grid{grid-template-columns:1fr;}}
  .contract-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
  }
  .contract-card .fn-name {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    color: #a78bfa;
    margin-bottom: 4px;
  }
  .contract-card p { font-size: 12px; color: var(--muted); }

  /* ─── ENV TABLE ─── */
  .env-table { width: 100%; border-collapse: collapse; }
  .env-table td {
    padding: 8px 14px;
    border-bottom: 1px solid var(--border);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
  }
  .env-table tr:last-child td { border-bottom: none; }
  .env-key { color: var(--accent); }
  .env-desc { color: var(--muted); font-size: 11px; }
  .env-wrap {
    background: #050810;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  /* ─── ROLES ─── */
  .roles-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media(max-width:600px){.roles-grid{grid-template-columns:1fr;}}
  .role-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
  }
  .role-title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .role-list { list-style: none; }
  .role-list li {
    font-size: 12.5px;
    color: var(--muted);
    padding: 4px 0;
    display: flex; align-items: flex-start; gap: 8px;
  }
  .role-list li::before { content: '→'; color: var(--accent); flex-shrink: 0; }

  /* ─── FOOTER ─── */
  .footer {
    margin-top: 80px;
    border-top: 1px solid var(--border);
    padding: 32px 24px;
    text-align: center;
    color: var(--muted);
    font-size: 12px;
    font-family: 'IBM Plex Mono', monospace;
  }
  .footer a { color: var(--accent); text-decoration: none; }

  .info-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 8px;
    padding: 14px 18px;
    font-size: 13px;
    color: var(--muted);
    margin-top: 16px;
  }
  .info-box strong { color: var(--text); }
</style>
</head>
<body>

<!-- HERO -->
<div class="hero">
  <div class="chain-bg">
    <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon points="30,2 58,17 58,47 30,62 2,47 2,17" fill="none" stroke="#00d4ff" stroke-width="0.5"/>
      </pattern></defs>
      <rect width="1200" height="400" fill="url(#hex)"/>
    </svg>
  </div>
  <div class="hero-badge">⛓ Blockchain · AI · DApp</div>
  <h1>Insurance Claim<br/><span>Blockchain System</span></h1>
  <p class="hero-sub">A full-stack decentralized insurance platform with AI-powered fraud detection, Solidity smart contracts, and a NestJS + React architecture.</p>
  <div class="badges">
    <span class="badge badge-blue">React + Vite + TypeScript</span>
    <span class="badge badge-purple">NestJS + Prisma</span>
    <span class="badge badge-green">Solidity Smart Contracts</span>
    <span class="badge badge-amber">Google Gemini AI</span>
    <span class="badge badge-gray">MongoDB · JWT · Ethers.js</span>
  </div>
</div>

<!-- CONTENT -->
<div class="container">

  <!-- OVERVIEW -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-blue">📋</div>
      <div><h2>Project Overview</h2><div class="divider"></div></div>
    </div>
    <p style="color:var(--muted);font-size:14px;max-width:720px;">
      This project is a blockchain-based insurance claim management system. Users can browse insurance policies, 
      purchase them, and submit claims. Each claim is <strong style="color:var(--text)">verified by AI (Google Gemini)</strong> 
      for fraud risk and then <strong style="color:var(--text)">recorded on-chain</strong> using a custom Solidity smart contract. 
      Admins have a full dashboard to review, approve, or reject claims with an immutable audit trail.
    </p>

    <!-- FLOW -->
    <div style="margin-top:28px;">
      <div class="code-label">Claim Lifecycle Flow</div>
      <div class="flow">
        <div class="flow-step">
          <div class="flow-num">1</div>
          <strong>User Signs Up</strong>
          <span>Wallet + Email</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-num">2</div>
          <strong>Buy Policy</strong>
          <span>Choose coverage</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-num">3</div>
          <strong>Submit Claim</strong>
          <span>Details + docs</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-num">4</div>
          <strong>AI Verify</strong>
          <span>Fraud risk score</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-num">5</div>
          <strong>Admin Review</strong>
          <span>Approve / Reject</span>
        </div>
        <div class="flow-arrow">→</div>
        <div class="flow-step">
          <div class="flow-num">6</div>
          <strong>On-Chain Record</strong>
          <span>TX Hash stored</span>
        </div>
      </div>
    </div>
  </div>

  <!-- TECH STACK -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-purple">🔧</div>
      <div><h2>Tech Stack</h2><div class="divider"></div></div>
    </div>
    <div class="tech-grid">
      <div class="tech-card">
        <div class="tech-icon">⚛️</div>
        <div class="tech-name">React 18 + Vite</div>
        <div class="tech-desc">Frontend SPA with TypeScript, fast HMR dev server</div>
      </div>
      <div class="tech-card">
        <div class="tech-icon">🎨</div>
        <div class="tech-name">Tailwind + shadcn/ui</div>
        <div class="tech-desc">Utility-first styling with accessible UI components</div>
      </div>
      <div class="tech-card">
        <div class="tech-icon">🦁</div>
        <div class="tech-name">NestJS</div>
        <div class="tech-desc">Backend REST API with modular architecture</div>
      </div>
      <div class="tech-card">
        <div class="tech-icon">🗃️</div>
        <div class="tech-name">Prisma + MongoDB</div>
        <div class="tech-desc">Type-safe ORM with document database</div>
      </div>
      <div class="tech-card">
        <div class="tech-icon">⛓️</div>
        <div class="tech-name">Solidity 0.8.21</div>
        <div class="tech-desc">Smart contract for policy and claim management</div>
      </div>
      <div class="tech-card">
        <div class="tech-icon">🔗</div>
        <div class="tech-name">Ethers.js v6</div>
        <div class="tech-desc">Ethereum wallet/contract interaction</div>
      </div>
      <div class="tech-card">
        <div class="tech-icon">🤖</div>
        <div class="tech-name">Google Gemini AI</div>
        <div class="tech-desc">AI fraud detection and claim risk scoring</div>
      </div>
      <div class="tech-card">
        <div class="tech-icon">🔐</div>
        <div class="tech-name">JWT + Passport</div>
        <div class="tech-desc">Stateless authentication with bcrypt hashing</div>
      </div>
    </div>
  </div>

  <!-- FEATURES -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-green">✨</div>
      <div><h2>Key Features</h2><div class="divider"></div></div>
    </div>
    <div class="feature-grid">
      <div class="feature-card blue">
        <h3>🔒 Role-Based Access</h3>
        <p>Separate dashboards and routes for USER and ADMIN roles, protected by JWT guards.</p>
      </div>
      <div class="feature-card">
        <h3>🤖 AI Fraud Detection</h3>
        <p>Google Gemini AI evaluates each claim and returns a fraud risk score with explanation.</p>
      </div>
      <div class="feature-card green">
        <h3>⛓️ On-Chain Claims</h3>
        <p>Approved/rejected claims are written to the blockchain — immutable and transparent.</p>
      </div>
      <div class="feature-card amber">
        <h3>📄 Policy Management</h3>
        <p>Admins can create/manage insurance policies with custom categories, coverage, and rules.</p>
      </div>
      <div class="feature-card blue">
        <h3>📁 Document Upload</h3>
        <p>Claim documents are hashed and stored via IPFS for tamper-proof storage.</p>
      </div>
      <div class="feature-card">
        <h3>📊 Analytics Dashboard</h3>
        <p>Admin analytics view with charts (Recharts) for claims, approvals, and revenue.</p>
      </div>
      <div class="feature-card green">
        <h3>🧾 Audit Logs</h3>
        <p>Every admin action is recorded in the Audit_Log model with timestamp and actor ID.</p>
      </div>
      <div class="feature-card amber">
        <h3>🔔 Notifications</h3>
        <p>Users receive in-app notifications on claim status changes and policy updates.</p>
      </div>
    </div>
  </div>

  <!-- USER ROLES -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-amber">👥</div>
      <div><h2>User Roles</h2><div class="divider"></div></div>
    </div>
    <div class="roles-grid">
      <div class="role-card">
        <div class="role-title">👤 <span style="color:var(--accent)">USER</span></div>
        <ul class="role-list">
          <li>Sign up / Log in (email or wallet)</li>
          <li>Browse and purchase insurance policies</li>
          <li>Submit insurance claims with documents</li>
          <li>Track claim status (Pending → Approved/Rejected)</li>
          <li>View blockchain transaction hash for claims</li>
          <li>Manage profile and wallet address</li>
          <li>Receive notifications on claim updates</li>
        </ul>
      </div>
      <div class="role-card">
        <div class="role-title">🛡️ <span style="color:#a78bfa">ADMIN</span></div>
        <ul class="role-list">
          <li>Log in through separate admin portal</li>
          <li>Create, activate, or deactivate policies</li>
          <li>Review AI-verified claims with fraud scores</li>
          <li>Approve or reject claims (triggers on-chain TX)</li>
          <li>View analytics and statistics dashboard</li>
          <li>Browse full audit logs of all actions</li>
          <li>Manage smart contract interactions</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- PROJECT STRUCTURE -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-blue">📁</div>
      <div><h2>Project Structure</h2><div class="divider"></div></div>
    </div>
    <div class="tree">
<span class="dir">Insurance-claim-blockchain/</span>
├── <span class="dir">src/</span>                       <span class="note"># Frontend (React + Vite)</span>
│   ├── <span class="dir">pages/</span>
│   │   ├── <span class="dir">admin/</span>             <span class="note"># Admin dashboard pages</span>
│   │   │   ├── <span class="file">AdminDashboard.tsx</span>
│   │   │   ├── <span class="file">AdminClaims.tsx</span>
│   │   │   ├── <span class="file">AdminReviewClaims.tsx</span>
│   │   │   ├── <span class="file">AdminPolicies.tsx</span>
│   │   │   ├── <span class="file">AdminAnalytics.tsx</span>
│   │   │   └── <span class="file">AdminAuditLogs.tsx</span>
│   │   ├── <span class="dir">user/</span>              <span class="note"># User dashboard pages</span>
│   │   │   ├── <span class="file">UserDashboard.tsx</span>
│   │   │   ├── <span class="file">UserClaims.tsx</span>
│   │   │   ├── <span class="file">SubmitClaim.tsx</span>
│   │   │   └── <span class="file">UserPolicies.tsx</span>
│   │   └── <span class="dir">auth/</span>              <span class="note"># Login / Signup pages</span>
│   ├── <span class="dir">components/</span>
│   │   ├── <span class="dir">layout/</span>            <span class="note"># Admin/User sidebar layouts</span>
│   │   └── <span class="dir">ui/</span>                <span class="note"># shadcn/ui + custom components</span>
│   ├── <span class="dir">lib/</span>                   <span class="note"># API clients, utils, contract ABI</span>
│   └── <span class="dir">hooks/</span>                 <span class="note"># Custom React hooks</span>
│
├── <span class="dir">backend/</span>                   <span class="note"># Backend (NestJS)</span>
│   ├── <span class="dir">src/</span>
│   │   ├── <span class="dir">auth/</span>              <span class="note"># JWT auth, login, signup</span>
│   │   ├── <span class="dir">claims/</span>            <span class="note"># Claim CRUD + AI verification</span>
│   │   ├── <span class="dir">policies/</span>          <span class="note"># Policy management</span>
│   │   ├── <span class="dir">blockchain/</span>        <span class="note"># Ethers.js contract interaction</span>
│   │   └── <span class="dir">prisma/</span>            <span class="note"># Prisma service module</span>
│   └── <span class="dir">prisma/</span>
│       └── <span class="file">schema.prisma</span>      <span class="note"># MongoDB schema</span>
│
└── <span class="file">compile_temp.sol</span>           <span class="note"># Solidity smart contract</span>
    </div>
  </div>

  <!-- SMART CONTRACT -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-green">⛓️</div>
      <div><h2>Smart Contract</h2><div class="divider"></div></div>
    </div>
    <p style="color:var(--muted);font-size:13px;margin-bottom:16px;">Contract: <code style="color:var(--accent);font-family:'IBM Plex Mono',monospace;">InsuranceClaimSystem.sol</code> — Deployed by insurer (admin wallet). Handles on-chain policy and claim state.</p>
    <div class="contract-grid">
      <div class="contract-card">
        <div class="fn-name">createPolicy(premium, coverage)</div>
        <p>Creates a new policy linked to the caller's address. Emits PolicyCreated event.</p>
      </div>
      <div class="contract-card">
        <div class="fn-name">submitClaim(policyId, reason)</div>
        <p>Policy holder submits a claim. Validates ownership and policy active status.</p>
      </div>
      <div class="contract-card">
        <div class="fn-name">approveClaim(claimId) 🔒</div>
        <p>Only insurer (admin) can approve an unprocessed claim. Emits ClaimApproved.</p>
      </div>
      <div class="contract-card">
        <div class="fn-name">rejectClaim(claimId) 🔒</div>
        <p>Only insurer (admin) can reject an unprocessed claim. Emits ClaimRejected.</p>
      </div>
    </div>
    <div class="info-box" style="margin-top:16px;">
      <strong>⚡ Events:</strong> <code style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#a78bfa;">PolicyCreated · ClaimSubmitted · ClaimApproved · ClaimRejected</code>
      — all blockchain events are captured and stored as <code style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--accent)">blockchainTxHash</code> in MongoDB.
    </div>
  </div>

  <!-- DATABASE SCHEMA -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-purple">🗃️</div>
      <div><h2>Database Schema</h2><div class="divider"></div></div>
    </div>
    <div class="schema-grid">
      <div class="schema-card">
        <div class="schema-header">🧑 User</div>
        <div class="schema-body">
          <div class="schema-field"><span>id</span><span class="type">ObjectId</span></div>
          <div class="schema-field"><span>name, email</span><span class="type">String</span></div>
          <div class="schema-field"><span>walletAddress</span><span class="type">String?</span></div>
          <div class="schema-field"><span>role</span><span class="type">USER | ADMIN</span></div>
          <div class="schema-field"><span>balance</span><span class="type">Float</span></div>
          <div class="schema-field"><span>claims[]</span><span class="type">Relation</span></div>
        </div>
      </div>
      <div class="schema-card">
        <div class="schema-header">📋 Claim</div>
        <div class="schema-body">
          <div class="schema-field"><span>amount</span><span class="type">Float</span></div>
          <div class="schema-field"><span>incidentType</span><span class="type">String?</span></div>
          <div class="schema-field"><span>status</span><span class="type">ClaimStatus</span></div>
          <div class="schema-field"><span>aiRiskScore</span><span class="type">Float?</span></div>
          <div class="schema-field"><span>blockchainTxHash</span><span class="type">String?</span></div>
          <div class="schema-field"><span>documents[]</span><span class="type">Relation</span></div>
        </div>
      </div>
      <div class="schema-card">
        <div class="schema-header">🛡️ Policy</div>
        <div class="schema-body">
          <div class="schema-field"><span>policyName</span><span class="type">String</span></div>
          <div class="schema-field"><span>category</span><span class="type">String?</span></div>
          <div class="schema-field"><span>coverageAmount</span><span class="type">Float</span></div>
          <div class="schema-field"><span>premium</span><span class="type">Float</span></div>
          <div class="schema-field"><span>rules</span><span class="type">Json</span></div>
          <div class="schema-field"><span>active</span><span class="type">Boolean</span></div>
        </div>
      </div>
      <div class="schema-card">
        <div class="schema-header">🤖 AI_Verification</div>
        <div class="schema-body">
          <div class="schema-field"><span>fraudScore</span><span class="type">Float</span></div>
          <div class="schema-field"><span>explanation</span><span class="type">String</span></div>
          <div class="schema-field"><span>claimId</span><span class="type">ObjectId @unique</span></div>
        </div>
      </div>
      <div class="schema-card">
        <div class="schema-header">📎 Document</div>
        <div class="schema-body">
          <div class="schema-field"><span>ipfsHash</span><span class="type">String</span></div>
          <div class="schema-field"><span>fileType</span><span class="type">String</span></div>
          <div class="schema-field"><span>claimId</span><span class="type">ObjectId</span></div>
        </div>
      </div>
      <div class="schema-card">
        <div class="schema-header">📝 Audit_Log</div>
        <div class="schema-body">
          <div class="schema-field"><span>action</span><span class="type">String</span></div>
          <div class="schema-field"><span>performedBy</span><span class="type">String</span></div>
          <div class="schema-field"><span>details</span><span class="type">Json?</span></div>
          <div class="schema-field"><span>timestamp</span><span class="type">DateTime</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- SETUP -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-amber">🚀</div>
      <div><h2>Getting Started</h2><div class="divider"></div></div>
    </div>

    <h3 style="margin-bottom:8px;">Prerequisites</h3>
    <div class="badges" style="justify-content:flex-start;margin-bottom:24px;">
      <span class="badge badge-blue">Node.js v18+</span>
      <span class="badge badge-green">MongoDB (local or Atlas)</span>
      <span class="badge badge-purple">MetaMask Wallet</span>
      <span class="badge badge-amber">Google Gemini API Key</span>
    </div>

    <div class="code-label" style="margin-bottom:8px;">Step 1 — Clone the repository</div>
    <pre><span class="c">git clone</span> <span class="v">https://github.com/Sujal-85/Insurance-claim-blockchain.git</span>
<span class="c">cd</span> Insurance-claim-blockchain</pre>

    <div class="code-label" style="margin-top:20px;margin-bottom:8px;">Step 2 — Setup Frontend</div>
    <pre><span class="c">npm install</span>
<span class="c">npm run dev</span>         <span class="cmt"># starts at http://localhost:5173</span></pre>

    <div class="code-label" style="margin-top:20px;margin-bottom:8px;">Step 3 — Setup Backend</div>
    <pre><span class="c">cd backend</span>
<span class="c">npm install</span>
<span class="c">cp</span> .env.example .env   <span class="cmt"># fill in your env variables</span>
<span class="c">npx prisma generate</span>
<span class="c">npm run dev</span>            <span class="cmt"># starts at http://localhost:3000</span></pre>

    <div class="code-label" style="margin-top:20px;margin-bottom:8px;">Environment Variables — <code style="color:var(--accent)">backend/.env</code></div>
    <div class="env-wrap">
      <table class="env-table">
        <tr><td class="env-key">DATABASE_URL</td><td class="env-desc">MongoDB connection string (e.g. mongodb://localhost:27017/insurance)</td></tr>
        <tr><td class="env-key">JWT_SECRET</td><td class="env-desc">Secret key for signing JWT tokens</td></tr>
        <tr><td class="env-key">GEMINI_API_KEY</td><td class="env-desc">Google Generative AI API key for fraud detection</td></tr>
        <tr><td class="env-key">CONTRACT_ADDRESS</td><td class="env-desc">Deployed InsuranceClaimSystem contract address</td></tr>
        <tr><td class="env-key">PRIVATE_KEY</td><td class="env-desc">Admin wallet private key for signing transactions</td></tr>
        <tr><td class="env-key">RPC_URL</td><td class="env-desc">Ethereum RPC URL (e.g. Hardhat / Alchemy / Infura)</td></tr>
      </table>
    </div>
  </div>

  <!-- API REFERENCE -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-blue">🔌</div>
      <div><h2>API Reference</h2><div class="divider"></div></div>
    </div>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
      <table class="api-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Route</th>
            <th>Description</th>
            <th>Auth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="method post">POST</span></td>
            <td class="route">/auth/signup</td>
            <td class="route-desc">Register new user account</td>
            <td>—</td>
          </tr>
          <tr>
            <td><span class="method post">POST</span></td>
            <td class="route">/auth/login</td>
            <td class="route-desc">Login and receive JWT token</td>
            <td>—</td>
          </tr>
          <tr>
            <td><span class="method get">GET</span></td>
            <td class="route">/policies</td>
            <td class="route-desc">Get all active insurance policies</td>
            <td><span class="auth-tag">JWT</span></td>
          </tr>
          <tr>
            <td><span class="method post">POST</span></td>
            <td class="route">/policies</td>
            <td class="route-desc">Create a new policy (admin only)</td>
            <td><span class="auth-tag">ADMIN</span></td>
          </tr>
          <tr>
            <td><span class="method get">GET</span></td>
            <td class="route">/claims</td>
            <td class="route-desc">Get all claims (admin) / own claims (user)</td>
            <td><span class="auth-tag">JWT</span></td>
          </tr>
          <tr>
            <td><span class="method post">POST</span></td>
            <td class="route">/claims</td>
            <td class="route-desc">Submit a new claim (triggers AI verification)</td>
            <td><span class="auth-tag">JWT</span></td>
          </tr>
          <tr>
            <td><span class="method patch">PATCH</span></td>
            <td class="route">/claims/:id/approve</td>
            <td class="route-desc">Approve claim — records on blockchain</td>
            <td><span class="auth-tag">ADMIN</span></td>
          </tr>
          <tr>
            <td><span class="method patch">PATCH</span></td>
            <td class="route">/claims/:id/reject</td>
            <td class="route-desc">Reject claim — records on blockchain</td>
            <td><span class="auth-tag">ADMIN</span></td>
          </tr>
          <tr>
            <td><span class="method get">GET</span></td>
            <td class="route">/blockchain/status/:id</td>
            <td class="route-desc">Get blockchain confirmation status of a claim</td>
            <td><span class="auth-tag">JWT</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- STATUS ENUMS -->
  <div class="section">
    <div class="section-label">
      <div class="icon icon-green">🏷️</div>
      <div><h2>Claim Status Values</h2><div class="divider"></div></div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;">
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 24px;text-align:center;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#fbbf24;margin-bottom:6px;">PENDING</div>
        <div style="font-size:11px;color:var(--muted)">Just submitted,<br/>awaiting AI check</div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 24px;text-align:center;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--accent);margin-bottom:6px;">AI_VERIFIED</div>
        <div style="font-size:11px;color:var(--muted)">AI fraud check<br/>completed</div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 24px;text-align:center;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#34d399;margin-bottom:6px;">APPROVED</div>
        <div style="font-size:11px;color:var(--muted)">Admin approved,<br/>TX on-chain</div>
      </div>
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 24px;text-align:center;">
        <div style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#f87171;margin-bottom:6px;">REJECTED</div>
        <div style="font-size:11px;color:var(--muted)">Admin rejected,<br/>TX on-chain</div>
      </div>
    </div>
    <div class="info-box" style="margin-top:16px;">
      <strong>Blockchain Status:</strong> Each claim also has a separate <code style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--accent)">blockchainStatus</code> field: 
      <span style="color:#fbbf24">PENDING</span> → <span style="color:#34d399">CONFIRMED</span> or <span style="color:#f87171">FAILED</span>, 
      tracking the on-chain transaction separately from the admin decision.
    </div>
  </div>

</div>

<!-- FOOTER -->
<div class="footer">
  <div class="container" style="padding-bottom:0;">
    Built with ⛓️ React · NestJS · Solidity · Gemini AI
    &nbsp;·&nbsp;
    <a href="https://github.com/Sujal-85/Insurance-claim-blockchain">github.com/Sujal-85/Insurance-claim-blockchain</a>
    &nbsp;·&nbsp;
    MIT License
  </div>
</div>

</body>
</html>
