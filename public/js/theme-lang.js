// Theme and Language Management System
class ThemeLangManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.applyTheme();
        this.updateLanguage();
        this.createControls();
    }

    // Theme Management
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    applyTheme() {
        if (this.currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    // Language Management
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateLanguage();
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[this.currentLanguage] && translations[this.currentLanguage][key]) {
                if (element.placeholder !== undefined) {
                    element.placeholder = translations[this.currentLanguage][key];
                } else {
                    element.innerHTML = translations[this.currentLanguage][key];
                }
            }
        });

        // Update page title
        const titleKey = document.querySelector('title')?.getAttribute('data-translate');
        if (titleKey && translations[this.currentLanguage] && translations[this.currentLanguage][titleKey]) {
            document.title = translations[this.currentLanguage][titleKey];
        }
    }

    createControls() {
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            const themeLanguageControls = document.getElementById('themeLanguageControls');
            
            if (themeLanguageControls) {
                // Create theme toggle button
                const themeBtn = document.createElement('button');
                themeBtn.className = 'p-2 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300';
                themeBtn.innerHTML = `
                    <i class="fas fa-sun text-yellow-500 dark:hidden"></i>
                    <i class="fas fa-moon text-blue-400 hidden dark:inline"></i>
                `;
                themeBtn.onclick = () => this.toggleTheme();
                
                // Create language toggle container
                const langContainer = document.createElement('div');
                langContainer.className = 'relative';
                
                const langBtn = document.createElement('button');
                langBtn.className = 'p-2 px-3 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 flex items-center space-x-2';
                langBtn.innerHTML = `
                    <i class="fas fa-globe text-blue-600 dark:text-blue-400"></i>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${this.currentLanguage.toUpperCase()}</span>
                `;
                
                const langDropdown = document.createElement('div');
                langDropdown.className = 'absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden z-50';
                
                const enBtn = document.createElement('button');
                enBtn.className = 'w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors text-gray-700 dark:text-gray-300';
                enBtn.innerHTML = '🇺🇸 English';
                enBtn.onclick = () => {
                    this.setLanguage('en');
                    langDropdown.classList.add('hidden');
                    langBtn.querySelector('span').textContent = 'EN';
                };
                
                const bnBtn = document.createElement('button');
                bnBtn.className = 'w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors text-gray-700 dark:text-gray-300';
                bnBtn.innerHTML = '🇧🇩 বাংলা';
                bnBtn.onclick = () => {
                    this.setLanguage('bn');
                    langDropdown.classList.add('hidden');
                    langBtn.querySelector('span').textContent = 'BN';
                };
                
                langBtn.onclick = () => langDropdown.classList.toggle('hidden');
                
                langDropdown.appendChild(enBtn);
                langDropdown.appendChild(bnBtn);
                langContainer.appendChild(langBtn);
                langContainer.appendChild(langDropdown);
                
                // Create container for both controls
                const controlsContainer = document.createElement('div');
                controlsContainer.className = 'flex items-center space-x-4';
                controlsContainer.appendChild(themeBtn);
                controlsContainer.appendChild(langContainer);
                
                // Clear and add new controls
                themeLanguageControls.innerHTML = '';
                themeLanguageControls.appendChild(controlsContainer);
            }
        }, 100);
    }

    // Get translated text
    t(key) {
        return translations[this.currentLanguage]?.[key] || key;
    }
}

