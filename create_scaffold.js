import fs from 'fs';
import path from 'path';

const dirs = [
  'src/components',
  'src/layouts',
  'src/pages',
  'src/admin'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const files = {
  'src/layouts/PublicLayout.jsx': "import React from 'react';\nimport { Outlet } from 'react-router-dom';\nimport Navbar from '../components/Navbar';\nimport Footer from '../components/Footer';\n\nexport default function PublicLayout() {\n  return (\n    <>\n      <Navbar />\n      <main>\n        <Outlet />\n      </main>\n      <Footer />\n    </>\n  );\n}",
  
  'src/layouts/AdminLayout.jsx': "import React from 'react';\nimport { Outlet, Link } from 'react-router-dom';\n\nexport default function AdminLayout() {\n  return (\n    <div className=\"admin-layout\" style={{ display: 'flex' }}>\n      <aside style={{ width: '250px', background: 'var(--color-bg-surface)', height: '100vh', padding: 'var(--spacing-md)' }}>\n        <h2 className=\"text-gradient\" style={{ fontSize: '1.2rem' }}>Admin Panel</h2>\n        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>\n          <Link to=\"/admin\">Dashboard</Link>\n          <Link to=\"/admin/events\">Events</Link>\n          <Link to=\"/admin/projects\">Projects</Link>\n          <Link to=\"/admin/team\">Team</Link>\n          <Link to=\"/admin/domains\">Domains</Link>\n          <Link to=\"/admin/gallery\">Gallery</Link>\n        </nav>\n      </aside>\n      <main style={{ flex: 1, padding: 'var(--spacing-xl)' }}>\n        <Outlet />\n      </main>\n    </div>\n  );\n}",

  'src/components/Navbar.jsx': "import React from 'react';\nimport { Link } from 'react-router-dom';\nimport './Navbar.css';\n\nexport default function Navbar() {\n  return (\n    <header className=\"navbar\">\n      <div className=\"container navbar-inner\">\n        <Link to=\"/\" className=\"brand\">D&R CLUB</Link>\n        <nav className=\"nav-links\">\n          <Link to=\"/about\">About</Link>\n          <Link to=\"/domains\">Domains</Link>\n          <Link to=\"/projects\">Projects</Link>\n          <Link to=\"/events\">Events</Link>\n          <Link to=\"/team\">Team</Link>\n          <Link to=\"/gallery\">Gallery</Link>\n          <Link to=\"/join\" className=\"btn btn-primary\" style={{ padding: '0.25rem 1rem' }}>Join Us</Link>\n        </nav>\n      </div>\n    </header>\n  );\n}",

  'src/components/Navbar.css': ".navbar {\n  background: var(--color-bg-surface-glass);\n  backdrop-filter: blur(12px);\n  border-bottom: 1px solid var(--color-border);\n  position: sticky;\n  top: 0;\n  z-index: 50;\n}\n.navbar-inner {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 70px;\n}\n.brand {\n  font-family: var(--font-family-display);\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--color-text-primary);\n}\n.nav-links {\n  display: flex;\n  gap: var(--spacing-lg);\n  align-items: center;\n}\n.nav-links a:not(.btn) {\n  font-weight: 500;\n  font-size: 0.95rem;\n}",

  'src/components/Footer.jsx': "import React from 'react';\n\nexport default function Footer() {\n  return (\n    <footer style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--spacing-xl) 0', marginTop: 'auto' }}>\n      <div className=\"container\" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>\n        <p>&copy; " + new Date().getFullYear() + " Drone & Robotics Club. All rights reserved.</p>\n      </div>\n    </footer>\n  );\n}",
};

const pages = [
  'Home', 'About', 'Domains', 'Projects', 'Events', 'Team', 'Gallery', 'Achievements', 'JoinUs', 'Contact'
];

pages.forEach(page => {
  files['src/pages/' + page + '.jsx'] = "import React from 'react';\n\nexport default function " + page + "() {\n  return (\n    <div className=\"container section-padding\">\n      <h1>" + page + "</h1>\n      <p>This is the " + page + " page.</p>\n    </div>\n  );\n}";
});

const adminPages = [
  'Dashboard', 'EventsAdmin', 'ProjectsAdmin', 'TeamAdmin', 'DomainsAdmin', 'GalleryAdmin'
];

adminPages.forEach(page => {
  files['src/admin/' + page + '.jsx'] = "import React from 'react';\n\nexport default function " + page + "() {\n  return (\n    <div>\n      <h1>" + page + "</h1>\n      <div className=\"glass-panel\">Manage your " + page.replace('Admin', '').toLowerCase() + " here.</div>\n    </div>\n  );\n}";
});

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.resolve(filepath), content);
}

console.log('Scaffolding complete.');
