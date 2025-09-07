# Student Results System

## Overview

A modern, 3D-animated web-based student results dashboard built with Express.js backend and vanilla HTML/CSS/JavaScript frontend. The system features a complete navigation structure with five main pages: Home, Leaderboard, My Scores, Task Submit, and Profile. The application showcases professional 3D design elements, glass morphism effects, and sophisticated animations while maintaining a clean, modern SaaS-style appearance.

## Recent Changes (September 2025)

- **Complete Authentication System**: Added PostgreSQL database with user registration, login, and session management using bcrypt password hashing
- **Dynamic Data Integration**: Made leaderboard show real registered users and personalized My Scores page with actual user data
- **Dark/Light Theme System**: Implemented comprehensive theme switching with localStorage preferences and smooth transitions
- **Bengali/English Language Support**: Added complete translation system with 180+ translations and language preferences storage
- **Modern 3D Design**: Upgraded entire UI with 3D card effects, glass morphism, and professional animations supporting both themes
- **Enhanced User Experience**: Theme and language controls integrated into navigation with persistent preferences

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Modern, 3D, animated, professional, and attractive looking interfaces.
Language support: English and Bengali (বাংলা) with complete translations.
Theme support: Light and dark modes with user preference storage.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML, CSS (Tailwind CSS with custom 3D animations), and JavaScript
- **UI Framework**: Tailwind CSS with extensive custom CSS for 3D effects and animations
- **Design System**: Modern SaaS-style dashboard with glass morphism, 3D cards, and gradient backgrounds
- **Theme System**: 
  - Dark/Light mode toggle with localStorage persistence
  - Comprehensive dark theme styling across all components
  - Smooth color transitions with CSS variables
  - Theme-aware 3D effects and animations
- **Language System**:
  - Bengali/English translation support with 180+ translations
  - localStorage preference storage
  - Dynamic content switching without page reload
  - Translation data attributes for all user-facing content
- **Animation Features**: 
  - Floating elements with rotation
  - 3D card transformations on hover
  - Glowing effects and pulsing animations
  - Smooth fade-in and scale transitions
  - Glass morphism with backdrop filters
- **Client-Side Routing**: Complete navigation between all five pages
- **Data Fetching**: Native fetch API with loading states and error handling
- **Authentication**: Session-based authentication with protected routes
- **User Experience**: Theme and language controls in navigation with real-time updates

### Backend Architecture
- **Framework**: Express.js with comprehensive middleware stack
- **Database**: PostgreSQL with users, user_scores tables and proper relationships
- **Authentication**: bcrypt password hashing with express-session management
- **API Design**: RESTful endpoints with authentication middleware
- **Security**: Password hashing, session management, and protected routes
- **Data Storage**: PostgreSQL database with real user and score data
- **Middleware**: CORS, express.json, express.static, express-session
- **Route Handling**: Serves all pages with authentication checks
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

### Page Structure
- **Home (`/`)**: Hero section with 3D elements, feature showcase, and context-aware navigation
- **Login (`/login.html`)**: Modern 3D authentication form with error handling
- **Register (`/register.html`)**: User registration with instant sample data creation
- **Leaderboard (`/leaderboard.html`)**: Real user rankings with 3D cards and trophy system
- **My Scores (`/myscores.html`)**: Protected personal dashboard showing actual user scores with statistics
- **Task Submit (`/submit.html`)**: Assignment submission form with modern styling
- **Profile (`/profile.html`)**: User profile management with academic statistics

### Key API Endpoints
- `POST /api/register`: User registration with automatic sample data creation
- `POST /api/login`: User authentication with session management
- `POST /api/logout`: Session destruction and cleanup
- `GET /api/auth-status`: Check current authentication status
- `GET /api/leaderboard`: Returns sorted list of real registered users by total score
- `GET /api/myscores`: Returns authenticated user's detailed score breakdown
- `GET /`: Serves homepage with authentication-aware navigation
- `GET /login.html`: Serves authentication form
- `GET /register.html`: Serves user registration form
- `GET /leaderboard.html`: Serves real user leaderboard
- `GET /myscores.html`: Serves protected personal scores dashboard
- `GET /submit.html`: Serves task submission page
- `GET /profile.html`: Serves user profile page

### Design Features
- **Dual Theme System**: 
  - Light mode with clean whites and subtle shadows
  - Dark mode with rich grays and enhanced contrast
  - Automatic theme-aware color adjustments
  - Smooth transitions between themes
- **3D Card System**: Perspective-based transforms with hover effects supporting both themes
- **Glass Morphism**: Backdrop filters with transparency adapted for light/dark modes
- **Gradient Backgrounds**: Multi-color gradients optimized for both themes
- **Language Toggle**: Real-time Bengali/English switching with persistent preferences
- **Animation System**: 
  - Float animations for floating elements
  - Glow effects for emphasis
  - Scale and rotation transforms
  - Fade-in sequences with delays
  - Theme-aware animations and effects
- **Professional Color Palette**: Blue, purple, and white with dark mode variants
- **Modern Typography**: Gradient text effects and varied font weights with theme support

### Data Structure
- **User Records**: Real PostgreSQL users with bcrypt hashed passwords, full names, usernames, emails
- **Score Details**: Real user_scores table with task-specific scores linked to users
- **Authentication Sessions**: Session-based auth with express-session and secure storage
- **User Preferences**: localStorage-based theme and language preferences
- **Sample Data**: Automatic sample score generation for new users
- **Database Schema**: Proper relational design with foreign key constraints

## External Dependencies

### NPM Packages
- **express**: Web application framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware

### CDN Resources
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN with dark mode support
- **Font Awesome**: Icon library for UI elements, animations, and theme/language controls
- **UI Avatars**: Service for generating user avatar images for real users

### Third-Party Services
- **ui-avatars.com**: Generates colored avatar images with initials for registered users
- **PostgreSQL Database**: Professional database for user management and score tracking
- **Express Session**: Secure session management for authentication
- **bcrypt**: Industry-standard password hashing for security
- **Translation System**: Built-in Bengali/English language support with localStorage persistence