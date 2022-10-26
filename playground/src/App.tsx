import './App.css'
import { CompA } from './CompA'

function App() {
  const renderContent = <Box>
    <CompA />
    <CompA />
    <Button variant="text">Text</Button>
    <Button variant="contained">Contained</Button>
    <Button variant="outlined">Outlined</Button>
    <CompB />
    <CompC />
  </Box>
  return (
    <div className="App">
      {renderContent}
    </div>
  )
}

export default App
