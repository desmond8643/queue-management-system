import React from "react"
import { onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"
import {
  registeredListCollectionRef,
  currentNumberCollectionRef,
  displayCollectionRef,
} from "./lib/firestoreCollections"
import { db } from "./lib/firebase"

export default function Index() {
  const [registeredList, setRegisteredList] = React.useState([])
  const [registeredListId, setRegisteredListId] = React.useState([])
  const [currentNumber, setCurrentNumber] = React.useState([])
  const [display, setDisplay] = React.useState([])
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false)
  const [repeat, setRepeat] = React.useState(null)

  React.useEffect(() => {
    const live = onSnapshot(registeredListCollectionRef, (snapshot) => {
      setRegisteredList(
        snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      )
      setRegisteredListId(snapshot.docs.map((doc) => doc.id))
      console.log(
        snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      )
    })

    return () => {
      live()
    }
  }, [])

  React.useEffect(() => {
    const live = onSnapshot(currentNumberCollectionRef, (snapshot) => {
      setCurrentNumber(snapshot.docs[0].data().number)
    })
    return () => {
      live()
    }
  }, [])

  React.useEffect(() => {
    const live = onSnapshot(displayCollectionRef, (snapshot) => {
      setDisplay(snapshot.docs[0].data().number)
      setRepeat(snapshot.docs[0].data().repeat)
    })
    return () => {
      live()
    }
  }, [])

  const resetNumber = async () => {
    try {
      const documentRef = doc(db, "current-number", "nwxLBLSC03qYS5HReojF")
      await updateDoc(documentRef, { number: 1 })
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  function renderRegisteredList() {
    const sortedList = registeredList.sort(
      (a, b) => a.data.createdAt.seconds - b.data.createdAt.seconds
    )

    return sortedList.map((number) => {
      const createdAt = number.data.createdAt
      const date = new Date(
        createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6
      )
      return (
        <tr
          className="text-light"
          style={{ textAlign: "center" }}
          key={number.id}
        >
          <th class="col-2">{number.data.number}</th>
          <th>{date.toString()}</th>
          <th class="col-2">
            <button
              class="btn btn-danger"
              onClick={() => deleteButton(number.id)}
            >
              Delete
            </button>
          </th>
        </tr>
      )
    })
  }

  function deleteButton(id) {
    const docRef = doc(db, "registered-list", id)
    deleteDoc(docRef)
  }

  function clearQueue() {
    registeredListId.forEach((id) => {
      const docRef = doc(db, "registered-list", id)
      deleteDoc(docRef)
    })
  }

  const callNumber = async () => {
    setIsButtonDisabled(true)

    setTimeout(() => {
      setIsButtonDisabled(false)
    }, 2000)

    if (registeredList.length > 0) {
      let smallestNumber = Number.MAX_VALUE
      let smallestId = ""

      registeredList.forEach((obj, index) => {
        const number = obj.data.number
        if (number < smallestNumber) {
          smallestNumber = number
          smallestId = obj.id
        }
      })
      const documentRef = doc(db, "display", "GjLkEBz3YXFKFR72ZCF7")
      await updateDoc(documentRef, { number: smallestNumber })

      const docRef = doc(db, "registered-list", smallestId)
      deleteDoc(docRef)
    } else {
      confirm("No registered number")
    }
  }

  const repeatNumber = async () => {
    setIsButtonDisabled(true)

    setTimeout(() => {
      setIsButtonDisabled(false)
    }, 2000)
    const documentRef = doc(db, "display", "GjLkEBz3YXFKFR72ZCF7")
    const changeNumber = repeat === 1 ? 0 : 1
    await updateDoc(documentRef, { repeat: changeNumber })
  }

  return (
    <div class="container">
      <div class="mt-2 ms-3 mb-1">
        <div className="d-flex gap-5">
          <h2 class="text-light">Current Number: {display}</h2>
          <h2 class="text-light">Next Number: {currentNumber}</h2>
        </div>
        <div class="d-flex mt-2">
          <button
            className={`btn btn-success
          `}
            onClick={callNumber}
            disabled={isButtonDisabled}
          >
            Call number
          </button>
          <button
            class="btn btn-primary ms-1"
            onClick={repeatNumber}
            disabled={isButtonDisabled}
          >
            Repeat Call
          </button>
          <button onClick={resetNumber} class="btn btn-danger ms-1">
            Reset number
          </button>
          <button class="btn btn-secondary ms-1" onClick={clearQueue}>
            Clear Queue
          </button>
        </div>
      </div>
      <div>
        <h3 class="ms-3 mt-3 text-light">Registered List</h3>
        <table class="ms-3 mt-3">
          {registeredList.length > 0 ? (
            <tr class="text-light" style={{ textAlign: "center" }}>
              <th>Number</th>
              <th>Time</th>
              <th></th>
            </tr>
          ) : (
            <th class="text-light col-1" style={{ textAlign: "center" }}>
              No register yet...
            </th>
          )}
          {renderRegisteredList()}
        </table>
      </div>
    </div>
  )
}
