import React from 'react';

 function Navbar({ setView }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient shadow-sm mb-4" style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '12px 20px' }}>
      <span className="navbar-brand fw-bold fs-4 text-white">🚀Job Portal</span>
      <div className="ms-auto">
        <button className="btn btn-outline-light btn-sm px-3 me-2 rounded-pill" onClick={() => setView('home')}>
          🏠 Home
        </button>
        <button className="btn btn-light btn-sm px-3 rounded-pill text-dark fw-bold shadow-sm" onClick={() => setView('add')}>
          + Post a Job
        </button>
      </div>
    </nav>
  );
}
export default Navbar;