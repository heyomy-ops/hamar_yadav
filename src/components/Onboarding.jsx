import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFamily } from '../context/FamilyContext';
import { User, Users, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { capitalizeName } from '../utils/textUtils';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Onboarding() {
  const { user, gotraList, registerUser, database } = useFamily();
  const [step, setStep] = useState(1); // 1: Gotra, 2: Name, 3: Auto-match
  const [selectedGotra, setSelectedGotra] = useState('');
  const [name, setName] = useState(user?.displayName || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user]);

  const filteredGotras = gotraList.filter(g => 
    g.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGotraNext = () => {
    if (selectedGotra || searchQuery.trim()) {
      const gotra = selectedGotra || searchQuery.trim();
      setSelectedGotra(gotra);
      setStep(2);
    }
  };

  const handleNameNext = () => {
    if (!name.trim()) return;
    
    // Search for matches in selected Gotra
    const gotraMatches = database.filter(p => 
      p.birthGotra === selectedGotra &&
      p.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (gotraMatches.length > 0) {
      setMatches(gotraMatches);
      setStep(3);
    } else {
      // No matches, just register
      handleFinish(null);
    }
  };

  const handleSelectMatch = async (personId) => {
    setIsSubmitting(true);
    try {
      // Link this person to user account
      await updateDoc(doc(db, 'people', personId), {
        linkedUserId: user.uid
      });
      
      // Register user with link
      await registerUser(name, selectedGotra, personId);
    } catch (error) {
      console.error("Failed to link:", error);
      setIsSubmitting(false);
    }
  };

  const handleFinish = async (linkedPersonId = null) => {
    setIsSubmitting(true);
    try {
      await registerUser(name, selectedGotra, linkedPersonId);
    } catch (error) {
      console.error("Failed to register:", error);
      setIsSubmitting(false);
    }
  };

  const getFatherName = (person) => {
    if (!person.fatherId) return null;
    const father = database.find(p => p.id === person.fatherId);
    return father ? father.name : null;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-indigo-50/50 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-rose-50/50 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md border border-slate-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Welcome! 🎉</h1>
          <p className="text-slate-500">Let's set up your profile</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
            {step > 1 ? <Check size={16} /> : '1'}
          </div>
          <div className={`h-1 w-12 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
            {step > 2 ? <Check size={16} /> : '2'}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Gotra */}
          {step === 1 && (
            <motion.div
              key="gotra"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <Users className="inline mr-2" size={16} />
                    Select Your Gotra
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search or type new Gotra..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>

                {filteredGotras.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                    {filteredGotras.map(g => (
                      <button
                        key={g}
                        onClick={() => {
                          setSelectedGotra(g);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${selectedGotra === g ? 'bg-indigo-50 text-indigo-700 font-bold' : ''}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}

                {selectedGotra && (
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <p className="text-sm text-indigo-700">
                      Selected: <strong>{selectedGotra}</strong>
                    </p>
                  </div>
                )}

                <button
                  onClick={handleGotraNext}
                  disabled={!selectedGotra && !searchQuery.trim()}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Enter Name */}
          {step === 2 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <User className="inline mr-2" size={16} />
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(capitalizeName(e.target.value))}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNameNext}
                    disabled={!name.trim() || isSubmitting}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Searching...' : 'Next'} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Select Match */}
          {step === 3 && (
            <motion.div
              key="match"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Is this you?</h3>
                  <p className="text-sm text-slate-500 mb-4">We found {matches.length} person(s) with your name. Select the one that's you:</p>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {matches.map(person => {
                    const fatherName = getFatherName(person);
                    return (
                      <button
                        key={person.id}
                        onClick={() => handleSelectMatch(person.id)}
                        disabled={isSubmitting}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left disabled:opacity-50"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-slate-800">{person.name}</p>
                            {fatherName && (
                              <p className="text-sm text-slate-500">Son of {fatherName}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleFinish(null)}
                    disabled={isSubmitting}
                    className="w-full py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    None of these are me
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
