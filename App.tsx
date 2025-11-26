
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Project, User } from './types';
import { INITIAL_PROJECTS, ADMIN_PASSWORD } from './constants';
import Admin from './components/Admin';
import ProjectModal from './components/ProjectModal';
import BackgroundEffect from './components/BackgroundEffect';
import { Lock, Instagram, Mail, Linkedin, Menu, X } from 'lucide-react';

// --- Components for Public View (In-file for single block requirement simplicity, can be separated) ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    // [Modifiable] mix-blend-difference allows the text to be visible even if a light passes under it
    <nav className="fixed top-0 left-0 w-full z-40 mix-blend-difference text-neutral-200 p-6 md:p-10 flex justify-between items-start">
      <Link to="/" className="text-2xl font-bold tracking-tighter z-50 hover:opacity-80 transition-opacity">
        QINGBIAO JIA.<span className="text-amber-500">PORTFOLIO</span>
      </Link>
      
      {/* Mobile Menu Toggle */}
      <button className="md:hidden z-50" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      {/* Desktop Links */}
      <div className="hidden md:flex flex-col items-end space-y-1 text-sm font-medium tracking-wide uppercase">
        <Link to="/" className={`hover:text-amber-500 transition-colors ${isHome ? 'text-amber-500' : ''}`}>Work</Link>
        <a href="#about" className="hover:text-amber-500 transition-colors">About</a>
        <a href="#contact" className="hover:text-amber-500 transition-colors">Contact</a>
        <Link to="/login" className="hover:text-amber-500 transition-colors text-xs text-neutral-500 mt-4">Admin</Link>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center space-y-8 z-40 md:hidden">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-3xl font-light">Work</Link>
          <a href="#about" onClick={() => setIsOpen(false)} className="text-3xl font-light">About</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="text-3xl font-light">Contact</a>
          <Link to="/login" onClick={() => setIsOpen(false)} className="text-sm text-neutral-500 mt-8">Admin Access</Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-transparent text-neutral-600 py-12 px-6 text-center relative z-10">
    <div className="flex justify-center space-x-6 mb-6" id="contact">
      {/* [中文说明] 修改这里的链接为你的社交媒体地址 */}
      <Mail size={20} className="cursor-pointer hover:text-amber-500 transition-colors" />
    </div>
    <p className="text-xs uppercase tracking-widest">© {new Date().getFullYear()} Qingbiao Jia. All rights reserved.</p>
  </footer>
);

