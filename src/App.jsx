import DashboardContext from "./component/context/DashboardContext"
import Dashboard from "./component/Dashboard"

function App() {
  
  return (
    <>
     <DashboardContext>
       <Dashboard/>
     </DashboardContext>
    </>
  )
}

export default App
