import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFamily } from '../context/FamilyContext';
import { User, Users, ArrowRight, Check } from 'lucide-react';
import { capitalizeName } from '../utils/textUtils';

export default function Onboarding() {
  const { user, gotraList, registerUser } = useFamily();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.displayName || '');
  const [selectedGotra, setSelectedGotra] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user]);

  const filteredGotras = gotraList.filter(g => 
    g.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
  };

  const handleFinish = async () => {
    if (!selectedGotra && !searchQuery) return;
    
    // Use selected gotra or the custom one typed in search
    const gotraToSave = selectedGotra || searchQuery;
    
    setIsSubmitting(true);
    try {
      await registerUser(name, gotraToSave);
      // Context will update isOnboarding to false automatically
    } catch (error) {
      console.error("Failed to register:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-indigo-50/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-rose-50/50 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full"
      >
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 mb-4">
                <User size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">What should we call you?</h1>
              <p className="text-slate-500">Confirm your name to get started.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(capitalizeName(e.target.value))}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>

            <button 
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              Next Step <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl mx-auto flex items-center justify-center text-rose-600 mb-4">
                <Users size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Select your Gotra</h1>
              <p className="text-slate-500">Find your lineage or add a new one.</p>
            </div>

            <div className="relative">
               <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(capitalizeName(e.target.value)); setSelectedGotra(''); }}
                  placeholder="Search or add Gotra..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none transition-all mb-4"
                  autoFocus
               />
               
               <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                 {filteredGotras.map(g => (
                   <button 
                     key={g}
                     onClick={() => { setSelectedGotra(g); setSearchQuery(g); }}
                     className={`w-full text-left p-3 rounded-lg font-semibold transition-colors flex items-center justify-between ${selectedGotra === g ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'hover:bg-slate-50 text-slate-600'}`}
                   >
                     {g}
                     {selectedGotra === g && <Check size={16} />}
                   </button>
                 ))}
                 
                 {searchQuery && !filteredGotras.includes(searchQuery) && (
                    <button 
                      onClick={() => { setSelectedGotra(searchQuery); }}
                      className={`w-full text-left p-3 rounded-lg font-semibold transition-colors flex items-center gap-2 text-indigo-600 bg-indigo-50 border border-indigo-100 border-dashed`}
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-xs">+</span>
                      Add "{searchQuery}" as new Gotra
                    </button>
                 )}
               </div>
            </div>

            <button 
              onClick={handleFinish}
              disabled={(!selectedGotra && !searchQuery) || isSubmitting}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Setting up...' : 'Finish Setup'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
