import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import MatchedMentorPage from './MatchedMentorPage';
import MentorsPage from './MentorsPage';
import BooksPage from './BooksPage';
import StudyPage from './StudyPage';
import VideosPage from './VideosPage';
import AdminDashboard from './AdminDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const currentUser = localStorage.getItem('studyhub_currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setIsLoggedIn(true);
      setUserEmail(user.email);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {!isLoggedIn ? (
          <Routes>
            {/* ✅ Both / and /login show the LoginPage */}
            <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* ✅ Any unknown route goes to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/profile" />} />
            {/* ✅ /login redirects to profile if already logged in */}
            <Route path="/login" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<ProfilePage userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/matched-mentor" element={<MatchedMentorPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/admin" element={<AdminDashboard setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;