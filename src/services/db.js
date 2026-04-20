import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";

export const createSession = async (uid, title = "New Conversation") => {
  return await addDoc(collection(db, "sessions"), {
    uid,
    sessionTitle: title,
    createdAt: serverTimestamp(),
  });
};

export const saveMessage = async (uid, sessionId, message, response, emotion, isPrivate = false) => {
  if (isPrivate) return null;
  
  return await addDoc(collection(db, "conversations"), {
    uid,
    sessionId,
    message,
    response,
    emotion,
    createdAt: serverTimestamp(),
  });
};

export const getSessions = (uid, callback) => {
  const q = query(
    collection(db, "sessions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(sessions);
  });
};

export const getMessages = (sessionId, callback) => {
  const q = query(
    collection(db, "conversations"),
    where("sessionId", "==", sessionId),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};
