import React from 'react';
import { GraduationCap, Award, ClipboardList, BookOpen, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomeScreen({ onStart }) {
  const highlights = [
    {
      icon: <Award size={24} className="welcome-feature-icon" style={{ color: 'var(--success)' }} />,
      title: "Smart Matching",
      desc: "Get matched to scholarships based on your academic score, category caste, domicile state, and family income."
    },
    {
      icon: <ClipboardList size={24} className="welcome-feature-icon" style={{ color: 'var(--primary)' }} />,
      title: "Task-by-Task Tracker",
      desc: "Never miss a deadline. Break down applications into a checklist of documents, essays, and references."
    },
    {
      icon: <BookOpen size={24} className="welcome-feature-icon" style={{ color: 'var(--accent)' }} />,
      title: "Plain-English Glossary",
      desc: "No more confusing administrative jargon. Understand terms like Bonafide Stamps and Tehsildar Certificates instantly."
    },
    {
      icon: <MessageSquare size={24} className="welcome-feature-icon" style={{ color: 'var(--secondary)' }} />,
      title: "Mentor Advisor",
      desc: "Receive guidance, request letter templates, and get your essay drafts reviewed by a college advisor."
    }
  ];

  return (
    <div className="onboarding-backdrop">
      <div className="welcome-screen-card">
        <div className="welcome-screen-header">
          <div className="welcome-logo-glow">
            <GraduationCap size={44} color="white" />
          </div>
          <h1>Scholar Mate</h1>
          <p className="welcome-subtitle">
            <Sparkles size={14} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} />
            The First-Gen College Scholar Navigator (India)
          </p>
        </div>

        <div className="welcome-screen-body">
          <p className="welcome-intro-text">
            Paving the path to higher education can be confusing when you are doing it for the first time in your family. 
            We are here to explain the rules, organize your documents, and guide you through every application step.
          </p>

          <div className="welcome-features-grid">
            {highlights.map((item, idx) => (
              <div key={idx} className="welcome-feature-card">
                <div className="welcome-feature-icon-wrapper">
                  {item.icon}
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="welcome-screen-footer">
          <button className="btn-primary welcome-cta-btn" onClick={onStart}>
            Get Started
            <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
