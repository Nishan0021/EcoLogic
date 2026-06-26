import React, { useState } from 'react';
import { User, Award, IndianRupee, ArrowRight, Check } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    gender: '',
    academicLevel: '',
    score: '', // GPA out of 10 or percentage
    income: '', // annual income limit value
    firstGen: '',
    category: ''
  });

  const states = [
    { code: 'MH', name: 'Maharashtra' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'DL', name: 'Delhi' },
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'UP', name: 'Uttar Pradesh' },
    { code: 'WB', name: 'West Bengal' },
    { code: 'OTHER', name: 'Other State / UT' }
  ];

  const academicLevels = [
    "Class 10 Passed",
    "Class 12 Passed",
    "Undergrad (B.Tech/B.Sc/B.A/B.Com)",
    "Postgraduate (M.Tech/M.Sc/MBA)",
    "Diploma / ITI"
  ];

  const incomeRanges = [
    { value: '250000', label: 'Under ₹2.5 Lakhs' },
    { value: '600000', label: '₹2.5 Lakhs - ₹6 Lakhs' },
    { value: '800000', label: '₹6 Lakhs - ₹8 Lakhs' },
    { value: '9999999', label: '₹8 Lakhs+' }
  ];

  const categories = [
    { value: 'General', label: 'General Category' },
    { value: 'EWS', label: 'EWS (Economically Weaker Section)' },
    { value: 'OBC', label: 'OBC (Other Backward Class)' },
    { value: 'SC', label: 'SC (Scheduled Caste)' },
    { value: 'ST', label: 'ST (Scheduled Tribe)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.name.trim() !== '' && formData.state !== '' && formData.gender !== '';
    }
    if (step === 2) {
      const scoreNum = parseFloat(formData.score);
      return formData.academicLevel !== '' && !isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 100;
    }
    if (step === 3) {
      return formData.income !== '' && formData.firstGen !== '' && formData.category !== '';
    }
    return false;
  };

  return (
    <div className="onboarding-backdrop">
      <div className="onboarding-card">
        
        <div className="onboarding-header">
          <div className="onboarding-header-content">
            <h2>Create your Scholar Profile</h2>
            <p>We use your background to match you with Indian central schemes, state DBTs, and private corporate scholarships.</p>
            
            <div className="progress-steps-bar">
              <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}></div>
              <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}></div>
              <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}></div>
            </div>
          </div>
        </div>

        <div className="onboarding-body">
          {step === 1 && (
            <div className="step-content">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color="var(--primary)" /> Student Details
              </h3>
              
              <div className="form-group">
                <label htmlFor="name-input">Student's Full Name</label>
                <input
                  id="name-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g., Alex Sharma"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="state-select">Home State (Domicile)</label>
                <select
                  id="state-select"
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                >
                  <option value="">-- Select State --</option>
                  {states.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <div className="options-grid">
                  {['Female', 'Male', 'Other', 'Prefer not to say'].map(gender => (
                    <div
                      key={gender}
                      className={`option-card ${formData.gender === gender ? 'selected' : ''}`}
                      onClick={() => handleInputChange('gender', gender)}
                    >
                      {formData.gender === gender && <Check size={14} style={{ marginRight: '6px' }} />}
                      {gender}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="var(--primary)" /> Academic Status
              </h3>

              <div className="form-group">
                <label>Current Educational Level</label>
                <div className="options-grid" style={{ gridTemplateColumns: '1fr' }}>
                  {academicLevels.map(level => (
                    <div
                      key={level}
                      className={`option-card ${formData.academicLevel === level ? 'selected' : ''}`}
                      onClick={() => handleInputChange('academicLevel', level)}
                      style={{ textAlign: 'left', padding: '14px 20px' }}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="score-input">Previous Class Score (CGPA out of 10 or Percentage %)</label>
                <input
                  id="score-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g., 85.5 or 8.8"
                  value={formData.score}
                  onChange={(e) => handleInputChange('score', e.target.value)}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>
                  Enter your percentage (e.g. 85) or cumulative grade point (e.g. 8.5).
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IndianRupee size={20} color="var(--primary)" /> Category & Income
              </h3>

              <div className="form-group">
                <label>Social Category (For Reservation/Caste Benefits)</label>
                <div className="options-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {categories.map(c => (
                    <div
                      key={c.value}
                      className={`option-card ${formData.category === c.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('category', c.value)}
                    >
                      {c.value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Are you a First-Generation College Student?</label>
                <div className="options-grid">
                  {[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' }
                  ].map(opt => (
                    <div
                      key={opt.value}
                      className={`option-card ${formData.firstGen === opt.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('firstGen', opt.value)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>

                <div className="firstgen-explainer">
                  <strong>💡 What is first-generation in India?</strong>
                  If your parents or guardians have not completed a Bachelor's degree (graduation) and are working as manual laborers, farmers, or clerical workers with school-level education, you are a first-generation scholar!
                </div>
              </div>

              <div className="form-group">
                <label>Family Annual Income (Gross)</label>
                <div className="options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  {incomeRanges.map(range => (
                    <div
                      key={range.value}
                      className={`option-card ${formData.income === range.value ? 'selected' : ''}`}
                      onClick={() => handleInputChange('income', range.value)}
                    >
                      {range.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="onboarding-footer">
          <div className="onboarding-footer-content">
            {step > 1 ? (
              <button className="btn-secondary" onClick={prevStep}>
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              className="btn-primary"
              onClick={nextStep}
              disabled={!isStepValid()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {step === 3 ? 'Match Scholarships' : 'Continue'} 
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
