import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth & Security
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Domains from './pages/Domains';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Team from './pages/Team';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';

// Admin Pages
import Dashboard from './admin/Dashboard';
import EventsAdmin from './admin/EventsAdmin';
import ProjectsAdmin from './admin/ProjectsAdmin';
import TeamAdmin from './admin/TeamAdmin';
import DomainsAdmin from './admin/DomainsAdmin';
import ApplicationsAdmin from './admin/ApplicationsAdmin';
import AnnouncementsAdmin from './admin/AnnouncementsAdmin';
import UsersAdmin from './admin/UsersAdmin';
import SettingsAdmin from './admin/SettingsAdmin';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="domains" element={<Domains />} />
                <Route path="projects" element={<Projects />} />
                <Route path="events" element={<Events />} />
                <Route path="team" element={<Team />} />
                <Route path="join" element={<JoinUs />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              {/* Admin Routes with Protected Authentication Guard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route
                  path="events"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin', 'event_manager']}>
                      <EventsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin', 'domain_lead']}>
                      <ProjectsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="team"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin', 'social_media']}>
                      <TeamAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="domains"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin', 'domain_lead']}>
                      <DomainsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="applications"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin', 'domain_lead']}>
                      <ApplicationsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="announcements"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin', 'social_media']}>
                      <AnnouncementsAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin']}>
                      <UsersAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute allowedRoles={['super_admin']}>
                      <SettingsAdmin />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Catch-all fallback for any unknown URL -> clean redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
