import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Recommendation from './pages/Recommendation';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1>AI Insurance Platform</h1>
          </Link>
          <nav>
            <Link to="/user" style={{ marginRight: '1.5rem', color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Find Policy</Link>
            <Link to="/admin" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Admin</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/user" element={<Home />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
