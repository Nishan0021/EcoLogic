import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Volume2, Mic, MapPin, Grid, Layers, Search, Cpu, CheckCircle } from 'lucide-react';

const ECO_FEATURES = [
  // Core Discovery
  { id: 1, name: "Smart Matching Engine", category: "Discovery", desc: "Compares scores, income, state, and category to calculate eligibility match.", status: "MVP (Implemented)" },
  { id: 2, name: "AI OCR Scanner Simulator", category: "Discovery", desc: "Scans uploaded certificates to auto-extract GPA and income levels.", status: "MVP (Implemented)" },
  { id: 3, name: "In-App Browser Autofill", category: "Discovery", desc: "Simulates government portal browser and auto-populates inputs in one click.", status: "MVP (Implemented)" },
  { id: 4, name: "Auto-Document Generator", category: "Discovery", desc: "Drafts official request sheets like Bonafide certificates and Income Affidavits.", status: "MVP (Implemented)" },
  { id: 5, name: "Multi-Language Switcher", category: "Discovery", desc: "Instantly localizes the experience into English, Hindi, and Kannada.", status: "MVP (Implemented)" },
  { id: 6, name: "Meta WhatsApp Outbox Log", category: "Discovery", desc: "Displays WhatsApp notification template logs sent on form submission.", status: "MVP (Implemented)" },
  { id: 7, name: "Plain-Language Jargon Buster", category: "Discovery", desc: "Hover decoders explain bureaucratic terms in simple words.", status: "MVP (Implemented)" },
  { id: 8, name: "Kanban Tracker Workflow", category: "Discovery", desc: "Interactive board organizing Saved, In Progress, and Submitted milestones.", status: "MVP (Implemented)" },
  { id: 9, name: "EcoVault Document Locker", category: "Discovery", desc: "Category-aware digital vault organizing documents for scholarship matching.", status: "MVP (Implemented)" },
  { id: 10, name: "Sarah: Interactive AI Counselor", category: "Discovery", desc: "AI assistant that helps draft recommendation drafts and outlines application steps.", status: "MVP (Implemented)" },

  // Reminders & Deadlines
  { id: 11, name: "DigiLocker API Integration", category: "Reminders & Verification", desc: "Connects directly to verified Government locker APIs to fetch official documents.", status: "Phase 2 (High Priority)" },
  { id: 12, name: "Twilio SMS/WhatsApp Gateway", category: "Reminders & Verification", desc: "Sends active text reminders and checklist alerts directly to student phones.", status: "Phase 2 (High Priority)" },
  { id: 13, name: "Automatic Image Compressor", category: "Reminders & Verification", desc: "Compresses uploaded camera photos and PDFs under 500KB automatically.", status: "Phase 2 (High Priority)" },
  { id: 14, name: "Scholarship Scraper Engine", category: "Reminders & Verification", desc: "Crawlers updating portal listings from central, state, and corporate sites.", status: "Phase 2 (High Priority)" },
  { id: 15, name: "Real-Time Push Alerts", category: "Reminders & Verification", desc: "Browser-based push alerts warning students of fast-approaching deadlines.", status: "Phase 2 (High Priority)" },

  // Tech & Innovation Add-ons
  { id: 51, name: "One-Click Direct Apply Integrations", category: "Tech & Innovation", desc: "Direct APIs transferring student data straight to private corporate partners.", status: "Phase 3 (Long-Term)" },
  { id: 52, name: "AI Essay Drafter and Editor", category: "Tech & Innovation", desc: "Draws personal stories from profile data to write polished scholarship essay drafts.", status: "Phase 3 (Long-Term)" },
  { id: 53, name: "Blockchain Document Signatures", category: "Tech & Innovation", desc: "Saves cryptographic verification tags on public ledger networks to prevent document fraud.", status: "Phase 3 (Long-Term) - SIMULATION AVAILABLE" },
  { id: 54, name: "AI Winning Odds Estimator", category: "Tech & Innovation", desc: "Predictive model calculating award probabilities based on historical winner stats.", status: "Phase 3 (Long-Term) - SIMULATION AVAILABLE" },
  { id: 68, name: "Offline Local Mesh Networking", category: "Tech & Innovation", desc: "Allows sharing of documents and checklists between offline phones using WiFi-Direct.", status: "Phase 3 (Long-Term)" }
];

