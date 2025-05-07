import { BrowserRouter, Routes, Route } from "react-router";
import React from "react";
import RizzQ from "./pages/RizzQ";
import Admin from "./pages/Admin";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RizzQ />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
