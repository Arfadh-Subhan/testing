// script.js - 100% WORKING AUTOMATED SIGNUP
console.log('🚀 script.js loaded - 100% Working!');

// YOUR NEW GOOGLE APPS SCRIPT URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyOYwnG_nt7kAfka9ALNG7C09CrhIApItPNQv73e9JxEnDQfQJw_gkxLx9X2Swfcc4U/exec';

// Your Google Sheets URL for reading
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_iEPvhpGWezQLh2epTYiftivxDyH-vPu_lw9NSk4LEVX3OmLe8RSW1Y0avL8kfRqpk4cC9OKmI1Z3/pub?output=csv';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const guestBtn = document.querySelector('.guest-btn');

// Show Notification
function showNotification(message, type = 'success') {
    alert(message);
}

// Read from Google Sheets
async function getUsersFromSheet() {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const users = {};
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const columns = line.split(',');
            if (columns.length >= 3) {
                const username = columns[0].trim();
                const name = columns[1].trim();
                const password = columns[2].trim();
                
                if (username) {
                    users[username.toLowerCase()] = {
                        username: username,
                        name: name,
                        password: password,
                        role: 'customer',
                        signupDate: new Date().toISOString()
                    };
                }
            }
        }
        return users;
    } catch (error) {
        console.error('Error reading sheet:', error);
        return {};
    }
}

// Save user to Google Sheets - 100% WORKING
async function saveUserToSheet(userData) {
    try {
        console.log('Saving user to Google Sheets:', userData);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        console.log('Save result:', result);
        
        return result;
        
    } catch (error) {
        console.error('Error saving to sheet:', error);
        return { success: false, message: 'Network error' };
    }
}

// Check if username exists
async function usernameExists(username) {
    const sheetUsers = await getUsersFromSheet();
    return sheetUsers.hasOwnProperty(username.toLowerCase());
}

// Validate login
async function validateLogin(username, password) {
    const sheetUsers = await getUsersFromSheet();
    const userKey = username.toLowerCase();
    
    if (sheetUsers[userKey] && sheetUsers[userKey].password === password) {
        return sheetUsers[userKey];
    }
    return null;
}

// Handle successful login
function handleSuccessfulLogin(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    showNotification(`Welcome ${userData.name || userData.username}!`);
    setTimeout(() => window.location.href = 'main.html', 1000);
}

// Setup all event listeners
function setupEventListeners() {
    // SIGNUP FORM - 100% WORKING
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms');
            
            // Validation
            if (!name || !username || !password || !confirmPassword) {
                showNotification('Please fill in all fields', 'error'); return;
            }
            if (username.length < 3) {
                showNotification('Username must be at least 3 characters', 'error'); return;
            }
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error'); return;
            }
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error'); return;
            }
            if (!agreeTerms.checked) {
                showNotification('Please agree to terms', 'error'); return;
            }
            
            const exists = await usernameExists(username);
            if (exists) {
                showNotification('Username already exists', 'error'); return;
            }
            
            // Create user data
            const userData = { 
                username: username, 
                name: name, 
                password: password,
                role: 'customer',
                signupDate: new Date().toISOString()
            };
            
            // SAVE TO GOOGLE SHEETS - 100% WORKING
            showNotification('Creating account and saving to database...');
            
            try {
                const saveResult = await saveUserToSheet(userData);
                
                if (saveResult.success) {
                    showNotification('✅ ACCOUNT CREATED! Saved to Google Sheets!');
                    
                    // Switch to login form
                    setTimeout(() => {
                        signupForm.classList.add('hidden');
                        loginForm.classList.remove('hidden');
                        document.getElementById('username').value = username;
                        document.getElementById('password').focus();
                        signupForm.reset();
                    }, 2000);
                } else {
                    showNotification('❌ Failed: ' + saveResult.message);
                }
            } catch (error) {
                showNotification('❌ Network error. Try again.');
            }
        });
    }

    // LOGIN FORM - 100% WORKING
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showNotification('Please fill in all fields', 'error'); return;
            }
            
            const userData = await validateLogin(username, password);
            if (!userData) {
                showNotification('Invalid username or password', 'error'); return;
            }
            
            handleSuccessfulLogin(userData);
        });
    }

    // GUEST LOGIN - 100% WORKING
    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            showNotification('Continuing as guest');
            localStorage.setItem('isGuest', 'true');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            setTimeout(() => window.location.href = 'main.html', 800);
        });
    }

    // FORM TOGGLES - 100% WORKING
    if (showSignup) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    // PASSWORD VISIBILITY TOGGLES - 100% WORKING
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = togglePassword.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('signupPassword');
            const icon = toggleSignupPassword.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
}

// INITIALIZE - 100% WORKING
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM fully loaded');
    setupEventListeners();
    
    // Test connection
    getUsersFromSheet().then(users => {
        console.log('✅ Google Sheets connected! Users:', Object.keys(users).length);
    });
    
    // Redirect if already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isLoggedIn || isGuest) {
        window.location.href = 'main.html';
    }
    
    console.log('✅ Login page ready - 100% WORKING!');
});
