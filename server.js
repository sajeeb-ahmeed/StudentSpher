require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for production (required for Render)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'student-dashboard-default-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Admin authorization middleware (for demo - in production use proper role system)
const requireAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // For demo purposes, checking if user is from batch1 OR username contains 'admin'
    // In production, you'd have a proper roles table
    const result = await pool.query(
      'SELECT username, batch FROM users WHERE id = $1',
      [req.session.userId]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Demo admin check - modify as needed for your requirements
    if (user.username.toLowerCase().includes('admin') || user.batch === 'batch1') {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Helper function to generate avatar URL
const generateAvatar = (name) => {
  const colors = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4', 'ec4899', '84cc16'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${randomColor}&color=fff&size=150`;
};

// Authentication Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, fullName, batch } = req.body;

    // Basic validation
    if (!username || !email || !password || !fullName || !batch) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['batch1', 'batch2'].includes(batch)) {
      return res.status(400).json({ error: 'Invalid batch selection' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, email, password, full_name, batch) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, full_name, batch',
      [username, email, hashedPassword, fullName, batch]
    );

    const newUser = result.rows[0];

    // Add some sample scores for new user
    const sampleScores = [
      { task_name: 'JavaScript Fundamentals', score: Math.floor(Math.random() * 20) + 80 },
      { task_name: 'HTML & CSS Basics', score: Math.floor(Math.random() * 20) + 75 },
      { task_name: 'React Components', score: Math.floor(Math.random() * 25) + 70 }
    ];

    for (const scoreData of sampleScores) {
      await pool.query(
        'INSERT INTO user_scores (user_id, task_name, score) VALUES ($1, $2, $3)',
        [newUser.id, scoreData.task_name, scoreData.score]
      );
    }

    // Set session
    req.session.userId = newUser.id;
    req.session.username = newUser.username;

    res.json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, username, email, password, full_name FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Simple auth check removed - using enhanced version below

// Dynamic API Routes
app.get('/api/leaderboard', requireAuth, async (req, res) => {
  try {
    // Get current user's batch
    const userResult = await pool.query('SELECT batch FROM users WHERE id = $1', [req.session.userId]);
    const userBatch = userResult.rows[0]?.batch;

    const result = await pool.query(`
      SELECT 
        u.id,
        u.full_name as name,
        u.username,
        u.batch,
        COALESCE(AVG(us.score), 0) as total_score,
        COUNT(us.id) as total_submissions
      FROM users u
      LEFT JOIN user_scores us ON u.id = us.user_id
      WHERE u.batch = $1
      GROUP BY u.id, u.full_name, u.username, u.batch
      ORDER BY total_score DESC
    `, [userBatch]);

    const leaderboard = result.rows.map(user => ({
      name: user.name,
      username: user.username,
      batch: user.batch,
      avatar: generateAvatar(user.name),
      total_score: Math.round(user.total_score),
      total_submissions: parseInt(user.total_submissions)
    }));

    res.json({ leaderboard, user_batch: userBatch });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

// Check authentication status
app.get('/api/auth-status', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ authenticated: false });
    }

    const result = await pool.query(
      'SELECT id, username, full_name, email, batch FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      req.session.destroy();
      return res.json({ authenticated: false });
    }

    const user = result.rows[0];
    const isAdmin = user.username.toLowerCase().includes('admin') || user.batch === 'batch1';

    res.json({
      authenticated: true,
      isAdmin,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        batch: user.batch
      }
    });

  } catch (error) {
    console.error('Auth status check error:', error);
    res.status(500).json({ error: 'Failed to check auth status' });
  }
});

app.get('/api/myscores', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Get user scores
    const scoresResult = await pool.query(
      'SELECT task_name, score, submitted_at FROM user_scores WHERE user_id = $1 ORDER BY submitted_at DESC',
      [userId]
    );

    const scores = scoresResult.rows;
    const total = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length) : 0;

    res.json({
      total: total,
      scores: scores.map(score => ({
        task_name: score.task_name,
        score: score.score
      }))
    });

  } catch (error) {
    console.error('My scores error:', error);
    res.status(500).json({ error: 'Failed to load your scores' });
  }
});

// Add score endpoint
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
  } catch (error) {
    console.error('Add score error:', error);
    res.status(500).json({ error: 'Failed to add score' });
  }
});

