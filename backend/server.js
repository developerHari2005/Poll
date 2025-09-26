const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();


const app = express();
const server = http.createServer(app);

const clientURL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors({
  origin: clientURL,
  credentials: true
}));

const io = socketIo(server, {
  cors: {
    origin: clientURL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());

let pollData = {
  currentQuestion: null,
  students: new Map(),
  answers: new Map(),
  isActive: false,
  timeLimit: 60,
  pollId: null,
  chatMessages: []
};

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.get("/api/poll/status", (req, res) => {
  const studentsArray = Array.from(pollData.students.values());
  const answersArray = Array.from(pollData.answers.values());

  res.json({
    currentQuestion: pollData.currentQuestion,
    isActive: pollData.isActive,
    timeLimit: pollData.timeLimit,
    students: studentsArray,
    totalStudents: studentsArray.length,
    answeredCount: answersArray.length,
    answers: answersArray
  });
});

app.post("/api/poll/create", (req, res) => {
  const { question, options, timeLimit = 60 } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ error: "Question and at least 2 options are required" });
  }

  const studentsArray = Array.from(pollData.students.values());
  const answersArray = Array.from(pollData.answers.values());

  if (pollData.currentQuestion && answersArray.length < studentsArray.length) {
    return res.status(400).json({
      error: "Cannot create new poll. Previous question not completed by all students."
    });
  }

  pollData.pollId = uuidv4();
  pollData.currentQuestion = { question, options, createdAt: new Date() };
  pollData.isActive = true;
  pollData.timeLimit = timeLimit;
  pollData.answers.clear();

  io.emit("newPoll", {
    pollId: pollData.pollId,
    question: pollData.currentQuestion,
    timeLimit: pollData.timeLimit
  });

  res.json({
    success: true,
    pollId: pollData.pollId,
    question: pollData.currentQuestion
  });
});

app.post("/api/poll/answer", (req, res) => {
  const { studentId, answer } = req.body;

  if (!pollData.isActive || !pollData.currentQuestion) {
    return res.status(400).json({ error: "No active poll" });
  }

  if (!pollData.students.has(studentId)) {
    return res.status(400).json({ error: "Student not registered" });
  }

  if (pollData.answers.has(studentId)) {
    return res.status(400).json({ error: "Answer already submitted" });
  }

  pollData.answers.set(studentId, {
    studentId,
    answer,
    timestamp: new Date()
  });

  const results = calculateResults();
  io.emit("pollResults", results);

  res.json({ success: true, answer });
});

app.post("/api/student/register", (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  const existingStudent = Array.from(pollData.students.values())
    .find(student => student.name.toLowerCase() === name.toLowerCase());

  if (existingStudent) {
    return res.status(400).json({ error: "Name already taken" });
  }

  const studentId = uuidv4();
  pollData.students.set(studentId, {
    id: studentId,
    name: name.trim(),
    joinedAt: new Date()
  });

  io.emit("studentJoined", {
    student: pollData.students.get(studentId),
    totalStudents: pollData.students.size
  });

  res.json({
    success: true,
    studentId,
    name: name.trim()
  });
});

app.get("/api/poll/results", (req, res) => {
  const results = calculateResults();
  res.json(results);
});

function calculateResults() {
  const answersArray = Array.from(pollData.answers.values());
  const optionsCount = {};

  if (pollData.currentQuestion && pollData.currentQuestion.options) {
    pollData.currentQuestion.options.forEach((option, index) => {
      optionsCount[index] = 0;
    });
  }

  answersArray.forEach(answer => {
    if (optionsCount.hasOwnProperty(answer.answer)) {
      optionsCount[answer.answer]++;
    }
  });

  return {
    question: pollData.currentQuestion,
    totalAnswers: answersArray.length,
    totalStudents: pollData.students.size,
    results: optionsCount,
    answers: answersArray,
    isActive: pollData.isActive
  };
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("pollStatus", {
    currentQuestion: pollData.currentQuestion,
    isActive: pollData.isActive,
    timeLimit: pollData.timeLimit
  });

  socket.on("joinAsTeacher", () => {
    socket.join("teachers");
    socket.emit("teacherJoined", { success: true });
  });

  socket.on("joinAsStudent", (data) => {
    const { studentId } = data;
    if (pollData.students.has(studentId)) {
      socket.join("students");
      socket.studentId = studentId;
      socket.emit("studentJoined", { success: true });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (socket.studentId && pollData.students.has(socket.studentId)) {
      pollData.students.delete(socket.studentId);
      io.emit("studentLeft", {
        studentId: socket.studentId,
        totalStudents: pollData.students.size
      });
    }
  });

  socket.on("chatMessage", (message) => {
    const newMessage = { ...message, id: uuidv4(), timestamp: new Date() };
    pollData.chatMessages.push(newMessage);
    io.emit("newChatMessage", newMessage);
  });

  socket.on("kickStudent", ({ studentId }) => {
    for (const [id, sock] of io.of("/").sockets) {
      if (sock.studentId === studentId) {
        sock.emit("kicked");
        sock.disconnect();
        break;
      }
    }
  });
});
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
  });
}

const PORT = process.env.PORT || 8001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
