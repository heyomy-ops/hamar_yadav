import React, { useState, useEffect, useRef } from 'react';
import { Search, Activity, Heart, Info, Plus, Trash2, Users, CheckCircle2, RefreshCw, X, User } from 'lucide-react';
import { useFamily } from '../context/FamilyContext';
import { GOTRA_LIST, GOTRA_COLORS } from '../constants/gotras';
import { capitalizeName } from '../utils/textUtils';

// --- Constants imported from shared file ---



// --- COMPONENTS ---

const SelectGotraStep = ({ onSelect }) => (
  <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 relative z-20">
    <div className="flex items-center gap-3 mb-4">
       <div className="bg-slate-100 p-2 rounded-full"><Users size={24} className="text-slate-700"/></div>
       <div>
         <h2 className="text-2xl font-bold text-slate-800">Identify Gotra</h2>
         <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Step 1 of 4</p>
       </div>
    </div>
    
    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-6 flex gap-3">
      <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
      <p className="text-blue-800 text-sm">Select the <strong>Father's Lineage</strong> (Gotra) to begin.</p>
    </div>
    
    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
      {GOTRA_LIST.map(g => (
        <button 
          key={g} 
          onClick={() => onSelect(g)} 
          className="group relative overflow-hidden p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-left shadow-sm hover:shadow-md bg-white"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-full opacity-10" style={{backgroundColor: GOTRA_COLORS[g]}}></div>
          <div className="absolute top-0 left-0 w-1.5 h-full" style={{backgroundColor: GOTRA_COLORS[g]}}></div>
          <span className="relative z-10 font-bold text-slate-700 group-hover:translate-x-1 transition-transform block">{g}</span>
        </button>
      ))}
    </div>
  </div>
);

const FindFatherStep = ({ 
  database, selectedGotra, searchQuery, setSearchQuery, onSelectFather, onCreateFather, onBack, onChangeHead 
}) => {
  const candidates = database.filter(p => p.currentGotra === selectedGotra && p.gender === 'male' && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // Find current head (Generation 1)
  const currentHead = database.find(p => p.currentGotra === selectedGotra && p.gender === 'male' && p.generation === 1);
  
  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-right relative z-20">
      <div className="flex justify-between items-start mb-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Who is the Head?</h2>
           <p className="text-slate-500 text-sm">Searching in <strong style={{color: GOTRA_COLORS[selectedGotra]}}>{selectedGotra}</strong> Gotra</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded">CHANGE</button>
      </div>

      {/* Current Head Display */}
      {currentHead && (
        <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Current Head (Gen 1)</p>
              <h3 className="text-lg font-bold text-slate-800">{currentHead.name}</h3>
            </div>
            <button 
              onClick={() => onChangeHead(currentHead)}
              className="px-3 py-1.5 bg-white hover:bg-indigo-50 border-2 border-indigo-300 text-indigo-700 rounded-lg text-xs font-bold transition-all hover:scale-105"
            >
              Change Head
            </button>
          </div>
        </div>
      )}

      <div className="relative mb-4 group">
        <Search className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text" 
          autoFocus 
          placeholder="Search Father's Name..." 
          className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          value={searchQuery} 
          onChange={e => setSearchQuery(capitalizeName(e.target.value))} 
        />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto mb-2 custom-scrollbar">
        {candidates.map(p => (
          <button key={p.id} onClick={() => onSelectFather(p)} className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 group transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold group-hover:bg-white group-hover:text-blue-600 transition-colors">{p.name[0]}</div>
              <div className="text-left">
                <div className="font-bold text-slate-700">{p.name}</div>
                <div className="text-xs text-slate-400">Generation {p.generation}</div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Plus size={16} />
            </div>
          </button>
        ))}
        {candidates.length === 0 && searchQuery.length > 2 && (
            <button onClick={onCreateFather} className="w-full py-4 text-blue-600 font-bold text-sm bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 border-dashed animate-in fade-in">
                + Create New Head: "{searchQuery}"
            </button>
        )}
      </div>
    </div>
  );
};

