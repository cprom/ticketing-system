import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/Tickets"
import Dashboard from "./pages/Dashboard"
import LayoutComponent from "./components/Navbar/LayoutComponent"
import Tickets from "./pages/Tickets"
import Profile from "./pages/Profile"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutComponent/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/tickets" element={<Tickets/>} />
            <Route path="/profile" element={<Profile/>} />
          </Route>
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App
