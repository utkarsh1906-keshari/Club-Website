import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FolderGit2, 
  Search, 
  ExternalLink, 
  GitBranch, 
  Tag, 
  Users, 
  Sparkles, 
  Filter, 
  ArrowRight,
  Code2
} from 'lucide-react';

function GithubIcon({ size = 15 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
import { projectsService, domainsService } from '../lib/dataService';
import './Projects.css';

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeDomainFilter = searchParams.get('domain') || 'all';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [projData, domData] = await Promise.all([
          projectsService.getAll(),
          domainsService.getAll()
        ]);
        setProjects(projData);
        setDomains(domData);
      } catch (err) {
        console.error('Failed to load projects data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDomainFilter = (domainId) => {
    if (domainId === 'all') {
      searchParams.delete('domain');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ domain: domainId }, { replace: true });
    }
  };

  const domainFilterOptions = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai-ml', label: 'AI/ML' },
    { id: 'vlsi', label: 'VLSI' },
    { id: 'robotics-iot', label: 'Robotics & IoT' },
    { id: 'drone-tech', label: 'Drone Technology' }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesDomain = activeDomainFilter === 'all' || project.domain_id === activeDomainFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      project.title?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.technologies?.some(t => t.toLowerCase().includes(query)) ||
      project.team_members?.some(m => m.toLowerCase().includes(query));
    return matchesDomain && matchesSearch;
  });

  const getDomainName = (domainId) => {
    const found = domains.find(d => d.id === domainId);
    return found ? found.name : domainId?.toUpperCase();
  };

  return (
    <div className="projects-page">
      {/* Hero Header */}
      <section className="projects-hero">
        <div className="container">
          <span className="section-label">Engineering Portfolio</span>
          <h1 className="projects-title">Club Projects Showcase</h1>
          <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.25rem auto' }}></div>
          <p className="projects-subtitle">
            Explore cutting-edge hardware, autonomous flight firmware, edge artificial intelligence, and custom silicon prototypes engineered by student squads at ABES Engineering College.
          </p>

          {/* Search & Domain Filter Pills */}
          <div className="projects-controls">
            <div className="projects-search-box">
              <Search size={18} className="projects-search-icon" />
              <input
                type="text"
                placeholder="Search by project title, keyword, technology, or member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="projects-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="projects-clear-btn"
                  aria-label="Clear search query"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="domain-filters-bar">
              {domainFilterOptions.map(option => (
                <button
                  key={option.id}
                  className={`filter-pill-btn ${activeDomainFilter === option.id ? 'active' : ''}`}
                  onClick={() => handleDomainFilter(option.id)}
                  type="button"
                >
                  {option.label}
                  {option.id !== 'all' && (
                    <span className="filter-count">
                      {projects.filter(p => p.domain_id === option.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="section-padding">
        <div className="container">
          {loading ? (
            <div className="loading-state-container">
              <div className="loading-spinner"></div>
              <p>Loading club engineering projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="aesthetic-card empty-projects-card text-center">
              <FolderGit2 size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3>No matching projects found</h3>
              <p>Try refining your search terms or select another technical domain.</p>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  handleDomainFilter('all');
                }}
                style={{ marginTop: '1rem' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map(proj => (
                <div key={proj.id} className="aesthetic-card project-card">
                  {/* Card Thumbnail / Header */}
                  <div className="project-thumbnail-box">
                    <img 
                      src={proj.image_url || '/abes/bottom-banner.webp'} 
                      alt={proj.title}
                      className="project-thumb-img"
                    />
                    <div className="project-badge-overlay">
                      <span className="domain-tag-badge">
                        {getDomainName(proj.domain_id)}
                      </span>
                      {proj.featured && (
                        <span className="featured-pill">
                          <Sparkles size={12} /> Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="project-card-body">
                    <h3 className="project-card-title">{proj.title}</h3>
                    <p className="project-card-desc">{proj.description}</p>

                    {/* Tech Tags */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="project-tech-stack">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="tag-pill project-tech-pill">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Team Members */}
                    {proj.team_members && proj.team_members.length > 0 && (
                      <div className="project-team-row">
                        <Users size={14} className="team-icon" />
                        <span className="team-members-text">
                          <strong>Contributors:</strong> {proj.team_members.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Card Footer Actions */}
                    <div className="project-card-footer">
                      {proj.github_url && (
                        <a 
                          href={proj.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-secondary project-action-btn"
                          title="View Repository"
                        >
                          <GithubIcon size={15} /> Source
                        </a>
                      )}
                      {proj.demo_url ? (
                        <a 
                          href={proj.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary project-action-btn"
                          title="Live Demo"
                        >
                          <ExternalLink size={15} /> Live Demo
                        </a>
                      ) : (
                        <Link 
                          to={`/domains?domain=${proj.domain_id}`} 
                          className="btn btn-primary project-action-btn"
                        >
                          Domain Details <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Build With Us Banner */}
      <section className="section-padding project-cta-section">
        <div className="container">
          <div className="aesthetic-card project-cta-card text-center">
            <h2>Have an Autonomous Robotics or Drone Concept?</h2>
            <p style={{ maxWidth: '650px', margin: '0.75rem auto 1.5rem auto' }}>
              The club provides component grants, 3D printing, flight telemetry cages, and guidance under faculty mentorship to convert research concepts into working hardware prototypes.
            </p>
            <div className="hero-cta-group" style={{ justifyContent: 'center' }}>
              <Link to="/join" className="btn btn-primary">
                Join an Engineering Squad &rarr;
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Submit Research Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
