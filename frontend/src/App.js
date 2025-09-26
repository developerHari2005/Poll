import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromStorage } from './store/userSlice';
import { connectSocket, disconnectSocket } from './services/socketService';

import Welcome from './components/Welcome';
import StudentName from './components/StudentName';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Kicked from './components/Kicked';

function App() {
  const dispatch = useDispatch();
  const { role, isLoggedIn, kicked } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUserFromStorage());
    connectSocket(dispatch);
    return () => {
      disconnectSocket();
    };
  }, [dispatch]);

  if (kicked) {
    return <Kicked />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/student/name" element={<StudentName />} />
        <Route 
          path="/teacher" 
          element={<TeacherDashboard />}
        />
        <Route 
          path="/student" 
          element={
            role === 'student' && isLoggedIn ? <StudentDashboard /> : <Navigate to="/" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;