const PublicShowcase: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen text-neutral-200 selection:bg-amber-900 selection:text-white relative overflow-x-hidden">
      {/* 
         [中文说明] 舞台光效背景组件
         它位于 z-0，覆盖在 body 的黑色背景上。内容都在 z-10 以上。
      */}
      <BackgroundEffect />
      
      <Navbar />
      
      {/* Hero Section */}
      <header className="h-[80vh] flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto pb-24 relative z-10 pointer-events-none">
        {/* pointer-events-none allows mouse to pass through text to affect the background light */}
        <div className="pointer-events-auto">
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter text-white mb-6 mix-blend-overlay">
            Qingbiao JIA <br/>
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-amber-700 to-amber-900">Silence & Noise</span>
          </h1>
          {/* [中文说明] 这里的文本是首页的标语，可以在代码中直接修改 */}
          <p className="max-w-xl text-neutral-300 text-lg md:text-xl font-light leading-relaxed mix-blend-screen border-l-2 border-amber-800/50 pl-6">
            A collection of theatrical works exploring the human condition through translating embodied micro-events into minimalist, tech-mediated stage texts.
          </p>
        </div>
      </header>

      {/* Gallery Section */}
      <section id="work" className="px-4 md:px-12 pb-32 max-w-screen-2xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* [修改点] 移除了 grayscale，改为全彩显示，悬停时增加亮度 */}
              <div className="overflow-hidden aspect-[4/5] bg-neutral-900/30 mb-6 relative backdrop-blur-sm border border-neutral-800/30 transition-all duration-500 group-hover:border-amber-900/50 group-hover:shadow-2xl group-hover:shadow-amber-900/10">
                 <img 
                   src={project.coverImage} 
                   alt={project.title} 
                   className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                 />
                 {/* 渐变遮罩，底部深色保证文字可读，上部透明展示图片 */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-all duration-500" />
                 
                 {/* 悬停时出现的类别标签 */}
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-black/80 px-2 py-1 rounded">
                      {project.category}
                    </span>
                 </div>
              </div>
              
              <div className="flex justify-between items-baseline border-b border-neutral-800 pb-2 group-hover:border-amber-800/50 transition-colors duration-300">
                <h3 className="text-xl font-medium text-white group-hover:text-amber-500 transition-colors">{project.title}</h3>
                <span className="text-sm text-neutral-500 group-hover:text-neutral-300 transition-colors">{project.year}</span>
              </div>
              <p className="text-sm text-neutral-500 mt-2 group-hover:text-amber-700/80 transition-colors">{project.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-12 relative z-10">
        {/* Blur backing to make text readable against the lights */}
        <div className="max-w-3xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-neutral-950/40 backdrop-blur-md border border-neutral-800/40 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-light text-white">About the Director</h2>
          {/* [中文说明] 这里是“关于我”的部分，请在下方代码中修改文字内容 */}
          <p className="text-neutral-300 text-lg leading-relaxed font-light">
             Focused on the intersection of text and performance art. 
             I specialise in cross-media creation and studio-based methods that combine embodied practice with low-intrusive sensing to generate reproducible artistic outcomes.
             My work produces both public performance and shareable research tools that bridge artistic rigour and pedagogical utility.
          </p>
        </div>
      </section>
      
      <Footer />

      {/* Modal Popup */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundEffect />
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 relative z-10 bg-neutral-900/40 p-8 rounded-lg backdrop-blur-md border border-neutral-800/50 shadow-2xl">
        <div className="text-center space-y-2">
          <Lock className="mx-auto text-amber-600 mb-4" size={32} />
          <h1 className="text-2xl font-light text-white">Director Access</h1>
        </div>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className="w-full bg-neutral-950/80 border border-neutral-800 rounded px-4 py-3 text-white focus:outline-none focus:border-amber-600 transition-colors"
          />
          {error && <p className="text-red-500 text-xs">Incorrect password.</p>}
        </div>
        <button className="w-full bg-white text-black font-medium py-3 rounded hover:bg-neutral-200 transition-colors">
          Enter Dashboard
        </button>
        <div className="text-center">
          <Link to="/" className="text-xs text-neutral-500 hover:text-white">Return to Portfolio</Link>
        </div>
      </form>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // [中文说明] 从 LocalStorage 初始化数据，如果没有则使用默认数据
  // [Note] Initialize data from LocalStorage, fallback to constants
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
        const saved = localStorage.getItem('portfolio_projects');
        if (saved) {
             const parsed = JSON.parse(saved);
             
             // [Critical Fix] Validate that parsed is actually an array
             if (!Array.isArray(parsed)) {
                 console.warn("LocalStorage data corrupted (not an array). Resetting to defaults.");
                 return INITIAL_PROJECTS;
             }

             // Data Migration: Convert old 'videoUrl' string to 'videoUrls' array
             return parsed.map((p: any) => {
                 if (!p.videoUrls) {
                     return {
                         ...p,
                         videoUrls: p.videoUrl ? [p.videoUrl] : []
                     };
                 }
                 return p;
             });
        }
        return INITIAL_PROJECTS;
    } catch (e) {
        console.error("Failed to load/parse projects from localStorage:", e);
        return INITIAL_PROJECTS;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth_status') === 'true';
  });

  // [中文说明] 当 projects 变化时，自动保存到本地存储
  // [Note] Auto-save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to save to local storage (quota exceeded?)");
    }
  }, [projects]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth_status', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth_status');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicShowcase projects={projects} />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/admin" element={
          isAuthenticated ? (
            <Admin 
              projects={projects} 
              setProjects={setProjects} 
              onLogout={handleLogout} 
            />
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
