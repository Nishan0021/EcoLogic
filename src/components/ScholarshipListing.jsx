import React, { useState } from 'react';
import { Search, Heart, IndianRupee, Calendar, Star } from 'lucide-react';

export default function ScholarshipListing({ profile, scholarships, savedScholarships, onSaveToggle, onOpenDetail }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [matchFilter, setMatchFilter] = useState('');

  // Matching score calculation
  const calculateMatch = (scholarship) => {
    let score = 100;
    const criteria = scholarship.eligibilityCriteria;
    
    // Normalise academic score
    const userScore = parseFloat(profile.score);
    const userGpa = userScore > 10 ? userScore / 10 : userScore; // 85% -> 8.5
    
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

    // State Domicile check
    if (criteria.stateResidency && !criteria.stateResidency.includes(profile.state)) {
      score -= 20;
    }

    // Academic Level check
    const levelMatch = criteria.academicLevel.some(lvl => profile.academicLevel.includes(lvl.split(" ")[0]));
    if (criteria.academicLevel && !levelMatch) {
      score -= 15;
    }
    
    return Math.max(0, score);
  };

  // Filter scholarships
  const filteredScholarships = scholarships.map(sch => ({
    ...sch,
    matchScore: calculateMatch(sch)
  })).filter(sch => {
    // Search
    const matchesSearch = sch.title.toLowerCase().includes(search.toLowerCase()) || 
                          sch.provider.toLowerCase().includes(search.toLowerCase()) ||
                          sch.requirementsDescription.toLowerCase().includes(search.toLowerCase());
    
    // Category
    const matchesCategory = categoryFilter === '' || sch.category.includes(categoryFilter);
    
    // Source
    const matchesSource = sourceFilter === '' || sch.source === sourceFilter;
    
    // Academic level
    const matchesLevel = levelFilter === '' || sch.eligibilityCriteria.academicLevel.some(lvl => lvl.includes(levelFilter.split(" ")[0]));
    
    // Match score
    const matchesScore = matchFilter === '' || 
                         (matchFilter === 'high' && sch.matchScore >= 80) ||
                         (matchFilter === 'medium' && sch.matchScore >= 50 && sch.matchScore < 80);

    return matchesSearch && matchesCategory && matchesSource && matchesLevel && matchesScore;
  });

  return (
    <div className="scholarship-listing-view">
      <div className="dashboard-header">
        <h2>Discover Scholarships</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Search central, state, and private corporate funds. Update your profile scores at any time to see your matching percentages update.
        </p>
      </div>

      <div className="filter-search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search schemes, departments, or certificates needed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <select
            className={`filter-select ${categoryFilter ? 'active' : ''}`}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Need-based">Need-based</option>
            <option value="Merit-based">Merit-based</option>
            <option value="Need & Merit-based">Need & Merit</option>
          </select>

          <select
            className={`filter-select ${sourceFilter ? 'active' : ''}`}
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
          </select>

          <select
            className={`filter-select ${levelFilter ? 'active' : ''}`}
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="">All Education Levels</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 12">Class 12</option>
            <option value="Undergrad">Undergrad</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="Diploma">Diploma / ITI</option>
          </select>

          <select
            className={`filter-select ${matchFilter ? 'active' : ''}`}
            value={matchFilter}
            onChange={(e) => setMatchFilter(e.target.value)}
          >
            <option value="">All Matches</option>
            <option value="high">Best Matches (80%+)</option>
            <option value="medium">Good Matches (50%-80%)</option>
          </select>
        </div>
      </div>

      {filteredScholarships.length > 0 ? (
        <div className="scholarship-grid">
          {filteredScholarships.map(sch => {
            const isSaved = savedScholarships.includes(sch.id);
            const isHigh = sch.matchScore >= 80;
            const isMedium = sch.matchScore >= 50 && sch.matchScore < 80;

            return (
              <div 
                key={sch.id} 
                className={`scholarship-card ${isHigh ? 'high-matching' : ''}`}
              >
                <div className="scholarship-card-header">
                  <div className="provider-text">{sch.provider}</div>
                  <div className={`match-pill ${isHigh ? 'high' : isMedium ? 'medium' : 'low'}`}>
                    <Star size={12} fill="currentColor" /> {sch.matchScore}% Match
                  </div>
                </div>

                <h3 className="scholarship-title">{sch.title}</h3>
                <p className="scholarship-desc">{sch.requirementsDescription}</p>

                <div className="card-details-grid">
                  <div className="card-detail-item">
                    <span className="card-detail-label">Amount</span>
                    <span className="card-detail-value" style={{ color: 'var(--primary)', fontWeight: '800' }}>
                      {sch.amountFormatted}
                    </span>
                  </div>
                  <div className="card-detail-item">
                    <span className="card-detail-label">Deadline</span>
                    <span className="card-detail-value">
                      <Calendar size={14} color="var(--text-secondary)" />
                      {new Date(sch.deadline).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="card-tags">
                  <span className="card-tag">{sch.category}</span>
                  <span className="card-tag">{sch.source}</span>
                  {sch.eligibilityCriteria.casteRequired && (
                    <span className="card-tag" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {sch.eligibilityCriteria.casteRequired.join(', ')} Benefit
                    </span>
                  )}
                  {sch.eligibilityCriteria.genderRequired && (
                    <span className="card-tag" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
                      {sch.eligibilityCriteria.genderRequired} Only
                    </span>
                  )}
                </div>

                <div className="scholarship-card-footer">
                  <button 
                    className="btn-card-primary" 
                    onClick={() => onOpenDetail(sch.id)}
                  >
                    Check Eligibility & Apply
                  </button>
                  <button 
                    className={`btn-card-secondary ${isSaved ? 'saved' : ''}`}
                    onClick={() => onSaveToggle(sch.id)}
                    title={isSaved ? "Remove from Saved" : "Save Scholarship"}
                  >
                    <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>No scholarships match your filters.</p>
          <button 
            className="btn-secondary" 
            style={{ marginTop: '16px' }}
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
              setSourceFilter('');
              setLevelFilter('');
              setMatchFilter('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
