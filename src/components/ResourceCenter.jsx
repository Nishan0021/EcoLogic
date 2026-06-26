import React, { useState } from 'react';
import { GLOSSARY, FAQ } from '../data';
import { BookOpen, FileText, HelpCircle, Copy, Check } from 'lucide-react';

export default function ResourceCenter({ activeTerm, setActiveTerm }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedTemplate, setCopiedTemplate] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const emailTemplate = `Subject: Request for Letter of Recommendation - [Your Name] (Class 12 / Roll No. [Roll No])

Dear [Teacher's Name],

Hope you are doing well.

I am writing to request a Letter of Recommendation. I am applying for the [Scholarship Name] to support my undergraduate studies in [Your Major, e.g. Computer Engineering]. As I am a first-generation college student, securing this scholarship is critical for me to cover my college admission fees.

I thoroughly enjoyed learning [mention subject, e.g. Mathematics] in your class, particularly when we worked on [mention a project or favorite topic]. I would be highly grateful if you could write a recommendation supporting my academic dedication and character.

The deadline to upload the letter is [Date]. I have attached my Class 10/12 marksheets and a list of my co-curricular activities for your reference.

Thank you so much for your time and guidance!

Sincerely,
[Your Name]
[Contact Number]`;

  const bonafideTemplate = `To,
The Principal / Registrar,
[Name of College / School],
[City, State]

Subject: Application for Bonafide Student Certificate for Scholarship Portal

Respected Sir/Ma'am,

I, [Your Name], am a regular student of your college, currently studying in [Year, e.g. First Year B.Tech], Branch [Branch, e.g. Information Technology], Roll Number [Roll Number]. 

I am a first-generation college student and need to apply for the [Scholarship Name, e.g. AICTE Pragati Scholarship] on the National Scholarship Portal (NSP). For this application, I am required to upload an official Bonafide Student Certificate issued by the college.

I kindly request you to issue me a Bonafide Certificate at the earliest. I have attached my college ID card and recent fee receipt for verification.

Thank you.

Yours obediently,
[Your Name]
[Roll Number / Department]`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(key);
    setTimeout(() => setCopiedTemplate(''), 2000);
  };

  return (
    <div className="resource-center-view">
      <div className="dashboard-header">
        <h2>First-Gen Resource Center (India)</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Explore plain-language guides, official letter templates, and frequently asked questions about Indian scholarship portals.
        </p>
      </div>

      <div className="resources-grid">
        
        {/* Dictionary Panel */}
        <div className="jargon-dictionary">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '10px' }}>
            <BookOpen size={20} color="var(--primary)" /> Plain-English Dictionary
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
            Govt portals use complex terms. Click a word below to read its explanation in simple language.
          </p>

          <div className="glossary-terms-list">
            {GLOSSARY.map((item, index) => {
              const isActive = activeTerm === item.term;
              return (
                <div key={index} className="glossary-term-item">
                  <h4 
                    className="glossary-term-name"
                    onClick={() => setActiveTerm(isActive ? null : item.term)}
                    style={{ textDecoration: isActive ? 'underline' : 'none' }}
                  >
                    {item.term} {isActive ? '▼' : '►'}
                  </h4>
                  {isActive && (
                    <p className="glossary-term-definition" style={{ marginTop: '6px', padding: '12px', backgroundColor: 'var(--bg-app)', borderRadius: '8px', borderLeft: '4px solid var(--primary)', fontSize: '13.5px' }}>
                      {item.definition}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Guides & Templates Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* LoR Template Guide */}
          <div className="section-card" style={{ padding: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FileText size={20} color="var(--secondary)" /> Recommendation Letter Request Template
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
              Use this email format when requesting a letter of recommendation from your school teacher or college professor.
            </p>

            <div style={{ position: 'relative' }}>
              <pre style={{ 
                backgroundColor: 'var(--bg-app)', 
                padding: '16px', 
                borderRadius: '8px', 
                fontSize: '11px', 
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                maxHeight: '180px',
                border: '1px solid var(--border-color)'
              }}>
                {emailTemplate}
              </pre>
              <button 
                onClick={() => copyToClipboard(emailTemplate, 'lor')}
                style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px', 
                  border: 'none', 
                  background: 'white', 
                  boxShadow: 'var(--shadow-sm)',
                  borderRadius: '6px', 
                  width: '32px', 
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Copy Template"
              >
                {copiedTemplate === 'lor' ? <Check size={16} color="var(--success)" /> : <Copy size={16} color="var(--text-secondary)" />}
              </button>
            </div>
          </div>

          {/* Bonafide Request Template */}
          <div className="section-card" style={{ padding: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FileText size={20} color="var(--accent)" /> College Bonafide Request Letter
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
              Submit this letter to your college admin window to get your official Bonafide Certificate stamped.
            </p>

            <div style={{ position: 'relative' }}>
              <pre style={{ 
                backgroundColor: 'var(--bg-app)', 
                padding: '16px', 
                borderRadius: '8px', 
                fontSize: '11px', 
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                maxHeight: '180px',
                border: '1px solid var(--border-color)'
              }}>
                {bonafideTemplate}
              </pre>
              <button 
                onClick={() => copyToClipboard(bonafideTemplate, 'bonafide')}
                style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px', 
                  border: 'none', 
                  background: 'white', 
                  boxShadow: 'var(--shadow-sm)',
                  borderRadius: '6px', 
                  width: '32px', 
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Copy Template"
              >
                {copiedTemplate === 'bonafide' ? <Check size={16} color="var(--success)" /> : <Copy size={16} color="var(--text-secondary)" />}
              </button>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="section-card" style={{ padding: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <HelpCircle size={20} color="var(--warning)" /> FAQs for Indian Scholars
            </h3>
            
            <div className="faq-list">
              {FAQ.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <button 
                    className="faq-question"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '12px' }}>{openFaq === idx ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