const AddMotherStep = ({ father, motherName, setMotherName, motherMaidenGotra, setMotherMaidenGotra, selectedGotra, onContinue, gotraList, onAddGotra }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newGotra, setNewGotra] = useState('');

  const handleAddNew = async () => {
     if(newGotra.trim()) {
         await onAddGotra(newGotra.trim());
         setMotherMaidenGotra(newGotra.trim());
         setIsAddingNew(false);
     }
  };

  return (
  <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-right border-t-4 border-pink-400 relative z-20">
    <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Who is the Wife?</h2>
        <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">Husband: {father?.name}</span>
        </div>
    </div>
    
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Wife's Name</label>
        <input type="text" autoFocus value={motherName} onChange={(e) => setMotherName(capitalizeName(e.target.value))} className="w-full p-3 mt-1 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all" placeholder="Enter name..." />
      </div>
      
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
        <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-1.5 rounded-full text-amber-600 mt-1"><Users size={16} /></div>
            <div className="flex-1">
                <label className="block text-sm font-bold text-amber-900 mb-1">Her Maiden Lineage</label>
                <p className="text-xs text-amber-700/80 mb-3 leading-relaxed">This is critical. Which clan did she belong to <strong>before</strong> marriage?</p>
                
                {!isAddingNew ? (
                    <div className="space-y-2">
                        <select 
                        value={motherMaidenGotra || ''}
                        className="w-full p-2.5 rounded-lg border border-amber-200 bg-white text-slate-800 font-medium text-sm outline-none focus:border-amber-400" 
                        onChange={(e) => {
                            if(e.target.value === 'ADD_NEW') {
                                setIsAddingNew(true);
                                setMotherMaidenGotra('');
                            } else {
                                setMotherMaidenGotra(e.target.value);
                            }
                        }}
                        >
                        <option value="">Select Gotra...</option>
                        {gotraList.filter(g => g !== selectedGotra).map(g => (<option key={g} value={g}>{g}</option>))}
                        <option value="ADD_NEW" className="font-bold text-indigo-600">+ Add New Gotra</option>
                        </select>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newGotra} 
                            onChange={(e) => setNewGotra(capitalizeName(e.target.value))}
                            placeholder="Enter Gotra Name"
                            className="flex-1 p-2.5 rounded-lg border border-indigo-300 bg-white text-slate-800 font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                        <button 
                            onClick={handleAddNew}
                            disabled={!newGotra.trim()}
                            className="bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold text-xs disabled:opacity-50"
                        >
                            Add
                        </button>
                        <button 
                            onClick={() => setIsAddingNew(false)}
                            className="text-slate-400 hover:text-slate-600 px-2"
                        >
                            Cancel
                        </button>
                    </div>
                )}
          </div>
        </div>
      </div>
    </div>
    <button disabled={!motherName || !motherMaidenGotra} onClick={onContinue} className="w-full mt-6 bg-slate-800 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 shadow-lg hover:shadow-xl transition-all transform active:scale-95">
        Continue to Children
    </button>
  </div>
  );
};

