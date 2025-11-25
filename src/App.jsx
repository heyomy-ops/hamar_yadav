import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  User, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Share2,
  Sparkles,
  Layout,
  Heart,
  Menu,
  Activity,
  Shield,
  Lock,
  Trash2,
  Edit2
} from 'lucide-react';
import { GOTRA_LIST } from './constants/gotras';

// --- Sample Data ---
const familyData = {
  id: 'root',
  name: 'Grandfather',
  role: 'Patriarch',
  years: '1945 - Present',
  color: 'bg-indigo-500',
  tags: ['Farmer', 'Root'],
  partner: {
    name: 'Grandmother',
    role: 'Matriarch',
    color: 'bg-rose-500',
    tags: ['Homemaker']
  },
  children: [
    {
      id: 'c1',
      name: 'Elder Uncle',
      role: 'Eldest Son',
      years: '1970 - Present',
      color: 'bg-emerald-500',
      tags: ['Engineer'],
      partner: {
        name: 'Aunt',
        role: 'Spouse',
        color: 'bg-rose-400',
        tags: ['Teacher']
      },
      children: [
        { 
          id: 'c1-1', 
          name: 'Cousin Brother', 
          role: 'Grandson', 
          years: '1995', 
          color: 'bg-blue-500',
          tags: ['Artist'],
          children: [] 
        },
      ],
    },
    {
      id: 'c2',
      name: 'Dad',
      role: 'Father',
      years: '1975 - Present',
      color: 'bg-emerald-500',
      tags: ['Business'],
      partner: {
        name: 'Mom',
        role: 'Mother',
        color: 'bg-rose-500',
        tags: ['The Heart']
      },
      children: [
        { 
          id: 'me', 
          name: 'You', 
          role: 'Me', 
          years: '2000', 
          color: 'bg-blue-600',
          tags: ['Developer'],
          children: [
            {
                id: 'gen-alpha',
                name: 'Next Gen',
                role: 'Future',
                years: '2028',
                color: 'bg-purple-500',
                tags: ['Loading'],
                children: []
            }
          ] 
        },
        { 
            id: 'sibling', 
            name: 'Sister', 
            role: 'Sibling', 
            years: '2004', 
            color: 'bg-blue-500',
            tags: ['Student'],
            children: [] 
        },
      ],
    },
    {
      id: 'c3',
      name: 'Aunt (Bua)',
      role: 'Daughter',
      years: '1980 - Present',
      color: 'bg-purple-500',
      tags: ['Guide'],
      children: [],
    },
  ],
};

// --- Components ---

// --- Components ---









const ToolbarButton = ({ icon: Icon, onClick, active = false }) => (
  <button 
    onClick={onClick}
    className={`
      p-3 rounded-2xl transition-all duration-200 active:scale-95
      ${active 
        ? 'bg-indigo-100 text-indigo-600 shadow-inner' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-white shadow-sm border border-slate-100'}
    `}
  >
    <Icon size={20} strokeWidth={2} />
  </button>
);

import { FamilyProvider, useFamily } from './context/FamilyContext';
import LineageBuilder from './components/LineageBuilder';
import TreeNode from './components/TreeNode';
import LoginPage from './components/LoginPage';
import Onboarding from './components/Onboarding';

