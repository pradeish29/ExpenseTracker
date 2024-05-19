import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {Home} from "./Home"
import {Auth} from "./Auth"

function App() {
  return(
    <div className='App'>
      <Router basename="/ExpenseTracker"> 
        <Routes>
          <Route path='/' element={<Auth/>}/>
          <Route path='/app' element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;