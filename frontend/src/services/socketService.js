import io from 'socket.io-client';
import { setPollData, setNewPoll, updateResults, addStudent, removeStudent } from '../store/pollSlice';
import { setInitialMessages, addMessage } from '../store/chatSlice';
import { logout, setKicked } from '../store/userSlice';

let socket = null;

const getSocketUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin;
  }
  return 'http://localhost:8001';
};

export const connectSocket = (dispatch) => {
  const socketUrl = getSocketUrl();
  
  socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    maxReconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('pollStatus', (data) => {
    dispatch(setPollData(data));
  });

  socket.on('newPoll', (data) => {
    dispatch(setNewPoll(data));
  });

  socket.on('pollResults', (data) => {
    dispatch(updateResults(data));
  });

  socket.on('studentJoined', (data) => {
    dispatch(addStudent(data.student));
  });

  socket.on('studentLeft', (data) => {
    dispatch(removeStudent(data.studentId));
  });

  socket.on('chatHistory', (messages) => {
    dispatch(setInitialMessages(messages));
  });

  socket.on('newChatMessage', (message) => {
    dispatch(addMessage(message));
  });

  socket.on('kicked', () => {
    dispatch(setKicked(true));
    dispatch(logout());
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinAsTeacher = () => {
  if (socket) {
    socket.emit('joinAsTeacher');
  }
};

export const joinAsStudent = (studentId) => {
  if (socket) {
    socket.emit('joinAsStudent', { studentId });
  }
};

export const sendChatMessage = (message) => {
  if (socket) {
    socket.emit('chatMessage', message);
  }
};

export const kickStudent = (studentId) => {
  if (socket) {
    socket.emit('kickStudent', { studentId });
  }
};

export const getSocket = () => socket;