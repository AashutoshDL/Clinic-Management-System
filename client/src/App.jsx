import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Home/Home';
import TermsConditions from './components/TermsConditions';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/termsandconditions' element={<TermsConditions/>} />
      </Routes>
    </Router>
  )
}

export default App
