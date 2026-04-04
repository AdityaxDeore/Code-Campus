import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  PROBLEMS: 'problems',
  SUBMISSIONS: 'submissions',
  ACHIEVEMENTS: 'achievements',
  FORUMS: 'forums',
  TEST_RESULTS: 'testResults'
};

const isFirestoreReady = () => {
  if (!db) {
    console.warn('[Firestore] Firebase not initialized. Check your .env configuration.');
    return false;
  }
  return true;
};

// User operations
export const createUserProfile = async (user) => {
  if (!isFirestoreReady()) return null;
  if (!user?.uid) return { success: false, error: 'Missing user id' };

  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      role: 'student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (uid) => {
  if (!isFirestoreReady()) return null;
  if (!uid) return null;

  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (userDoc.exists()) {
      return { uid: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Firestore] getUserProfile error:', error);
    }
    return null;
  }
};

export const updateUserProfile = async (uid, data) => {
  if (!isFirestoreReady()) return null;
  if (!uid) return { success: false, error: 'Missing user id' };

  try {
    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (userDoc.exists()) {
      return { user: { id: userDoc.id, ...userDoc.data() }, error: null };
    } else {
      return { user: null, error: 'User not found' };
    }
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Test results
export const createTestResult = async (resultData) => {
  if (!isFirestoreReady()) return null;
  if (!resultData?.userId || !resultData?.testId) {
    return { success: false, error: 'Missing userId or testId' };
  }

  try {
    const docId = `${resultData.userId}_${resultData.testId}`;
    await setDoc(doc(db, COLLECTIONS.TEST_RESULTS, docId), {
      ...resultData,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserTestResults = async (userId) => {
  if (!isFirestoreReady()) return [];
  if (!userId) return [];

  try {
    const q = query(
      collection(db, COLLECTIONS.TEST_RESULTS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Firestore] getUserTestResults error:', error);
    }
    return [];
  }
};

// Forum post operations
export const createPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.POSTS), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      comments: 0,
      views: 0
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getPosts = async (categoryFilter = null, limitCount = 20) => {
  try {
    let q = collection(db, COLLECTIONS.POSTS);
    
    if (categoryFilter && categoryFilter !== 'all') {
      q = query(q, where('category', '==', categoryFilter));
    }
    
    q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { posts, error: null };
  } catch (error) {
    return { posts: [], error: error.message };
  }
};

export const updatePost = async (postId, updateData) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.POSTS, postId), {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Problem operations
export const createProblem = async (problemData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROBLEMS), {
      ...problemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      submissions: 0,
      solved: 0
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getProblems = async (difficulty = null, tags = [], limitCount = 50) => {
  try {
    let q = collection(db, COLLECTIONS.PROBLEMS);
    
    if (difficulty && difficulty !== 'all') {
      q = query(q, where('difficulty', '==', difficulty));
    }
    
    if (tags.length > 0) {
      q = query(q, where('tags', 'array-contains-any', tags));
    }
    
    q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const problems = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { problems, error: null };
  } catch (error) {
    return { problems: [], error: error.message };
  }
};

// Submission operations
export const createSubmission = async (submissionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.SUBMISSIONS), {
      ...submissionData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const getUserSubmissions = async (userId, limitCount = 20) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SUBMISSIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { submissions, error: null };
  } catch (error) {
    return { submissions: [], error: error.message };
  }
};

// Real-time listeners
export const listenToPosts = (callback, categoryFilter = null) => {
  let q = collection(db, COLLECTIONS.POSTS);
  
  if (categoryFilter && categoryFilter !== 'all') {
    q = query(q, where('category', '==', categoryFilter));
  }
  
  q = query(q, orderBy('createdAt', 'desc'), limit(20));
  
  return onSnapshot(q, (querySnapshot) => {
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(posts);
  }, (error) => {
    if (import.meta.env.DEV) {
      console.error('[Firestore] listenToPosts error:', error);
    }
    callback([]);
  });
};

export const listenToUserData = (userId, callback) => {
  return onSnapshot(doc(db, COLLECTIONS.USERS, userId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    if (import.meta.env.DEV) {
      console.error('[Firestore] listenToUserData error:', error);
    }
    callback(null);
  });
};
