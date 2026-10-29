import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JobCard from './components/JobCard';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  // View States ('home', 'detail', 'add')
  const [view, setView] = useState('home');
  const [selectedJob, setSelectedJob] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ title: '', company: '', location: '', type: 'Full-Time', description: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs data.');
        return res.json();
      })
      .then((data) => {
        const formattedJobs = data.slice(0, 15).map((item, index) => ({
          id: item.id,
          title: item.title.slice(0, 25),
          company: `Tech Corp ${index + 1}`,
          location: index % 2 === 0 ? 'Karachi' : 'Remote',
          type: index % 3 === 0 ? 'Full-Time' : 'Part-Time',
          description: item.body
        }));
        setJobs(formattedJobs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleAddJobSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setFormError('Bhai, saare fields fill karna lazmi hain!');
      setFormSuccess('');
      return;
    }
    setFormError('');
    const newJobItem = { id: jobs.length + 1, ...formData };
    setJobs([newJobItem, ...jobs]);
    setFormSuccess('Job kamyabi ke sath add ho gayi hai!');
    setFormData({ title: '', company: '', location: '', type: 'Full-Time', description: '' });
  };

  if (loading) return <div className="text-center mt-5 py-5"><h3>Loading jobs, zara sabar karein... ⏳</h3></div>;
  if (error) return <div className="text-center mt-5 text-danger py-5"><h3>Error: {error} ❌</h3></div>;

  return (
    <div className="container-fluid my-4">
      <Navbar setView={setView} />

      {/* HOME VIEW */}
      {view === 'home' && (
        <div>
          {/* SEARCH & FILTERS */}
          <div className="row g-3 mb-4 p-4 bg-white rounded-4 shadow-sm border">
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control rounded-pill px-3" 
                placeholder="🔍 Search job title or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select className="form-select rounded-pill px-3" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="All">💼 All Job Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>
            <div className="col-md-4">
              <select className="form-select rounded-pill px-3" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="All">📍 All Locations</option>
                <option value="Karachi">Karachi</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <h3 className="mb-4 fw-bold text-dark">Available Opportunities</h3>
          {currentJobs.length === 0 ? (
            <div className="alert alert-warning rounded-4 p-4 text-center">Koi job nahi mili is search ya filter ke mutabiq!</div>
          ) : (
            <div className="row g-4">
              {currentJobs.map((job) => (
                <div className="col-md-4" key={job.id}>
                  <JobCard job={job} onViewDetails={(j) => { setSelectedJob(j); setView('detail'); }} />
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link rounded-circle mx-1 border-0 shadow-sm" style={{ width: '40px', height: '40px' }} onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}

      {/* DETAIL VIEW */}
      {view === 'detail' && selectedJob && (
        <div className="card shadow-sm p-5 border-0 rounded-4 bg-white">
          <h2 className="text-primary fw-bold mb-2">{selectedJob.title}</h2>
          <h4 className="text-muted mb-4">🏢 {selectedJob.company}</h4>
          <div className="d-flex gap-3 mb-4">
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">📍 Location: {selectedJob.location}</span>
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">💼 Type: {selectedJob.type}</span>
          </div>
          <hr className="text-muted" />
          <h5 className="fw-bold mt-3">Job Description:</h5>
          <p className="text-secondary lh-lg">{selectedJob.description}</p>
          <button className="btn btn-outline-secondary mt-4 rounded-pill w-25" onClick={() => setView('home')}>
            ← Back to Jobs
          </button>
        </div>
      )}

      {/* ADD JOB VIEW */}
      {view === 'add' && (
        <div className="card shadow-sm p-5 border-0 rounded-4 col-md-8 mx-auto bg-white">
          <h2 className="mb-4 fw-bold text-center">✨ Post a New Job</h2>
          {formError && <div className="alert alert-danger rounded-3">{formError}</div>}
          {formSuccess && <div className="alert alert-success rounded-3">{formSuccess}</div>}
          
          <form onSubmit={handleAddJobSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Job Title</label>
              <input type="text" className="form-control rounded-3" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. React Developer" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Company Name</label>
              <input type="text" className="form-control rounded-3" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} placeholder="e.g. Tech Solutions" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Location</label>
              <input type="text" className="form-control rounded-3" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Karachi / Remote" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Job Type</label>
              <select className="form-select rounded-3" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control rounded-3" rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Write job details here..."></textarea>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold">Publish Job</button>
              <button type="button" className="btn btn-light rounded-pill px-4 border" onClick={() => setView('home')}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <footer className="bg-dark text-light py-4 mt-auto">
        <div className="container">
          <p className="text-center mb-0">&copy; 2023 Hanzala khan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}