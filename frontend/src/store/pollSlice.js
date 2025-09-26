import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: null,
  isActive: false,
  timeLimit: 60,
  timeRemaining: 60,
  answers: [],
  results: {},
  totalStudents: 0,
  answeredCount: 0,
  students: [],
  hasAnswered: false,
  loading: false,
  error: null,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPollData: (state, action) => {
      const { currentQuestion, isActive, timeLimit, totalStudents, answeredCount, students } = action.payload;
      state.currentQuestion = currentQuestion;
      state.isActive = isActive;
      state.timeLimit = timeLimit;
      state.timeRemaining = timeLimit;
      state.totalStudents = totalStudents;
      state.answeredCount = answeredCount;
      state.students = students;
    },
    setNewPoll: (state, action) => {
      const { question, timeLimit } = action.payload;
      state.currentQuestion = question;
      state.isActive = true;
      state.timeLimit = timeLimit;
      state.timeRemaining = timeLimit;
      state.hasAnswered = false;
      state.answers = [];
      state.results = {};
    },
    updateTimer: (state, action) => {
      state.timeRemaining = action.payload;
      if (action.payload <= 0) {
        state.isActive = false;
      }
    },
    setAnswered: (state) => {
      state.hasAnswered = true;
    },
    updateResults: (state, action) => {
      state.results = action.payload.results;
      state.answers = action.payload.answers;
      state.totalStudents = action.payload.totalStudents;
      state.answeredCount = action.payload.totalAnswers;
    },
    setStudents: (state, action) => {
      state.totalStudents = action.payload;
    },
    addStudent: (state, action) => {
      if (!state.students) state.students = [];
      state.students.push(action.payload);
      state.totalStudents = state.students.length;
    },
    removeStudent: (state, action) => {
      if (!state.students) state.students = [];
      state.students = state.students.filter(student => student.id !== action.payload);
      state.totalStudents = state.students.length;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPoll: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setPollData,
  setNewPoll,
  updateTimer,
  setAnswered,
  updateResults,
  setStudents,
  addStudent,
  removeStudent,
  setLoading,
  setError,
  clearError,
  resetPoll,
} = pollSlice.actions;

export default pollSlice.reducer;