require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5000",
    "https://studentspher.onrender.com" // 🔧 replace with your Render domain
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'student-dashboard-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.userId) return next();
  return res.status(401).json({ error: 'Authentication required' });
};

// Helper function to generate avatar URL
const generateAvatar = (name) => {
  const colors = ['3b82f6','10b981','f59e0b','ef4444','8b5cf6','06b6d4','ec4899','84cc16'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${randomColor}&color=fff&size=150`;
};

/* -------------------- AUTH ROUTES -------------------- */
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password, full_name) VALUES ($1,$2,$3,$4) RETURNING id, username, email, full_name',
      [username, email, hashedPassword, fullName]
    );

    const newUser = result.rows[0];
    req.session.userId = newUser.id;
    req.session.username = newUser.username;

    res.json({ message: 'Registration successful', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    const result = await pool.query(
      'SELECT id, username, email, password, full_name FROM users WHERE username = $1 OR email = $1',
      [username]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });

    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Could not log out' });
    res.json({ message: 'Logout successful' });
  });
});

app.get('/api/auth/status', (req, res) => {   // ✅ fixed route
  if (req.session.userId) {
    res.json({ authenticated: true, userId: req.session.userId, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

/* -------------------- LEADERBOARD & SCORES -------------------- */
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.full_name as name,
        u.username,
        COALESCE(AVG(us.score), 0) as total_score,
        COUNT(us.id) as total_submissions
      FROM users u
      LEFT JOIN user_scores us ON u.id = us.user_id
      GROUP BY u.id, u.full_name, u.username
      ORDER BY total_score DESC
    `);

    const leaderboard = result.rows.map(user => ({
      name: user.name,
      username: user.username,
      avatar: generateAvatar(user.name),
      total_score: Math.round(user.total_score),
      total_submissions: parseInt(user.total_submissions)
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

app.get('/api/myscores', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const scoresResult = await pool.query(
      'SELECT task_name, score, submitted_at FROM user_scores WHERE user_id = $1 ORDER BY submitted_at DESC',
      [userId]
    );

    const scores = scoresResult.rows;
    const total = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length) : 0;

    res.json({
      total,
      scores: scores.map(score => ({
        task_name: score.task_name,
        score: score.score
      }))
    });
  } catch (err) {
    console.error('My scores error:', err);
    res.status(500).json({ error: 'Failed to load your scores' });
  }
});

app.post('/api/scores', requireAuth, async (req, res) => {
  try {
    const { taskName, score } = req.body;
    const userId = req.session.userId;

    if (!taskName || score === undefined || score < 0 || score > 100) {
      return res.status(400).json({ error: 'Valid task name and score (0-100) are required' });
    }

    await pool.query(
      'INSERT INTO user_scores (user_id, task_name, score) VALUES ($1, $2, $3)',
      [userId, taskName, score]
    );

    res.json({ message: 'Score added successfully' });
  } catch (err) {
    console.error('Add score error:', err);
    res.status(500).json({ error: 'Failed to add score' });
  }
});

/* -------------------- PROFILE ROUTES -------------------- */
app.get('/api/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const result = await pool.query(
      'SELECT id, username, email, full_name, phone, avatar_url, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];
    res.json({
      ...user,
      avatar_url: user.avatar_url || generateAvatar(user.full_name)
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

app.put('/api/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { full_name, email, phone, avatar_url } = req.body;

    if (!full_name || !email) return res.status(400).json({ error: 'Full name and email are required' });

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );
    if (existingUser.rows.length > 0) return res.status(400).json({ error: 'Email already taken' });

    const result = await pool.query(
      'UPDATE users SET full_name=$1, email=$2, phone=$3, avatar_url=$4 WHERE id=$5 RETURNING id, username, email, full_name, phone, avatar_url',
      [full_name, email, phone, avatar_url, userId]
    );

    res.json({ message: 'Profile updated successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/* -------------------- SUBMISSIONS ROUTES -------------------- */
app.post('/api/submit', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { assignment_title, description, file_names } = req.body;

    if (!assignment_title || !description) {
      return res.status(400).json({ error: 'Assignment title and description are required' });
    }

    const result = await pool.query(
      'INSERT INTO submissions (user_id, assignment_title, description, file_names) VALUES ($1,$2,$3,$4) RETURNING id, submitted_at',
      [userId, assignment_title, description, file_names || []]
    );

    res.json({ message: 'Assignment submitted successfully', submission: result.rows[0] });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

app.get('/api/submissions', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const result = await pool.query(
      'SELECT id, assignment_title, description, file_names, submitted_at FROM submissions WHERE user_id=$1 ORDER BY submitted_at DESC',
      [userId]
    );
    res.json({ submissions: result.rows });
  } catch (err) {
    console.error('Submissions fetch error:', err);
    res.status(500).json({ error: 'Failed to load submissions' });
  }
});

/* -------------------- SERVE STATIC PAGES -------------------- */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/leaderboard.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'leaderboard.html')));
app.get('/myscores.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'myscores.html')));
app.get('/submit.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'submit.html')));
app.get('/profile.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'profile.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));

/* -------------------- START SERVER -------------------- */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
