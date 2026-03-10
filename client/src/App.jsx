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
      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LayoutComponent />
          </ProtectedRoute>
        }
      >
        {/* Default */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* All logged-in users */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", "User", "Agent","Tech"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={["Admin", "User", "Agent","Tech"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin + User tickets */}
        <Route
          path="tickets"
          element={
            <ProtectedRoute allowedRoles={["Admin", "User", "Agent","Tech"]}>
              <Tickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin", "User", "Agent","Tech"]}>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="tickets/new"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Tech"]}>
              <TicketNew />
            </ProtectedRoute>
          }
        />

        <Route
          path="tickets/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin","Tech"]}>
              <TicketEdit />
            </ProtectedRoute>
          }
        />

        {/* Admin ONLY SECTION */}
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["Admin", "User", "Agent","Tech"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="user/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin", "User", "Agent","Tech"]}>
              <UserDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="user/new"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Tech"]}>
              <UserNew />
            </ProtectedRoute>
          }
        />

        <Route
          path="user/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Tech"]}>
              <UserEdit />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route
        path="*"
        element={
          session ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
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
