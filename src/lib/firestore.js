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
  FORUMS: 'forums'
};

// User operations
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
