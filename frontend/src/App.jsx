import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Recommendation from './pages/Recommendation';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>AI Insurance Platform</h1>
          <nav>
            <Link to="/" style={{ marginRight: '1rem', color: '#fff', textDecoration: 'none' }}>Home</Link>
            <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin (Upload Files)</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
