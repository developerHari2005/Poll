import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateTimer, setAnswered } from '../store/pollSlice';
import { apiService } from '../services/apiService';
import { logout } from '../store/userSlice';
import Chat from './Chat';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, studentId } = useSelector((state) => state.user);
  const { 
    currentQuestion, 
    isActive, 
    timeRemaining, 
    hasAnswered, 
    results,
    totalStudents,
    answeredCount 
  } = useSelector((state) => state.poll);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isActive && timeRemaining > 0 && !hasAnswered) {
      const timer = setInterval(() => {
        dispatch(updateTimer(timeRemaining - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, timeRemaining, hasAnswered, dispatch]);

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      await apiService.submitAnswer(studentId, selectedAnswer);
      dispatch(setAnswered());
    } catch (err) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getResultsPercentage = (optionIndex) => {
    if (!results || !results[optionIndex] || answeredCount === 0) return 0;
    return Math.round((results[optionIndex] / answeredCount) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <span className="text-purple-600 font-semibold">Intervue Poll</span>
            <p className="text-gray-600 text-sm">Welcome, {name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {!currentQuestion ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Wait for the teacher to ask questions...
              </h2>
              <p className="text-gray-600">
                You'll see the question here once the teacher starts a poll
              </p>
            </div>
          ) : hasAnswered ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Poll Results
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
                        <span className="text-sm text-gray-600">
                          {getResultsPercentage(index)}%
                        </span>
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

                <div className="mt-4 text-center text-sm text-gray-600">
                  {answeredCount} of {totalStudents} students have answered
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-600">Question 1</span>
                  <div className="text-lg font-bold text-purple-600">
                    {formatTime(timeRemaining)}
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-8">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null || submitting || timeRemaining <= 0}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {submitting ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          )}
        </div>
        <Chat />
      </div>
    </div>
  );
};

export default StudentDashboard;