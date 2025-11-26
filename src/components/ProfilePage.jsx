import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFamily } from '../context/FamilyContext';
import { X, Camera, Upload, Trash2, User, Users, CheckCircle2, AlertCircle, Link as LinkIcon, Edit2, Check } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { capitalizeName } from '../utils/textUtils';

export default function ProfilePage({ onClose }) {
  const { user, userProfile, database, uploadProfilePhoto, deleteProfilePhoto } = useFamily();
  const [linkedPerson, setLinkedPerson] = useState(null);
  const [spouse, setSpouse] = useState(null);
  const [children, setChildren] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [matchingPeople, setMatchingPeople] = useState([]);
  const [isLinking, setIsLinking] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [parents, setParents] = useState({ mother: null, father: null });
  const [siblings, setSiblings] = useState([]);

  // Find matching people in database
  useEffect(() => {
    if (!userProfile || userProfile.linkedPersonId || !database) return;

    // Search for people with matching name and Gotra
    const matches = database.filter(p => 
      p.name.toLowerCase() === userProfile.name.toLowerCase() &&
      p.birthGotra === userProfile.gotra
    );
    
    setMatchingPeople(matches);
  }, [userProfile, database]);

  useEffect(() => {
    if (!userProfile?.linkedPersonId || !database) return;

    // Find linked person
    const person = database.find(p => p.id === userProfile.linkedPersonId);
    
    // If linked person doesn't exist (deleted), clear the link
    if (!person) {
      console.log('Linked person not found, clearing link...');
      // Clear the linkedPersonId from user profile
      updateDoc(doc(db, 'users', user.uid), {
        linkedPersonId: null
      }).catch(error => console.error('Error clearing link:', error));
      setLinkedPerson(null);
      return;
    }
    
    setLinkedPerson(person);

    // Find parents
    const mother = person.motherId ? database.find(p => p.id === person.motherId) : null;
    const father = person.fatherId ? database.find(p => p.id === person.fatherId) : null;
    setParents({ mother, father });

    // Find spouse
    if (person.spouseId) {
      const spousePerson = database.find(p => p.id === person.spouseId);
      setSpouse(spousePerson);
    } else {
      setSpouse(null);
    }

    // Find children (sons/daughters)
    const kids = database.filter(p => 
      p.fatherId === person.id || p.motherId === person.id
    );
    setChildren(kids);

    // Find siblings (only if not married)
    if (!person.spouseId && (person.fatherId || person.motherId)) {
      const siblings = database.filter(p => 
        p.id !== person.id && // Not themselves
        (
          (person.fatherId && p.fatherId === person.fatherId) || // Same father
          (person.motherId && p.motherId === person.motherId)    // Same mother
        )
      );
      setSiblings(siblings);
    } else {
      setSiblings([]);
    }
  }, [userProfile, database, user]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !linkedPerson) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      await uploadProfilePhoto(file, linkedPerson.id);
    } catch (error) {
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!linkedPerson || !linkedPerson.photoURL) return;
    
    if (!confirm('Delete your profile photo?')) return;

    try {
      await deleteProfilePhoto(linkedPerson.id);
    } catch (error) {
      alert('Failed to delete photo. Please try again.');
    }
  };

  const isPersonLinkedToUser = (personId) => {
    if (!database) return false;
    const person = database.find(p => p.id === personId);
    return person?.linkedUserId != null;
  };

  const handleLinkPerson = async (personId) => {
    if (!user) return;
    
    setIsLinking(true);
    try {
      // Link person to user
      await updateDoc(doc(db, 'people', personId), {
        linkedUserId: user.uid
      });
      
      // Update user profile
      await updateDoc(doc(db, 'users', user.uid), {
        linkedPersonId: personId
      });
      
      // Clear matching people list
      setMatchingPeople([]);
    } catch (error) {
      console.error('Error linking:', error);
      alert('Failed to link profile. Please try again.');
    } finally {
      setIsLinking(false);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || !linkedPerson) return;
    
    setIsSavingName(true);
    try {
      // Update linked person in Firestore
      await updateDoc(doc(db, 'people', linkedPerson.id), {
        name: editedName.trim()
      });
      
      // Update user profile
      await updateDoc(doc(db, 'users', user.uid), {
        name: editedName.trim()
      });
      
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name. Please try again.');
    } finally {
      setIsSavingName(false);
    }
  };

  const getFatherName = (person) => {
    if (!person.fatherId || !database) return null;
    const father = database.find(p => p.id === person.fatherId);
    return father ? father.name : null;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-all backdrop-blur-sm border border-slate-700"
      >
        <X size={24} />
      </button>

      <div className="min-h-screen flex items-center justify-center p-4 pt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
            <p className="text-indigo-100 text-sm">{user?.email}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Photo - Show even if not linked */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {linkedPerson?.photoURL ? (
                  <img
                    src={linkedPerson.photoURL}
                    alt={userProfile?.name || user?.displayName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600">
                    <User size={48} className="text-slate-400" />
                  </div>
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Photo Actions - Only if linked */}
              {linkedPerson && (
                <div className="mt-4 flex gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                    <Upload size={16} />
                    {linkedPerson.photoURL ? 'Change Photo' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  
                  {linkedPerson.photoURL && (
                    <button
                      onClick={handlePhotoDelete}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* User Info - Always show from userProfile */}
            <div className="bg-slate-700/50 rounded-2xl p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400 uppercase tracking-wide">Name</label>
                  {linkedPerson && !isEditingName && (
                    <button
                      onClick={() => {
                        setEditedName(linkedPerson.name);
                        setIsEditingName(true);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                  )}
                </div>
                
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(capitalizeName(e.target.value))}
                      className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={!editedName.trim() || isSavingName}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-1"
                    >
                      <Check size={14} />
                      {isSavingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditedName('');
                      }}
                      className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-white">
                    {userProfile?.name || linkedPerson?.name || user?.displayName || 'Unknown'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wide">Gotra</label>
                <p className="text-lg font-bold text-indigo-400">
                  {userProfile?.gotra || linkedPerson?.birthGotra || 'Not set'}
                </p>
              </div>
              {!linkedPerson && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-300">
                    <AlertCircle size={14} className="inline mr-1" />
                    Not linked to family tree yet
                  </p>
                </div>
              )}
            </div>

            {linkedPerson ? (
              /* Linked - Show Family Members */
              <>
                {/* Family Members Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Family</h3>
                  
                  {/* Parents - Always show */}
                  {(parents.mother || parents.father) && (
                    <div>
                      <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Parents</div>
                      <div className="space-y-2">
                        {parents.father && (
                          <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl">
                            <div>
                              <p className="font-bold text-white text-sm">{parents.father.name}</p>
                              <p className="text-xs text-slate-400">Father</p>
                            </div>
                            {isPersonLinkedToUser(parents.father.id) ? (
                              <CheckCircle2 size={18} className="text-emerald-500" title="Logged in" />
                            ) : (
                              <div className="text-xs text-slate-500">
                                Not logged in
                              </div>
                            )}
                          </div>
                        )}
                        {parents.mother && (
                          <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl">
                            <div>
                              <p className="font-bold text-white text-sm">{parents.mother.name}</p>
                              <p className="text-xs text-slate-400">Mother</p>
                            </div>
                            {isPersonLinkedToUser(parents.mother.id) ? (
                              <CheckCircle2 size={18} className="text-emerald-500" title="Logged in" />
                            ) : (
                              <div className="text-xs text-slate-500">
                                Not logged in
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* If married: Show spouse & children */}
                  {spouse && (
                    <>
                      <div>
                        <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                          {linkedPerson.gender === 'male' ? 'Wife' : 'Husband'}
                        </div>
                        <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl">
                          <div>
                            <p className="font-bold text-white text-sm">{spouse.name}</p>
                            <p className="text-xs text-slate-400">{spouse.birthGotra} Gotra</p>
                          </div>
                          {isPersonLinkedToUser(spouse.id) && (
                            <CheckCircle2 size={18} className="text-emerald-500" title="Logged in" />
                          )}
                        </div>
                      </div>

                      {children.length > 0 && (
                        <div>
                          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Children</div>
                          <div className="space-y-2">
                            {children.map(child => (
                              <div key={child.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl">
                                <div>
                                  <p className="font-bold text-white text-sm">{child.name}</p>
                                  <p className="text-xs text-slate-400">
                                    {child.gender === 'male' ? 'Son' : 'Daughter'}
                                  </p>
                                </div>
                                {isPersonLinkedToUser(child.id) ? (
                                  <CheckCircle2 size={18} className="text-emerald-500" title="Logged in" />
                                ) : (
                                  <div className="text-xs text-slate-500">
                                    Not logged in
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* If NOT married: Show siblings */}
                  {!spouse && siblings.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Siblings</div>
                      <div className="space-y-2">
                        {siblings.map(sibling => (
                          <div key={sibling.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl">
                            <div>
                              <p className="font-bold text-white text-sm">{sibling.name}</p>
                              <p className="text-xs text-slate-400">
                                {sibling.gender === 'male' ? 'Brother' : 'Sister'}
                              </p>
                            </div>
                            {isPersonLinkedToUser(sibling.id) ? (
                              <CheckCircle2 size={18} className="text-emerald-500" title="Logged in" />
                            ) : (
                              <div className="text-xs text-slate-500">
                                Not logged in
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Family Members */}
                  {!parents.mother && !parents.father && !spouse && siblings.length === 0 && children.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      No family members recorded yet
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Not Linked - Show Matching People or Message */
              <div className="space-y-4">
                {matchingPeople.length > 0 ? (
                  <>
                    <div className="text-center py-4">
                      <h3 className="text-lg font-bold text-white mb-2">Is this you?</h3>
                      <p className="text-sm text-slate-400">We found matching entries in the family tree</p>
                    </div>
                    
                    <div className="space-y-2">
                      {matchingPeople.map(person => {
                        const fatherName = getFatherName(person);
                        return (
                          <div key={person.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-bold text-white mb-1">{person.name}</p>
                                {fatherName && (
                                  <p className="text-sm text-slate-300">
                                    {person.gender === 'male' ? 'Son' : 'Daughter'} of {fatherName}
                                  </p>
                                )}
                                <p className="text-xs text-slate-400 mt-1">
                                  Gotra: {person.birthGotra} • Gen {person.generation}
                                </p>
                              </div>
                              <button
                                onClick={() => handleLinkPerson(person.id)}
                                disabled={isLinking}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap"
                              >
                                <LinkIcon size={16} />
                                {isLinking ? 'Linking...' : 'Link'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">
                      Add yourself to the family tree using the Gotra Map, then you'll be able to link your profile and upload photos.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
