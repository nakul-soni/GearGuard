import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile,
} from '@firebase/auth';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import { auth, db } from './firebase';

export type AuthUser = User;

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
}