const AddChildrenStep = ({ father, motherName, existingChildren, childrenList, onChildChange, onRemoveRow, onAddRow, onSave, selectedGotra, error, database }) => {
  const [showAddForm, setShowAddForm] = useState(existingChildren.length === 0);

  // Helper to find potential match
  const findMatch = (name) => {
    if (!name || name.length < 2 || !database) return null;
    return database.find(p => 
      p.birthGotra === selectedGotra && // Born in this gotra
      p.name.toLowerCase() === name.toLowerCase() && // Name matches
      !p.fatherId // Not already linked to a father
    );
  };

  // Helper to get spouse name
  const getSpouseName = (person) => {
    if (!person || !person.spouseId) return null;
    const spouse = database.find(p => p.id === person.spouseId);
    return spouse ? spouse.name : null;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-right relative z-20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Family Members</h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-slate-500">
             <span className="font-semibold">{father?.name}</span>
             <Heart size={14} className="text-pink-400 fill-pink-400" />
             <span className="font-semibold">{motherName}</span>
          </div>
        </div>
  
        {/* --- SHOW EXISTING SIBLINGS SECTION --- */}
        {existingChildren.length > 0 && (
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Already in Database</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {existingChildren.map(child => (
                        <div key={child.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                            <span className="text-sm font-semibold text-slate-700">{child.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${child.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                {child.gender === 'male' ? 'Son' : 'Daughter'}
                            </span>
                        </div>
                    ))}
                </div>
                
                {!showAddForm && (
                  <div className="mt-4 flex flex-col gap-3">
                      <button 
                        onClick={onSave} 
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                      >
                         <CheckCircle2 size={18} /> This is my Family (All Good)
                      </button>
                      <button 
                        onClick={() => setShowAddForm(true)}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
                      >
                         I don't see my name (Add New)
                      </button>
                  </div>
                )}
            </div>
        )}
  
        {/* --- INPUT FORM FOR NEW CHILDREN --- */}
        {showAddForm && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 mt-4">Add New Children</div>
            
            {/* Validation Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2 animate-in shake">
                    <Info size={16} className="shrink-0" />
                    {error}
                </div>
            )}

            <div className="space-y-3 mb-6 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
              {childrenList.map((child, idx) => {
                  const match = !child.existingId ? findMatch(child.name) : null;
                  const spouseName = match ? getSpouseName(match) : null;

                  return (
                  <div key={idx} className="animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex gap-2 items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0 shadow-inner">{idx + 1}</div>
                          <input 
                            type="text" 
                            autoFocus={idx === childrenList.length - 1 && childrenList.length > 1}
                            placeholder="Child Name"
                            value={child.name}
                            onChange={(e) => onChildChange(idx, 'name', capitalizeName(e.target.value))}
                            disabled={!!child.existingId} // Disable editing if linked
                            className={`flex-1 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all ${!child.gender && child.name.trim() && error ? 'border-red-300 bg-red-50' : 'border-slate-200'} ${child.existingId ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : ''}`}
                          />
                          <div className="flex bg-slate-100 rounded-xl p-1 shrink-0">
                              <button 
                                onClick={() => onChildChange(idx, 'gender', 'male')}
                                disabled={!!child.existingId}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${child.gender === 'male' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:bg-white hover:text-blue-500'}`}
                                title="Son"
                              ><User size={14} /></button>
                              <button 
                                onClick={() => onChildChange(idx, 'gender', 'female')}
                                disabled={!!child.existingId}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${child.gender === 'female' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400 hover:bg-white hover:text-pink-500'}`}
                                title="Daughter"
                              ><User size={14} /></button>
                          </div>
                          {childrenList.length > 1 && (
                              <button onClick={() => onRemoveRow(idx)} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                          )}
                      </div>

                      {/* Suggestion Box */}
                      {match && (
                        <div className="mt-2 ml-10 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
                          <div>
                            <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide mb-0.5">Found Match</div>
                            <div className="text-xs text-slate-600">
                                Is this <strong>{match.name}</strong>
                                {spouseName ? ` (Wife of ${spouseName})` : ` (from ${match.currentGotra})`}?
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                                onChildChange(idx, 'existingId', match.id);
                                onChildChange(idx, 'gender', match.gender); 
                                onChildChange(idx, 'name', match.name); // Normalize name
                            }}
                            className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                          >
                            Yes, Link
                          </button>
                        </div>
                      )}

                      {/* Linked State */}
                      {child.existingId && (
                          <div className="mt-2 ml-10 p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between animate-in fade-in">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-700">Linked to existing record</span>
                            </div>
                            <button onClick={() => {
                                onChildChange(idx, 'existingId', null);
                                // Optional: Reset gender/name if needed, but keeping them is fine
                            }} className="text-xs text-red-500 hover:text-red-700 font-semibold hover:underline">Undo</button>
                          </div>
                      )}
                  </div>
                  );
              })}
            </div>
      
            <div className="flex gap-3 mb-4">
              <button onClick={onAddRow} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm">
                  <Plus size={16} /> Add Another
              </button>
            </div>
            
            <button 
                onClick={onSave}
                disabled={childrenList.some(c => !c.name.trim())}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 text-sm mb-4"
            >
                  Save Family
              </button>
          </div>
        )}
  
        {showAddForm && existingChildren.length === 0 && (
          <div className="text-center pt-2 border-t border-slate-100">
            <button 
                onClick={onSave} 
                className="text-slate-400 text-xs font-semibold hover:text-slate-600 hover:underline decoration-slate-300 underline-offset-2 transition-all px-4 py-2"
            >
                I don't have children (Save Couple Only)
            </button>
          </div>
        )}
    </div>
  );
};

