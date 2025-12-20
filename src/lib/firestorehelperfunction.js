import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// start template functions
export const getTemplates = async (USER_ID) => {
  try {
    const q = query(
      collection(db, "templates"),
      where("userId", "==", USER_ID)
    );
    const snap = await getDocs(q);
    console.log("getTemplates run");

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
};

export const saveTemplate = async (USER_ID, template) => {
  const { id, ...data } = template;

  if (id) {
    await updateDoc(doc(db, "templates", id), { ...data, userId: USER_ID });
    return { id, ...data, userId: USER_ID };
  }

  const docRef = await addDoc(collection(db, "templates"), {
    ...data,
    userId: USER_ID,
    createdAt: serverTimestamp(),
  });
  console.log("saveTemplate run");

  return { ...data, id: docRef.id, userId: USER_ID };
};

export const deleteTemplate = async (id) => deleteDoc(doc(db, "templates", id));

// start contact functions
export const getContacts = async (USER_ID) => {
  const q = query(collection(db, "contacts"), where("userId", "==", USER_ID));
  const snap = await getDocs(q);
  console.log("getContacts run");

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const saveContact = async (USER_ID, contact) => {
  const { id, ...data } = contact;

  if (id) {
    await updateDoc(doc(db, "contacts", id), { ...data, userId: USER_ID });
    return { id, ...data, userId: USER_ID };
  }

  const docRef = await addDoc(collection(db, "contacts"), {
    ...data,
    userId: USER_ID,
    createdAt: serverTimestamp(),
  });

  console.log("saveContact run");

  return { ...data, id: docRef.id, userId: USER_ID };
};

export const deleteContact = async (id) => deleteDoc(doc(db, "contacts", id));

// start group functions
export const getGroups = async (USER_ID) => {
  const q = query(collection(db, "groups"), where("userId", "==", USER_ID));
  const snap = await getDocs(q);
  console.log("getGroups run");

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const saveGroup = async (USER_ID, group) => {
  const { id, ...data } = group;

  if (id) {
    await updateDoc(doc(db, "groups", id), { ...data, userId: USER_ID });
    return { id, ...data, userId: USER_ID };
  }

  const docRef = await addDoc(collection(db, "groups"), {
    ...data,
    userId: USER_ID,
    createdAt: serverTimestamp(),
  });

  console.log("getGroups run");

  return { ...data, id: docRef.id, userId: USER_ID };
};

export const deleteGroup = async (id) => deleteDoc(doc(db, "groups", id));

// get log
export const getSendLogs = async (USER_ID) => {
  try {
    const q = query(collection(db, "sendlog"), where("userId", "==", USER_ID));

    const snap = await getDocs(q);
    console.log("getSendLogs run");
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error("Error fetching send logs:", error);
    return [];
  }
};
