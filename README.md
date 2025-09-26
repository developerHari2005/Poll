# Live Polling System

This project is a Live Polling System consisting of a frontend React application and a backend server. It allows teachers to create polls in real-time and students to join, answer questions, and view results dynamically. The system supports real-time updates using WebSockets (Socket.IO).

## Features

- Teacher can create and manage live polls with multiple-choice questions.
- Students can join polls, submit answers, and view live results.
- Real-time updates for poll status, results, and student participation.
- Chat functionality for communication between teacher and students.
- Ability for teachers to kick students out of the session.
- User roles: Teacher and Student with role-based UI.
- Error handling and loading states.
- Persistent user sessions using localStorage.

## Technologies Used

- Frontend:
  - React 18
  - Redux Toolkit for state management
  - React Router for navigation
  - Socket.IO client for real-time communication
  - Tailwind CSS for styling

- Backend:
  - Node.js with Express (assumed from project structure)
  - Socket.IO server for WebSocket communication

## Project Structure

- `frontend/`: React frontend application
  - `src/components/`: React components for UI
  - `src/store/`: Redux slices and store configuration
  - `src/services/`: API and socket service utilities
  - `public/`: Static assets and HTML template

- `backend/`: Backend server (Node.js/Express)
  - Server and API endpoints
  - Socket.IO server setup

## Setup and Running

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. The frontend will be available at `http://localhost:3000`.

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

4. The backend server will run on `http://localhost:8001` (default).

## Usage

- Open the frontend URL in a browser.
- Teachers can create polls and manage students.
- Students can join polls using their name and participate.
- Real-time updates will be reflected automatically.

## Testing

- Manual testing of poll creation, student joining, answering, and results display.
- Verify real-time updates via WebSocket events.
- Check error handling and UI feedback for edge cases.

## Notes

- Ensure backend server is running before starting the frontend.
- Socket.IO is used for real-time communication between frontend and backend.
- User sessions are persisted in localStorage for convenience.

## License

This project is provided as-is without any warranty.
