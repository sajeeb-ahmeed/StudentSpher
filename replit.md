# Student Results System

## Overview

A web-based student results dashboard built with Express.js backend and vanilla HTML/CSS/JavaScript frontend. The system provides two main views: a leaderboard showing all students ranked by their total scores, and a personal scores page displaying individual task performance. The application uses a simple RESTful API architecture with sample data for demonstration purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML, CSS (Tailwind CSS), and JavaScript
- **UI Framework**: Tailwind CSS for styling with custom animations and responsive design
- **Client-Side Routing**: Simple page-based navigation between leaderboard and personal scores views
- **Data Fetching**: Native fetch API for consuming REST endpoints
- **Design Pattern**: Static file serving with dynamic content updates via API calls

### Backend Architecture
- **Framework**: Express.js with minimal middleware stack
- **API Design**: RESTful endpoints serving JSON data
- **Data Storage**: In-memory JavaScript objects (no persistent database)
- **Middleware**: CORS for cross-origin requests, express.json for request parsing, express.static for serving frontend assets
- **Error Handling**: Basic Express error handling with JSON responses

### Key API Endpoints
- `GET /api/leaderboard`: Returns sorted list of all students by total score
- `GET /api/myscores`: Returns individual student's detailed score breakdown
- `GET /`: Serves main dashboard page
- Static file serving for HTML, CSS, and JavaScript assets

### Data Structure
- **Student Records**: Name, avatar URL, total score, submission count
- **Score Details**: Task-specific scores with task names and individual performance metrics
- **Sample Data**: Hardcoded demonstration data with realistic student information

## External Dependencies

### NPM Packages
- **express**: Web application framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware for handling frontend-backend communication

### CDN Resources
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **Font Awesome**: Icon library for UI elements
- **UI Avatars**: External service for generating user avatar images based on names

### Third-Party Services
- **ui-avatars.com**: Generates colored avatar images with initials for student profiles
- No database dependencies (uses in-memory data storage)
- No authentication services integrated
- No external APIs for data persistence