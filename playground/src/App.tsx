import './App.css'

function App() {
  return (
    <div className="App">
      <Button variant={'contained'}>hi mui</Button>
      <AntProgress percent={30} />
      <AntSkeleton />
      <AntTooltip title="prompt text">
        <span>Tooltip will show on mouse enter.</span>
      </AntTooltip>
      <CompC />
    </div>
  )
}

export default App
