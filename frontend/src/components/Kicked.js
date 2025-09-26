import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setKicked } from '../store/userSlice';

const Kicked = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBackToLogin = () => {
    dispatch(setKicked(false));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-purple-600 font-semibold text-sm">Intervue Poll</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You have been kicked out
          </h1>
          <p className="text-gray-600 text-sm">
            The teacher has removed you from the session.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleBackToLogin}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Kicked;
