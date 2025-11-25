import React from 'react';
import { motion } from 'framer-motion';
import { useFamily } from '../context/FamilyContext';

export default function LoginPage() {
  const { loginWithGoogle } = useFamily();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-rose-100/50 blur-3xl" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-amber-100/50 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/50 max-w-md w-full text-center"
      >
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 transform rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
             </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Family Tree</h1>
          <p className="text-slate-500">Discover and preserve your lineage.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
            <span>Continue with Google</span>
          </button>
          
          <p className="text-xs text-slate-400 mt-6">
            By continuing, you agree to join the family network.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
