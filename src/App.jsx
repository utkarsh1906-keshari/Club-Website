import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Domains from './pages/Domains';
import Events from './pages/Events';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Achievements from './pages/Achievements';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';

// Admin Pages
import Dashboard from './admin/Dashboard';
import EventsAdmin from './admin/EventsAdmin';
import ProjectsAdmin from './admin/ProjectsAdmin';
import TeamAdmin from './admin/TeamAdmin';
import DomainsAdmin from './admin/DomainsAdmin';
import GalleryAdmin from './admin/GalleryAdmin';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="domains" element={<Domains />} />
            {/* Projects are now integrated directly inside Domains */}
            <Route path="projects" element={<Navigate to="/domains" replace />} />
            <Route path="events" element={<Events />} />
            <Route path="team" element={<Team />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="join" element={<JoinUs />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="events" element={<EventsAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="team" element={<TeamAdmin />} />
            <Route path="domains" element={<DomainsAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
