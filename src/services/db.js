import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

// Get sessions for a user
export const getSessions = (uid, callback) => {
  // Removed orderBy to avoid index requirement errors during setup
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid)
  );

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort manually in the frontend to avoid index requirement
    sessions.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    callback(sessions);
  });
};

// Create a new session
export const createSession = async (uid, sessionTitle) => {
  return await addDoc(collection(db, "sessions"), {
    uid,
    sessionTitle,
    createdAt: serverTimestamp(),
  });
};

// Get messages for a session
export const getMessages = (sessionId, callback) => {
  // Removed orderBy to avoid index requirement errors during setup
  const q = query(
    collection(db, "conversations"),
    where("sessionId", "==", sessionId)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort manually by createdAt to avoid needing a composite index
    messages.sort((a, b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
    callback(messages);
  });
};

// Save a message
export const saveMessage = async (uid, sessionId, message, response, emotion, isPrivate) => {
  if (isPrivate) return;
  
  return await addDoc(collection(db, "conversations"), {
    uid,
    sessionId,
    message,
    response,
    emotion,
    createdAt: serverTimestamp(),
  });
};
