/**
 * Vulnerable Login System - JavaScript Logic
 * Handles user signup, login, and simple session management using localStorage.
 * 
 * IMPORTANT: This code is intentionally vulnerable for educational purposes.
 * DO NOT USE THIS IN A PRODUCTION ENVIRONMENT.
 */

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const messageDiv = document.getElementById('message');

    // Helper to show messages in the UI
    const showMessage = (text, type = 'error') => {
        if (!messageDiv) return;
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    };

    // --- Signup Logic ---
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // SECURITY VULNERABILITY: No input validation/sanitization.
            // A user can submit malicious strings, including HTML and Script tags.
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Get existing users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Simple check to see if user already exists
            if (users.find(u => u.username === username)) {
                showMessage('User already exists!');
                return;
            }

            // SECURITY VULNERABILITY: Insecure Storage.
            // We are storing the password as PLAIN TEXT in localStorage.
            // Anyone with access to the browser console can see all usernames and passwords.
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));

            showMessage('Account created! You can now login.', 'success');
            
            // Clear form fields
            signupForm.reset();
        });
    }

    // --- Login Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Retrieve users list
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // SECURITY VULNERABILITY: Broken Authentication.
            // Simple plaintext comparison is highly insecure.
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // SECURITY VULNERABILITY: Insecure Session Management.
                // We are storing the session as a simple string in localStorage.
                // This is susceptible to Session Hijacking.
                localStorage.setItem('currentUser', user.username);
                window.location.href = 'dashboard.html';
            } else {
                showMessage('Invalid username or password.');
            }
        });
    }

    // --- Logout Logic ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // "Logging out" by removing the session key
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
});
