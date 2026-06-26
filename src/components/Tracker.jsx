import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function Tracker({ scholarships, savedScholarships, applications, onStartApplication, onSubmitApplication, onOpenDetail, onRemoveSaved }) {
  
  // Categorize scholarships into status buckets
  const notStarted = [];
  const inProgress = [];
  const submitted = [];
  const expired = [];

  const currentDate = new Date();

  // Find all scholarships that are either saved OR have an application state
  const trackedIds = Array.from(new Set([...savedScholarships, ...Object.keys(applications)]));

  trackedIds.forEach(id => {
    const sch = scholarships.find(s => s.id === id);
    if (!sch) return;

    const app = applications[id];
    const status = app?.status || 'Not Started';
    const isPastDeadline = new Date(sch.deadline) < currentDate;

    if (isPastDeadline && status !== 'Submitted') {
      expired.push({ ...sch, status: 'Expired', app });
    } else if (status === 'Submitted') {
      submitted.push({ ...sch, status: 'Submitted', app });
    } else if (status === 'In Progress') {
      inProgress.push({ ...sch, status: 'In Progress', app });
    } else {
      notStarted.push({ ...sch, status: 'Not Started', app });
    }
  });

  const getDaysLeft = (deadlineStr) => {
    const diffTime = new Date(deadlineStr) - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderKanbanCard = (sch) => {
    const daysLeft = getDaysLeft(sch.deadline);
    const app = applications[sch.id];
    
    // Checklist progress
    let completedCount = 0;
    let totalCount = sch.requirements.length;
    if (app && app.checklist) {
      completedCount = Object.keys(app.checklist).filter(reqId => app.checklist[reqId]).length;
    }
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
      <div key={sch.id} className="kanban-card" onClick={() => onOpenDetail(sch.id)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          <span>{sch.provider}</span>
          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{sch.amountFormatted}</span>
        </div>
        
        <h4 className="kanban-card-title">{sch.title}</h4>

        {sch.status === 'In Progress' && (
          <div style={{ margin: '8px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Tasks</span>
              <span>{completedCount}/{totalCount} ({percent}%)</span>
            </div>
            <div className="kanban-card-progress">
              <div className="kanban-card-progress-fill" style={{ width: `${percent}%`, backgroundColor: percent === 100 ? 'var(--success)' : 'var(--primary)' }}></div>
            </div>
          </div>
        )}

        <div className="kanban-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: daysLeft <= 15 && sch.status !== 'Submitted' ? 'var(--error)' : 'var(--text-secondary)' }}>
            <Calendar size={12} />
            {daysLeft < 0 ? 'Expired' : `${daysLeft}d left`}
          </span>

          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '800' }}>
            {sch.status}
          </span>
        </div>

        {/* Access buttons within card */}
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          {sch.status === 'Not Started' && (
            <>
              <button 
                className="btn-text" 
                style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'white' }}
                onClick={() => onStartApplication(sch.id)}
              >
                Start App
              </button>
              <button 
                className="btn-text" 
                style={{ fontSize: '12px', color: 'var(--error)', marginLeft: 'auto' }}
                onClick={() => onRemoveSaved(sch.id)}
              >
                Remove
              </button>
            </>
          )}
          {sch.status === 'In Progress' && (
            <button 
              className="btn-text" 
              style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--success-light)', color: 'var(--success-dark)' }}
              onClick={() => onSubmitApplication(sch.id)}
              disabled={percent < 100}
              title={percent < 100 ? "Complete all requirements first!" : ""}
            >
              Submit App
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tracker-view">
      <div className="dashboard-header">
        <h2>Deadline & Application Tracker</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Move applications step-by-step from saved to submitted. Complete items on your checklists and submit ahead of deadlines.
        </p>
      </div>

      <div className="kanban-board">
        {/* Not Started */}
        <div className="kanban-column">
          <div className="kanban-column-header">
            <span className="kanban-column-title" style={{ color: 'var(--text-secondary)' }}>
              <Clock size={16} /> Saved
            </span>
            <span className="kanban-column-count">{notStarted.length}</span>
          </div>
          <div className="kanban-cards">
            {notStarted.length > 0 ? (
              notStarted.map(renderKanbanCard)
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '24px 0' }}>
                No saved scholarships.
              </div>
            )}
          </div>
        </div>

        {/* In Progress */}
        <div className="kanban-column" style={{ borderTop: '3px solid var(--warning)' }}>
          <div className="kanban-column-header">
            <span className="kanban-column-title" style={{ color: 'var(--warning-dark)' }}>
              <RefreshCw size={16} className="spin-icon" style={{ animation: 'spin 4s linear infinite' }} /> In Progress
            </span>
            <span className="kanban-column-count" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning-dark)' }}>
              {inProgress.length}
            </span>
          </div>
          <div className="kanban-cards">
            {inProgress.length > 0 ? (
              inProgress.map(renderKanbanCard)
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '24px 0' }}>
                Start an application to track steps.
              </div>
            )}
          </div>
        </div>

        {/* Submitted */}
        <div className="kanban-column" style={{ borderTop: '3px solid var(--success)' }}>
          <div className="kanban-column-header">
            <span className="kanban-column-title" style={{ color: 'var(--success-dark)' }}>
              <CheckCircle2 size={16} /> Submitted
            </span>
            <span className="kanban-column-count" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-dark)' }}>
              {submitted.length}
            </span>
          </div>
          <div className="kanban-cards">
            {submitted.length > 0 ? (
              submitted.map(renderKanbanCard)
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '24px 0' }}>
                No applications submitted yet.
              </div>
            )}
          </div>
        </div>

        {/* Expired */}
        <div className="kanban-column" style={{ borderTop: '3px solid var(--error)' }}>
          <div className="kanban-column-header">
            <span className="kanban-column-title" style={{ color: 'var(--error-dark)' }}>
              <AlertTriangle size={16} /> Expired
            </span>
            <span className="kanban-column-count" style={{ backgroundColor: 'var(--error-light)', color: 'var(--error-dark)' }}>
              {expired.length}
            </span>
          </div>
          <div className="kanban-cards">
            {expired.length > 0 ? (
              expired.map(renderKanbanCard)
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '24px 0' }}>
                No expired applications.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