// --- Sidebar Component ---
const Sidebar = ({ isOpen, onClose, activeView, onViewChange, onReset, isAdminMode, onAdminToggle, user, onLogin, onLogout }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
        />
        
        {/* Sidebar Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-[70] p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Menu size={20} className="text-slate-500" />
            </button>
          </div>

          {/* User Profile / Login */}
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            {user ? (
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                    {user.displayName ? user.displayName[0] : 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{user.displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <button onClick={onLogout} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-rose-500 transition-colors" title="Logout">
                  <Lock size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-200 shadow-sm transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Login with Google
              </button>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => { onViewChange('tree'); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeView === 'tree' 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeView === 'tree' ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                <Layout size={20} />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Family Tree</div>
                <div className="text-xs opacity-70">Interactive Visualization</div>
              </div>
            </button>

            <button
              onClick={() => { onViewChange('builder'); onClose(); }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                activeView === 'builder' 
                  ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-100' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeView === 'builder' ? 'bg-rose-100' : 'bg-slate-100'}`}>
                <Activity size={20} />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Clan Map</div>
                <div className="text-xs opacity-70">Lineage Builder</div>
              </div>
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-2">
            <button 
              onClick={onAdminToggle}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors group ${
                isAdminMode
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-slate-50 border-slate-100 hover:bg-purple-50 hover:border-purple-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                isAdminMode
                  ? 'bg-gradient-to-br from-amber-200 to-amber-300 text-amber-700'
                  : 'bg-gradient-to-br from-purple-200 to-purple-300 text-purple-600 group-hover:from-purple-300 group-hover:to-purple-400'
              }`}>
                <Shield size={20} />
              </div>
              <div className="text-left flex-1">
                <div className={`text-sm font-bold ${isAdminMode ? 'text-amber-700' : 'text-slate-700 group-hover:text-purple-700'}`}>
                  {isAdminMode ? 'Admin Mode ON' : 'Admin Mode'}
                </div>
                <div className={`text-xs ${isAdminMode ? 'text-amber-500' : 'text-slate-400 group-hover:text-purple-400'}`}>
                  {isAdminMode ? 'Click to disable' : 'Require password'}
                </div>
              </div>
            </button>
            
            <button 
              onClick={onReset}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 font-bold group-hover:from-red-100 group-hover:to-red-200 group-hover:text-red-500">
                R
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-700 group-hover:text-red-700">Reset Data</div>
                <div className="text-xs text-slate-400 group-hover:text-red-400">Clear Local Storage</div>
              </div>
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// --- Main App Content ---
function AppContent() {
  const { familyData, resetData, selectedGotra, setSelectedGotra, isAdminMode, setIsAdminMode, user, loginWithGoogle, logout, gotraList, addNewGotra, deleteGotra } = useFamily();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isGotraMenuOpen, setIsGotraMenuOpen] = useState(false);
  const [gotraSearchQuery, setGotraSearchQuery] = useState('');
  const [highlightedId, setHighlightedId] = useState(null);
  
  // Navigation State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('tree'); // 'tree' or 'builder'
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Admin Mode State
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const containerRef = useRef(null);

  // Handle Tag Click (Cross-Lineage Navigation)
  const handleTagClick = (gotra, personId) => {
    setSelectedGotra(gotra);
    // If a personId is provided (the person whose tag was clicked), 
    // we want to highlight them in the new tree if they exist there.
    if (personId) {
        setHighlightedId(personId);
    }
  };

  // Effect to center on highlighted node
  useEffect(() => {
    if (highlightedId && activeView === 'tree') {
        // Wait for render
        const timer = setTimeout(() => {
            const element = document.getElementById(`node-${highlightedId}`);
            if (element && containerRef.current) {
                // Found the node! Center on it.
                const rect = element.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                
                // Calculate center offset
                // We need to adjust for current scale and position
                // But simpler: just find where it is on screen, and shift position
                
                // Current center of screen
                const centerX = containerRect.width / 2;
                const centerY = containerRect.height / 2;
                
                // Node center relative to viewport
                const nodeX = rect.left + rect.width / 2;
                const nodeY = rect.top + rect.height / 2;
                
                // Difference
                const dx = centerX - nodeX;
                const dy = centerY - nodeY;
                
                setPosition(prev => ({
                    x: prev.x + dx,
                    y: prev.y + dy
                }));

                // Clear highlight after 2 seconds
                setTimeout(() => setHighlightedId(null), 2000);
            } else {
                // Node not found in this tree (maybe not linked yet)
                // Just clear highlight
                setHighlightedId(null);
            }
        }, 500); // Delay to allow tree to render/animate
        return () => clearTimeout(timer);
    }
  }, [highlightedId, selectedGotra, activeView]);

  useEffect(() => {
    setPosition({ x: window.innerWidth / 2, y: 120 });
    if (window.innerWidth < 768) setScale(0.7);
  }, []);

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      setScale(prev => Math.min(Math.max(prev + delta, 0.2), 3));
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (isDragging) {
      e.preventDefault(); 
      const touch = e.touches[0];
      setPosition({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Admin Mode Handlers
  const handleAdminToggle = () => {
    if (isAdminMode) {
      // Disable admin mode
      setIsAdminMode(false);
      setIsSidebarOpen(false);
    } else {
      // Show password modal to enable admin mode
      setShowPasswordModal(true);
      setPassword('');
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'abcd123') {
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
      setIsSidebarOpen(false);
    } else {
      setPasswordError('Incorrect password. Try again.');
      setPassword('');
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden font-sans text-slate-900 flex flex-col relative bg-[#F8FAFC] selection:bg-rose-100">
      
      {/* Admin Mode Background Animation */}
      <motion.div
        initial={false}
        animate={{ 
          clipPath: isAdminMode ? 'circle(150% at 0% 100%)' : 'circle(0% at 0% 100%)',
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 bg-amber-100 pointer-events-none z-0"
      />
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeView={activeView}
        onViewChange={setActiveView}
        onReset={() => {
          if(confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            resetData();
            setIsSidebarOpen(false);
          }
        }}
        isAdminMode={isAdminMode}
        onAdminToggle={handleAdminToggle}
        user={user}
        onLogin={loginWithGoogle}
        onLogout={logout}
      />

      {/* Lineage Builder View */}
      <AnimatePresence mode="wait">
        {activeView === 'builder' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-900"
          >
            <LineageBuilder onClose={() => setActiveView('tree')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Top Navigation Bar --- */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Hamburger Menu - Triggers Sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="bg-white p-3 rounded-full shadow-md border border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors relative z-50"
          >
            <Menu size={20} />
          </button>

          {/* GOTRA SELECTOR */}
          <div className="relative">
            <button 
                onClick={() => setIsGotraMenuOpen(!isGotraMenuOpen)}
                className="bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-lg shadow-slate-200/20 p-2 pr-6 rounded-full flex items-center gap-3 transition-transform active:scale-95"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <Layout size={20} />
                </div>
                <div className="text-left">
                <h1 className="text-sm font-bold text-slate-800 tracking-tight leading-none">{selectedGotra || 'Select Clan'}</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Change Lineage</p>
                </div>
            </button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
                {isGotraMenuOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsGotraMenuOpen(false)}></div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col"
                        >
                            <div className="p-2 border-b border-slate-50">
                                <input 
                                    type="text" 
                                    placeholder="Search Clan..." 
                                    value={gotraSearchQuery}
                                    onChange={(e) => setGotraSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-full p-2 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                                {gotraList.filter(g => g.toLowerCase().includes(gotraSearchQuery.toLowerCase())).map(g => (
                                    <div
                                        key={g}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${selectedGotra === g ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <button 
                                            onClick={() => {
                                                setSelectedGotra(g);
                                                setIsGotraMenuOpen(false);
                                                setGotraSearchQuery('');
                                            }}
                                            className="flex-1 text-left flex items-center justify-between"
                                        >
                                            {g}
                                            {selectedGotra === g && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                        </button>
                                        {isAdminMode && (
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (confirm(`Delete "${g}" clan? This cannot be undone.`)) {
                                                        await deleteGotra(g);
                                                    }
                                                }}
                                                className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Gotra"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {gotraList.filter(g => g.toLowerCase().includes(gotraSearchQuery.toLowerCase())).length === 0 && gotraSearchQuery.trim() && (
                                    <button 
                                        onClick={async () => {
                                            await addNewGotra(gotraSearchQuery);
                                            setSelectedGotra(gotraSearchQuery);
                                            setIsGotraMenuOpen(false);
                                            setGotraSearchQuery('');
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 text-indigo-600 bg-indigo-50 border border-indigo-100 border-dashed hover:bg-indigo-100"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-xs">+</span>
                                        Add "{gotraSearchQuery}"
                                    </button>
                                )}
                                {gotraList.filter(g => g.toLowerCase().includes(gotraSearchQuery.toLowerCase())).length === 0 && !gotraSearchQuery.trim() && (
                                    <div className="p-4 text-center text-xs font-bold text-slate-400">
                                        No clans found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
           <div className="hidden md:flex gap-2">
             <button className="bg-white hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-full text-sm font-bold border border-slate-200 shadow-sm transition-all flex items-center gap-2">
               <Share2 size={16} /> Share
             </button>
             <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2">
               <Sparkles size={16} /> Edit
             </button>
           </div>
        </div>
      </div>

      {/* --- Canvas Area (Only visible when activeView is 'tree') --- */}
      <div 
        ref={containerRef}
        className={`flex-1 w-full relative h-full touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      >
        <motion.div
          className="absolute origin-top-left"
          style={{
            x: position.x,
            y: position.y,
            scale: scale,
          }}
        >
          <div className="-translate-x-1/2 pt-20 pb-40 px-20">
            {familyData ? (
              <TreeNode node={familyData} onTagClick={handleTagClick} isAdminMode={isAdminMode} highlightedId={highlightedId} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-10 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                   <Activity size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Start Your Lineage</h2>
                <p className="text-slate-500 max-w-xs mb-8">Your family tree is currently empty. Use the Clan Map to add the first member.</p>
                <button 
                  onClick={() => setActiveView('builder')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                >
                  <Plus size={20} /> Open Clan Map
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* --- Bottom Floating Toolbar --- */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-300/30 p-2 rounded-3xl flex items-center gap-2 pointer-events-auto ring-1 ring-slate-200">
          <ToolbarButton icon={Search} onClick={() => {}} />
          <div className="w-px h-8 bg-slate-200 mx-1"></div>
          <ToolbarButton icon={ZoomOut} onClick={() => setScale(s => Math.max(s - 0.1, 0.2))} />
          <span className="w-14 text-center text-xs font-bold text-slate-600 tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <ToolbarButton icon={ZoomIn} onClick={() => setScale(s => Math.min(s + 0.1, 3))} />
          <div className="w-px h-8 bg-slate-200 mx-1"></div>
          <ToolbarButton icon={Maximize} onClick={() => { setScale(window.innerWidth < 768 ? 0.7 : 1); setPosition({x: window.innerWidth/2, y:120}); }} />
        </div>
      </div>

      {/* Admin Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPasswordModal(false);
                setPassword('');
                setPasswordError('');
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Lock size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Admin Access</h3>
                    <p className="text-xs text-slate-500">Enter password to continue</p>
                  </div>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handlePasswordSubmit();
                  }}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />

                {passwordError && (
                  <p className="text-sm text-red-600 mb-4">{passwordError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword('');
                      setPasswordError('');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

function App() {
  return (
    <FamilyProvider>
      <AuthWrapper />
    </FamilyProvider>
  );
}

function AuthWrapper() {
  const { user, loading, isOnboarding } = useFamily();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (isOnboarding) {
    return <Onboarding />;
  }

  return <AppContent />;
}

export default App;
