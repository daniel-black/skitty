import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </Router>
    </>  
  );
}

export default App;

