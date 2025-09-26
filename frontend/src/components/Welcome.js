import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRole } from '../store/userSlice';
import { joinAsTeacher } from '../services/socketService';

const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRoleSelection = (role) => {
    console.log('Role selected:', role);
    dispatch(setRole(role));
    
    if (role === 'teacher') {
      joinAsTeacher();
      navigate('/teacher');
    } else {
      navigate('/student/name');
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
            Welcome to Live Polling!
          </h1>
          <p className="text-gray-600 text-sm">
            Join as a teacher to create polls or as a student to participate in live polling sessions
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4 mb-6">
          {/* Student Card */}
          <div 
            onClick={() => handleRoleSelection('student')}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">S</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Student</h3>
                <p className="text-sm text-gray-600">
                  Participate in live polls, submit your answers, and view results instantly
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Card */}
          <div 
            onClick={() => handleRoleSelection('teacher')}
            className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">T</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Teacher</h3>
                <p className="text-sm text-gray-600">
                  Create and launch polls, view real-time results, and manage student participation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button 
          disabled
          className="w-full py-3 px-4 bg-gray-200 text-gray-500 rounded-xl font-medium cursor-not-allowed"
        >
          Select a role to continue
        </button>
      </div>
    </div>
  );
};

export default Welcome;