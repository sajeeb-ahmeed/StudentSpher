-- Student Results System Database Schema
-- Complete SQL table structure for PostgreSQL

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_url VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    batch VARCHAR(20) DEFAULT 'batch1'
);

-- Create User Scores table
CREATE TABLE user_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    task_name VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Submissions table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    assignment_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    file_names TEXT[], -- Array of file names
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'submitted'
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_batch ON users(batch);
CREATE INDEX idx_user_scores_user_id ON user_scores(user_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);

-- Insert sample demo data (optional)
INSERT INTO users (username, email, password, full_name, batch) VALUES
('demo_student1', 'demo1@example.com', '$2b$10$hashedpassword1', 'Demo Student One', 'batch1'),
('demo_student2', 'demo2@example.com', '$2b$10$hashedpassword2', 'Demo Student Two', 'batch1'),
('demo_student3', 'demo3@example.com', '$2b$10$hashedpassword3', 'Demo Student Three', 'batch1'),
('demo_student4', 'demo4@example.com', '$2b$10$hashedpassword4', 'Demo Student Four', 'batch2'),
('demo_student5', 'demo5@example.com', '$2b$10$hashedpassword5', 'Demo Student Five', 'batch2');

-- Insert sample scores for demo users
INSERT INTO user_scores (user_id, task_name, score) VALUES
(1, 'JavaScript Fundamentals', 95),
(1, 'HTML & CSS Basics', 88),
(1, 'React Components', 92),
(2, 'JavaScript Fundamentals', 87),
(2, 'HTML & CSS Basics', 93),
(2, 'React Components', 89),
(3, 'JavaScript Fundamentals', 91),
(3, 'HTML & CSS Basics', 85),
(3, 'React Components', 88),
(4, 'JavaScript Fundamentals', 89),
(4, 'HTML & CSS Basics', 91),
(4, 'React Components', 86),
(5, 'JavaScript Fundamentals', 93),
(5, 'HTML & CSS Basics', 87),
(5, 'React Components', 90);


