import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile,
<<<<<<< HEAD
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
=======
} from '@firebase/auth';
import { doc, setDoc, getDoc } from '@firebase/firestore';
>>>>>>> c66372c (Final Commit)
import { auth, db } from './firebase';

export type AuthUser = User;

<<<<<<< HEAD
export async function signUp(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      id: userCredential.user.uid,
      name: displayName,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
      role: 'Employee',
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    console.error('Firebase Auth Sign Up Error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase Auth Sign In Error:', error);
    throw error;
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        id: result.user.uid,
        name: result.user.displayName || 'User',
        email: result.user.email,
        avatar: result.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.uid}`,
        role: 'Employee',
        createdAt: new Date().toISOString(),
      });
    }
    
    return result.user;
  } catch (error) {
    console.error('Firebase Auth Google Sign In Error:', error);
    throw error;
  }
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
=======
export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string, name: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await updateProfile(user, { displayName: name });
  
  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: name,
    role: 'user', // default role
    createdAt: new Date().toISOString(),
  });
  
  return userCredential;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export const signOut = async () => {
  return firebaseSignOut(auth);
};

export const onAuthChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const subscribeToAuthChanges = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const logout = signOut;

export async function getUserProfile(uid: string) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
>>>>>>> c66372c (Final Commit)
}
