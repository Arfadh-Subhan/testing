// Debug: Check what's loading
console.log('🚀 script.js loaded');

// DOM Elements with proper null checks
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const togglePassword = document.getElementById('togglePassword');
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const guestBtn = document.querySelector('.guest-btn');
const forgotPassword = document.querySelector('.forgot-password');

// Debug elements
console.log('Elements found:', {
    loginForm: !!loginForm,
    signupForm: !!signupForm,
    showSignup: !!showSignup,
    showLogin: !!showLogin,
    togglePassword: !!togglePassword,
    toggleSignupPassword: !!toggleSignupPassword,
    guestBtn: !!guestBtn,
    forgotPassword: !!forgotPassword
});

// Storage Keys
const USER_STORAGE_KEY = 'cakeCornerUsers';

// Initialize Storage - SIMPLE VERSION
function initializeStorage() {
    let users = {};
    
    try {
        const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }
    } catch (e) {
        console.log('No existing users found, creating fresh storage');
    }
    
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    console.log('📦 Storage initialized');
}

// Get All Users
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
    } catch (e) {
        console.error('Error reading users:', e);
        return {};
    }
}

// Save User
function saveUser(username, userData) {
    const users = getUsers();
    users[username.toLowerCase()] = userData;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    console.log('💾 User saved:', username);
}

// Check if Username Exists
function usernameExists(username) {
    const users = getUsers();
    const exists = users.hasOwnProperty(username.toLowerCase());
    console.log('🔍 Username check:', username, 'exists:', exists);
    return exists;
}

// Validate Login - SIMPLE VERSION
function validateLogin(username, password) {
    const users = getUsers();
    const userKey = username.toLowerCase();
    const user = users[userKey];
    
    console.log('🔐 Login attempt:', { 
        username, 
        userFound: !!user
    });
    
    if (user && user.password === password) {
        console.log('✅ Login successful for user:', user.username);
        return user;
    }
    
    console.log('❌ Login failed');
    return null;
}

// Show Notification
function showNotification(message, type = 'success') {
    console.log('📢 Notification:', message);
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type, 'show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    } else {
        // Fallback alert
        alert(message);
    }
}

// Handle Successful Login
function handleSuccessfulLogin(userData) {
    console.log('✅ Login successful, user data:', userData);
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    
    showNotification(`Welcome ${userData.name || userData.username}! Redirecting...`);
    
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1000);
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Login Form - SIMPLE VERSION
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Login form submitted');
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            console.log('📨 Form data:', { username, password });
            
            if (!username || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            const userData = validateLogin(username, password);
            if (!userData) {
                showNotification('Invalid username or password', 'error');
                return;
            }
            
            handleSuccessfulLogin(userData);
        });
    } else {
        console.error('❌ Login form not found!');
    }

    // Signup Form
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Signup form submitted');
            
            const name = document.getElementById('signupName').value.trim();
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms');
            
            console.log('📨 Signup data:', { name, username, password, confirmPassword });
            
            // Validation
            if (!name || !username || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (username.length < 3) {
                showNotification('Username must be at least 3 characters', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (!agreeTerms || !agreeTerms.checked) {
                showNotification('Please agree to terms and conditions', 'error');
                return;
            }
            
            if (usernameExists(username)) {
                showNotification('Username already exists', 'error');
                return;
            }
            
            // Create user
            const userData = {
                username: username,
                name: name,
                password: password,
                role: 'customer',
                signupDate: new Date().toISOString()
            };
            
            saveUser(username, userData);
            showNotification('Account created successfully! Please log in.');
            
            // Switch to login form
            setTimeout(() => {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                document.getElementById('username').value = username;
                document.getElementById('password').focus();
                signupForm.reset();
            }, 1500);
        });
    } else {
        console.error('❌ Signup form not found!');
    }

    // Guest Login
    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            console.log('🎭 Guest login clicked');
            showNotification('Continuing as guest');
            localStorage.setItem('isGuest', 'true');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 800);
        });
    } else {
        console.error('❌ Guest button not found!');
    }

    // Forgot Password
    if (forgotPassword) {
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Password reset feature coming soon!');
        });
    }

    // Form Toggle - Show Signup
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔄 Switching to signup form');
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });
    } else {
        console.error('❌ Show signup button not found!');
    }

    // Form Toggle - Show Login
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔄 Switching to login form');
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    } else {
        console.error('❌ Show login button not found!');
    }

    // Password Visibility Toggle - Login Form
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            console.log('👁️ Toggling password visibility');
            const passwordInput = document.getElementById('password');
            const icon = togglePassword.querySelector('i');
            
            if (passwordInput && icon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    } else {
        console.error('❌ Toggle password button not found!');
    }

    // Password Visibility Toggle - Signup Form
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener('click', () => {
            console.log('👁️ Toggling signup password visibility');
            const passwordInput = document.getElementById('signupPassword');
            const icon = toggleSignupPassword.querySelector('i');
            
            if (passwordInput && icon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    } else {
        console.error('❌ Toggle signup password button not found!');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM fully loaded');
    
    initializeStorage();
    setupEventListeners();
    
    // Redirect if already authenticated
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    console.log('🔍 Auth check:', { isLoggedIn, isGuest });
    
    if (isLoggedIn || isGuest) {
        console.log('➡️ Already authenticated, redirecting...');
        window.location.href = 'main.html';
        return;
    }
    
    console.log('✅ Login page ready!');
});
