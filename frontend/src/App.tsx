import { Button } from "./components/ui/button"
import { appName } from "./test"

function App() {

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <h1 className='text-5xl font-bold'>
        {appName}
      </h1>
      <Button>
        Make My Trip
      </Button>
    </div>
  )
}

export default App
