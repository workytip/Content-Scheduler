
import React from 'react'
import { Routes, Route } from 'react-router-dom' // <-- Add this line
import Navbar from './Components/Navbar'
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';


function App() {

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto "> 
       <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
       </Routes>
      </div>
    </>
  )
}

export default App
