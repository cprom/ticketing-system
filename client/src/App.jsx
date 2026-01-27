import { BrowserRouter, Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard/Dashboard"
import LayoutComponent from "./components/Navbar/LayoutComponent"
import Tickets from "./pages/Tickets/Tickets"
import Profile from "./pages/Profile/Profile"
import TicketDetails from "./pages/Tickets/TicketDetails"
import UserContext from "./Context/UserContext"

function App() {

  const user = 
  {
    UserID: 4,
    FullName: "Sys Admin",
    Email: 'admin@email.com'
  }

  return (
    <>
      <BrowserRouter>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<LayoutComponent/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/tickets" element={<Tickets/>} />
            <Route path="/tickets/:id" element={<TicketDetails/>} />
            <Route path="/profile" element={<Profile/>} />
          </Route>
        </Routes>
        </UserContext.Provider>
      </BrowserRouter>  
    </>
  )
}

export default App
