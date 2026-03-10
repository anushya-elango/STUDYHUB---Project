// Add this to your matched-mentor chat component OR create new ChatWithAssessments.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function MatchedMentorChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, selectedMentor, swapDeal, isPermanent } = location.state || {};
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentTest, setCurrentTest] = useState(0); // 0-3 for 4 tests
  const [testResults, setTestResults] = useState([false, false, false, false]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testAnswers, setTestAnswers] = useState({});
  
  // ✅ 4 ASSESSMENTS
  const assessments = [
    {
      id: 0,
      title: "Python Basics Test",
      questions: [
        { q: "What is a list in Python?", options: ["A", "B", "Array", "Dictionary"], correct: 2 },
        { q: "print('Hello') output?", options: ["Hello", "print", "H", "Error"], correct: 0 },
        { q: "List slicing [1:3]?", options: ["Index 1,3", "Elements 1-2", "Error", "All"], correct: 1 }
      ]
    },
    {
      id: 1,
      title: "Data Structures Test", 
      questions: [
        { q: "Time complexity of list append?", options: ["O(n)", "O(1)", "O(log n)", "O(n²)"], correct: 1 },
        { q: "Stack follows?", options: ["FIFO", "LIFO", "Random", "Sorted"], correct: 1 },
        { q: "Binary search requires?", options: ["Unsorted", "Sorted", "LinkedList", "Queue"], correct: 1 }
      ]
    },
    {
      id: 2,
      title: "JavaScript Test",
      questions: [
        { q: "What is closure?", options: ["Loop", "Function inside function", "Error", "Array"], correct: 1 },
        { q: "let vs var?", options: ["Same", "Block scope", "Global scope", "No difference"], correct: 1 },
        { q: "Array.map() returns?", options: ["Original", "New array", "Boolean", "Number"], correct: 1 }
      ]
    },
    {
      id: 3,
      title: "Final Assessment",
      questions: [
        { q: "REST API method for create?", options: ["GET", "POST", "PUT", "DELETE"], correct: 1 },
        { q: "async/await replaces?", options: [".then()", "for loop", "if else", "Object"], correct: 0 },
        { q: "React uses?", options: ["MVC", "Virtual DOM", "jQuery", "Angular"], correct: 1 }
      ]
    }
  ];

  // Load chat history & test progress
  useEffect(() => {
    const chatHistory = JSON.parse(localStorage.getItem(`chat_${userProfile.email}_${selectedMentor.email}`) || '[]');
    setMessages(chatHistory);
    
    const savedTests = JSON.parse(localStorage.getItem(`test_progress_${userProfile.email}_${selectedMentor.email}`) || '[false,false,false,false]');
    setTestResults(savedTests);
    
    // Auto-open first test if no tests completed
    if (savedTests.every(result => !result)) {
      setTimeout(() => setShowTestModal(true), 1000);
    }
  }, []);

  // Save chat & test progress
  useEffect(() => {
    localStorage.setItem(`chat_${userProfile.email}_${selectedMentor.email}`, JSON.stringify(messages));
    localStorage.setItem(`test_progress_${userProfile.email}_${selectedMentor.email}`, JSON.stringify(testResults));
  }, [messages, testResults]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { 
        sender: userProfile.email, 
        text: newMessage, 
        time: new Date().toLocaleTimeString() 
      }]);
      setNewMessage('');
    }
  };

  // ✅ TEST FUNCTIONS
  const submitTest = (testId) => {
    // Simple scoring - 2/3 correct = PASS
    const test = assessments[testId];
    const score = Object.values(testAnswers).filter((ans, i) => ans === test.questions[i].correct).length;
    const passed = score >= 2;
    
    const newResults = [...testResults];
    newResults[testId] = passed;
    setTestResults(newResults);
    setShowTestModal(false);
    setTestAnswers({});
    
    alert(passed ? `🎉 Test ${testId + 1} PASSED! (${score}/3)` : `❌ Test ${testId + 1} Failed. (${score}/3) Try again!`);
    
    // Auto-open next test
    if (passed && testId < 3) {
      setTimeout(() => setShowTestModal(true) && setCurrentTest(testId + 1), 1500);
    }
  };

  const nextAvailableTest = testResults.findIndex(result => !result);
  const allTestsCompleted = testResults.every(result => result);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                💬 {selectedMentor.name}
              </h1>
              <p className="text-xl text-gray-600 mt-2">{swapDeal}</p>
              {isPermanent && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold mt-2 inline-block">Permanent Connection</span>}
            </div>
            <button onClick={() => navigate('/profile')} className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-gray-600">
              ← Back to Profile
            </button>
          </div>

          {/* ✅ ASSESSMENTS PROGRESS */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-4 border-yellow-200">
            <h3 className="text-2xl font-bold mb-4 flex items-center">📊 Skill Assessments</h3>
            <div className="flex gap-3 mb-4">
              {assessments.map((test, index) => (
                <div key={test.id} className={`flex-1 p-4 rounded-xl text-center font-bold text-lg transition-all ${
                  testResults[index] 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : index === nextAvailableTest 
                    ? 'bg-blue-500 text-white shadow-lg border-2 border-blue-300 cursor-pointer hover:scale-105' 
                    : 'bg-gray-200 text-gray-500'
                }`} onClick={index === nextAvailableTest ? () => {setCurrentTest(index); setShowTestModal(true);} : undefined}>
                  Test {index + 1}
                  {testResults[index] && <div className="text-2xl mt-2">✅</div>}
                </div>
              ))}
            </div>
            {allTestsCompleted ? (
              <div className="text-center p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-2xl">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-2xl font-black mb-2">All Assessments Completed!</h3>
                <p>You're ready for skill swap! 🎯</p>
              </div>
            ) : (
              <p className="text-center text-lg text-gray-700">
                Next: <span className="font-bold text-blue-600">Test {nextAvailableTest + 1}</span> 
                {testResults[0] && <span className="text-green-600 ml-2">({testResults.filter(Boolean).length}/4 completed)</span>}
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Messages */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-h-[70vh] overflow-y-auto">
            <div className="space-y-4 mb-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === userProfile.email ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-lg ${
                    msg.sender === userProfile.email 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  }`}>
                    <p className="text-lg">{msg.text}</p>
                    <p className="text-xs opacity-75 mt-2">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg"
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:from-purple-600 hover:shadow-2xl transition-all"
              >
                Send
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl sticky top-8">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-3 rounded-xl font-bold shadow-lg hover:from-orange-600">
                  📚 Share Resources
                </button>
                <button className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-600">
                  🎯 Schedule Session
                </button>
                {allTestsCompleted && (
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold shadow-lg hover:from-emerald-600">
                    ✅ Complete Swap
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ TEST MODAL */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📝 {assessments[currentTest].title}
              </h2>
              <button onClick={() => setShowTestModal(false)} className="text-2xl font-bold text-gray-500 hover:text-gray-700">×</button>
            </div>
            
            <div className="space-y-6">
              {assessments[currentTest].questions.map((question, qIndex) => (
                <div key={qIndex} className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-blue-100">
                  <p className="text-xl font-semibold mb-4">{question.q}</p>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <label key={oIndex} className="flex items-center p-3 bg-white rounded-xl cursor-pointer hover:bg-blue-50 transition-all border">
                        <input
                          type="radio"
                          name={`q${qIndex}`}
                          value={oIndex}
                          checked={testAnswers[qIndex] === oIndex}
                          onChange={(e) => {
                            const newAnswers = { ...testAnswers };
                            newAnswers[qIndex] = parseInt(e.target.value);
                            setTestAnswers(newAnswers);
                          }}
                          className="w-5 h-5 text-blue-600 mr-3"
                        />
                        <span className="text-lg font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-100">
              <button
                onClick={() => setShowTestModal(false)}
                className="flex-1 bg-gray-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-gray-600 transition-all"
              >
                Skip
              </button>
              <button
                onClick={() => submitTest(currentTest)}
                disabled={Object.keys(testAnswers).length < 3}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold text-xl shadow-2xl hover:from-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchedMentorChat;
