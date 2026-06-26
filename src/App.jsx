import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Home, 
  Search, 
  ClipboardList, 
  BookOpen, 
  MessageSquare, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';

import { SCHOLARSHIPS, MOCK_MENTOR_CHAT } from './data';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ScholarshipListing from './components/ScholarshipListing';
import ScholarshipDetail from './components/ScholarshipDetail';
import Tracker from './components/Tracker';
import ResourceCenter from './components/ResourceCenter';
import MentorChat from './components/MentorChat';
import WelcomeScreen from './components/WelcomeScreen';

export default function App() {
  // --- Persistent State ---
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('firstgen_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [savedScholarships, setSavedScholarships] = useState(() => {
    const saved = localStorage.getItem('firstgen_saved');
    return saved ? JSON.parse(saved) : [];
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('firstgen_applications');
    return saved ? JSON.parse(saved) : {};
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('firstgen_messages');
    return saved ? JSON.parse(saved) : MOCK_MENTOR_CHAT;
  });

  // --- UI Layout State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedScholarshipId, setSelectedScholarshipId] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Sync state to LocalStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('firstgen_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('firstgen_profile');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('firstgen_saved', JSON.stringify(savedScholarships));
  }, [savedScholarships]);

  useEffect(() => {
    localStorage.setItem('firstgen_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('firstgen_messages', JSON.stringify(messages));
  }, [messages]);

  // --- Handlers ---
  const handleOnboardingComplete = (profileData) => {
    setProfile(profileData);
    setActiveTab('dashboard');
  };

  const handleSaveToggle = (id) => {
    setSavedScholarships(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRemoveSaved = (id) => {
    setSavedScholarships(prev => prev.filter(sid => sid !== id));
  };

  const handleStartApplication = (id) => {
    const scholarship = SCHOLARSHIPS.find(s => s.id === id);
    if (!scholarship) return;

    // Seed empty checklist based on scholarship requirements
    const initialChecklist = {};
    scholarship.requirements.forEach(req => {
      initialChecklist[req.id] = false;
    });

    setApplications(prev => ({
      ...prev,
      [id]: {
        status: 'In Progress',
        checklist: initialChecklist,
        essay: '',
        startedAt: new Date().toISOString()
      }
    }));

    // Auto-save/bookmark the scholarship if it wasn't saved already
    setSavedScholarships(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleToggleChecklistItem = (scholarshipId, reqId) => {
    setApplications(prev => {
      const app = prev[scholarshipId];
      if (!app) return prev;

      return {
        ...prev,
        [scholarshipId]: {
          ...app,
          checklist: {
            ...app.checklist,
            [reqId]: !app.checklist[reqId]
          }
        }
      };
    });
  };

  const handleSaveEssay = (scholarshipId, essayText) => {
    setApplications(prev => {
      const app = prev[scholarshipId];
      if (!app) return prev;

      return {
        ...prev,
        [scholarshipId]: {
          ...app,
          essay: essayText
        }
      };
    });
  };

  const handleSubmitApplication = (scholarshipId) => {
    setApplications(prev => {
      const app = prev[scholarshipId];
      if (!app) return prev;

      return {
        ...prev,
        [scholarshipId]: {
          ...app,
          status: 'Submitted',
          submittedAt: new Date().toISOString()
        }
      };
    });
  };

  const handleSendMessage = (msgObj) => {
    setMessages(prev => [...prev, msgObj]);
  };

  const handleResetApp = () => {
    if (window.confirm("Are you sure you want to log out and clear all your dashboard progress? This will reset your profile.")) {
      localStorage.clear();
      setProfile(null);
      setSavedScholarships([]);
      setApplications({});
      setMessages(MOCK_MENTOR_CHAT);
      setActiveTab('dashboard');
      setShowProfileModal(false);
      setShowWelcome(true);
    }
  };

  const handleOpenJargonTerm = (term) => {
    setActiveTerm(term);
    setActiveTab('resources');
    setSelectedScholarshipId(null); // Close detail view drawer
  };

  const handleNavigate = (tabName, detailId = null) => {
    setActiveTab(tabName);
    if (detailId) {
      setSelectedScholarshipId(detailId);
    }
  };

  // Profile modal edit states
  const [editName, setEditName] = useState('');
  const [editScore, setEditScore] = useState('');
  const [editIncome, setEditIncome] = useState('');

  const openProfileEdit = () => {
    if (profile) {
      setEditName(profile.name);
      setEditScore(profile.score);
      setEditIncome(profile.income);
      setShowProfileModal(true);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: editName,
      score: editScore,
      income: editIncome
    }));
    setShowProfileModal(false);
  };

  // If no profile, show WelcomeScreen first, then Onboarding form
  if (!profile) {
    if (showWelcome) {
      return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
    }
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const selectedScholarship = SCHOLARSHIPS.find(s => s.id === selectedScholarshipId);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">F</div>
          <div className="logo-text">
            <h1>Scholar Mate</h1>
            <span>First-Gen Navigator</span>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavigate('dashboard')}
              >
                <Home size={18} /> Dashboard
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'scholarships' ? 'active' : ''}`}
                onClick={() => handleNavigate('scholarships')}
              >
                <Search size={18} /> Discover
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'tracker' ? 'active' : ''}`}
                onClick={() => handleNavigate('tracker')}
              >
                <ClipboardList size={18} /> My Tracker
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => handleNavigate('resources')}
              >
                <BookOpen size={18} /> Resources
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'mentor' ? 'active' : ''}`}
                onClick={() => handleNavigate('mentor')}
              >
                <MessageSquare size={18} /> Mentor Chat
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Profile Card footer */}
        <div className="sidebar-profile-summary">
          <div className="profile-avatar" onClick={openProfileEdit} style={{ cursor: 'pointer' }} title="Edit Profile">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info" style={{ flex: 1 }}>
            <div className="profile-name" onClick={openProfileEdit} style={{ cursor: 'pointer' }} title="Edit Profile">{profile.name}</div>
            <span className="profile-tag">First-Gen</span>
          </div>
          <button 
            onClick={handleResetApp} 
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Workspace content */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            profile={profile} 
            scholarships={SCHOLARSHIPS}
            savedScholarships={savedScholarships}
            applications={applications}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipListing 
            profile={profile}
            scholarships={SCHOLARSHIPS}
            savedScholarships={savedScholarships}
            onSaveToggle={handleSaveToggle}
            onOpenDetail={setSelectedScholarshipId}
          />
        )}

        {activeTab === 'tracker' && (
          <Tracker 
            scholarships={SCHOLARSHIPS}
            savedScholarships={savedScholarships}
            applications={applications}
            onStartApplication={handleStartApplication}
            onSubmitApplication={handleSubmitApplication}
            onOpenDetail={setSelectedScholarshipId}
            onRemoveSaved={handleRemoveSaved}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceCenter 
            activeTerm={activeTerm}
            setActiveTerm={setActiveTerm}
          />
        )}

        {activeTab === 'mentor' && (
          <MentorChat 
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>

      {/* Drawer Overlay for Scholarship Details */}
      {selectedScholarship && (
        <ScholarshipDetail 
          scholarship={selectedScholarship}
          profile={profile}
          application={applications[selectedScholarship.id]}
          onStartApplication={handleStartApplication}
          onToggleChecklistItem={handleToggleChecklistItem}
          onSaveEssay={handleSaveEssay}
          onSubmitApplication={handleSubmitApplication}
          onClose={() => setSelectedScholarshipId(null)}
          onOpenGlossaryTerm={handleOpenJargonTerm}
        />
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="onboarding-backdrop" onClick={() => setShowProfileModal(false)}>
          <form className="onboarding-card" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()} onSubmit={handleSaveProfile}>
            <div className="onboarding-header" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px' }}>Update Profile</h2>
              <p>Change your academic scores or income to see updated matching recommendations.</p>
            </div>
            <div className="onboarding-body" style={{ padding: '24px' }}>
              <div className="form-group">
                <label htmlFor="edit-name">Full Name</label>
                <input 
                  id="edit-name"
                  type="text" 
                  className="form-input" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-score">Previous Class Score (CGPA out of 10 or %)</label>
                <input 
                  id="edit-score"
                  type="number" 
                  step="0.1"
                  min="0"
                  max="100"
                  className="form-input" 
                  value={editScore} 
                  onChange={(e) => setEditScore(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-income">Annual Family Income Range</label>
                <select 
                  id="edit-income"
                  className="form-input" 
                  value={editIncome} 
                  onChange={(e) => setEditIncome(e.target.value)}
                  required
                >
                  <option value="250000">Under ₹2.5 Lakhs</option>
                  <option value="600000">₹2.5 Lakhs - ₹6 Lakhs</option>
                  <option value="800000">₹6 Lakhs - ₹8 Lakhs</option>
                  <option value="9999999">₹8 Lakhs+</option>
                </select>
              </div>
            </div>
            <div className="onboarding-footer" style={{ padding: '16px 24px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