const SuccessStep = ({ motherName, father, displayedChildren, selectedGotra, motherMaidenGotra, onReset, onContinueAsChild, database }) => (
  <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in text-center relative z-20">
    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-4 ring-4 ring-emerald-50"><Activity size={32} /></div>
    <h2 className="text-2xl font-bold text-slate-800 mb-1">Family Verified!</h2>
    <p className="text-slate-500 mb-6 text-sm">Select a family member to continue the line.</p>
    
    <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 mb-6 text-sm backdrop-blur-sm">
      <div className="flex items-center justify-center gap-6 mb-5 border-b border-slate-200 pb-4">
            <div className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold shadow-md" style={{backgroundColor: GOTRA_COLORS[selectedGotra]}}>{father?.name[0]}</div>
                <div className="text-xs font-bold text-slate-700">{father?.name}</div>
            </div>
            <div className="h-px bg-slate-300 w-8 relative"><Heart size={14} className="absolute -top-2 left-2 text-pink-400 bg-slate-50 px-0.5" /></div>
            <div className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold shadow-md" style={{backgroundColor: motherMaidenGotra ? GOTRA_COLORS[motherMaidenGotra] : '#ccc'}}>{motherName[0]}</div>
                <div className="text-xs font-bold text-slate-700">{motherName}</div>
            </div>
      </div>
      <div className="grid grid-cols-1 gap-2 text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Children ({displayedChildren.length})</p>
          
          {displayedChildren.length === 0 && (
             <p className="text-xs text-slate-400 italic text-center py-2">No children recorded.</p>
          )}

          {displayedChildren.map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm group">
                  <div className={`w-2 h-2 rounded-full ${c.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
                  <span className="text-sm font-semibold text-slate-700 flex-1">{c.name}</span>
                  
                  {/* The Magic "Continue" Button - ONLY FOR MALES */}
                  {c.gender === 'male' && (
                    (() => {
                        // Check if this child already has a family (children where he is father)
                        const hasFamily = database && database.some(p => p.fatherId === c.id);
                        
                        return (
                            <button 
                              onClick={() => !hasFamily && onContinueAsChild(i)}
                              disabled={hasFamily}
                              className={`flex items-center gap-1 text-[10px] px-3 py-1.5 rounded-md font-bold transition-all ${
                                hasFamily 
                                  ? 'bg-emerald-50 text-emerald-600 cursor-default' 
                                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                              }`}
                            >
                              {hasFamily ? (
                                <>
                                  <CheckCircle2 size={12} /> FAMILY ADDED
                                </>
                              ) : (
                                <>
                                  <Plus size={12} /> ADD FAMILY
                                </>
                              )}
                            </button>
                        );
                    })()
                  )}
              </div>
          ))}
      </div>
    </div>

    <button onClick={onReset} className="flex items-center justify-center gap-2 w-full py-3 text-slate-400 font-semibold hover:text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-colors">
      <RefreshCw size={16} /> Return to Main Menu
    </button>
  </div>
);



// --- MAIN COMPONENT ---

const LinkFatherStep = ({ newFatherName, database, selectedGotra, onLink, onReverseLink, onSkip, onBack, headToChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempNewFatherName, setTempNewFatherName] = useState(newFatherName || ''); // Local state for new father name
  // If headToChange exists, start in descendant mode, otherwise ancestor mode
  const [mode, setMode] = useState(headToChange ? 'descendant' : 'ancestor');

  // Candidates for Father (Ancestors)
  const ancestors = database.filter(p => 
    p.currentGotra === selectedGotra && 
    p.gender === 'male' && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Candidates for Child (Existing Roots - Gen 1)
  const descendants = database.filter(p => 
    p.currentGotra === selectedGotra && 
    p.gender === 'male' && 
    p.generation === 1 && // Only show current roots
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in slide-in-from-right relative z-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Link Family</h2>
        <p className="text-slate-500 text-sm">
          {headToChange ? 'Add a new father above the current head.' : `Connecting ${tempNewFatherName || newFatherName} to the tree.`}
        </p>
      </div>

      {/* Name input when changing head */}
      {headToChange && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">New Father's Name</label>
          <input
            type="text"
            value={tempNewFatherName}
            onChange={(e) => setTempNewFatherName(capitalizeName(e.target.value))}
            placeholder="Enter new father's name..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      )}

      {/* Mode Switcher - Hidden when changing head */}
      {!headToChange && (
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button 
              onClick={() => { setMode('ancestor'); setSearchQuery(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'ancestor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Find his Father
            </button>
            <button 
              onClick={() => { setMode('descendant'); setSearchQuery(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'descendant' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Find his Son (Existing)
            </button>
        </div>
      )}

      {/* Info banner when changing head */}
      {headToChange && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>Changing Head:</strong> Select {headToChange.name} below to make them the son of a new father.
          </p>
        </div>
      )}

      <div className="relative mb-4 group">
        <Search className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text" 
          autoFocus 
          placeholder={mode === 'ancestor' ? "Search Father's Father..." : "Search Existing Son..."}
          className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
          value={searchQuery} 
          onChange={e => setSearchQuery(capitalizeName(e.target.value))} 
        />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
        {mode === 'ancestor' ? (
            ancestors.map(p => (
            <button key={p.id} onClick={() => onLink(p)} className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 group transition-all">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold group-hover:bg-white group-hover:text-blue-600 transition-colors">{p.name[0]}</div>
                <div className="text-left">
                    <div className="font-bold text-slate-700">{p.name}</div>
                    <div className="text-xs text-slate-400">Generation {p.generation}</div>
                </div>
                </div>
                <div className="text-xs font-bold text-blue-600 transition-opacity">
                    LINK FATHER
                </div>
            </button>
            ))
        ) : (
            descendants.map(p => (
            <button 
              key={p.id} 
              onClick={() => headToChange ? onReverseLink(p, tempNewFatherName) : onReverseLink(p)} 
              disabled={headToChange && !tempNewFatherName.trim()}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                headToChange && !tempNewFatherName.trim()
                  ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
                  : 'hover:bg-emerald-50 border-transparent hover:border-emerald-100 group'
              }`}
            >
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold group-hover:bg-white group-hover:text-emerald-600 transition-colors">{p.name[0]}</div>
                <div className="text-left">
                    <div className="font-bold text-slate-700">{p.name}</div>
                    <div className="text-xs text-slate-400">Current Head (Gen 1)</div>
                </div>
                </div>
                <div className="text-xs font-bold text-emerald-600 transition-opacity">
                    MAKE SON
                </div>
            </button>
            ))
        )}
        
        {((mode === 'ancestor' && ancestors.length === 0) || (mode === 'descendant' && descendants.length === 0)) && (
            <div className="text-center py-4 text-slate-400 text-sm italic">No matching people found.</div>
        )}
      </div>

      <div className="flex gap-3">
          <button onClick={onBack} className="px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Back</button>
          <button onClick={onSkip} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 shadow-lg transition-all">
              No Links / New Root
          </button>
      </div>
    </div>
  );
};

