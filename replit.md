# Student Results System

## Overview

A modern, 3D-animated web-based student results dashboard built with Express.js backend and vanilla HTML/CSS/JavaScript frontend. The system features a complete navigation structure with five main pages: Home, Leaderboard, My Scores, Task Submit, and Profile. The application showcases professional 3D design elements, glass morphism effects, and sophisticated animations while maintaining a clean, modern SaaS-style appearance.

## Recent Changes (September 2025)

- **Navigation System**: Fixed all navigation links - created functional Home, Task Submit, and Profile pages
- **Modern 3D Design**: Upgraded entire UI with 3D card effects, glass morphism, and professional animations
- **Enhanced Animations**: Added floating elements, glowing effects, pulsing animations, and smooth transitions
- **Professional Styling**: Implemented gradient backgrounds, 3D shadows, and modern visual hierarchy
- **Responsive Design**: Maintained mobile-first approach with enhanced visual appeal across devices

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Modern, 3D, animated, professional, and attractive looking interfaces.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML, CSS (Tailwind CSS with custom 3D animations), and JavaScript
- **UI Framework**: Tailwind CSS with extensive custom CSS for 3D effects and animations
- **Design System**: Modern SaaS-style dashboard with glass morphism, 3D cards, and gradient backgrounds
- **Animation Features**: 
  - Floating elements with rotation
  - 3D card transformations on hover
  - Glowing effects and pulsing animations
  - Smooth fade-in and scale transitions
  - Glass morphism with backdrop filters
- **Client-Side Routing**: Complete navigation between all five pages
- **Data Fetching**: Native fetch API with loading states and error handling
- **Design Pattern**: Static file serving with dynamic content updates via API calls

### Backend Architecture
- **Framework**: Express.js with middleware for serving all pages
- **API Design**: RESTful endpoints serving JSON data
- **Data Storage**: In-memory JavaScript objects (no persistent database)
- **Middleware**: CORS, express.json, express.static
- **Route Handling**: Serves all five HTML pages with proper routing
- **Error Handling**: Basic Express error handling with JSON responses

### Page Structure
- **Home (`/`)**: Hero section with 3D elements and feature showcase
- **Leaderboard (`/leaderboard.html`)**: 3D student cards with rankings and trophy system
- **My Scores (`/myscores.html`)**: Personal dashboard with animated progress bars and statistics
- **Task Submit (`/submit.html`)**: Assignment submission form with modern styling
- **Profile (`/profile.html`)**: User profile management with academic statistics

### Key API Endpoints
- `GET /api/leaderboard`: Returns sorted list of all students by total score
- `GET /api/myscores`: Returns individual student's detailed score breakdown
- `GET /`: Serves homepage with hero section
- `GET /leaderboard.html`: Serves 3D animated leaderboard
- `GET /myscores.html`: Serves personal scores dashboard
- `GET /submit.html`: Serves task submission page
- `GET /profile.html`: Serves user profile page

### Design Features
- **3D Card System**: Perspective-based transforms with hover effects
- **Glass Morphism**: Backdrop filters with transparency
- **Gradient Backgrounds**: Multi-color gradients throughout the interface
- **Animation System**: 
  - Float animations for floating elements
  - Glow effects for emphasis
  - Scale and rotation transforms
  - Fade-in sequences with delays
- **Professional Color Palette**: Blue, purple, and white with accent colors
- **Modern Typography**: Gradient text effects and varied font weights

### Data Structure
- **Student Records**: Name, avatar URL, total score, submission count
- **Score Details**: Task-specific scores with task names and individual performance metrics
- **Sample Data**: Realistic demonstration data with proper formatting

## External Dependencies

### NPM Packages
- **express**: Web application framework for Node.js
- **cors**: Cross-Origin Resource Sharing middleware

### CDN Resources
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **Font Awesome**: Icon library for UI elements and animations
- **UI Avatars**: Service for generating user avatar images

### Third-Party Services
- **ui-avatars.com**: Generates colored avatar images with initials
- No database dependencies (uses in-memory data storage)
- No authentication services integrated
- No external APIs for data persistence