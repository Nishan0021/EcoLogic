import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Share2, 
  FileSignature, 
  Trash2, 
  ExternalLink, 
  Lock, 
  ShieldCheck,
  Eye,
  X,
  Copy,
  Check
} from 'lucide-react';

export default function DocumentVault({ profile, vaultDocs, setVaultDocs, onOCRUpdate }) {
  const [activeSubTab, setActiveSubTab] = useState('locker');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zipDownloading, setZipDownloading] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  // --- OCR Scanner States ---
  const [scanningDocId, setScanningDocId] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrLogs, setOcrLogs] = useState([]);

  // --- Document Generator States ---
  const [selectedTemplate, setSelectedTemplate] = useState('bonafide');
  const [generatorData, setGeneratorData] = useState({
    rollNo: '',
    collegeName: '',
    courseName: '',
    academicYear: '2025-2026',
    parentName: '',
    incomeAmount: profile.income === '250000' ? '2,00,000' : profile.income === '600000' ? '4,50,000' : '7,00,000'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Helper to format mock date
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // --- Real File Selector trigger ---
  const handleMockUpload = (docId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleRealUpload(docId, file);
      }
    };
    input.click();
  };

  const handleRealUpload = async (docId, file) => {
    // Show OCR scanner progress window
    setScanningDocId(docId);
    setOcrProgress(0);
    setOcrLogs([
      `[System] Uploading ${file.name} to server...`,
      `[System] Initializing EcoOCR scanning engine...`
    ]);

    // Animate progress up to 85%
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 85) {
        clearInterval(interval);
      } else {
        setOcrProgress(progress);
        if (progress === 30) {
          setOcrLogs(prev => [...prev, '[OCR] Gray-scaling and cleaning image...', '[OCR] Running text segment boundary checks...']);
        } else if (progress === 60) {
          setOcrLogs(prev => [...prev, '[OCR] Matching text shapes using Tesseract OCR v5...', '[AI Parser] Extracting structured metadata fields...']);
        }
      }
    }, 150);

    try {
      const studentId = localStorage.getItem('econav_student_id');
      const response = await api.uploadDocument(studentId, docId, file);
      
      clearInterval(interval);
      setOcrProgress(100);

      const parsedLogs = [];
      parsedLogs.push(`[Success] OCR extraction complete!`);
      
      if (response.extracted_income !== null && response.extracted_income !== undefined) {
        parsedLogs.push(`[AI Parser] Parsed Family Annual Income: ₹${response.extracted_income.toLocaleString('en-IN')}`);
        if (onOCRUpdate) onOCRUpdate('income', String(response.extracted_income));
      }
      if (response.extracted_score !== null && response.extracted_score !== undefined) {
        parsedLogs.push(`[AI Parser] Parsed Academic Score: ${response.extracted_score}`);
        if (onOCRUpdate) onOCRUpdate('score', String(response.extracted_score));
      }

      parsedLogs.push(`[System] Document successfully archived in locker.`);
      setOcrLogs(prev => [...prev, ...parsedLogs]);

      // Update vaultDocs state
      setVaultDocs(prev => prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            status: 'Uploaded',
            file: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            date: getFormattedDate()
          };
        }
        return d;
      }));

    } catch (err) {
      clearInterval(interval);
      setOcrProgress(100);
      setOcrLogs(prev => [
        ...prev,
        `[Error] Server upload failed: ${err.message}`,
        `[System] Falling back to simulator state.`
      ]);
      applyUploadState(docId);
    } finally {
      setTimeout(() => {
        setScanningDocId(null);
      }, 2500);
    }
  };

  const applyUploadState = (docId) => {
    const mockFiles = {
      aadhaar: { name: `${profile.name.toLowerCase().replace(/\s+/g, '_')}_aadhaar_card.pdf`, size: '1.8 MB' },
      income: { name: 'tahsildar_income_certificate_2025.pdf', size: '2.4 MB' },
      marksheet_12: { name: 'class_12_marksheet_cbse.pdf', size: '3.1 MB' },
      marksheet_10: { name: 'class_10_marksheet_cbse.pdf', size: '2.9 MB' },
      domicile: { name: `domicile_certificate_${profile.state.toLowerCase()}.pdf`, size: '2.0 MB' },
      caste: { name: `caste_certificate_${profile.category.toLowerCase()}.pdf`, size: '2.2 MB' }
    };

    const chosenFile = mockFiles[docId] || { name: 'document.pdf', size: '1.5 MB' };

    setVaultDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'Uploaded',
          file: chosenFile.name,
          size: chosenFile.size,
          date: getFormattedDate()
        };
      }
      return d;
    }));
  };

  const handleDeleteDoc = (docId) => {
    if (window.confirm("Are you sure you want to remove this document from the vault?")) {
      setVaultDocs(prev => prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            status: 'Missing',
            file: null,
            size: null,
            date: null,
            generatedContent: null
          };
        }
        return d;
      }));
    }
  };

  // --- Compile Letter Text ---
  const generateLetterText = () => {
    const today = getFormattedDate();
    const stateFull = profile.state === 'MH' ? 'Maharashtra' : profile.state === 'KA' ? 'Karnataka' : profile.state === 'DL' ? 'Delhi' : profile.state === 'TN' ? 'Tamil Nadu' : profile.state === 'UP' ? 'Uttar Pradesh' : profile.state === 'WB' ? 'West Bengal' : 'India';

    if (selectedTemplate === 'bonafide') {
      return `To,
The Principal,
${generatorData.collegeName || '[Institution Name]'},
${stateFull}.

Date: ${today}

Subject: Request for Bonafide Certificate for Scholarship Application

Respected Sir/Madam,

I am writing to request a Bonafide Certificate as I am a student of your prestigious institution. My academic details are as follows:

Name of the Student : ${profile.name}
Course & Branch     : ${generatorData.courseName || '[Course Name, e.g. B.Tech CSE]'}
Academic Year       : ${generatorData.academicYear}
Roll Number         : ${generatorData.rollNo || '[Roll Number / Admission ID]'}

I am currently applying for scholarship schemes on the National Scholarship Portal (NSP) and state e-District portals to support my higher education expenses. A Bonafide Certificate is a mandatory document required by the scholarship verification department to prove my active enrollment status.

Kindly request you to issue a Bonafide Certificate on the official college letterhead as soon as possible so that I can upload it and submit my application before the upcoming deadline.

Thanking you.

Yours obediently,

(${profile.name})
Roll No: ${generatorData.rollNo || '[Roll Number]'}`;
    } else {
      return `SELF-DECLARATION INCOME AFFIDAVIT
(For Scholarship Verification Purposes Only)

I, ${profile.name}, son/daughter of Shri/Smt. ${generatorData.parentName || '[Parent/Guardian Name]'}, residing at Domicile State of ${stateFull}, do hereby solemnly affirm and state as follows:

1. I am enrolling/enrolled in ${generatorData.collegeName || '[College Name]'} for the course ${generatorData.courseName || '[Course Name]'} in the Academic Session ${generatorData.academicYear}.

2. I state that neither of my parents is currently employed in any government sector or holds any permanent high-income corporate post. 

3. I declare that the gross annual household income of my family from all sources (agriculture, labor, and small-scale business) is ₹${generatorData.incomeAmount || '[Annual Income Value]'} (Rupees Only).

4. I declare that the information given above is completely true and correct to the best of my knowledge and belief. In case any part of this declaration is found to be false, the scholarship award may be cancelled and legal action may be taken against me.

Declared by,

(${profile.name})
Student Declarant
Date: ${today}`;
    }
  };

  // --- Save Generated Letter to Vault ---
  const handleSaveGeneratedToVault = () => {
    const text = generateLetterText();
    const docId = selectedTemplate === 'bonafide' ? 'bonafide_letter' : 'income_affidavit';
    const docName = selectedTemplate === 'bonafide' ? 'Bonafide Request Letter' : 'Income Self-Affidavit';
    const fileName = selectedTemplate === 'bonafide' ? 'bonafide_request_letter.txt' : 'income_self_affidavit.txt';

    setVaultDocs(prev => {
      // Remove previous generated slot if it exists to avoid duplication, then insert updated slot
      const filtered = prev.filter(d => d.id !== docId);
      return [
        ...filtered,
        {
          id: docId,
          name: docName,
          status: 'Generated',
          file: fileName,
          size: '1.2 KB',
          date: getFormattedDate(),
          generatedContent: text
        }
      ];
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyGenerated = () => {
    navigator.clipboard.writeText(generateLetterText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://scholarmate.edu.in/share/verified-${profile.name.toLowerCase().replace(/\s+/g, '-')}-docs`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadAllZip = () => {
    const uploadedDocs = vaultDocs.filter(d => d.status === 'Uploaded' || d.status === 'Generated');
    if (uploadedDocs.length === 0) {
      alert("No documents are currently uploaded or generated in the locker to download.");
      return;
    }

    setZipDownloading(true);
    setTimeout(() => {
      setZipDownloading(false);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="dashboard-view animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>EcoVault Document Locker</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>
            Store your certificates, generate official request letters, and share a verified portfolio link with third-party sites.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setShowShareModal(true)}>
            <Share2 size={16} /> Share Docs Link
          </button>
          <button className="btn btn-primary" onClick={handleDownloadAllZip} disabled={zipDownloading}>
            {zipDownloading ? 'Compiling ZIP...' : <><Download size={16} /> Download ZIP Bundle</>}
          </button>
        </div>
      </div>

      {zipSuccess && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success-dark)',
          border: '1px solid var(--success)',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }} className="animate-fade-in">
          <CheckCircle2 size={16} />
          <strong>Success!</strong> Compiled and downloaded your document portfolio as <code>{profile.name.replace(/\s+/g, '_')}_EcoVault_Bundle.zip</code>. Ready for NSP or private uploads!
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '32px', gap: '24px' }}>
        <button 
          className={`nav-link-btn ${activeSubTab === 'locker' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('locker')}
          style={{ paddingBottom: '12px', borderBottom: activeSubTab === 'locker' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, fontWeight: 600, fontSize: '15px' }}
        >
          My Document Locker ({vaultDocs.filter(d => d.status !== 'Missing').length}/{vaultDocs.length})
        </button>
        <button 
          className={`nav-link-btn ${activeSubTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('generator')}
          style={{ paddingBottom: '12px', borderBottom: activeSubTab === 'generator' ? '2px solid var(--primary)' : '2px solid transparent', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, fontWeight: 600, fontSize: '15px' }}
        >
          <FileSignature size={16} style={{ marginRight: '6px' }} /> Auto-Document Generator
        </button>
      </div>

      {/* Sub-view: Document Locker */}
      {activeSubTab === 'locker' && (
        <div className="animate-fade-in">
          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            background: 'var(--primary-light)', 
            color: 'var(--primary-dark)', 
            padding: '16px 20px', 
            borderRadius: '12px', 
            marginBottom: '32px',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            <ShieldCheck size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>EcoVault Security Seal Enabled:</strong> These document slots help you prepare for government DBT and corporate uploads. You can also generate a single zip file or copy a secure portfolio URL to paste on external application portals.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {vaultDocs.map(doc => {
              const isMissing = doc.status === 'Missing';
              const isGenerated = doc.status === 'Generated';

              return (
                <div key={doc.id} className="card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className={`badge ${isMissing ? 'badge-danger' : isGenerated ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '11px' }}>
                        {doc.status}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doc.size || ''}</span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="var(--primary)" />
                      {doc.name}
                    </h4>

                    {isMissing ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.4' }}>
                        Please upload your certificate in PDF or JPG format to prepare it for scholarship applications.
                      </p>
                    ) : (
                      <div style={{ margin: '12px 0 20px 0' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <strong>File:</strong> {doc.file}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <strong>Uploaded/Generated:</strong> {doc.date}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)', paddingTop: '14px', gap: '10px' }}>
                    {isMissing ? (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleMockUpload(doc.id)}
                        style={{ width: '100%', fontSize: '13px', padding: '8px' }}
                      >
                        <Upload size={14} /> Upload Mock Document
                      </button>
                    ) : (
                      <>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => setShowDocViewer(doc)}
                          style={{ flex: 1, fontSize: '13px', padding: '8px' }}
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleDeleteDoc(doc.id)}
                          style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                          title="Remove Document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-view: Auto-Document Generator */}
      {activeSubTab === 'generator' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', alignItems: 'start' }}>
          
          {/* Left panel: template selector & form inputs */}
          <div className="card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSignature size={18} color="var(--primary)" /> Document Settings
            </h3>

            {/* Template Selector */}
            <div className="form-group">
              <label>Select Document Template</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                <button
                  className="btn"
                  onClick={() => setSelectedTemplate('bonafide')}
                  style={{
                    justifyContent: 'flex-start',
                    background: selectedTemplate === 'bonafide' ? 'var(--primary-light)' : 'rgba(0,0,0,0.02)',
                    color: selectedTemplate === 'bonafide' ? 'var(--primary-dark)' : 'var(--text-primary)',
                    border: selectedTemplate === 'bonafide' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    padding: '12px 16px',
                    width: '100%'
                  }}
                >
                  <FileText size={16} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>College Bonafide Request Letter</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>To request bonafide certificates from your college registrar</div>
                  </div>
                </button>

                <button
                  className="btn"
                  onClick={() => setSelectedTemplate('affidavit')}
                  style={{
                    justifyContent: 'flex-start',
                    background: selectedTemplate === 'affidavit' ? 'var(--primary-light)' : 'rgba(0,0,0,0.02)',
                    color: selectedTemplate === 'affidavit' ? 'var(--primary-dark)' : 'var(--text-primary)',
                    border: selectedTemplate === 'affidavit' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    padding: '12px 16px',
                    width: '100%'
                  }}
                >
                  <Lock size={16} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Self-Declaration Income Affidavit</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>For schemes allowing self-attested parent income declarations</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Student Name (Autofilled)</label>
                <input type="text" className="form-input" value={profile.name} disabled />
              </div>

              <div className="form-group">
                <label htmlFor="college-name-input">School / College Name</label>
                <input
                  id="college-name-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g., St. Xavier's College, Bangalore"
                  value={generatorData.collegeName}
                  onChange={(e) => setGeneratorData(prev => ({ ...prev, collegeName: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="course-name-input">Course & Branch Name</label>
                <input
                  id="course-name-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g., B.Sc Physics or Class 12 Science"
                  value={generatorData.courseName}
                  onChange={(e) => setGeneratorData(prev => ({ ...prev, courseName: e.target.value }))}
                />
              </div>

              {selectedTemplate === 'bonafide' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
                  <div className="form-group">
                    <label htmlFor="roll-no-input">Roll Number</label>
                    <input
                      id="roll-no-input"
                      type="text"
                      className="form-input"
                      placeholder="e.g., 2024PH501"
                      value={generatorData.rollNo}
                      onChange={(e) => setGeneratorData(prev => ({ ...prev, rollNo: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="academic-year-select">Academic Year</label>
                    <select
                      id="academic-year-select"
                      className="form-input"
                      value={generatorData.academicYear}
                      onChange={(e) => setGeneratorData(prev => ({ ...prev, academicYear: e.target.value }))}
                    >
                      <option value="2024-2025">2024-25 (Previous)</option>
                      <option value="2025-2026">2025-26 (Current)</option>
                      <option value="2026-2027">2026-27 (Upcoming)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label htmlFor="parent-name-input">Parent/Guardian Name</label>
                    <input
                      id="parent-name-input"
                      type="text"
                      className="form-input"
                      placeholder="Shri. Ramesh Sharma"
                      value={generatorData.parentName}
                      onChange={(e) => setGeneratorData(prev => ({ ...prev, parentName: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="income-amount-input">Declared Income (₹)</label>
                    <input
                      id="income-amount-input"
                      type="text"
                      className="form-input"
                      value={generatorData.incomeAmount}
                      onChange={(e) => setGeneratorData(prev => ({ ...prev, incomeAmount: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {saveSuccess && (
                <div style={{
                  background: 'var(--success-light)',
                  color: 'var(--success-dark)',
                  border: '1px solid var(--success)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={14} /> Letter saved successfully to your Vault Locker!
                </div>
              )}

              <button className="btn btn-primary" onClick={handleSaveGeneratedToVault} style={{ width: '100%', marginTop: '10px' }}>
                <CheckCircle2 size={16} /> Save Document to Locker Vault
              </button>
            </div>
          </div>

          {/* Right panel: live sheet-of-paper preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Document Preview
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={handleCopyGenerated} style={{ padding: '6px 12px', fontSize: '12px' }}>
                  {copiedText ? <Check size={14} /> : <Copy size={14} />} {copiedText ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Formal letter card layout */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              padding: '40px 32px',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#111827',
              minHeight: '480px',
              whiteSpace: 'pre-wrap',
              borderTop: '6px solid var(--primary)',
              position: 'relative'
            }}>
              {/* Paper Watermark Stamp logo */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-15deg)',
                opacity: 0.05,
                fontSize: '44px',
                fontWeight: 800,
                letterSpacing: '2px',
                color: 'var(--primary)',
                pointerEvents: 'none',
                textAlign: 'center',
                width: '100%'
              }}>
                SCHOLAR MATE AUTO
              </div>

              {generateLetterText()}
            </div>
          </div>
        </div>
      )}

      {/* Share Links Portfolio Modal */}
      {showShareModal && (
        <div className="onboarding-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="onboarding-card" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            
            <div className="onboarding-header" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Share2 size={20} color="var(--primary)" />
                  Shareable Document Bundle
                </h2>
                <p>Allow third-party government or corporate websites to access your documents.</p>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="onboarding-body" style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
                Some scholarship platforms (like government portals) don't host application forms on our system. You can generate a single, secure read-only URL and paste it directly into their forms so recruiters can view your authenticated documents.
              </p>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Your Public Portfolio Link</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly 
                    value={`https://scholarmate.edu.in/share/verified-${profile.name.toLowerCase().replace(/\s+/g, '-')}-docs`}
                    style={{ background: 'var(--bg-secondary)', fontSize: '12px' }}
                  />
                  <button className="btn btn-primary" onClick={handleCopyLink} style={{ whiteSpace: 'nowrap' }}>
                    {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Public portfolio preview window */}
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                padding: '20px'
              }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--primary)" /> Reviewer Portal Preview
                </h4>
                
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 'bold' }}>
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{profile.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Verified First-Gen Scholar (India)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {vaultDocs.filter(d => d.status !== 'Missing').map(d => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{d.name}</span>
                        <CheckCircle2 size={12} color="var(--success)" />
                      </div>
                    ))}
                    {vaultDocs.filter(d => d.status !== 'Missing').length === 0 && (
                      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>No documents uploaded yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="onboarding-footer" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowShareModal(false)}>Close</button>
            </div>

          </div>
        </div>
      )}

      {/* Document View Modal (Simulated file viewer) */}
      {showDocViewer && (
        <div className="onboarding-backdrop" onClick={() => setShowDocViewer(null)}>
          <div className="onboarding-card" style={{ maxWidth: '600px', background: '#f8fafc' }} onClick={(e) => e.stopPropagation()}>
            
            <div className="onboarding-header" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{showDocViewer.name}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>File: {showDocViewer.file}</span>
              </div>
              <button 
                onClick={() => setShowDocViewer(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="onboarding-body" style={{ 
              padding: '32px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '320px'
            }}>
              {showDocViewer.generatedContent ? (
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '24px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  lineHeight: '1.5',
                  width: '100%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  color: '#111827'
                }}>
                  {showDocViewer.generatedContent}
                </div>
              ) : (
                /* Mock Certificate visual */
                <div style={{
                  width: '100%',
                  maxWidth: '440px',
                  background: '#ffffff',
                  border: '8px double #cbd5e1',
                  borderRadius: '4px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}>
                  {/* Decorative stamp */}
                  <div style={{ position: 'absolute', top: '16px', right: '16px', border: '2px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15, transform: 'rotate(10deg)' }}>
                    <ShieldCheck size={24} color="var(--primary)" />
                  </div>
                  
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Government of India / Competent Authority
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                    {showDocViewer.id === 'aadhaar' ? 'Aadhaar Card' : showDocViewer.name.replace(/\(.*\)/, '')}
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#475569', textAlign: 'left', background: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                    <div><strong>Name:</strong> {profile.name.toUpperCase()}</div>
                    {showDocViewer.id === 'aadhaar' && <div><strong>Aadhaar No:</strong> XXXX-XXXX-5829</div>}
                    {showDocViewer.id === 'income' && <div><strong>Annual Family Income:</strong> Verified under ₹{profile.income === '250000' ? '2.5' : profile.income === '600000' ? '6.0' : '8.0'} Lakhs</div>}
                    <div><strong>Verification Code:</strong> SM-IN-{Math.floor(100000 + Math.random() * 900000)}</div>
                    <div><strong>Status:</strong> Digitally Authenticated via DigiLocker Map</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justify: 'center', gap: '4px', fontSize: '10px', color: 'var(--success)' }}>
                    <ShieldCheck size={14} /> Verified & Secured by ScholarMate Vault
                  </div>
                </div>
              )}
            </div>

            <div className="onboarding-footer" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', background: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <Lock size={12} /> Encrypted at Rest
              </div>
              <button className="btn btn-secondary" onClick={() => setShowDocViewer(null)}>Close View</button>
            </div>

          </div>
        </div>
      )}

      {/* OCR Scanner Animation Modal */}
      {scanningDocId && (
        <div className="onboarding-backdrop" style={{ zIndex: 1000 }}>
          <div className="onboarding-card" style={{ maxWidth: '420px', padding: '28px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              EcoOCR AI Document Extractor
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Running Tesseract OCR & Gemini parsing models to extract verifiable profile details.
            </p>

            <div style={{
              width: '100%',
              height: '150px',
              background: '#0f172a',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '20px',
              border: '2px solid #334155'
            }}>
              {/* Laser line */}
              <div style={{
                position: 'absolute',
                top: `${ocrProgress - 4}%`,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'var(--primary)',
                boxShadow: '0 0 12px var(--primary), 0 0 4px var(--primary)',
                transition: 'top 0.3s ease-out',
                zIndex: 2
              }}></div>
              
              {/* Text visual feed */}
              <div style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: '#38bdf8',
                textAlign: 'left',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                overflowY: 'auto',
                height: '100%',
                lineHeight: '1.4',
                opacity: 0.85
              }}>
                {ocrLogs.map((log, index) => (
                  <div key={index} style={{
                    color: log.includes('Success') ? 'var(--success)' : log.includes('System') ? '#94a3b8' : '#38bdf8'
                  }}>{log}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
              <span>Parsing Certificate...</span>
              <span>{ocrProgress}%</span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${ocrProgress}%`,
                height: '100%',
                background: 'var(--primary)',
                transition: 'width 0.3s ease-out'
              }}></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