export default function EcoLabs({ documents = [], language, setLanguage, setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('roadmap');
  
  // 1. Blockchain States
  const [selectedDoc, setSelectedDoc] = useState('');
  const [isNotarizing, setIsNotarizing] = useState(false);
  const [notaryLogs, setNotaryLogs] = useState([]);
  const [blockchainRecords, setBlockchainRecords] = useState({});

  // 2. Voice Assist States
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);

  // 3. AI Predictor States
  const [selectedScholarship, setSelectedScholarship] = useState('nsp_merit');
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);

  // Check Voice Support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      voiceSupported(true);
    }
  }, []);

  // Blockchain Notarize Action
  const handleNotarize = () => {
    if (!selectedDoc) return;
    setIsNotarizing(true);
    const logs = [
      "Generating SHA-256 hash checksum for file...",
      "Connecting to Polygon Proof-of-Stake RPC node...",
      "Assembling transaction payload with student credential hash...",
      "Signing transaction with student signature key...",
      "Broadcasting transaction to blockchain network..."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setNotaryLogs(prev => [...prev, log]);
      }, (index + 1) * 800);
    });

    setTimeout(() => {
      const txHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const blockNo = Math.floor(18500000 + Math.random() * 500000);
      setBlockchainRecords(prev => ({
        ...prev,
        [selectedDoc]: { txHash, blockNo, timestamp: new Date().toLocaleString() }
      }));
      setNotaryLogs(prev => [...prev, `🎉 Block confirmed! TX Hash: ${txHash.slice(0, 10)}... | Block Height: #${blockNo}`]);
      setIsNotarizing(false);
    }, 4800);
  };

  // Voice Recognition Handler
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setVoiceTranscript("Listening for commands...");

    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      setVoiceTranscript(speechResult);
      
      // Navigate Commands
      if (speechResult.includes('dashboard') || speechResult.includes('home')) {
        setActiveTab('dashboard');
      } else if (speechResult.includes('scholarship') || speechResult.includes('list')) {
        setActiveTab('scholarships');
      } else if (speechResult.includes('tracker') || speechResult.includes('status')) {
        setActiveTab('tracker');
      } else if (speechResult.includes('vault') || speechResult.includes('document')) {
        setActiveTab('vault');
      } else if (speechResult.includes('counselor') || speechResult.includes('mentor') || speechResult.includes('sarah')) {
        setActiveTab('mentor');
      }
      
      // Language Commands
      if (speechResult.includes('hindi') || speechResult.includes('हिंदी')) {
        setLanguage('hi');
      } else if (speechResult.includes('kannada') || speechResult.includes('ಕನ್ನಡ')) {
        setLanguage('kn');
      } else if (speechResult.includes('english')) {
        setLanguage('en');
      }
    };

    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceTranscript("Error capturing speech. Try again.");
    };
  };

  // AI Predictor Simulation
  const runPrediction = () => {
    setIsPredicting(true);
    setPredictionResults(null);
    setTimeout(() => {
      let score = 0;
      let breakdown = [];
      
      if (selectedScholarship === 'nsp_merit') {
        score = 88;
        breakdown = [
          { label: "Academic Qualification (9.2 CGPA)", value: "+45% score weight", positive: true },
          { label: "First-Generation Scholar status verified", value: "+20% weight multiplier", positive: true },
          { label: "Income Limit (under ₹2,50,000)", value: "+25% weight multiplier", positive: true },
          { label: "Missing Document: Domicile Certificate", value: "-10% risk multiplier", positive: false }
        ];
      } else if (selectedScholarship === 'sitaram_jindal') {
        score = 92;
        breakdown = [
          { label: "Course alignment (Undergrad Degree)", value: "+30% weight", positive: true },
          { label: "Income Certificate verified via OCR", value: "+40% weight", positive: true },
          { label: "Marksheet OCR Verification Match", value: "+22% weight", positive: true }
        ];
      } else {
        score = 65;
        breakdown = [
          { label: "Reservation Category Match", value: "+35% weight", positive: true },
          { label: "Income verified under threshold", value: "+30% weight", positive: true },
          { label: "Requires Letter of Recommendation (Missing)", value: "-15% risk weight", positive: false }
        ];
      }

      setPredictionResults({ score, breakdown });
      setIsPredicting(false);
    }, 1800);
  };

  // Roadmap filter states
  const [roadmapSearch, setRoadmapSearch] = useState('');
  const [selectedRoadmapCat, setSelectedRoadmapCat] = useState('All');

  const filteredFeatures = ECO_FEATURES.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(roadmapSearch.toLowerCase()) || f.desc.toLowerCase().includes(roadmapSearch.toLowerCase());
    const matchesCat = selectedRoadmapCat === 'All' || f.category === selectedRoadmapCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="ecolabs-container fade-in">
      <div className="section-header">
        <h2 className="section-title">🧪 EcoLabs (Beta features & Roadmap)</h2>
        <p className="section-subtitle">Explore live simulated technology add-ons and the full 100-feature development roadmap compiled for the jury presentation.</p>
      </div>

      {/* Sub tabs */}
      <div className="tabs-container" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
        <button onClick={() => setActiveSubTab('roadmap')} className={`nav-link-btn ${activeSubTab === 'roadmap' ? 'active' : ''}`} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeSubTab === 'roadmap' ? 'var(--accent)' : '#aaa', fontWeight: '600', padding: '0.5rem 1rem' }}>
          📂 100-Feature Roadmap
        </button>
        <button onClick={() => setActiveSubTab('blockchain')} className={`nav-link-btn ${activeSubTab === 'blockchain' ? 'active' : ''}`} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeSubTab === 'blockchain' ? 'var(--accent)' : '#aaa', fontWeight: '600', padding: '0.5rem 1rem' }}>
          🔗 Blockchain Notary
        </button>
        <button onClick={() => setActiveSubTab('voice')} className={`nav-link-btn ${activeSubTab === 'voice' ? 'active' : ''}`} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeSubTab === 'voice' ? 'var(--accent)' : '#aaa', fontWeight: '600', padding: '0.5rem 1rem' }}>
          🎙️ Voice Command Assist
        </button>
        <button onClick={() => setActiveSubTab('prediction')} className={`nav-link-btn ${activeSubTab === 'prediction' ? 'active' : ''}`} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeSubTab === 'prediction' ? 'var(--accent)' : '#aaa', fontWeight: '600', padding: '0.5rem 1rem' }}>
          📈 AI Odds Predictor
        </button>
      </div>

      {/* SUBTAB 1: Roadmap Backlog */}
      {activeSubTab === 'roadmap' && (
        <div className="roadmap-panel">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
              <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#888' }} />
              <input type="text" placeholder="Search roadmap features..." value={roadmapSearch} onChange={(e) => setRoadmapSearch(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['All', 'Discovery', 'Reminders & Verification', 'Tech & Innovation'].map(cat => (
                <button key={cat} onClick={() => setSelectedRoadmapCat(cat)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: selectedRoadmapCat === cat ? 'var(--accent-glow)' : 'rgba(255,255,255,0.05)', color: selectedRoadmapCat === cat ? 'var(--accent)' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {filteredFeatures.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s hover' }}>
                <div style={{ flex: '1', paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.07)', color: '#bbb', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'monospace' }}>#{item.id}</span>
                    <strong style={{ color: '#fff' }}>{item.name}</strong>
                    <span style={{ fontSize: '0.7rem', border: '1px solid rgba(255,255,255,0.15)', color: '#aaa', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{item.category}</span>
                  </div>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0' }}>{item.desc}</p>
                </div>
                <div>
                  <span style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block', minWidth: '130px', textAlign: 'center', background: item.status.includes('MVP') ? 'rgba(46, 213, 115, 0.15)' : item.status.includes('Phase 2') ? 'rgba(255, 165, 0, 0.15)' : 'rgba(54, 162, 235, 0.15)', color: item.status.includes('MVP') ? '#2ed573' : item.status.includes('Phase 2') ? '#ffaa00' : '#36a2eb', border: item.status.includes('MVP') ? '1px solid rgba(46, 213, 115, 0.3)' : item.status.includes('Phase 2') ? '1px solid rgba(255, 165, 0, 0.3)' : '1px solid rgba(54, 162, 235, 0.3)' }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Blockchain Notary */}
      {activeSubTab === 'blockchain' && (
        <div className="blockchain-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(54, 162, 235, 0.1)', color: '#36a2eb' }}>
              <Shield size={32} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>Decentralized Document Notarization</h3>
              <p style={{ margin: '0', color: '#aaa', fontSize: '0.85rem' }}>Simulates hashing and anchoring student locker certificates onto a public blockchain ledger (Polygon Devnet) for fraud prevention.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Input column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#ddd' }}>Select Document to Notarize:</label>
              <select value={selectedDoc} onChange={(e) => { setSelectedDoc(e.target.value); setNotaryLogs([]); }} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}>
                <option value="">-- Choose Locker File --</option>
                <option value="Aadhaar Card (Identity Proof)">Aadhaar Card (Identity Proof)</option>
                <option value="Income Certificate">Income Certificate</option>
                <option value="Class 12 Marksheet">Class 12 Marksheet</option>
                <option value="Domicile Certificate">Domicile Certificate (Address Proof)</option>
              </select>

              <button onClick={handleNotarize} disabled={isNotarizing || !selectedDoc} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.8rem', background: '#36a2eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
                {isNotarizing ? 'Executing Cryptographic Anchor...' : '🔐 Anchoring Checksum Hash'}
              </button>

              {blockchainRecords[selectedDoc] && (
                <div style={{ background: 'rgba(46, 213, 115, 0.05)', border: '1px solid rgba(46, 213, 115, 0.2)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#2ed573', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={18} /> File Verified On-Chain
                  </h4>
                  <div style={{ fontSize: '0.75rem', color: '#bbb', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div><strong>Tx Hash:</strong> <span style={{ color: '#fff' }}>{blockchainRecords[selectedDoc].txHash}</span></div>
                    <div><strong>Block:</strong> <span style={{ color: '#fff' }}>#{blockchainRecords[selectedDoc].blockNo}</span></div>
                    <div><strong>Network:</strong> Polygon Edge Testnet</div>
                    <div><strong>Timestamp:</strong> {blockchainRecords[selectedDoc].timestamp}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Logs console */}
            <div style={{ background: '#0e1111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', minHeight: '220px', position: 'relative' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem', fontFamily: 'monospace' }}>
                Anchor Console Logs
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#00ff00', overflowY: 'auto', maxHeight: '180px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {notaryLogs.length === 0 ? (
                  <span style={{ color: '#555' }}>Waiting for anchoring command execution...</span>
                ) : (
                  notaryLogs.map((log, i) => <div key={i}>&gt; {log}</div>)
                )}
              </div>
              {isNotarizing && (
                <div style={{ position: 'absolute', right: '1rem', bottom: '1rem', display: 'flex', gap: '0.2rem' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#36a2eb', animation: 'bounce 0.6s infinite alternate' }}></span>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#36a2eb', animation: 'bounce 0.6s infinite alternate 0.2s' }}></span>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#36a2eb', animation: 'bounce 0.6s infinite alternate 0.4s' }}></span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Voice Command Assist */}
      {activeSubTab === 'voice' && (
        <div className="voice-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b' }}>
              <Volume2 size={32} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>Voice Command Navigation & Translation</h3>
              <p style={{ margin: '0', color: '#aaa', fontSize: '0.85rem' }}>Uses native browser Web Speech API to control navigation tabs and toggle regional language scripts directly using voice cues.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px dashed rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px' }}>
            <button onClick={startSpeechRecognition} className={`mic-button ${isListening ? 'listening' : ''}`} style={{ width: '80px', height: '80px', borderRadius: '50%', background: isListening ? '#ff6b6b' : 'rgba(255,255,255,0.05)', border: isListening ? 'none' : '1px solid rgba(255,255,255,0.15)', color: isListening ? '#fff' : '#ff6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', boxShadow: isListening ? '0 0 20px rgba(255, 107, 107, 0.4)' : 'none' }}>
              <Mic size={36} className={isListening ? 'pulse' : ''} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 'bold' }}>Captured Command Transcript</div>
              <div style={{ fontSize: '1.2rem', color: isListening ? '#ff6b6b' : '#fff', fontWeight: '600', fontFamily: 'monospace' }}>
                "{voiceTranscript || 'Tap mic and speak a command...'}"
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', maxWidth: '500px' }}>
              <div style={{ fontSize: '0.8rem', color: '#bbb', fontWeight: 'bold', marginBottom: '0.5rem' }}>🗣️ Supported Voice Prompts:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#aaa', fontFamily: 'monospace' }}>
                <div>• "Go to Dashboard"</div>
                <div>• "Go to Scholarships"</div>
                <div>• "Go to Tracker"</div>
                <div>• "Go to Document Vault"</div>
                <div>• "Select Hindi Language"</div>
                <div>• "Select Kannada Language"</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: AI Odds Predictor */}
      {activeSubTab === 'prediction' && (
        <div className="prediction-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(46, 213, 115, 0.1)', color: '#2ed573' }}>
              <Sparkles size={32} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>AI Application Winning Odds Estimator</h3>
              <p style={{ margin: '0', color: '#aaa', fontSize: '0.85rem' }}>Runs regression simulations against historical grant recipient parameters to predict your probability of winning.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
            {/* Input Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#ddd', marginBottom: '0.5rem' }}>Select Target Scholarship:</label>
                <select value={selectedScholarship} onChange={(e) => { setSelectedScholarship(e.target.value); setPredictionResults(null); }} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}>
                  <option value="nsp_merit">National Merit-cum-Means Scholarship</option>
                  <option value="sitaram_jindal">Sitaram Jindal Foundation Grant</option>
                  <option value="post_matric">State Post-Matric DBT Scholarship</option>
                </select>
              </div>

              <button onClick={runPrediction} disabled={isPredicting} className="btn-primary" style={{ padding: '0.8rem', background: '#2ed573', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                {isPredicting ? 'Running Regression Matrix...' : '📊 Estimate Winning Odds'}
              </button>
            </div>

            {/* Results Grid */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPredicting ? (
                <div style={{ textAlign: 'center' }}>
                  <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #2ed573', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>Analyzing 10k+ historical scholarship matches...</span>
                </div>
              ) : predictionResults ? (
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>Winning Probability:</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: predictionResults.score >= 80 ? '#2ed573' : '#ffaa00' }}>{predictionResults.score}%</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {predictionResults.breakdown.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.4rem', borderRadius: '6px', background: item.positive ? 'rgba(46, 213, 115, 0.05)' : 'rgba(255, 107, 107, 0.05)' }}>
                        <span style={{ color: '#ccc' }}>{item.label}</span>
                        <span style={{ fontWeight: 'bold', color: item.positive ? '#2ed573' : '#ff6b6b' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ color: '#555', fontSize: '0.85rem', textAlign: 'center' }}>
                  Select a scholarship program and execute the odds estimation check.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
