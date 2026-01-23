import { BrowserRouter, Routes, Route } from "react-router"
import Dashboard from "./pages/Dashboard/Dashboard"
import LayoutComponent from "./components/Navbar/LayoutComponent"
import Tickets from "./pages/Tickets/Tickets"
import Profile from "./pages/Profile/Profile"
import TicketDetails from "./pages/Tickets/TicketDetails"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutComponent/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/tickets" element={<Tickets/>} />
            <Route path="/tickets/:id" element={<TicketDetails/>} />
            <Route path="/profile" element={<Profile/>} />
          </Route>
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
