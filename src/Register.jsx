import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore"
import React from "react"
import { db } from "./lib/firebase"
import { currentNumberCollectionRef } from "./lib/firestoreCollections"

export default function Register() {
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false)
  const [currentNumber, setCurrentNumber] = React.useState([])
  React.useEffect(() => {
    const live = onSnapshot(currentNumberCollectionRef, (snapshot) => {
      setCurrentNumber(snapshot.docs[0].data().number)
    })
    return () => {
      live()
    }
  }, [])

  const handleGetTicket = async () => {
    setIsButtonDisabled(true);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000); 
    try {
      const registeredCollectionRef = collection(db, "registered-list")
      const registeredDocRef = await addDoc(registeredCollectionRef, {
        number: currentNumber,
        createdAt: serverTimestamp(),
      })
      const documentRef = doc(db, "current-number", "nwxLBLSC03qYS5HReojF")
      await updateDoc(documentRef, { number: currentNumber + 1 })

      console.log("Document written with ID: ", registeredDocRef.id)
    } catch (error) {
      console.error("Error adding document: ", error)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
      <h1 className="text-light">Welcome!</h1>
      <button
        className={`my-5 btn ${isButtonDisabled ? 'btn-secondary' : 'btn-primary'} rounded-3`}
        onClick={handleGetTicket}
        disabled={isButtonDisabled}
      >
        Get Ticket
      </button>
      <h2 className="text-light">Next Number: {currentNumber}</h2>
    </div>
  )
}