export default function LineageBuilder({ onClose }) {
  const { database, addPerson, updatePerson, selectedGotra, loading, gotraList, addNewGotra } = useFamily();
  const safeDatabase = Array.isArray(database) ? database : [];
  
  // Start directly at find-father since Gotra is global
  const [step, setStep] = useState('find-father');
  
  // Data State
  const [father, setFather] = useState(null);
  const [newFatherName, setNewFatherName] = useState(''); // Temp store for new father name
  const [existingMother, setExistingMother] = useState(null); 
  const [motherName, setMotherName] = useState('');
  const [motherMaidenGotra, setMotherMaidenGotra] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [childrenList, setChildrenList] = useState([{ name: '', gender: null }]);
  const [existingChildren, setExistingChildren] = useState([]); 
  const [lastAddedChildren, setLastAddedChildren] = useState([]);
  const [error, setError] = useState(null); // Add error state
  const [headToChange, setHeadToChange] = useState(null); // Track when changing head

  // Simulation State
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  
  // Initialize Simulation Nodes when DB changes
  useEffect(() => {
    const existingIds = new Set(nodesRef.current.map(n => n.id));
    
    const newNodes = safeDatabase.filter(p => !existingIds.has(p.id)).map(p => {
       const fatherNode = nodesRef.current.find(n => n.id === p.fatherId);
       const startX = fatherNode ? fatherNode.x + (Math.random() - 0.5) * 50 : Math.random() * window.innerWidth;
       const startY = fatherNode ? fatherNode.y + (Math.random() - 0.5) * 50 : Math.random() * window.innerHeight;

       return {
         ...p,
         x: startX,
         y: startY,
         vx: 0,
         vy: 0,
         radius: p.generation === 1 ? 8 : p.generation === 2 ? 6 : 4
       };
    });

    nodesRef.current = [...nodesRef.current, ...newNodes];
  }, [safeDatabase]);

  // Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let time = 0;

    const gotraCenters = {};
    GOTRA_LIST.forEach((g, i) => {
        const angle = (i / GOTRA_LIST.length) * Math.PI * 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.35;
        gotraCenters[g] = {
            x: canvas.width / 2 + Math.cos(angle) * radius,
            y: canvas.height / 2 + Math.sin(angle) * radius
        };
    });

    const render = () => {
      time += 0.01;
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        GOTRA_LIST.forEach((g, i) => {
            const angle = (i / GOTRA_LIST.length) * Math.PI * 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.35;
            gotraCenters[g] = {
                x: canvas.width / 2 + Math.cos(angle) * radius,
                y: canvas.height / 2 + Math.sin(angle) * radius
            };
        });
      }

      ctx.fillStyle = '#0f172a'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      Object.entries(gotraCenters).forEach(([g, pos]) => {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 40, 0, Math.PI * 2);
          ctx.fillStyle = GOTRA_COLORS[g];
          ctx.globalAlpha = 0.05;
          ctx.fill();
          ctx.globalAlpha = 1;
          
          ctx.fillStyle = GOTRA_COLORS[g];
          ctx.font = "bold 10px sans-serif";
          ctx.textAlign = "center";
          ctx.globalAlpha = 0.5;
          ctx.fillText(g, pos.x, pos.y + 60);
          ctx.globalAlpha = 1;
      });

      nodesRef.current.forEach(node => {
          const center = gotraCenters[node.birthGotra] || {x: canvas.width/2, y: canvas.height/2};
          const dx = center.x - node.x;
          const dy = center.y - node.y;
          node.vx += dx * 0.005; 
          node.vy += dy * 0.005;

          nodesRef.current.forEach(other => {
              if (node.id === other.id) return;
              const distDx = node.x - other.x;
              const distDy = node.y - other.y;
              const dist = Math.sqrt(distDx*distDx + distDy*distDy);
              const minDist = 30;
              if (dist < minDist) {
                  const force = (minDist - dist) / dist;
                  node.vx += distDx * force * 0.5;
                  node.vy += distDy * force * 0.5;
              }
          });

          if (node.fatherId) {
             const dad = nodesRef.current.find(n => n.id === node.fatherId);
             if (dad) {
                 const sx = dad.x - node.x;
                 const sy = dad.y - node.y;
                 node.vx += sx * 0.05;
                 node.vy += sy * 0.05;
             }
          }
          if (node.motherId) {
             const mom = nodesRef.current.find(n => n.id === node.motherId);
             if (mom) {
                 const sx = mom.x - node.x;
                 const sy = mom.y - node.y;
                 node.vx += sx * 0.02;
                 node.vy += sy * 0.02;
             }
          }

          node.vx *= 0.9;
          node.vy *= 0.9;
          node.x += node.vx;
          node.y += node.vy;
      });

      nodesRef.current.forEach(node => {
          if (node.fatherId) {
              const dad = nodesRef.current.find(n => n.id === node.fatherId);
              if (dad) {
                  ctx.beginPath();
                  ctx.moveTo(node.x, node.y);
                  ctx.lineTo(dad.x, dad.y);
                  ctx.strokeStyle = GOTRA_COLORS[node.birthGotra];
                  ctx.lineWidth = 1;
                  ctx.globalAlpha = 0.3;
                  ctx.stroke();
              }
          }
          if (node.motherId) {
            const mom = nodesRef.current.find(n => n.id === node.motherId);
            if (mom) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(mom.x, mom.y);
                ctx.strokeStyle = '#fff'; 
                ctx.setLineDash([2, 4]);
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 0.2;
                ctx.stroke();
                ctx.setLineDash([]);
            }
          }
      });

      nodesRef.current.forEach(node => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = GOTRA_COLORS[node.birthGotra];
          ctx.globalAlpha = 1;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = GOTRA_COLORS[node.birthGotra];
          ctx.globalAlpha = 0.15;
          ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // --- Handlers ---

  const handleSelectFather = (p) => {
    setFather(p);
    
    const kids = safeDatabase.filter(child => child.fatherId === p.id);
    
    if (kids.length > 0) {
        const momId = kids[0].motherId;
        const mom = safeDatabase.find(m => m.id === momId);
        
        if (mom) {
            setExistingMother(mom);
            setMotherName(mom.name);
            setMotherMaidenGotra(mom.birthGotra);
            setExistingChildren(kids);
            setStep('add-children');
        } else {
            setExistingMother(null);
            setMotherName('');
            setMotherMaidenGotra(null);
            setExistingChildren([]);
            setStep('add-mother');
        }
    } else {
        setExistingMother(null);
        setMotherName('');
        setMotherMaidenGotra(null);
        setExistingChildren([]);
        setStep('add-mother');
    }
  };

  const handleCreateFather = () => {
    // Check if a Gen 1 head already exists
    const existingHead = safeDatabase.find(p => p.currentGotra === selectedGotra && p.gender === 'male' && p.generation === 1);
    
    if (!existingHead) {
      // NO HEAD - Create New Father as Head
      const newFather = { 
        name: searchQuery, 
        gender: 'male', 
        birthGotra: selectedGotra, 
        currentGotra: selectedGotra, 
        generation: 1
      };

      const doCreate = async () => {
          const docRef = await addPerson(newFather);
          if (docRef) {
              const fatherWithId = { ...newFather, id: docRef.id };
              setFather(fatherWithId);
              setExistingMother(null);
              setMotherName('');
              setMotherMaidenGotra(null);
              setExistingChildren([]);
              setStep('add-mother');
          }
      };
      doCreate();

    } else {
      // HEAD EXISTS - Go to link-father step for linking
      setNewFatherName(searchQuery);
      setStep('link-father');
    }
  };

  const handleLinkFather = async (ancestor) => {
    const newFather = { 
        name: newFatherName, 
        gender: 'male', 
        birthGotra: selectedGotra, 
        currentGotra: selectedGotra, 
        generation: ancestor.generation + 1,
        fatherId: ancestor.id 
    };
    
    const docRef = await addPerson(newFather);
    if (docRef) {
        const fatherWithId = { ...newFather, id: docRef.id };
        setFather(fatherWithId);
        setExistingMother(null);
        setMotherName('');
        setMotherMaidenGotra(null);
        setExistingChildren([]);
        setStep('add-mother');
    }
  };

  const handleReverseLink = async (child, customName) => {
      // Use customName if provided (when changing head), otherwise use newFatherName
      const fatherNameToUse = customName || newFatherName;
      
      // 1. Create new father at Gen 1
      const newFather = { 
        name: fatherNameToUse, 
        gender: 'male', 
        birthGotra: selectedGotra, 
        currentGotra: selectedGotra, 
        generation: 1 
      };

      const docRef = await addPerson(newFather);
      if (!docRef) return;
      
      const newFatherId = docRef.id;
      const fatherWithId = { ...newFather, id: newFatherId };

      // 2. Update child to link to new father
      // We need to fetch descendants to update their generation too.
      // This is complex to do purely with atomic updates without a backend function.
      // For now, we will just update the direct child.
      // Recursive generation updates are tricky in client-side only Firestore without reading all.
      // We'll assume for now we just update the child.
      
      // Note: The original code did recursive updates. To replicate that with Firestore:
      // We'd need to read all descendants and batch update them.
      // For this MVP refactor, let's just update the child and warn about generations if needed.
      // Or we can try to do it if we have the full DB in context (which we do via 'database').
      
      // We have 'database' from context which is synced with Firestore!
      // So we can calculate the updates locally and then batch write them.
      
      // Let's use the 'database' prop to find descendants.
      
      const getDescendants = (pId, allNodes) => {
         let descendants = [];
         const kids = allNodes.filter(n => n.fatherId === pId);
         descendants = [...descendants, ...kids];
         kids.forEach(k => {
             descendants = [...descendants, ...getDescendants(k.id, allNodes)];
         });
         return descendants;
      };
      
      const descendantsToUpdate = getDescendants(child.id, database);
      
      // Update child
      await updatePerson(child.id, { fatherId: newFatherId, generation: child.generation + 1 });
      
      // Update descendants
      for (const desc of descendantsToUpdate) {
          await updatePerson(desc.id, { generation: desc.generation + 1 });
      }

      setFather(fatherWithId);
      setExistingMother(null);
      setMotherName('');
      setMotherMaidenGotra(null);
      
      const updatedChild = { ...child, fatherId: newFatherId, generation: child.generation + 1 };
      setExistingChildren([updatedChild]);
      
      setStep('add-mother');
  };

  const handleSkipLink = async () => {
    const newFather = { 
        name: newFatherName, 
        gender: 'male', 
        birthGotra: selectedGotra, 
        currentGotra: selectedGotra, 
        generation: 1 
    };
    
    const docRef = await addPerson(newFather);
    if (docRef) {
        const fatherWithId = { ...newFather, id: docRef.id };
        setFather(fatherWithId);
        setExistingMother(null);
        setMotherName('');
        setMotherMaidenGotra(null);

        setExistingChildren([]);
        setStep('add-mother');
    }
  };

  const finishFlow = async () => {
    // Validation: Check if all new children have a gender
    const invalidChild = childrenList.find(c => c.name.trim() && !c.gender);
    if (invalidChild) {
        setError(`Please select a gender for ${invalidChild.name || 'the new child'}`);
        return;
    }
    setError(null);

    let momId = existingMother ? existingMother.id : null;
    
    // 1. Create Mother if needed
    if (!existingMother) {
        const newMother = {
            name: motherName,
            gender: 'female',
            birthGotra: motherMaidenGotra,
            currentGotra: selectedGotra,
            generation: (father.generation || 1),
            spouseId: father.id // Link to husband
        };
        const momRef = await addPerson(newMother);
        if (momRef) {
            momId = momRef.id;
            // Update father with spouseId
            await updatePerson(father.id, { spouseId: momId });
        }
    }

    // 2. Process Children
    const childrenToProcess = childrenList.filter(c => c.name.trim());
    const processedChildren = [];

    for (const c of childrenToProcess) {
        if (c.existingId) {
            // Existing person - update their parent links
            await updatePerson(c.existingId, {
                fatherId: father.id,
                motherId: momId,
                generation: (father.generation || 1) + 1
            });
            processedChildren.push({
                ...c,
                id: c.existingId,
                fatherId: father.id,
                motherId: momId
            });
        } else {
            // New child - create new record
            const newChildData = {
                name: c.name, 
                gender: c.gender, 
                birthGotra: selectedGotra, 
                currentGotra: selectedGotra, 
                generation: (father.generation || 1) + 1, 
                fatherId: father.id, 
                motherId: momId 
            };
            const childRef = await addPerson(newChildData);
            if (childRef) {
                processedChildren.push({
                    ...newChildData,
                    id: childRef.id
                });
            }
        }
    }
    
    setLastAddedChildren(processedChildren);
    setStep('success');
  };

  const continueAsChild = (idx) => {
      const child = lastAddedChildren[idx];
      setMotherName('');
      setMotherMaidenGotra(null);
      setChildrenList([{ name: '', gender: null }]);
      setFather(child);
      // Gotra is global, so we don't change it
      
      setExistingMother(null);
      setExistingChildren([]);
      
      setStep('add-mother'); 
  };

  const handleChangeHead = (currentHead) => {
    // Store the current head so we can auto-select them in link-father step
    setHeadToChange(currentHead);
    setNewFatherName(''); // Clear, user will type new name
    setStep('link-father'); // Go to link-father page
  };

  const resetFlow = () => {
      setChildrenList([{ name: '', gender: null }]);
      setMotherName('');
      setMotherMaidenGotra(null);
      setSearchQuery('');
      setExistingMother(null);
      setExistingChildren([]);
      setStep('find-father'); // Go back to find father, not select gotra
      setLastAddedChildren([]);
      setError(null);
      setHeadToChange(null); // Clear head change state
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-screen overflow-hidden bg-slate-900 font-sans">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all backdrop-blur-sm border border-slate-700"
      >
        <X size={24} />
      </button>

      <div className="relative z-10 w-full h-full overflow-y-auto flex flex-col items-center pt-24 md:pt-12 pb-24 px-4 pointer-events-none">
        
        <div className="mb-8 flex items-center gap-2 md:gap-3 bg-slate-900/80 backdrop-blur-md px-3 md:px-5 py-2 md:py-2.5 rounded-full border border-slate-700 shadow-xl pointer-events-auto">
           <Activity className="text-blue-500" size={16} />
           <span className="font-bold text-slate-100 tracking-wide text-xs md:text-sm">GOTRA MAP</span>
           <div className="h-4 w-px bg-slate-700 mx-0.5 md:mx-1"></div>
           <span className="text-slate-400 text-[10px] md:text-xs font-mono">{safeDatabase.length} NODES</span>
           <div className="h-4 w-px bg-slate-700 mx-0.5 md:mx-1 hidden sm:block"></div>
           <span className="text-emerald-400 text-[10px] md:text-xs font-bold uppercase hidden sm:inline">{selectedGotra}</span>
        </div>

        <div className="pointer-events-auto w-full max-w-md">
            {step === 'find-father' && selectedGotra && <FindFatherStep database={safeDatabase} selectedGotra={selectedGotra} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSelectFather={handleSelectFather} onCreateFather={handleCreateFather} onChangeHead={handleChangeHead} onBack={onClose} />}
            {step === 'link-father' && <LinkFatherStep newFatherName={newFatherName} database={safeDatabase} selectedGotra={selectedGotra} onLink={handleLinkFather} onReverseLink={handleReverseLink} onSkip={handleSkipLink} onBack={() => setStep('find-father')} headToChange={headToChange} />}
            {step === 'add-mother' && selectedGotra && <AddMotherStep father={father} motherName={motherName} setMotherName={setMotherName} motherMaidenGotra={motherMaidenGotra} setMotherMaidenGotra={setMotherMaidenGotra} selectedGotra={selectedGotra} onContinue={() => setStep('add-children')} gotraList={gotraList} onAddGotra={addNewGotra} />}
            {step === 'add-children' && selectedGotra && <AddChildrenStep father={father} motherName={motherName} existingChildren={existingChildren} childrenList={childrenList} onChildChange={(idx, f, v) => { const n = [...childrenList]; n[idx][f] = v; setChildrenList(n); }} onRemoveRow={(idx) => { const n=[...childrenList]; n.splice(idx,1); setChildrenList(n); }} onAddRow={() => setChildrenList([...childrenList, {name:'', gender: null}])} onSave={finishFlow} selectedGotra={selectedGotra} error={error} database={safeDatabase} />}
            {step === 'success' && selectedGotra && <SuccessStep motherName={motherName} father={father} displayedChildren={lastAddedChildren} selectedGotra={selectedGotra} motherMaidenGotra={motherMaidenGotra} onReset={resetFlow} onContinueAsChild={continueAsChild} database={safeDatabase} />}
        </div>
      </div>
    </div>
  );
}