// Translation Dictionary
const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.leaderboard': 'Leaderboard',
        'nav.myscores': 'My Scores',
        'nav.submit': 'Task Submit',
        'nav.profile': 'Profile',
        'nav.login': 'Login',
        'nav.register': 'Register',
        'nav.logout': 'Logout',
        
        // Home Page
        'home.title': 'StudyDash - Student Results Dashboard',
        'home.welcome': 'Welcome to',
        'home.subtitle': 'Your ultimate student performance dashboard. Track scores, compete on leaderboards, and achieve academic excellence.',
        'home.view-leaderboard': 'View Leaderboard',
        'home.my-progress': 'My Progress',
        'home.get-started': 'Get Started',
        'home.sign-in': 'Sign In',
        'home.features': 'Powerful Features',
        'home.features-subtitle': 'Everything you need to track and improve your academic performance',
        'home.feature1.title': 'Leaderboard',
        'home.feature1.desc': 'See how you rank against your peers with real-time leaderboard updates and competitive scoring.',
        'home.feature2.title': 'Progress Tracking',
        'home.feature2.desc': 'Monitor your academic progress with detailed analytics and performance insights.',
        'home.feature3.title': 'Task Management',
        'home.feature3.desc': 'Submit assignments and track your submissions with our intuitive task management system.',
        
        // Leaderboard Page
        'leaderboard.title': 'Leaderboard - Student Results Dashboard',
        'leaderboard.heading': 'Leaderboard',
        'leaderboard.subtitle': 'See how you stack up against your peers. Rankings are based on total scores across all assignments.',
        'leaderboard.loading': 'Loading leaderboard...',
        'leaderboard.error': 'Failed to load leaderboard. Please try again later.',
        'leaderboard.points': 'points',
        'leaderboard.submissions': 'submissions',
        'leaderboard.rank': 'Current Rank',
        
        // My Scores Page
        'myscores.title': 'My Scores - Student Results Dashboard',
        'myscores.heading': 'My Scores',
        'myscores.subtitle': 'Track your progress and see how you\'re performing across all your assignments.',
        'myscores.loading': 'Loading your scores...',
        'myscores.error': 'Failed to load your scores. Please try again later.',
        'myscores.total-score': 'Your Total Score',
        'myscores.great-work': 'Outstanding performance! Keep shining!',
        'myscores.assignment-breakdown': 'Assignment Breakdown',
        'myscores.assignment-score': 'Assignment Score',
        'myscores.performance-summary': 'Performance Summary',
        'myscores.average-score': 'Average Score',
        'myscores.highest-score': 'Highest Score',
        'myscores.lowest-score': 'Lowest Score',
        
        // Login Page
        'login.title': 'Login - StudyDash',
        'login.welcome-back': 'Welcome Back',
        'login.subtitle': 'Sign in to your StudyDash account',
        'login.username': 'Username or Email',
        'login.password': 'Password',
        'login.username-placeholder': 'Enter your username or email',
        'login.password-placeholder': 'Enter your password',
        'login.sign-in': 'Sign In',
        'login.signing-in': 'Signing In...',
        'login.no-account': 'Don\'t have an account?',
        'login.sign-up-here': 'Sign up here',
        
        // Register Page
        'register.title': 'Register - StudyDash',
        'register.join': 'Join StudyDash',
        'register.subtitle': 'Create your account and start learning',
        'register.full-name': 'Full Name',
        'register.username': 'Username',
        'register.email': 'Email Address',
        'register.password': 'Password',
        'register.full-name-placeholder': 'Enter your full name',
        'register.username-placeholder': 'Choose a username',
        'register.email-placeholder': 'Enter your email',
        'register.password-placeholder': 'Create a secure password',
        'register.password-hint': 'Password must be at least 6 characters long',
        'register.create-account': 'Create Account',
        'register.creating-account': 'Creating Account...',
        'register.have-account': 'Already have an account?',
        'register.sign-in-here': 'Sign in here',
        
        // Submit Page
        'submit.title': 'Task Submit - StudyDash',
        'submit.heading': 'Submit Task',
        'submit.subtitle': 'Submit your assignments and get instant feedback',
        'submit.assignment-title': 'Assignment Title',
        'submit.description': 'Description',
        'submit.upload-files': 'Upload Files',
        'submit.assignment-title-placeholder': 'Enter assignment title',
        'submit.description-placeholder': 'Describe your submission',
        'submit.upload-hint': 'Drag and drop files or click to browse',
        'submit.submit-assignment': 'Submit Assignment',
        
        // Profile Page
        'profile.title': 'Profile - StudyDash',
        'profile.heading': 'My Profile',
        'profile.subtitle': 'Manage your account settings and preferences',
        'profile.profile-info': 'Profile Information',
        'profile.academic-stats': 'Academic Stats',
        'profile.full-name': 'Full Name',
        'profile.email': 'Email',
        'profile.student-id': 'Student ID',
        'profile.current-gpa': 'Current GPA',
        'profile.total-submissions': 'Total Submissions',
        'profile.average-score': 'Average Score',
        'profile.update-profile': 'Update Profile',
        'profile.joined': 'Joined March 2024',
        'profile.rank': 'Rank #1'
    },
    
    bn: {
        // Navigation
        'nav.home': 'হোম',
        'nav.leaderboard': 'লিডারবোর্ড',
        'nav.myscores': 'আমার স্কোর',
        'nav.submit': 'কাজ জমা দিন',
        'nav.profile': 'প্রোফাইল',
        'nav.login': 'লগইন',
        'nav.register': 'নিবন্ধন',
        'nav.logout': 'লগআউট',
        
        // Home Page
        'home.title': 'স্টাডিড্যাশ - ছাত্র ফলাফল ড্যাশবোর্ড',
        'home.welcome': 'স্বাগতম',
        'home.subtitle': 'আপনার চূড়ান্ত ছাত্র পারফরম্যান্স ড্যাশবোর্ড। স্কোর ট্র্যাক করুন, লিডারবোর্ডে প্রতিযোগিতা করুন এবং একাডেমিক উৎকর্ষতা অর্জন করুন।',
        'home.view-leaderboard': 'লিডারবোর্ড দেখুন',
        'home.my-progress': 'আমার অগ্রগতি',
        'home.get-started': 'শুরু করুন',
        'home.sign-in': 'সাইন ইন',
        'home.features': 'শক্তিশালী বৈশিষ্ট্য',
        'home.features-subtitle': 'আপনার একাডেমিক পারফরম্যান্স ট্র্যাক এবং উন্নত করার জন্য প্রয়োজনীয় সবকিছু',
        'home.feature1.title': 'লিডারবোর্ড',
        'home.feature1.desc': 'রিয়েল-টাইম লিডারবোর্ড আপডেট এবং প্রতিযোগিতামূলক স্কোরিং সহ আপনার সহপাঠীদের বিপরীতে আপনার অবস্থান দেখুন।',
        'home.feature2.title': 'অগ্রগতি ট্র্যাকিং',
        'home.feature2.desc': 'বিস্তারিত বিশ্লেষণ এবং পারফরম্যান্স অন্তর্দৃষ্টি সহ আপনার একাডেমিক অগ্রগতি পর্যবেক্ষণ করুন।',
        'home.feature3.title': 'কাজ ব্যবস্থাপনা',
        'home.feature3.desc': 'আমাদের স্বজ্ঞাত কাজ ব্যবস্থাপনা সিস্টেম দিয়ে অ্যাসাইনমেন্ট জমা দিন এবং আপনার জমা ট্র্যাক করুন।',
        
        // Leaderboard Page
        'leaderboard.title': 'লিডারবোর্ড - ছাত্র ফলাফল ড্যাশবোর্ড',
        'leaderboard.heading': 'লিডারবোর্ড',
        'leaderboard.subtitle': 'দেখুন আপনি আপনার সহপাঠীদের তুলনায় কোথায় দাঁড়িয়ে। র‍্যাঙ্কিং সমস্ত অ্যাসাইনমেন্ট জুড়ে মোট স্কোরের উপর ভিত্তি করে।',
        'leaderboard.loading': 'লিডারবোর্ড লোড হচ্ছে...',
        'leaderboard.error': 'লিডারবোর্ড লোড করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
        'leaderboard.points': 'পয়েন্ট',
        'leaderboard.submissions': 'জমা',
        'leaderboard.rank': 'বর্তমান র‍্যাঙ্ক',
        
        // My Scores Page
        'myscores.title': 'আমার স্কোর - ছাত্র ফলাফল ড্যাশবোর্ড',
        'myscores.heading': 'আমার স্কোর',
        'myscores.subtitle': 'আপনার অগ্রগতি ট্র্যাক করুন এবং আপনার সমস্ত অ্যাসাইনমেন্ট জুড়ে আপনার পারফরম্যান্স দেখুন।',
        'myscores.loading': 'আপনার স্কোর লোড হচ্ছে...',
        'myscores.error': 'আপনার স্কোর লোড করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।',
        'myscores.total-score': 'আপনার মোট স্কোর',
        'myscores.great-work': 'অসাধারণ পারফরম্যান্স! চালিয়ে যান!',
        'myscores.assignment-breakdown': 'অ্যাসাইনমেন্ট বিভাজন',
        'myscores.assignment-score': 'অ্যাসাইনমেন্ট স্কোর',
        'myscores.performance-summary': 'পারফরম্যান্স সারসংক্ষেপ',
        'myscores.average-score': 'গড় স্কোর',
        'myscores.highest-score': 'সর্বোচ্চ স্কোর',
        'myscores.lowest-score': 'সর্বনিম্ন স্কোর',
        
        // Login Page
        'login.title': 'লগইন - স্টাডিড্যাশ',
        'login.welcome-back': 'ফিরে স্বাগতম',
        'login.subtitle': 'আপনার স্টাডিড্যাশ অ্যাকাউন্টে সাইন ইন করুন',
        'login.username': 'ব্যবহারকারীর নাম বা ইমেইল',
        'login.password': 'পাসওয়ার্ড',
        'login.username-placeholder': 'আপনার ব্যবহারকারীর নাম বা ইমেইল লিখুন',
        'login.password-placeholder': 'আপনার পাসওয়ার্ড লিখুন',
        'login.sign-in': 'সাইন ইন',
        'login.signing-in': 'সাইন ইন হচ্ছে...',
        'login.no-account': 'কোনো অ্যাকাউন্ট নেই?',
        'login.sign-up-here': 'এখানে সাইন আপ করুন',
        
        // Register Page
        'register.title': 'নিবন্ধন - স্টাডিড্যাশ',
        'register.join': 'স্টাডিড্যাশে যোগ দিন',
        'register.subtitle': 'আপনার অ্যাকাউন্ট তৈরি করুন এবং শেখা শুরু করুন',
        'register.full-name': 'পূর্ণ নাম',
        'register.username': 'ব্যবহারকারীর নাম',
        'register.email': 'ইমেইল ঠিকানা',
        'register.password': 'পাসওয়ার্ড',
        'register.full-name-placeholder': 'আপনার পূর্ণ নাম লিখুন',
        'register.username-placeholder': 'একটি ব্যবহারকারীর নাম বেছে নিন',
        'register.email-placeholder': 'আপনার ইমেইল লিখুন',
        'register.password-placeholder': 'একটি নিরাপদ পাসওয়ার্ড তৈরি করুন',
        'register.password-hint': 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
        'register.create-account': 'অ্যাকাউন্ট তৈরি করুন',
        'register.creating-account': 'অ্যাকাউন্ট তৈরি হচ্ছে...',
        'register.have-account': 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
        'register.sign-in-here': 'এখানে সাইন ইন করুন',
        
        // Submit Page
        'submit.title': 'কাজ জমা - স্টাডিড্যাশ',
        'submit.heading': 'কাজ জমা দিন',
        'submit.subtitle': 'আপনার অ্যাসাইনমেন্ট জমা দিন এবং তাৎক্ষণিক ফিডব্যাক পান',
        'submit.assignment-title': 'অ্যাসাইনমেন্টের শিরোনাম',
        'submit.description': 'বিবরণ',
        'submit.upload-files': 'ফাইল আপলোড করুন',
        'submit.assignment-title-placeholder': 'অ্যাসাইনমেন্টের শিরোনাম লিখুন',
        'submit.description-placeholder': 'আপনার জমার বর্ণনা দিন',
        'submit.upload-hint': 'ফাইল টেনে এনে ছাড়ুন বা ব্রাউজ করতে ক্লিক করুন',
        'submit.submit-assignment': 'অ্যাসাইনমেন্ট জমা দিন',
        
        // Profile Page
        'profile.title': 'প্রোফাইল - স্টাডিড্যাশ',
        'profile.heading': 'আমার প্রোফাইল',
        'profile.subtitle': 'আপনার অ্যাকাউন্ট সেটিংস এবং পছন্দ পরিচালনা করুন',
        'profile.profile-info': 'প্রোফাইল তথ্য',
        'profile.academic-stats': 'একাডেমিক পরিসংখ্যান',
        'profile.full-name': 'পূর্ণ নাম',
        'profile.email': 'ইমেইল',
        'profile.student-id': 'ছাত্র আইডি',
        'profile.current-gpa': 'বর্তমান জিপিএ',
        'profile.total-submissions': 'মোট জমা',
        'profile.average-score': 'গড় স্কোর',
        'profile.update-profile': 'প্রোফাইল আপডেট করুন',
        'profile.joined': 'যোগদান মার্চ ২০২৪',
        'profile.rank': 'র‍্যাঙ্ক #১'
    }
};

// Initialize theme and language manager
let themeLangManager;
document.addEventListener('DOMContentLoaded', () => {
    themeLangManager = new ThemeLangManager();
    window.themeLangManager = themeLangManager; // Make globally accessible
});