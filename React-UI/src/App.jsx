
import React from 'react'
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Navbar from './Components/Navbar';
import Analytics from './pages/Analytics';
import CalendarView from './pages/CalendarView';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';


function App() {

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto ">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarView />
              </PrivateRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
            />

        </Routes>
      </div>
    </>
  )
}

export default App
