import React, { createContext, useContext, useState, useEffect } from 'react';
import { GOTRA_LIST } from '../constants/gotras';
import { auth, googleProvider, db } from '../firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';

const FamilyContext = createContext();

// --- Initial Data for Tree View ---
const INITIAL_TREE_DATA = null;

// --- Initial Data for Builder View ---
const INITIAL_DB = [];

export const FamilyProvider = ({ children }) => {
  const [familyData, setFamilyData] = useState(INITIAL_TREE_DATA);
  const [database, setDatabase] = useState(INITIAL_DB);
  const [loading, setLoading] = useState(true);
  
  // Auth State
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [gotraList, setGotraList] = useState(GOTRA_LIST); // Start with static, merge with DB
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Admin mode state
  const [isAdminMode, setIsAdminMode] = useState(false);

  // --- Auth & User Profile Listener ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setIsOnboarding(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Sync User Profile
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
        setIsOnboarding(false);
      } else {
        setUserProfile(null);
        setIsOnboarding(true); // User exists in Auth but not in DB -> Onboarding needed
      }
    });

    return () => unsubscribeProfile();
  }, [user]);

  // Sync Gotras
  useEffect(() => {
    const q = query(collection(db, 'gotras'), orderBy('name'));
    const unsubscribeGotras = onSnapshot(q, (snapshot) => {
      const dbGotras = snapshot.docs.map(d => d.data().name);
      // Merge unique gotras from static list and DB
      const merged = Array.from(new Set([...GOTRA_LIST, ...dbGotras])).sort();
      setGotraList(merged);
    });
    return () => unsubscribeGotras();
  }, []);

  // Register User Function
  const registerUser = async (name, gotra) => {
    if (!user) return;
    try {
      // 1. Save User Profile
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email: user.email,
        gotra: gotra,
        createdAt: new Date()
      });

      // 2. Save Gotra if it's new (check if in static list or current list)
      if (!GOTRA_LIST.includes(gotra)) {
        // Check if already in DB to avoid duplicates (though Set handles it in UI)
        // Ideally we check DB, but for now we just try to add if it doesn't exist
        // We can use setDoc with merge or just addDoc. 
        // Let's use a specific ID for gotra to avoid dups if we want, or just addDoc.
        // Simple approach: Add to 'gotras' collection.
        await addDoc(collection(db, 'gotras'), { name: gotra });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  // Add New Gotra Function
  const addNewGotra = async (gotraName) => {
    if (!gotraName) return;
    const trimmedName = gotraName.trim();
    if (!trimmedName) return;

    try {
      if (!gotraList.includes(trimmedName)) {
        await addDoc(collection(db, 'gotras'), { name: trimmedName });
      }
    } catch (error) {
      console.error("Error adding gotra:", error);
      throw error;
    }
  };

  // Delete Gotra Function
  const deleteGotra = async (gotraName) => {
    if (!gotraName) return;
    
    try {
      // Find the gotra document in Firestore
      const q = query(collection(db, 'gotras'), orderBy('name'));
      const snapshot = await new Promise((resolve) => {
        const unsubscribe = onSnapshot(q, (snap) => {
          unsubscribe();
          resolve(snap);
        });
      });
      
      const gotraDoc = snapshot.docs.find(doc => doc.data().name === gotraName);
      if (gotraDoc) {
        await deleteDoc(doc(db, 'gotras', gotraDoc.id));
      }
    } catch (error) {
      console.error("Error deleting gotra:", error);
      throw error;
    }
  };

  // Login Function
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // Logout Function
  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdminMode(false); // Disable admin mode on logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // --- Firestore Sync ---
  useEffect(() => {
    const q = query(collection(db, 'people'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const people = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDatabase(people);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching family data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Reset function (Clears Firestore Collection - Use with Caution!)
  const resetData = async () => {
    if (!confirm("WARNING: This will delete ALL data from the cloud database. Are you sure?")) return;
    
    try {
      const batch = writeBatch(db);
      database.forEach(person => {
        const ref = doc(db, 'people', person.id);
        batch.delete(ref);
      });
      await batch.commit();
      setFamilyData(INITIAL_TREE_DATA);
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Failed to reset data.");
    }
  };

  // Add new person to Firestore
  const addPerson = async (personData) => {
    try {
      const docRef = await addDoc(collection(db, 'people'), personData);
      return docRef;
    } catch (error) {
      console.error("Error adding person:", error);
      return null;
    }
  };

  // Update person data (e.g., DOB)
  const updatePerson = async (personId, updates) => {
    try {
      const personRef = doc(db, 'people', personId);
      await updateDoc(personRef, updates);
    } catch (error) {
      console.error("Error updating person:", error);
    }
  };

  // Delete person from database (Admin only)
  const deletePerson = async (personId) => {
    try {
      // 1. Delete the person
      await deleteDoc(doc(db, 'people', personId));
      
      // 2. Clean up references in other documents
      // Note: In a production app, this should be a Cloud Function or a batch update.
      // For simplicity here, we'll iterate and update.
      const batch = writeBatch(db);
      
      database.forEach(p => {
        if (p.id === personId) return; // Skip self (already deleted)
        
        let needsUpdate = false;
        const updates = {};

        if (p.fatherId === personId) { updates.fatherId = null; needsUpdate = true; }
        if (p.motherId === personId) { updates.motherId = null; needsUpdate = true; }
        if (p.spouseId === personId) { updates.spouseId = null; needsUpdate = true; }

        if (needsUpdate) {
          const ref = doc(db, 'people', p.id);
          batch.update(ref, updates);
        }
      });

      await batch.commit();

    } catch (error) {
      console.error("Error deleting person:", error);
      alert("Failed to delete person.");
    }
  };

  // --- Tree Building Logic ---
  const buildTree = (db, gotra) => {
    if (!gotra || !db || db.length === 0) return null;

    // 1. Find the Root (Generation 1 Male of this Gotra)
    // In a real app, you might have multiple roots or a specific way to choose.
    // Here we pick the first Gen 1 Male we find for the selected Gotra.
    const rootNode = db.find(p => p.generation === 1 && p.birthGotra === gotra && p.gender === 'male');

    if (!rootNode) return null;

    // Helper to recursively build the tree
    const buildNode = (person) => {
      // Find Partner (Wife)
      // Strategy: Find a female node linked via children, or explicitly linked (if we add spouseId later).
      // For now, we look for children who have this person as father.
      const childrenInDb = db.filter(c => c.fatherId === person.id);
      
      // Determine if we should show spouse
      // If this is a female member of the selected lineage (Daughter), do NOT show her husband
      // We only show spouses for males of the lineage (Daughters-in-law)
      const isDaughterOfLineage = person.gender === 'female' && person.birthGotra === gotra;
      
      let partner = null;
      if (!isDaughterOfLineage) {
          if (childrenInDb.length > 0) {
            const motherId = childrenInDb[0].motherId;
            const mother = db.find(m => m.id === motherId);
            if (mother) {
              partner = {
                id: mother.id,
                name: mother.name,
                role: 'Wife', // Simplified
                color: 'bg-rose-500', // You might want dynamic colors
                tags: [mother.birthGotra || 'Spouse', 'Female'],
                gender: 'female', // Explicitly set gender for wife
                dob: mother.dob // Pass DOB
              };
            }
          } else if (person.spouseId) {
             // Fallback if we add spouseId logic
             const spouse = db.find(s => s.id === person.spouseId);
             if (spouse) {
                partner = {
                    id: spouse.id,
                    name: spouse.name,
                    role: 'Wife',
                    color: 'bg-rose-500',
                    tags: [spouse.birthGotra || 'Spouse', 'Female'],
                    gender: 'female',
                    dob: spouse.dob
                };
             }
          }
      }

      // Recursively build children
      const children = childrenInDb.map(child => buildNode(child));

      return {
        id: person.id,
        name: person.name,
        role: person.generation === 1 ? 'Head of Family' : (person.gender === 'male' ? 'Son' : 'Daughter'),
        gender: person.gender, // Pass gender
        dob: person.dob, // Pass DOB
        years: 'Present', // Placeholder
        color: person.gender === 'male' ? 'bg-blue-500' : 'bg-rose-500',
        // If daughter of lineage, show birthGotra (Besra). Otherwise show currentGotra (Ghonsi)
        tags: [isDaughterOfLineage ? person.birthGotra : (person.currentGotra || 'Unknown'), person.gender === 'male' ? 'Male' : 'Female'],
        partner: partner,
        children: children
      };
    };

    return buildNode(rootNode);
  };

  const [selectedGotra, setSelectedGotra] = useState(GOTRA_LIST[0]); // Default to first gotra
  
  // Derived Tree Data
  const currentTreeData = React.useMemo(() => {
     const tree = buildTree(database, selectedGotra);
     return tree || INITIAL_TREE_DATA; // Fallback to mock data if no tree found
  }, [database, selectedGotra]);

  return (
    <FamilyContext.Provider value={{ 
      familyData: currentTreeData, // Expose the computed tree
      setFamilyData, // Keep for compatibility if needed, though we rely on DB now
      database, 
      setDatabase,
      resetData,
      addPerson, // Expose addPerson
      updatePerson,
      deletePerson,
      selectedGotra,
      setSelectedGotra,
      isAdminMode,
      setIsAdminMode,
      loading, // Expose loading state
      user,
      userProfile,
      gotraList,
      isOnboarding,
      registerUser,
      addNewGotra,
      deleteGotra,
      loginWithGoogle,
      logout
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
