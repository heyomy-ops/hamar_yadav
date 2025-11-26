import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Heart, Edit2, Calendar, X, Trash2, 
  Minus, Plus, Activity, Shield, Lock 
} from 'lucide-react';
import clsx from 'clsx';
import { useFamily } from '../context/FamilyContext';
import { GOTRA_LIST } from '../constants/gotras';
import { capitalizeName } from '../utils/textUtils';

const Tag = ({ text, onClick }) => (
  <span 
    onClick={(e) => {
      if (onClick) {
        e.stopPropagation();
        onClick(text);
      }
    }}
    className={`px-2 py-0.5 rounded-full bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100 uppercase tracking-wider ${onClick ? 'cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors' : ''}`}
  >
    {text}
  </span>
);

const ProfileBlock = ({ name, role, tags, color, align = 'left', onTagClick, personId, dob, gender, photoURL, isAdminMode, isHighlighted }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDob, setEditDob] = useState(dob || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAdminEdit, setShowAdminEdit] = useState(false);
  const [editName, setEditName] = useState(name || '');
  const [editGender, setEditGender] = useState(gender || 'male');

  const { updatePerson, deletePerson, gotraList } = useFamily();
  
  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dob);

  const handleSave = () => {
    updatePerson(personId, { dob: editDob });
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (personId) {
      deletePerson(personId);
      setShowDeleteConfirm(false);
    }
  };

  const handleAdminSave = () => {
    if (personId) {
      updatePerson(personId, { 
        name: editName,
        gender: editGender,
        dob: editDob
      });
      setShowAdminEdit(false);
    }
  };

  const isFemale = (gender || '').toLowerCase() !== 'male';

  return (
    <div className={`flex flex-col gap-2 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      {/* Avatar and Name/Role Row */}
      <div className={`flex items-center gap-3 ${align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full ${!photoURL ? color : 'bg-slate-200'} flex items-center justify-center text-white font-bold text-base shadow-sm overflow-hidden`}>
          {photoURL ? (
            <img src={photoURL} alt={name} className="w-full h-full object-cover" />
          ) : (
            <User size={20} />
          )}
        </div>

        {/* Name & Role */}
        <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
          <h3 className="text-sm font-bold text-slate-800 leading-tight tracking-tight">{name}</h3>
          <span className="text-[11px] text-slate-400 font-medium tracking-wide">{role}</span>
        </div>
      </div>

      {/* Tags + Age (only if age is set) */}
      <div className="flex flex-row gap-1.5">
        {tags && tags.slice(0, 2).map(t => {
          // Make tag clickable if it's a Gotra (not "Male"/"Female")
          const isGotraTag = t !== 'Male' && t !== 'Female';
          return (
            <Tag 
               key={t} 
               text={t} 
               onClick={isGotraTag && onTagClick ? () => onTagClick(t, personId) : undefined} 
            />
          );
        })}
        
        {/* Age Tag - only shows when age is set */}
        {personId && age !== null && (
          <span
            className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-wider"
          >
            {age} YEARS
          </span>
        )}
      </div>

      {/* Admin Buttons - only show in admin mode */}
      {isAdminMode && personId && (
        <div className="flex gap-2 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditName(name);
              setEditGender(gender);
              setEditDob(dob || '');
              setShowAdminEdit(true);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100"
          >
            <Edit2 size={12} />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      )}

      {/* Set DOB Button - only shows when age is NOT set AND not in admin mode */}
      {personId && age === null && !isAdminMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditModalOpen(true);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          <Plus size={12} />
          Set DOB
        </button>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditModalOpen(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 w-96 animate-in fade-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Edit {name}'s DOB</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(false);
                }}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Minus size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={editDob}
                onChange={(e) => setEditDob(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={!editDob}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 w-96 animate-in fade-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Delete {name}?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this person? All references will be removed from the family tree.
            </p>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {showAdminEdit && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowAdminEdit(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 w-96 animate-in fade-in zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Edit {name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAdminEdit(false);
                }}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Minus size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(capitalizeName(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Gender
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditGender('male');
                    }}
                    className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-colors ${
                      editGender === 'male'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditGender('female');
                    }}
                    className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-colors ${
                      editGender === 'female'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAdminEdit(false);
                }}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdminSave();
                }}
                disabled={!editName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NodeCard = ({ node, toggleExpand, isExpanded, hasChildren, onTagClick, isAdminMode, isHighlighted }) => {
  const isCouple = !!node.partner;

  return (
    <motion.div 
      id={`node-${node.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative z-10 group`}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Animated Highlight Effect */}
      {isHighlighted && (
        <>
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.8, 0.4, 0.8]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.5), 0 0 60px 10px rgba(14, 165, 233, 0.3)',
              zIndex: -1
            }}
          />
          
          {/* Middle ring with different timing */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.3, 0.6]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
            style={{
              boxShadow: '0 0 0 8px rgba(14, 165, 233, 0.4), 0 0 40px 8px rgba(14, 165, 233, 0.2)',
              zIndex: -2
            }}
          />

          {/* Inner shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{ zIndex: -3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-200/40 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>

          {/* Static glow base */}
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              boxShadow: '0 0 0 2px rgba(14, 165, 233, 0.8), 0 0 30px rgba(14, 165, 233, 0.5)',
              zIndex: -4
            }}
          />
        </>
      )}
      
      {/* Main Card */}
      <div 
        onClick={(e) => {
          if(hasChildren) {
             e.stopPropagation();
             toggleExpand();
          }
        }}
        className={`
          relative bg-white/95 backdrop-blur-sm rounded-2xl
          shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] 
          hover:shadow-[0_20px_40px_-6px_rgba(0,0,0,0.1)] 
          border border-white/50 ring-1 ring-slate-200
          transition-all duration-300 ease-out
          cursor-pointer overflow-visible
          ${isCouple ? 'px-8 py-4 min-w-[480px]' : 'px-6 py-4 min-w-[280px]'}
        `}
      >
        {/* --- DEDICATED CONNECTOR FOR COUPLES --- */}
        {isCouple && (
            <div className="absolute top-0 right-1/2 left-[44px] h-6 pointer-events-none">
                <div className="w-full h-full border-t-[2px] border-l-[2px] border-slate-300 rounded-tl-xl -mt-[1px]" />
                <div className="absolute bottom-0 -left-[3px] w-1.5 h-1.5 bg-slate-300 rounded-full" />
            </div>
        )}

        <div className="flex items-center justify-between relative z-10">
            {/* Left Person (Dad/Husband) */}
            <ProfileBlock 
                name={node.name} 
                role={node.role} 
                tags={node.tags} 
                color={node.color}
                personId={node.id}
                dob={node.dob}
                gender={node.gender}
                photoURL={node.photoURL}
                onTagClick={onTagClick}
                isAdminMode={isAdminMode}
            />

            {/* Center Heart Connector */}
            {isCouple && (
                <div className="flex flex-col items-center justify-center px-6 relative h-full">
                    {/* Horizontal connector behind heart (The Union Line) */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 rounded-full" />
                    
                    {/* Heart Icon */}
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 z-10">
                        <Heart size={16} fill="currentColor" className="animate-pulse" />
                    </div>

                    {/* Vertical Line descending from heart - OUTGOING to Children */}
                    {hasChildren && isExpanded && (
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300 h-20 -z-20"></div>
                    )}
                </div>
            )}

            {/* Right Person (Mom/Wife) */}
            {isCouple && (
                <ProfileBlock 
                    name={node.partner.name} 
                    role={node.partner.role} 
                    tags={node.partner.tags} 
                    color={node.partner.color}
                    personId={node.partner.id}
                    dob={node.partner.dob}
                    gender={node.partner.gender}
                    photoURL={node.partner.photoURL}
                    align="right"
                    onTagClick={onTagClick}
                    isAdminMode={isAdminMode}
                />
            )}

            {/* Single Parent Expand Button */}
            {!isCouple && hasChildren && (
                 <button 
                 className={`
                   ml-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                   ${isExpanded 
                     ? 'bg-slate-100 text-slate-500 rotate-0' 
                     : 'bg-indigo-50 text-indigo-600 -rotate-90'}
                 `}
               >
                 {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
               </button>
            )}
        </div>

        {/* Couple Expand Button (Bottom Center) */}
        {isCouple && hasChildren && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex justify-center w-full z-30">
                 <button 
                 className={`
                   w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-md transition-all
                   ${isExpanded 
                     ? 'bg-slate-50 text-slate-400 border-slate-200' 
                     : 'bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-600'}
                 `}
               >
                 {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
               </button>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default NodeCard;
