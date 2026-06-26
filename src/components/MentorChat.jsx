import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { MOCK_MENTOR_CHAT } from '../data';

export default function MentorChat({ messages, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Indian context fast suggestions
  const suggestions = [
    "How to get a Tehsildar Income Certificate?",
    "What is Aadhaar Bank Account Seeding?",
    "How to request a Bonafide Certificate?",
    "Can you review my Pragati scholarship essay?"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Send user message
    onSendMessage({
      sender: 'student',
      time: new Date().toISOString(),
      text: textToSend
    });
    
    setInputText('');

    // Trigger mock response after a small delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerText = textToSend.toLowerCase();
      let reply = "That is a great query! Navigating government portals and revenue offices can be confusing, but you're doing an amazing job. Tell me more, or check the Resource Center for definitions!";

      if (lowerText.includes('essay') || lowerText.includes('draft') || lowerText.includes('review')) {
        if (textToSend.split(/\s+/).length > 20) {
          reply = "Wow, what a powerful draft! I love how you shared your personal story and family motivation. To make it even stronger: 1. Clearly explain how the scholarship funds will cover your B.Tech/B.Sc expenses (like fees or hostel). 2. Make sure to double check that you mention your goals for helping your community. This is an excellent draft!";
        } else {
          reply = "I would be happy to review your scholarship statement! Please paste your draft essay here. I'll read it and give you suggestions on structure, opening hook, and wording.";
        }
      } else if (lowerText.includes('income') || lowerText.includes('tehsildar') || lowerText.includes('certificate')) {
        reply = "To get an official Income Certificate, you must apply through your state's online portal (like Mahaonline in Maharashtra, e-District in Delhi/UP, Seva Sindhu in Karnataka) or visit your nearest Maha e-Seva Kendra / Common Service Centre (CSC). You will need your parents' Aadhaar card, ration card, land record details, or a salary declaration signed by the local Panchayat head/Tahsildar.";
      } else if (lowerText.includes('aadhaar') || lowerText.includes('seeding') || lowerText.includes('link') || lowerText.includes('dbt')) {
        reply = "Aadhaar Seeding links your bank account to your 12-digit Aadhaar card so that DBT (Direct Benefit Transfer) funds arrive securely. To do this, download the 'Aadhaar Seeding Form', fill it out, and submit it at your bank branch. Ask them to verify it on their NPCI mapper portal. You can check the status on the UIDAI portal under 'Aadhaar Bank Seeding Status'.";
      } else if (lowerText.includes('bonafide') || lowerText.includes('stamp') || lowerText.includes('college')) {
        reply = "A Bonafide Certificate is issued by your college administrative department. Write a simple request letter (we have a copy-paste template in the Resource Center!), attach your college ID and admission fee receipt, and submit it at the clerk's counter. It usually takes 2-3 working days to get signed by the Principal/Registrar.";
      } else if (lowerText.includes('nsp') || lowerText.includes('portal') || lowerText.includes('national')) {
        reply = "The National Scholarship Portal (NSP) is the central government portal. You need to register as a 'New Student', input your details (Aadhaar, bank IFSC, domicile), and select the scheme you qualify for. Make sure to double check your bank details—an error there can stop your scholarship payments!";
      }

      onSendMessage({
        sender: 'mentor',
        time: new Date().toISOString(),
        text: reply
      });
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(inputText);
    }
  };

  return (
    <div className="mentor-chat-view">
      <div className="dashboard-header">
        <h2>Mentor & Counselor Support</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Ask Sarah questions about document applications, government scholarship portals, or paste your essays for live feedback.
        </p>
      </div>

      <div className="chat-container">
        
        {/* Sidebar contacts list */}
        <div className="chat-contacts">
          <div className="chat-contacts-header">Your Mentors</div>
          <div className="contact-item active">
            <div className="contact-avatar">
              S
              <div className="online-indicator"></div>
            </div>
            <div className="contact-info">
              <div className="contact-name">Sarah Jenkins</div>
              <div className="contact-role">First-Gen Advisor</div>
            </div>
          </div>
        </div>

        {/* Main conversation pane */}
        <div className="chat-main">
          
          <div className="chat-header">
            <div className="contact-avatar" style={{ width: '40px', height: '40px', fontSize: '15px' }}>S</div>
            <div>
              <div className="profile-name">Sarah Jenkins</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--success)' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--success)', borderRadius: '50%' }}></div>
                Active Now • First-Gen Advisor
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message-bubble ${msg.sender}`}
              >
                <div>{msg.text}</div>
                <div className="message-time">
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-bubble mentor" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sarah is typing</span>
                <span className="dot" style={{ animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0s' }}>•</span>
                <span className="dot" style={{ animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.2s' }}>•</span>
                <span className="dot" style={{ animation: 'bounce 1.4s infinite ease-in-out', animationDelay: '0.4s' }}>•</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-suggestions">
            {suggestions.map((sug, idx) => (
              <button 
                key={idx} 
                className="chat-suggestion-chip"
                onClick={() => handleSend(sug)}
              >
                {sug}
              </button>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask Sarah about Tehsildar certificates, NSP portal rules, or paste your essays..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button 
              className="btn-send"
              onClick={() => handleSend(inputText)}
            >
              <Send size={18} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
