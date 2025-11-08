// script.js - FULLY AUTOMATED WITH GOOGLE SHEETS SIGNUP
console.log('🚀 script.js loaded with Automated Google Sheets!');

// Your Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFcwkKkA4CIZQHg8HEqEHtIuxmjpYn3Vt9r6YsIEsRT_gkkWD4ndNNoXpLTirgPw/exec';

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
        console.log('📥 Fetching users from Google Sheets...');
        const response = await fetch(GOOGLE_SHEETS_URL);
        const csvText = await response.text();
        
        console.log('📄 Raw CSV data:', csvText);
        
        const lines = csvText.split('\n');
        const users = {};
        
        // Start from line 1 (skip header)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const columns = line.split(',');
            if (columns.length >= 3) {
                const username = columns[0].trim();
                const name = columns[1].trim();
                const password = columns[2].trim();
                const role = columns[3] ? columns[3].trim() : 'customer';
                const signupDate = columns[4] ? columns[4].trim() : new Date().toISOString();
                
                if (username) {
                    users[username.toLowerCase()] = {
                        username: username,
                        name: name,
                        password: password,
                        role: role,
                        signupDate: signupDate
                    };
                }
            }
        }
        
        console.log('✅ Users loaded from Google Sheets:', users);
        return users;
    } catch (error) {
        console.error('❌ Error reading from Google Sheets:', error);
        return {};
    }
}

// Save user to Google Sheets via Apps Script
async function saveUserToSheet(userData) {
    try {
        console.log('📤 Saving user to Google Sheets:', userData);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.text();
        console.log('📨 Google Script response:', result);
        
        return { success: true, message: 'User saved to Google Sheets!' };
        
    } catch (error) {
        console.error('❌ Error saving to Google Sheets:', error);
        return { 
            success: false, 
            message: 'Failed to save to Google Sheets, but account created locally.' 
        };
    }
}

// Backup storage (fallback)
function initializeBackupStorage() {
    if (!localStorage.getItem('cakeCornerUsers')) {
        localStorage.setItem('cakeCornerUsers', JSON.stringify({}));
    }
}

function saveUserToBackup(username, userData) {
    const users = JSON.parse(localStorage.getItem('cakeCornerUsers') || '{}');
    users[username.toLowerCase()] = userData;
    localStorage.setItem('cakeCornerUsers', JSON.stringify(users));
    console.log('💾 User saved to backup:', username);
}

function getUsersFromBackup() {
    return JSON.parse(localStorage.getItem('cakeCornerUsers') || '{}');
}

// Check if username exists
async function usernameExists(username) {
    const sheetUsers = await getUsersFromSheet();
    const backupUsers = getUsersFromBackup();
    
    const exists = sheetUsers.hasOwnProperty(username.toLowerCase()) || 
                   backupUsers.hasOwnProperty(username.toLowerCase());
    
    console.log('🔍 Username check:', username, 'exists:', exists);
    return exists;
}

// Validate login
async function validateLogin(username, password) {
    // Check Google Sheets first
    const sheetUsers = await getUsersFromSheet();
    const userKey = username.toLowerCase();
    
    if (sheetUsers[userKey] && sheetUsers[userKey].password === password) {
        console.log('✅ Login successful from Google Sheets');
        return sheetUsers[userKey];
    }
    
    // Check backup storage
    const backupUsers = getUsersFromBackup();
    if (backupUsers[userKey] && backupUsers[userKey].password === password) {
        console.log('✅ Login successful from backup');
        return backupUsers[userKey];
    }
    
    console.log('❌ Login failed');
    return null;
}

// Handle successful login
function handleSuccessfulLogin(userData) {
    console.log('✅ Login successful, user data:', userData);
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    
    showNotification(`Welcome ${userData.name || userData.username}! Redirecting...`);
    
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📝 Login form submitted');
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            const userData = await validateLogin(username, password);
            if (!userData) {
                showNotification('Invalid username or password', 'error');
                return;
            }
            
            handleSuccessfulLogin(userData);
        });
    }

    // Signup Form - UPDATED FOR AUTOMATIC SHEET SAVING
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📝 Signup form submitted');
            
            const name = document.getElementById('signupName').value.trim();
            const username = document.getElementById('signupUsername').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms');
            
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
            
            const exists = await usernameExists(username);
            if (exists) {
                showNotification('Username already exists', 'error');
                return;
            }
            
            // Create user data
            const userData = {
                username: username,
                name: name,
                password: password,
                role: 'customer',
                signupDate: new Date().toISOString()
            };
            
            // Show loading message
            showNotification('Creating account and saving to database...');
            
            try {
                // Try to save to Google Sheets
                const saveResult = await saveUserToSheet(userData);
                
                if (saveResult.success) {
                    showNotification('Account created successfully! Saved to Google Sheets!');
                } else {
                    // Fallback to local storage
                    saveUserToBackup(username, userData);
                    showNotification('Account created! (Saved locally - Google Sheets unavailable)');
                }
                
            } catch (error) {
                // Fallback to local storage
                saveUserToBackup(username, userData);
                showNotification('Account created! (Saved locally)');
            }
            
            // Switch to login form
            setTimeout(() => {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                document.getElementById('username').value = username;
                document.getElementById('password').focus();
                signupForm.reset();
            }, 2000);
        });
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
    }

    // Form Toggles
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

    // Password visibility toggles
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const icon = togglePassword.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
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
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM fully loaded');
    
    initializeBackupStorage();
    setupEventListeners();
    
    // Test Google Sheets connection
    getUsersFromSheet().then(users => {
        console.log('🎯 Google Sheets test successful! Users found:', Object.keys(users).length);
    });
    
    // Redirect if already authenticated
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    if (isLoggedIn || isGuest) {
        console.log('➡️ Already authenticated, redirecting...');
        window.location.href = 'main.html';
        return;
    }
    
    console.log('✅ Login page ready with Automated Google Sheets!');
});
