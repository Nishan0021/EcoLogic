import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  Lock, 
  ShieldCheck, 
  Upload, 
  Zap, 
  Check, 
  Info,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export default function InAppBrowser({ 
  scholarship, 
  profile, 
  vaultDocs, 
  setVaultDocs, 
  onClose, 
  onSubmitApplication 
}) {
  const [autofilled, setAutofilled] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  
  // Simulated form input values
  const [formValues, setFormValues] = useState({
    fullName: '',
    state: '',
    gender: '',
    category: '',
    gpa: '',
    income: '',
    firstGen: '',
    attachedFiles: {
      aadhaar: false,
      income: false,
      domicile: false,
      caste: false
    }
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Quick Upload Handler inside Browser Assistant ---
  const handleAssistantUpload = (docId) => {
    const mockFiles = {
      aadhaar: { name: `${profile.name.toLowerCase().replace(/\s+/g, '_')}_aadhaar.pdf`, size: '1.8 MB' },
      income: { name: 'tahsildar_income_cert_2025.pdf', size: '2.4 MB' },
      domicile: { name: `domicile_${profile.state.toLowerCase()}.pdf`, size: '2.0 MB' },
      caste: { name: `caste_${profile.category.toLowerCase()}.pdf`, size: '2.2 MB' }
    };
    
    const chosenFile = mockFiles[docId];

    setVaultDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'Uploaded',
          file: chosenFile.name,
          size: chosenFile.size,
          date: new Date().toLocaleDateString('en-IN')
        };
      }
      return d;
    }));
  };

  // Check if a document is present in vault
  const getDocStatus = (docId) => {
    return vaultDocs.find(d => d.id === docId);
  };

  // --- Autofill Handler ---
  const handleAutofill = () => {
    setFormValues(prev => ({
      ...prev,
      fullName: profile.name,
      state: profile.state === 'MH' ? 'Maharashtra' : profile.state === 'KA' ? 'Karnataka' : profile.state === 'DL' ? 'Delhi' : profile.state === 'TN' ? 'Tamil Nadu' : profile.state === 'UP' ? 'Uttar Pradesh' : profile.state === 'WB' ? 'West Bengal' : 'Other',
      gender: profile.gender || 'Not Specified',
      category: profile.category || 'General',
      gpa: profile.score || '',
      income: profile.income === '250000' ? 'Under ₹2.5 Lakhs' : profile.income === '600000' ? '₹2.5L - ₹6L' : '₹6L - ₹8L',
      firstGen: profile.firstGen === 'yes' ? 'Yes' : 'No',
      attachedFiles: {
        aadhaar: !!getDocStatus('aadhaar')?.file,
        income: !!getDocStatus('income')?.file,
        domicile: !!getDocStatus('domicile')?.file,
        caste: profile.category === 'General' ? false : !!getDocStatus('caste')?.file
      }
    }));
    setAutofilled(true);
  };

  // Handle individual attachment
  const handleAttachFile = (docId) => {
    const doc = getDocStatus(docId);
    if (!doc || doc.status === 'Missing') {
      handleAssistantUpload(docId);
    }
    
    setFormValues(prev => ({
      ...prev,
      attachedFiles: {
        ...prev.attachedFiles,
        [docId]: true
      }
    }));
  };

  const handleInputChange = (field, val) => {
    setFormValues(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onSubmitApplication(scholarship.id);
      }, 2500);
    }, 2000);
  };

  // Calculate matching criteria for active inputs to show advice
  const getHelperGuidance = () => {
    switch (activeInput) {
      case 'fullName':
        return {
          title: "Legal Name Check",
          content: `Your EcoVault verified name is "${profile.name}". Make sure it matches exactly with your Aadhaar Card and Class 10/12 marksheet. Spelling discrepancies will delay verification.`
        };
      case 'income':
        return {
          title: "Income Declaration Criteria",
          content: `Your profile annual income is set to ${profile.income === '250000' ? 'Under ₹2.5 Lakhs' : '₹2.5 Lakhs - ₹8 Lakhs'}. This scholarship requires a Tahsildar Income Certificate. Ensure your parent's salary declaration is uploaded to match.`
        };
      case 'category':
        return {
          title: "Category Selection Advice",
          content: `You selected "${profile.category}" caste category. Government verification portals (NSP) cross-verify reservation category certificates using state database APIs. Ensure your Caste Certificate is linked.`
        };
      case 'gpa':
        return {
          title: "Academic Score Verification",
          content: `Your last class score is verified as ${profile.score} CGPA/%. If this form asks for a GPA out of 4.0 or 10.0, use the official conversion formula provided by your board.`
        };
      case 'attachedFiles':
        return {
          title: "Document Attachment Guidance",
          content: "Government scholarship portals require PDF uploads under 500KB. EcoVault automatically compresses your uploaded files to fit these limits."
        };
      default:
        return {
          title: "Ready to Autofill",
          content: "Click the '⚡ Autofill' button on the EcoVault panel to automatically load your verified grades, income details, and attach certificates instantly!"
        };
    }
  };

  const guidance = getHelperGuidance();

  return (
    <div className="in-app-browser-backdrop animate-fade-in" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      background: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* 1. Browser Address Bar & Toolbar */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <button 
          onClick={onClose}
          className="btn btn-secondary btn-icon"
          style={{ width: '32px', height: '32px', borderRadius: '8px' }}
        >
          <ArrowLeft size={16} />
        </button>
        <button className="btn btn-secondary btn-icon" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
          <RotateCw size={14} />
        </button>

        {/* Address Input */}
        <div style={{
          flex: 1,
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px'
        }}>
          <Lock size={12} color="var(--success)" />
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>Secure</span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>https://scholarships.gov.in/portal/apply?scheme={scholarship.id}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--success-light)',
          color: 'var(--success-dark)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          <ShieldCheck size={14} />
          <span>EcoVault Connected</span>
        </div>
      </div>

      {/* 2. Main split view: Left Portal / Right Assistant */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Side: Mock Government Portal Form */}
        <div style={{
          flex: 1,
          padding: '40px',
          overflowY: 'auto',
          background: '#ffffff',
          position: 'relative'
        }}>
          {submitted ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              textAlign: 'center'
            }} className="animate-fade-in">
              <div style={{
                background: 'var(--success-light)',
                color: 'var(--success)',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <FileCheck size={40} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>Application Submitted Successfully!</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '380px' }}>
                Your details have been successfully transmitted to the National Scholarship Portal. EcoVault has recorded the submission.
              </p>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px' }}>
                Redirecting back to your ScholarMate Kanban Tracker...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '32px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>GOVERNMENT OF INDIA</span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>National Scholarship Portal (NSP) Form</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Scheme: <strong>{scholarship.title} ({scholarship.provider})</strong>
                </p>
              </div>

              {/* Personal Details Section */}
              <h4 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>1. Basic Demographics</h4>
              
              <div className="form-group" onClick={() => setActiveInput('fullName')}>
                <label className="form-label" htmlFor="browser-fullname">Applicant's Full Name (As in Class 10 Certificate)</label>
                <input
                  id="browser-fullname"
                  type="text"
                  className="form-input"
                  value={formValues.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    background: activeInput === 'fullName' ? 'rgba(2, 132, 199, 0.02)' : '#ffffff',
                    border: activeInput === 'fullName' ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" onClick={() => setActiveInput('gender')}>
                  <label className="form-label" htmlFor="browser-gender">Gender</label>
                  <select
                    id="browser-gender"
                    className="form-input"
                    value={formValues.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group" onClick={() => setActiveInput('category')}>
                  <label className="form-label" htmlFor="browser-category">Social Category</label>
                  <select
                    id="browser-category"
                    className="form-input"
                    value={formValues.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="EWS">EWS</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
              </div>

              {/* Academic & Financial */}
              <h4 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: '24px' }}>2. Academic & Income Profile</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" onClick={() => setActiveInput('gpa')}>
                  <label className="form-label" htmlFor="browser-gpa">Academic Score (CGPA / %)</label>
                  <input
                    id="browser-gpa"
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formValues.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    placeholder="e.g. 8.5"
                    required
                  />
                </div>

                <div className="form-group" onClick={() => setActiveInput('income')}>
                  <label className="form-label" htmlFor="browser-income">Family Annual Income Limit</label>
                  <select
                    id="browser-income"
                    className="form-input"
                    value={formValues.income}
                    onChange={(e) => handleInputChange('income', e.target.value)}
                    required
                  >
                    <option value="">Select Income Bracket</option>
                    <option value="Under ₹2.5 Lakhs">Under ₹2.5 Lakhs</option>
                    <option value="₹2.5L - ₹6L">₹2.5 Lakhs - ₹6 Lakhs</option>
                    <option value="₹6L - ₹8L">₹6 Lakhs - ₹8 Lakhs</option>
                    <option value="₹8 Lakhs+">₹8 Lakhs+</option>
                  </select>
                </div>
              </div>

              {/* File Attachments */}
              <h4 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginTop: '24px' }}>3. Required Documents Upload</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onClick={() => setActiveInput('attachedFiles')}>
                
                {/* Aadhaar File */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>1. Aadhaar Card Card (Identity)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formValues.attachedFiles.aadhaar ? (
                      <span style={{ color: 'var(--success)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Check size={14} /> Attached
                      </span>
                    ) : (
                      <button type="button" className="btn btn-secondary" onClick={() => handleAttachFile('aadhaar')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Attach PDF
                      </button>
                    )}
                  </div>
                </div>

                {/* Income File */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>2. Income Certificate (Tahsildar)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formValues.attachedFiles.income ? (
                      <span style={{ color: 'var(--success)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Check size={14} /> Attached
                      </span>
                    ) : (
                      <button type="button" className="btn btn-secondary" onClick={() => handleAttachFile('income')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Attach PDF
                      </button>
                    )}
                  </div>
                </div>

                {/* Domicile File */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>3. Domicile Certificate (Residency)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formValues.attachedFiles.domicile ? (
                      <span style={{ color: 'var(--success)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Check size={14} /> Attached
                      </span>
                    ) : (
                      <button type="button" className="btn btn-secondary" onClick={() => handleAttachFile('domicile')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Attach PDF
                      </button>
                    )}
                  </div>
                </div>

                {/* Caste File (SC/ST/OBC/EWS) */}
                {profile.category && profile.category !== 'General' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>4. Caste Certificate ({profile.category})</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {formValues.attachedFiles.caste ? (
                        <span style={{ color: 'var(--success)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <Check size={14} /> Attached
                        </span>
                      ) : (
                        <button type="button" className="btn btn-secondary" onClick={() => handleAttachFile('caste')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                          Attach PDF
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Submit Buttons */}
              <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', gap: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                  Cancel Application
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={submitting}>
                  {submitting ? 'Transmitting Data...' : 'Submit Application to Government'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: EcoVault Co-Pilot Assistant Panel */}
        <div style={{
          width: '380px',
          background: '#f8fafc',
          borderLeft: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          
          {/* Assistant Header */}
          <div style={{
            background: 'var(--primary-dark)',
            color: '#ffffff',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Design circle */}
            <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold' }}>S</div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Sarah (EcoVault Assistant)</h4>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>First-Gen Portal co-pilot active</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            
            {/* Assistant intro bubble */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '16px',
              position: 'relative'
            }}>
              <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                Hi {profile.name}! I have linked your <strong>EcoVault</strong> document package to this form. Click <strong>Autofill Form</strong> to fill out all demographic fields and attach your verified certificates in one tap!
              </p>
              
              {!autofilled && (
                <button 
                  onClick={handleAutofill} 
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    fontSize: '13px',
                    background: 'var(--primary)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Zap size={14} style={{ fill: '#ffffff' }} />
                  ⚡ Autofill Form with Vault
                </button>
              )}
            </div>

            {/* Input Guidance Section */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(2,132,199,0.02) 100%)',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h5 style={{ fontSize: '12px', color: 'var(--primary-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={14} />
                {guidance.title}
              </h5>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {guidance.content}
              </p>
            </div>

            {/* Documents matching checklist */}
            <div className="card" style={{ padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <h5 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-primary)', marginBottom: '14px' }}>
                Vault Attachment Controller
              </h5>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['aadhaar', 'income', 'domicile'].map(docId => {
                  const doc = getDocStatus(docId);
                  const isMissing = !doc || doc.status === 'Missing';
                  const isAttached = formValues.attachedFiles[docId];

                  return (
                    <div key={docId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {docId === 'aadhaar' ? 'Aadhaar Card' : docId === 'income' ? 'Income Certificate' : 'Domicile Certificate'}
                        </div>
                        <div style={{ fontSize: '10px', color: isMissing ? 'var(--danger)' : 'var(--text-muted)' }}>
                          {isMissing ? '❌ Missing in Vault' : `✅ ${doc.file.substring(0, 15)}...`}
                        </div>
                      </div>
                      
                      {isMissing ? (
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => {
                            handleAssistantUpload(docId);
                            alert(`Mock file uploaded to vault and attached!`);
                          }}
                          style={{ padding: '4px 8px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Upload size={10} /> Upload & Attach
                        </button>
                      ) : isAttached ? (
                        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Check size={12} /> Attached
                        </span>
                      ) : (
                        <button 
                          className="btn btn-secondary"
                          onClick={() => handleAttachFile(docId)}
                          style={{ padding: '4px 8px', fontSize: '10px' }}
                        >
                          Attach
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Secure indicator footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={12} color="var(--success)" /> End-to-End Secure DigiLocker Portal Connection
          </div>
        </div>

      </div>

    </div>
  );
}
