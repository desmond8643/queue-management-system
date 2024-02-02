import { onSnapshot } from "firebase/firestore"
import React from "react"
import { db } from "./lib/firebase"
import { displayCollectionRef } from "./lib/firestoreCollections"

export default function Display() {
  const [display, setDisplay] = React.useState([])
  const [isCalling, setIsCalling] = React.useState(false)
  const [repeatCall, setRepeatCall] = React.useState(null)

  function repeatCallNumber() {
    const element = document.getElementById("displayNumber")
    if (element) {
      element.classList.add("animated-text")
      setTimeout(() => {
        element.classList.remove("animated-text")
      }, 2000)
    }

    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(display)
    synth.speak(utterance)
    setIsCalling(true)

    setTimeout(() => {
      synth.cancel()
      setIsCalling(false)
    }, 2000)
  }

  React.useEffect(() => {
    const live = onSnapshot(displayCollectionRef, (snapshot) => {
      const data = snapshot.docs[0].data()
      setDisplay(data.number)
      setRepeatCall(data.repeat)

      if (data.number !== null && data.number !== "") {
        const synth = window.speechSynthesis
        const utterance = new SpeechSynthesisUtterance(data.number)
        synth.speak(utterance)
        setIsCalling(true)

        setTimeout(() => {
          synth.cancel()
          setIsCalling(false)
        }, 2000)
      }
    })

    return () => {
      live()
    }
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.getElementById("displayNumber")
      if (element) {
        element.classList.add("animated-text")
        setTimeout(() => {
          element.classList.remove("animated-text")
        }, 2000)
      }
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [display])

  React.useEffect(() => {
      const timer = setTimeout(() => {
        const element = document.getElementById("displayNumber");
        if (element) {
          element.classList.add("animated-text");
          setTimeout(() => {
            element.classList.remove("animated-text");
          }, 2000);
        }
      }, 0);
      
      return () => {
        clearTimeout(timer);
      };
    
  }, [repeatCall]);


  return (
    <div class="d-flex justify-content-center align-items-center vh-100">
      <h1
        id="displayNumber"
        className={`${isCalling ? "red-text" : "text-light"}`}
        style={{ fontSize: "100px" }}
      >
        {display}
      </h1>
    </div>
  )
}
