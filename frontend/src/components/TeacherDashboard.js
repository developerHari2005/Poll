import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import { clearError } from '../store/pollSlice';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { kickStudent } from '../services/socketService';
import Chat from './Chat';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    currentQuestion, 
    isActive, 
    results,
    totalStudents,
    answeredCount, 
    students
  } = useSelector((state) => state.poll);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [creating, setCreating] = useState(false);
  const [error, setLocalError] = useState('');

  const canCreateNewPoll = !currentQuestion || (totalStudents > 0 && answeredCount >= totalStudents);

  useEffect(() => {
    fetchPollStatus();
  }, []);

  const fetchPollStatus = async () => {
    try {
      const data = await apiService.getPollStatus();
    } catch (err) {
      console.error('Failed to fetch poll status:', err);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setLocalError('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setLocalError('Please provide at least 2 options');
      return;
    }

    setCreating(true);
    setLocalError('');
    dispatch(clearError());

    try {
      await apiService.createPoll(question.trim(), validOptions, timeLimit);
      setQuestion('');
      setOptions(['', '', '', '']);
      setTimeLimit(60);
      setShowCreateForm(false);
    } catch (err) {
      setLocalError(err.message || 'Failed to create poll');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleKickStudent = (studentId) => {
    if (window.confirm('Are you sure you want to kick this student?')) {
      kickStudent(studentId);
    }
  };

  const getResultsPercentage = (optionIndex) => {
    if (!results || !results[optionIndex] || answeredCount === 0) return 0;
    return Math.round((results[optionIndex] / answeredCount) * 100);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <span className="text-purple-600 font-semibold">Intervue Poll</span>
            <p className="text-gray-600 text-sm">Teacher Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Poll Management & Students */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Students Status */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Students Status
                </h2>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Students:</span>
                  <span className="font-medium">{totalStudents}</span>
                </div>
                {currentQuestion && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Answered:</span>
                    <span className="font-medium">{answeredCount} / {totalStudents}</span>
                  </div>
                )}
              </div>

              {/* Student List */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Students</h2>
                <div className="space-y-2">
                  {students && students.length > 0 ? (
                    students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <span>{student.name}</span>
                        <button 
                          onClick={() => handleKickStudent(student.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Kick
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm">No students connected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Create Poll Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create Poll
                </h2>
                {!showCreateForm && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    disabled={!canCreateNewPoll}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    New Poll
                  </button>
                )}
              </div>

              {!canCreateNewPoll && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <p className="text-yellow-800 text-sm">
                    Wait for all students to answer the current question before creating a new poll.
                  </p>
                </div>
              )}

              {showCreateForm && (
                <form onSubmit={handleCreatePoll} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Enter your question"
                      disabled={creating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          disabled={creating}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (seconds)
                    </label>
                    <select
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      disabled={creating}
                    >
                      <option value={30}>30 seconds</option>
                      <option value={60}>60 seconds</option>
                      <option value={90}>90 seconds</option>
                      <option value={120}>120 seconds</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {creating ? 'Creating...' : 'Create Poll'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      disabled={creating}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column - Chat & Current Poll */}
          <div className="space-y-6">
            <Chat />
            {currentQuestion ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Current Poll
                </h2>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">
                            {String.fromCharCode(65 + index)}. {option}
                          </span>
                          <div className="text-right">
                            <span className="text-sm text-gray-600">
                              {results?.[index] || 0} votes
                            </span>
                            <span className="text-sm text-gray-600 ml-2">
                              ({getResultsPercentage(index)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${getResultsPercentage(index)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                      {answeredCount} of {totalStudents} students have answered
                    </span>
                    {isActive && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Live Poll Active
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Active Poll
                </h2>
                <p className="text-gray-600 mb-4">
                  Create a new poll to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;