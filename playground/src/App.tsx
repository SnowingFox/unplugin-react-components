import './App.css'
import { Button } from '@mui/material'
import { CompA } from './CompA'

function App() {
  const renderContent = <>
    <CompA />
    <CompA />
    <Button variant="text">Text</Button>
    <Button variant="contained">Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <CompB />
    <CompC />
  </>
  return (
    <div className="App">
      {renderContent}
    </div>
  )
}

export default App
