import React, {useState} from 'react'
import axios from "axios"

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const url = "http://localhost:9000/api/result"

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message,setMessage] = useState(initialMessage)
  const [email,setEmail] = useState(initialEmail)
  const [steps,setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)
  
  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let arrs = [
      [0,1,2],
      [3,4,5],
      [6,7,8]
    ]
    let x,y
    arrs.filter((arr,idx) => {
      for (let i=0; i<arr.length; i++){
        if (index === arr[i]) {
          x = idx + 1
          y = i + 1
        }
      }
    })
    return {x,y}
  }
  
  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    let coordinates = getXY(index)
    let message = `Coordinates (${coordinates.x}, ${coordinates.y})`
    return message
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(4)
    setSteps(0)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let newIndex

    if (direction === "left" && index !== 0 && index !== 3 && index !== 6) {
      newIndex = index - 1
      return newIndex
    }

    if (direction === "right" && index !== 2 && index !== 5 && index !== 8) {
      newIndex = index + 1
      return newIndex
    } 

    if (direction === "up" && index !== 0 && index !== 1 && index !== 2) {
      newIndex = index - 3
      return newIndex
    } 

    if (direction === "down" && index !== 6 && index !== 7 && index !== 8) {
      newIndex = index + 3
      return newIndex
    } 
    


    return index
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault()
    const {id} = evt.target 
    let newIndex = getNextIndex(id)
    if (newIndex !== index) {
      setIndex(newIndex)
      setSteps(steps + 1)
      setMessage("")
    } else {
      setMessage(`You can't go ${id}`)
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    let {value} = evt.target
    setEmail(value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    let coordinates = getXY(index)
    let payload = {x: coordinates.x, y:coordinates.y, steps:steps, email:email}
    axios.post(url, payload)
    .then (res => setMessage(res.data.message))
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{`You moved ${steps} times`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input value={email} onChange={onChange} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
