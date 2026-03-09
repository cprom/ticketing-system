// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useSession } from "./hooks/useSession";
import ProtectedRoute from "./components/ProtectedRoute";

import LayoutComponent from "./components/Navbar/LayoutComponent";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tickets from "./pages/Tickets/Tickets";
import TicketDetails from "./pages/Tickets/TicketDetails";
import TicketNew from "./pages/Tickets/TicketNew";
import TicketEdit from "./pages/Tickets/TicketEdit";
import Profile from "./pages/Profile/Profile";

import Users from "./pages/Users/Users";
import UserDetails from "./pages/Users/UserDetails";
import UserNew from "./pages/Users/UserNew";
import UserEdit from "./pages/Users/UserEdit";

import Login from "./pages/Login/Login";
import UserContext from "./Context/UserContext";

function AppRoutes() {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return <div>Initializing...</div>;
  }

  return (
       <UserContext.Provider value={session}>
    <Routes>
      {/* Public route: login */}
      <Route
        path="/login"
        element={session ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected layout for all authenticated routes */}
      <Route
        path="/"
        element={
          session ?
          <ProtectedRoute>
            <LayoutComponent />
          </ProtectedRoute>
          :
          <Login/>
        }
      >
        {/* Default index route redirects to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Tickets */}
        <Route path="tickets" element={<Tickets />} />
        <Route path="tickets/:id" element={<TicketDetails />} />
        <Route path="tickets/new" element={<TicketNew />} />
        <Route path="tickets/edit/:id" element={<TicketEdit />} />

        {/* Profile */}
        <Route path="profile" element={<Profile />} />

        {/* Users - admin-only section */}
        <Route path="users" element={<Users />} />
        <Route path="user/:id" element={<UserDetails />} />
        <Route path="user/new" element={<UserNew />} />
        <Route path="user/edit/:id" element={<UserEdit />} />
      </Route>

      {/* Catch-all: redirect based on session */}
      <Route
        path="*"
        element={session ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
</UserContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
 
      <AppRoutes />
    </BrowserRouter>
  );
}
