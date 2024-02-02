import { collection } from "firebase/firestore";
import { db } from "./firebase";

export const registeredListCollectionRef = collection(db, 'registered-list')
export const currentNumberCollectionRef = collection(db, 'current-number')
export const displayCollectionRef = collection(db, 'display')