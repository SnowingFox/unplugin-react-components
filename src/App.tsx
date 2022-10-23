import { useState } from 'react'
import './App.css'
import { CompA } from './CompA'
import CompB from './CompB'

type Com = typeof import('./CompA').CompA

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <CompA />
      <CompB />
    </div>
  )
}

export default App
