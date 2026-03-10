import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Sample mentors database
  const allMentors = [
    { 
      id: 1, 
      name: 'React Guru Priya', 
      skills: 'React, JavaScript, Next.js, Tailwind CSS', 
      photo: '👩‍💻',
      rating: 4.9,
      experience: '5+ years',
      availability: 'Weekdays 6-9 PM'
    },
    { 
      id: 2, 
      name: 'Python Master Rohan', 
      skills: 'Python, Django, Flask, Data Science', 
      photo: '🐍',
      rating: 4.8,
      experience: '4+ years',
      availability: 'Weekends 10 AM-2 PM'
    },
    { 
      id: 3, 
      name: 'Data Science Expert Neha', 
      skills: 'Machine Learning, Python, Pandas, TensorFlow', 
      photo: '📊',
      rating: 4.9,
      experience: '6+ years',
      availability: 'Evenings 7-10 PM'
    },
    { 
      id: 4, 
      name: 'Fullstack Pro Arjun', 
      skills: 'React, Node.js, MongoDB, Express', 
      photo: '💻',
      rating: 4.7,
      experience: '3+ years',
      availability: 'Weekdays 8-11 PM'
    },
    { 
      id: 5, 
      name: 'DevOps Wizard Kavya', 
      skills: 'Docker, Kubernetes, AWS, CI/CD', 
      photo: '☁️',
      rating: 5.0,
      experience: '7+ years',
      availability: 'Weekends All Day'
    }
  ];

  useEffect(() => {
    setMentors(allMentors);
    setLoading(false);

    // Get user profile from navigation state
    if (location.state?.userProfile) {
      setUserProfile(location.state.userProfile);
      
      // Load user's sent requests
      const userRequests = JSON.parse(localStorage.getItem(`studyhub_requests_${location.state.userProfile.email}`) || '[]');
      setSentRequests(userRequests);
    }
  }, [location.state]);

  // Smart matching based on user's learning goals
  useEffect(() => {
    if (userProfile?.learnGoals && mentors.length > 0) {
      const userGoalsLower = userProfile.learnGoals.toLowerCase();
      const matched = mentors.map(mentor => {
        const matchScore = calculateMatchScore(userGoalsLower, mentor.skills.toLowerCase());
        return { ...mentor, matchScore, matchPercentage: Math.round(matchScore * 100 / 10) };
      }).sort((a, b) => b.matchScore - a.matchScore);
      
      setFilteredMentors(matched);
    } else {
      setFilteredMentors(mentors);
    }
  }, [userProfile, mentors]);

  // Calculate match score between user goals and mentor skills
  const calculateMatchScore = (userGoals, mentorSkills) => {
    const keywords = userGoals.split(',').map(k => k.trim());
    let score = 0;
    keywords.forEach(keyword => {
      if (mentorSkills.includes(keyword)) score += 3;
      else if (mentorSkills.includes('js') && keyword.includes('react')) score += 1;
      else if (mentorSkills.includes('python') && keyword.includes('data')) score += 1;
    });
    return score;
  };

  // Send request to mentor
  const sendRequest = (mentor) => {
    if (!userProfile) {
      alert('Please complete your profile first!');
      navigate('/profile');
      return;
    }

    // Check if already sent
    const alreadySent = sentRequests.some(req => req.mentorId === mentor.id);
    if (alreadySent) {
      alert('✅ Request already sent to this mentor!');
      return;
    }

    const userRequests = JSON.parse(localStorage.getItem(`studyhub_requests_${userProfile.email}`) || '[]');
    const newRequest = {
      mentorId: mentor.id,
      mentorName: mentor.name,
      status: 'sent',
      time: new Date().toLocaleString(),
      learnGoals: userProfile.learnGoals
    };
    
    userRequests.push(newRequest);
    localStorage.setItem(`studyhub_requests_${userProfile.email}`, JSON.stringify(userRequests));
    setSentRequests(userRequests);
    
    alert(`📤 Request sent to ${mentor.name}!\n⏳ Waiting for response...`);
  };

  // Simulate mentor acceptance (3 second delay)
  const simulateAcceptance = (mentor) => {
    const btn = document.getElementById(`accept-${mentor.id}`);
    btn.textContent = '⏳ Processing...';
    btn.disabled = true;

    setTimeout(() => {
      // Save as ACCEPTED in localStorage
      const userAccepted = JSON.parse(localStorage.getItem(`studyhub_accepted_${userProfile.email}`) || '[]');
      const acceptedRequest = {
        mentorId: mentor.id,
        mentorName: mentor.name,
        status: 'accepted',
        time: new Date().toLocaleString(),
        message: `Congratulations! ${mentor.name} has accepted your mentorship request. You can now start your learning journey together! 📚✨`
      };
      
      userAccepted.push(acceptedRequest);
      localStorage.setItem(`studyhub_accepted_${userProfile.email}`, JSON.stringify(userAccepted));
      
      btn.textContent = '✅ ACCEPTED!';
      btn.className = 'w-full bg-emerald-600 text-white py-4 px-6 rounded-2xl font-bold shadow-xl';
      
      setTimeout(() => {
        alert(`🎉 ${mentor.name} ACCEPTED your request!\n\n📱 Go to Profile to see message box & start mentoring!`);
        navigate('/profile');
      }, 1500);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen study-bg flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-8">🔍</div>
          <h1 className="text-4xl font-bold text-white mb-4">Finding Perfect Mentors...</h1>
          <p className="text-xl text-white/80">Matching based on your learning goals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen study-bg p-8">
      {/* Top Navigation */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-indigo-700 shadow-2xl transition-all"
          >
            ← Back to Profile
          </button>
          
          <div className="text-right">
            <h2 className="text-3xl font-bold text-white mb-2">
              {userProfile ? `Hi ${userProfile.name}!` : 'Welcome!'}
            </h2>
            <p className="text-xl text-white/80">
              Looking for: <strong>{userProfile?.learnGoals || 'Any skills'}</strong>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-emerald-600">{filteredMentors.length}</div>
            <div className="text-lg font-semibold">Available Mentors</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
            <div className="text-4xl mb-2">📤</div>
            <div className="text-3xl font-bold text-orange-500">{sentRequests.length}</div>
            <div className="text-lg font-semibold">Requests Sent</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-lg font-semibold">Accepted</div>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            👨‍🏫 Perfect Mentor Matches
          </h1>
          <p className="text-2xl text-white/90">Click "Send Request" → Wait 3s → See ACCEPTED → Message Box!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all group">
              {/* Mentor Photo & Rating */}
              <div className="text-center mb-6">
                <div className="text-7xl mb-4 group-hover:animate-bounce">{mentor.photo}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl font-bold text-emerald-600">{mentor.rating}</span>
                  <span className="text-xl text-yellow-500">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-sm text-gray-500">{mentor.experience} • {mentor.availability}</p>
              </div>

              {/* Mentor Info */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-800 mb-4 group-hover:text-purple-600 transition-colors">
                  {mentor.name}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">{mentor.skills}</p>
                <div className="mt-4 p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                  <div className="font-bold text-lg text-emerald-800">
                    Match: {mentor.matchPercentage}% 
                    {mentor.matchPercentage >= 80 && ' 🔥 BEST MATCH'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => sendRequest(mentor)}
                  disabled={sentRequests.some(req => req.mentorId === mentor.id)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-5 px-8 rounded-2xl font-black text-xl shadow-2xl hover:from-emerald-600 hover:to-teal-700 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {sentRequests.some(req => req.mentorId === mentor.id) 
                    ? '✅ Request Sent!' 
                    : '📤 Send Request'
                  }
                </button>
                
                <button 
                  id={`accept-${mentor.id}`}
                  onClick={() => simulateAcceptance(mentor)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-2xl font-bold shadow-xl hover:from-orange-600 hover:to-red-700 transition-all"
                >
                  🎯 Test Accept (3s)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MentorsPage;