import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Brain, Cpu, Bot, Plane, CheckCircle2 } from 'lucide-react';
import { domainsService, projectsService } from '../lib/dataService';
import './Domains.css';

const DOMAIN_ICONS = {
  'ai-ml': <Brain size={24} />,
  'vlsi': <Cpu size={24} />,
  'robotics-iot': <Bot size={24} />,
  'drone-tech': <Plane size={24} />
};

export default function Domains() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [domainList, setDomainList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [doms, projs] = await Promise.all([
          domainsService.getAll(),
          projectsService.getAll()
        ]);
        setDomainList(doms);
        setProjectsList(projs);
      } catch (err) {
        console.error('Failed to load domains and projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const paramDomain = searchParams.get('id') || searchParams.get('domain');
  const validDomainId = domainList.some(d => d.id === paramDomain) 
    ? paramDomain 
    : (domainList[0]?.id || 'ai-ml');
  const [selectedDomainId, setSelectedDomainId] = useState(validDomainId);

  useEffect(() => {
    if (paramDomain && domainList.some(d => d.id === paramDomain)) {
      setSelectedDomainId(paramDomain);
    } else if (domainList.length > 0 && !selectedDomainId) {
      setSelectedDomainId(domainList[0].id);
    }
  }, [paramDomain, domainList]);

  const handleDomainSelect = (id) => {
    setSelectedDomainId(id);
    setSearchParams({ domain: id }, { replace: true });
  };

  const activeDomain = domainList.find(d => d.id === selectedDomainId) || domainList[0] || {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    lead_name: 'Asra Kamal',
    badge: 'Edge AI & Perception',
    description: 'Developing intelligent systems for autonomous robotics.',
    focus_areas: [],
    technologies: []
  };

  const activeDomainProjects = projectsList.filter(p => p.domain_id === activeDomain.id);

  return (
    <div className="domains-page">
      {/* Hero Header */}
      <section className="domains-hero">
        <div className="container">
          <span className="section-label">Engineering Verticals</span>
          <h1 className="domains-title">Core Technical Domains</h1>
          <div className="heading-line-maroon" style={{ margin: '0.5rem auto 1.25rem auto' }}></div>
          <p className="domains-subtitle">
            Explore our specialized engineering divisions. Select any domain below to view its focus areas, technologies, and active projects.
          </p>

          {/* Clean Domain Selector Cards */}
          <div className="domain-tabs-grid">
            {domainList.map(domain => {
              const isSelected = domain.id === selectedDomainId;
              const leadText = domain.lead_name || domain.lead || '';
              return (
                <button
                  key={domain.id}
                  className={`domain-tab-card ${isSelected ? 'active' : ''}`}
                  onClick={() => handleDomainSelect(domain.id)}
                  type="button"
                  aria-pressed={isSelected}
                >
                  <div className="domain-tab-icon">
                    {DOMAIN_ICONS[domain.id] || <Brain size={24} />}
                  </div>
                  <div className="domain-tab-info">
                    <span className="domain-tab-badge">{domain.badge}</span>
                    <h3 className="domain-tab-name">{domain.name}</h3>
                    <span className="domain-tab-lead">Lead: {leadText.split('(')[0].trim()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected Domain Detailed View */}
      <section className="section-padding">
        <div className="container">
          <div className="aesthetic-card domain-detail-card" key={activeDomain.id}>
            
            {/* Domain Title & Lead Header */}
            <div className="domain-detail-header">
              <div className="domain-detail-title-group">
                <div className="domain-detail-icon">
                  {DOMAIN_ICONS[activeDomain.id] || <Brain size={24} />}
                </div>
                <div className="domain-title-text-group">
                  <span className="domain-card-tag">{activeDomain.badge}</span>
                  <h2 className="domain-detail-name">{activeDomain.name}</h2>
                  <span className="domain-lead-text">
                    Domain Mentorship: <strong>{activeDomain.lead_name || activeDomain.lead}</strong>
                  </span>
                </div>
              </div>
            </div>

            <p className="domain-detail-description">{activeDomain.description || activeDomain.desc}</p>

            {/* 2-Column Breakdown: Focus Areas & Technologies */}
            <div className="domain-breakdown-grid">
              
              {/* Focus Areas */}
              <div className="breakdown-col">
                <h4 className="breakdown-heading">Core Focus Areas</h4>
                <ul className="focus-list">
                  {(activeDomain.focus_areas || activeDomain.focusAreas || []).map((area, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} color="var(--color-primary)" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="breakdown-col">
                <h4 className="breakdown-heading">Technologies &amp; Frameworks</h4>
                <div className="tech-tags-grid">
                  {(activeDomain.technologies || []).map((tech, i) => (
                    <span key={i} className="tag-pill tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Domain Projects */}
            <div className="domain-projects-section">
              <h4 className="breakdown-heading">Active Domain Projects</h4>
              {activeDomainProjects.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  No projects currently listed for this domain.
                </p>
              ) : (
                <div className="domain-projects-cards-grid">
                  {activeDomainProjects.map(proj => (
                    <div key={proj.id} className="domain-subproject-card">
                      <h5 className="subproject-title">{proj.title || proj.name}</h5>
                      <p className="subproject-desc">{proj.description || proj.desc}</p>
                      <div className="subproject-tech-list">
                        {(proj.technologies || []).map((t, idx) => (
                          <span key={idx} className="subproject-tech-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}