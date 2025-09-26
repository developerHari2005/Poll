import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  studentId: null,
  role: null, // 'teacher' or 'student'
  isLoggedIn: false,
  kicked: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { name, studentId, role } = action.payload;
      state.name = name;
      state.studentId = studentId;
      state.role = role;
      state.isLoggedIn = true;
      localStorage.setItem('pollUser', JSON.stringify({
        name,
        studentId,
        role
      }));
    },
    setRole: (state, action) => {
      state.role = action.payload;
      if (action.payload === 'teacher') {
        state.isLoggedIn = true;
      }
      const stored = localStorage.getItem('pollUser') || '{}';
      const userData = JSON.parse(stored);
      userData.role = action.payload;
      localStorage.setItem('pollUser', JSON.stringify(userData));
    },
    loadUserFromStorage: (state) => {
      const stored = localStorage.getItem('pollUser');
      if (stored) {
        const userData = JSON.parse(stored);
        state.name = userData.name || '';
        state.studentId = userData.studentId || null;
        state.role = userData.role || null;
        state.isLoggedIn = !!(userData.name || userData.role);
      }
    },
    setKicked: (state, action) => {
      state.kicked = action.payload;
    },
    logout: (state) => {
      state.name = '';
      state.studentId = null;
      state.role = null;
      state.isLoggedIn = false;
      state.kicked = false;
      localStorage.removeItem('pollUser');
    },
  },
});

export const { setUser, setRole, loadUserFromStorage, setKicked, logout } = userSlice.actions;

export default userSlice.reducer;