const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample data for demonstration
const students = [
  { name: "Alex Johnson", avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=3b82f6&color=fff", total_score: 95, total_submissions: 12 },
  { name: "Sarah Chen", avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff", total_score: 92, total_submissions: 11 },
  { name: "Michael Rodriguez", avatar: "https://ui-avatars.com/api/?name=Michael+Rodriguez&background=f59e0b&color=fff", total_score: 88, total_submissions: 10 },
  { name: "Emma Thompson", avatar: "https://ui-avatars.com/api/?name=Emma+Thompson&background=ef4444&color=fff", total_score: 87, total_submissions: 9 },
  { name: "David Kim", avatar: "https://ui-avatars.com/api/?name=David+Kim&background=8b5cf6&color=fff", total_score: 84, total_submissions: 11 },
  { name: "Lisa Wang", avatar: "https://ui-avatars.com/api/?name=Lisa+Wang&background=06b6d4&color=fff", total_score: 82, total_submissions: 8 },
  { name: "James Wilson", avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=ec4899&color=fff", total_score: 79, total_submissions: 10 },
  { name: "Sophie Brown", avatar: "https://ui-avatars.com/api/?name=Sophie+Brown&background=84cc16&color=fff", total_score: 76, total_submissions: 7 }
];

const myScores = {
  total: 95,
  scores: [
    { task_name: "JavaScript Fundamentals", score: 98 },
    { task_name: "React Components", score: 94 },
    { task_name: "Node.js Basics", score: 96 },
    { task_name: "Database Design", score: 92 },
    { task_name: "API Development", score: 97 },
    { task_name: "CSS Grid & Flexbox", score: 89 },
    { task_name: "Authentication Systems", score: 95 },
    { task_name: "Testing Strategies", score: 93 }
  ]
};

// API Routes
app.get('/api/leaderboard', (req, res) => {
  const sortedStudents = [...students].sort((a, b) => b.total_score - a.total_score);
  res.json(sortedStudents);
});

app.get('/api/myscores', (req, res) => {
  res.json(myScores);
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/leaderboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

app.get('/myscores.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'myscores.html'));
});

app.get('/submit.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});