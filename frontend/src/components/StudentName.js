import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { apiService } from '../services/apiService';
import { joinAsStudent } from '../services/socketService';

const StudentName = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.registerStudent(name.trim());
      
      if (response.success) {
        dispatch(setUser({
          name: response.name,
          studentId: response.studentId,
          role: 'student'
        }));
        
        joinAsStudent(response.studentId);
        navigate('/student');
      }
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <span className="text-purple-600 font-semibold text-sm">Intervue Poll</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Student Portal
          </h1>
          <p className="text-gray-600 text-sm">
            Submit your name to participate in polls and compare answers with your classmates
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 text-sm hover:text-purple-700 transition-colors"
          >
            ← Back to role selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentName;