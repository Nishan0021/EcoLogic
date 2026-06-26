import React from 'react';
import { Award, Calendar, IndianRupee, CheckCircle2, Clock, Sparkles, AlertTriangle } from 'lucide-react';

export default function Dashboard({ profile, scholarships, savedScholarships, applications, onNavigate }) {
  // Matching score calculation
  const calculateMatch = (scholarship) => {
    let score = 100;
    const criteria = scholarship.eligibilityCriteria;
    
    // Normalise academic score
    const userScore = parseFloat(profile.score);
    const userGpa = userScore > 10 ? userScore / 10 : userScore; // e.g. 85% becomes 8.5
    
    // GPA check
    if (criteria.gpaMin && userGpa < criteria.gpaMin) {
      score -= 20;
    }
    
    // First-gen check
    if (criteria.firstGenRequired && profile.firstGen !== 'yes') {
      score -= 25;
    }
    
    // Income check
    const userIncome = parseFloat(profile.income);
    if (criteria.incomeMax && userIncome > criteria.incomeMax) {
      score -= 25;
    }
    
    // Caste check
    if (criteria.casteRequired && !criteria.casteRequired.includes(profile.category)) {
      score -= 30;
    }

    // Gender check
    if (criteria.genderRequired && criteria.genderRequired !== profile.gender) {
      score -= 30;
    }

    // Domicile state check
    if (criteria.stateResidency && !criteria.stateResidency.includes(profile.state)) {
      score -= 20;
    }

    // Academic level check
    // Normalize level tags to match slightly
    const levelMatch = criteria.academicLevel.some(lvl => profile.academicLevel.includes(lvl.split(" ")[0]));
    if (criteria.academicLevel && !levelMatch) {
      score -= 15;
    }
    
    return Math.max(0, score);
  };

  // Process data
  const matchedList = scholarships.map(s => ({
    ...s,
    matchScore: calculateMatch(s)
  })).sort((a, b) => b.matchScore - a.matchScore);

  const topRecommendations = matchedList.slice(0, 3);
  
  // Stats
  const activeApplications = Object.keys(applications).filter(id => applications[id].status === 'In Progress');
  const submittedApplications = Object.keys(applications).filter(id => applications[id].status === 'Submitted');
  
  const savedList = matchedList.filter(s => savedScholarships.includes(s.id));
  
  // Calculate total amount tracked (saved or in progress)
  const totalAmountTracked = savedList.reduce((acc, curr) => acc + curr.amount, 0);

  // Total steps completed across all in-progress applications
  let totalTasks = 0;
  let completedTasks = 0;
  Object.keys(applications).forEach(id => {
    const app = applications[id];
    if (app.status === 'In Progress') {
      const scholarship = scholarships.find(s => s.id === id);
      if (scholarship) {
        totalTasks += scholarship.requirements.length;
        completedTasks += Object.keys(app.checklist || {}).filter(cid => app.checklist[cid]).length;
      }
    }
  });

  // Calculate next deadline
  const savedAndInProgress = matchedList.filter(s => savedScholarships.includes(s.id) || (applications[s.id] && applications[s.id].status === 'In Progress'));
  let daysLeftText = "No active deadlines";

  if (savedAndInProgress.length > 0) {
    const sortedByDeadline = [...savedAndInProgress].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    const nextSch = sortedByDeadline[0];
    const diffTime = new Date(nextSch.deadline) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      daysLeftText = "Expired";
    } else if (diffDays === 0) {
      daysLeftText = "Today!";
    } else {
      daysLeftText = `${diffDays} days left`;
    }
  }

  // Matching Score Gauge Calculation
  const avgMatchScore = topRecommendations.length > 0
    ? Math.round(topRecommendations.reduce((acc, curr) => acc + curr.matchScore, 0) / topRecommendations.length)
    : 0;

  // Circular gauge SVG calculations
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (avgMatchScore / 100) * circumference;

  return (
    <div className="dashboard-view">
      <div className="dashboard-header">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Welcome back, {profile.name}!</h2>
            <p>You are taking a key step towards funding your college studies. Being a first-generation student means you are paving the way. We are here to support your journey.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '16px' }}>
            <Award size={48} color="white" />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper primary">
            <Award size={24} />
          </div>
          <div className="stat-details">
            <h4>Saved</h4>
            <div className="stat-value">{savedScholarships.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper warning">
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <h4>In Progress</h4>
            <div className="stat-value">{activeApplications.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper success">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-details">
            <h4>Submitted</h4>
            <div className="stat-value">{submittedApplications.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper secondary">
            <IndianRupee size={24} />
          </div>
          <div className="stat-details">
            <h4>Tracked Funds</h4>
            <div className="stat-value">₹{totalAmountTracked.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="left-column">
          
          <div className="matching-widget">
            <div className="matching-gauge">
              <svg className="matching-circle-svg">
                <circle className="matching-circle-bg" cx="40" cy="40" r={radius} />
                <circle 
                  className="matching-circle-fill" 
                  cx="40" 
                  cy="40" 
                  r={radius} 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="matching-gauge-text">{avgMatchScore}%</div>
            </div>
            <div className="matching-widget-info">
              <h4>Profile Match Score</h4>
              <p>Calculated dynamically from your academic scores, category caste, domicile state, and annual income. Focus on 80%+ matches first!</p>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">
              <h3>
                <Sparkles size={20} color="var(--accent)" /> Recommended for You
              </h3>
              <button className="btn-text" onClick={() => onNavigate('scholarships')}>See All</button>
            </div>
            
            <div className="recommendations-list">
              {topRecommendations.map(sch => (
                <div 
                  key={sch.id} 
                  className="deadline-item" 
                  style={{ 
                    cursor: 'pointer',
                    borderLeft: `5px solid ${sch.matchScore >= 80 ? 'var(--success)' : 'var(--warning)'}` 
                  }}
                  onClick={() => onNavigate('scholarships', sch.id)}
                >
                  <div className="deadline-item-info">
                    <h4>{sch.title}</h4>
                    <p style={{ gap: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <IndianRupee size={13} /> {sch.amountFormatted}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> Due {new Date(sch.deadline).toLocaleDateString('en-IN')}
                      </span>
                    </p>
                  </div>
                  <div className={`match-pill ${sch.matchScore >= 80 ? 'high' : sch.matchScore >= 50 ? 'medium' : 'low'}`}>
                    {sch.matchScore}% Match
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="right-column">
          <div className="section-card">
            <div className="section-header">
              <h3>
                <Calendar size={20} color="var(--primary)" /> Deadlines
              </h3>
              <button className="btn-text" onClick={() => onNavigate('tracker')}>Open Tracker</button>
            </div>

            {savedAndInProgress.length > 0 ? (
              <div className="deadline-mini-list">
                {savedAndInProgress.slice(0, 4).map(sch => {
                  const diffTime = new Date(sch.deadline) - new Date();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  let badgeColor = "gray";
                  let badgeText = "Upcoming";
                  
                  if (diffDays < 0) {
                    badgeColor = "gray";
                    badgeText = "Expired";
                  } else if (diffDays <= 15) {
                    badgeColor = "red";
                    badgeText = `${diffDays} days left`;
                  } else if (diffDays <= 30) {
                    badgeColor = "yellow";
                    badgeText = `${diffDays} days left`;
                  } else {
                    badgeText = `${diffDays} days left`;
                  }

                  const isApplied = applications[sch.id] && applications[sch.id].status === 'Submitted';

                  return (
                    <div key={sch.id} className={`deadline-item ${diffDays <= 15 ? 'urgent' : diffDays <= 30 ? 'warning' : ''}`} style={{ borderLeftWidth: '4px' }}>
                      <div className="deadline-item-info">
                        <h4 style={{ fontSize: '13px' }}>{sch.title}</h4>
                        <p>
                          {isApplied ? (
                            <span style={{ color: 'var(--success)', fontWeight: '600' }}>✓ Submitted</span>
                          ) : (
                            <span>Due: {new Date(sch.deadline).toLocaleDateString('en-IN')}</span>
                          )}
                        </p>
                      </div>
                      {!isApplied && (
                        <div className={`deadline-badge ${badgeColor}`}>
                          {badgeText}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                <p>No scholarships tracked yet.</p>
                <button 
                  className="btn-primary" 
                  onClick={() => onNavigate('scholarships')}
                  style={{ marginTop: '12px', fontSize: '12px', padding: '6px 12px' }}
                >
                  Find Scholarships
                </button>
              </div>
            )}

            {totalTasks > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  <span>Tasks Completed</span>
                  <span style={{ marginLeft: 'auto' }}>{completedTasks} / {totalTasks}</span>
                </div>
                <div className="checklist-progress-bar" style={{ margin: '0' }}>
                  <div 
                    className="checklist-progress-fill" 
                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="section-card" style={{ marginTop: '24px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px dashed var(--secondary)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '8px', color: '#1e40af' }}>
              <AlertTriangle size={16} /> First-Gen Mentor Tip
            </h4>
            <p style={{ fontSize: '12px', lineHeight: '1.5', color: '#1e3a8a' }}>
              Government scholarships in India (like NSP or State portals) strictly require your bank account to be linked with Aadhaar. Contact your bank to complete Aadhaar Seeding as soon as possible!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
