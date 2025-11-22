import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppMain from './AppMain';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppMain />} />
      </Routes>
    </Router>
  );
}

export default App;