// Profile management endpoints
app.get('/api/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const result = await pool.query(
      'SELECT id, username, email, full_name, photo_url, phone, batch, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get user statistics
    const statsResult = await pool.query(
      'SELECT COUNT(*) as total_submissions, COALESCE(AVG(score), 0) as average_score FROM user_scores WHERE user_id = $1',
      [userId]
    );

    const submissionsResult = await pool.query(
      'SELECT COUNT(*) as assignment_submissions FROM submissions WHERE user_id = $1',
      [userId]
    );

    const stats = statsResult.rows[0];
    const assignmentStats = submissionsResult.rows[0];

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      photo_url: user.photo_url || generateAvatar(user.full_name),
      phone: user.phone || '',
      batch: user.batch,
      created_at: user.created_at,
      stats: {
        total_submissions: parseInt(stats.total_submissions),
        assignment_submissions: parseInt(assignmentStats.assignment_submissions),
        average_score: Math.round(stats.average_score),
        gpa: Math.min(4.0, (parseFloat(stats.average_score) / 100) * 4).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

app.put('/api/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { full_name, email, phone, photo_url, batch } = req.body;

    // Basic validation
    if (!full_name || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    // Check if email is already taken by another user
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already taken by another user' });
    }

    // Update user profile (include batch if provided)
    let query, params;
    if (batch && ['batch1', 'batch2'].includes(batch)) {
      query = 'UPDATE users SET full_name = $1, email = $2, phone = $3, photo_url = $4, batch = $5 WHERE id = $6 RETURNING id, username, email, full_name, photo_url, phone, batch';
      params = [full_name, email, phone, photo_url, batch, userId];
    } else {
      query = 'UPDATE users SET full_name = $1, email = $2, phone = $3, photo_url = $4 WHERE id = $5 RETURNING id, username, email, full_name, photo_url, phone, batch';
      params = [full_name, email, phone, photo_url, userId];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        photo_url: user.photo_url || generateAvatar(user.full_name),
        phone: user.phone || '',
        batch: user.batch
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Assignment submission endpoints
app.post('/api/submit', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { assignment_title, description, drive_link, file_names } = req.body;

    // Basic validation
    if (!assignment_title || !description) {
      return res.status(400).json({ error: 'Assignment title and description are required' });
    }

    // Validate drive_link if provided
    let validatedDriveLink = null;
    if (drive_link && drive_link.trim()) {
      const trimmedLink = drive_link.trim();
      // Basic URL validation and security check
      if (trimmedLink.length > 500) {
        return res.status(400).json({ error: 'Drive link is too long' });
      }
      if (!trimmedLink.match(/^https?:\/\/.+/i)) {
        return res.status(400).json({ error: 'Drive link must be a valid HTTP/HTTPS URL' });
      }
      validatedDriveLink = trimmedLink;
    }

    // Insert submission
    const result = await pool.query(
      'INSERT INTO submissions (user_id, assignment_title, description, drive_link, file_names) VALUES ($1, $2, $3, $4, $5) RETURNING id, submitted_at',
      [userId, assignment_title, description, validatedDriveLink, file_names || []]
    );

    const submission = result.rows[0];

    res.json({
      message: 'Assignment submitted successfully',
      submission: {
        id: submission.id,
        assignment_title,
        description,
        file_names: file_names || [],
        submitted_at: submission.submitted_at,
        status: 'submitted'
      }
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

app.get('/api/submissions', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const result = await pool.query(
      'SELECT id, assignment_title, description, drive_link, file_names, submitted_at, status FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC',
      [userId]
    );

    res.json({
      submissions: result.rows
    });

  } catch (error) {
    console.error('Submissions fetch error:', error);
    res.status(500).json({ error: 'Failed to load submissions' });
  }
});

// Admin endpoints
app.get('/api/admin/students', requireAdmin, async (req, res) => {
  try {
    const { batch } = req.query;

    let whereClause = '';
    let queryParams = [];

    if (batch && batch !== 'all') {
      whereClause = 'WHERE u.batch = $1';
      queryParams.push(batch);
    }

    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.photo_url,
        u.batch,
        u.created_at,
        COALESCE(scores.total_score, 0) as total_score,
        COALESCE(subs.submission_count, 0) as submission_count
      FROM users u
      LEFT JOIN (
        SELECT user_id, SUM(score) as total_score 
        FROM user_scores 
        GROUP BY user_id
      ) scores ON u.id = scores.user_id
      LEFT JOIN (
        SELECT user_id, COUNT(*) as submission_count 
        FROM submissions 
        GROUP BY user_id
      ) subs ON u.id = subs.user_id
      ${whereClause}
      ORDER BY u.full_name
    `, queryParams);

    const students = result.rows.map(student => ({
      ...student,
      photo_url: student.photo_url || generateAvatar(student.full_name)
    }));

    res.json({
      students,
      batch: batch || 'all'
    });

  } catch (error) {
    console.error('Admin students fetch error:', error);
    res.status(500).json({ error: 'Failed to load students data' });
  }
});

// Get individual student details for admin
app.get('/api/admin/student/:id', requireAdmin, async (req, res) => {
  try {
    const studentId = req.params.id;

    // Get student basic info
    const studentResult = await pool.query(
      'SELECT id, username, email, full_name, photo_url, batch, created_at FROM users WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = studentResult.rows[0];

    // Get student's academic scores
    const scoresResult = await pool.query(
      'SELECT task_name, score, submitted_at FROM user_scores WHERE user_id = $1 ORDER BY submitted_at DESC',
      [studentId]
    );

    // Get student's submissions
    const submissionsResult = await pool.query(
      'SELECT id, assignment_title, description, drive_link, file_names, submitted_at, status FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC',
      [studentId]
    );

    res.json({
      student: {
        ...student,
        photo_url: student.photo_url || generateAvatar(student.full_name)
      },
      scores: scoresResult.rows,
      submissions: submissionsResult.rows
    });

  } catch (error) {
    console.error('Admin student details fetch error:', error);
    res.status(500).json({ error: 'Failed to load student details' });
  }
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

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/student-details.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-details.html'));
});


// Exams routes (added)
app.locals.pool = pool;
const examRoutes = require('./routes/exam')(pool, requireAuth, requireAdmin);

app.use('/api/exams', examRoutes);

app.use('/exams', examRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});