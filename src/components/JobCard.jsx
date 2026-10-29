import React from 'react';

 function JobCard({ job, onViewDetails }) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 p-2 transition-hover" style={{ backgroundColor: '#ffffff', transition: 'transform 0.2s' }}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold text-dark">{job.title}</h5>
          <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill small">{job.type}</span>
        </div>
        <h6 className="card-subtitle mb-3 text-muted fw-semibold">🏢 {job.company}</h6>
        <p className="card-text text-secondary small mb-4">📍 {job.location}</p>
        <button 
          className="mt-auto btn btn-outline-primary btn-sm rounded-pill fw-semibold py-2"
          onClick={() => onViewDetails(job)}
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
export default JobCard;