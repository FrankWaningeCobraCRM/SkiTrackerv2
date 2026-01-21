// ===========================
// AUTHENTICATION LOGIC
// ===========================

let currentUser = null;

// Show/Hide loading overlay
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Show login form
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('switch-to-register').style.display = 'block';
    document.getElementById('switch-to-login').style.display = 'none';
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
}

// Show register form
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('switch-to-register').style.display = 'none';
    document.getElementById('switch-to-login').style.display = 'block';
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
}

// Handle login form submit
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorElement = document.getElementById('login-error');
    
    showLoading();
    errorElement.textContent = '';
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        // Auth state change will handle the redirect
    } catch (error) {
        hideLoading();
        errorElement.textContent = getErrorMessage(error.code);
    }
});

// Handle register form submit
document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    const errorElement = document.getElementById('register-error');
    
    errorElement.textContent = '';
    
    // Validate passwords match
    if (password !== passwordConfirm) {
        errorElement.textContent = 'Wachtwoorden komen niet overeen.';
        return;
    }
    
    showLoading();
    
    try {
        // Create the user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update display name
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Create user document in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Auth state change will handle the redirect
    } catch (error) {
        hideLoading();
        errorElement.textContent = getErrorMessage(error.code);
    }
});

// Sign in with Google
async function signInWithGoogle() {
    showLoading();
    
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        
        // Check if this is a new user
        if (result.additionalUserInfo.isNewUser) {
            // Create user document in Firestore
            await db.collection('users').doc(result.user.uid).set({
                name: result.user.displayName,
                email: result.user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Auth state change will handle the redirect
    } catch (error) {
        hideLoading();
        if (error.code !== 'auth/popup-closed-by-user') {
            alert('Fout bij inloggen met Google: ' + getErrorMessage(error.code));
        }
    }
}

// Handle logout
async function handleLogout() {
    if (confirm('Weet je zeker dat je wilt uitloggen?')) {
        showLoading();
        try {
            await auth.signOut();
            // Auth state change will handle the redirect
        } catch (error) {
            hideLoading();
            alert('Fout bij uitloggen: ' + error.message);
        }
    }
}

// Listen for auth state changes
auth.onAuthStateChanged(function(user) {
    hideLoading();
    
    if (user) {
        // User is signed in
        currentUser = user;
        
        // Update UI
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        document.getElementById('user-display-name').textContent = user.displayName || user.email;
        
        // Initialize the app (load user data)
        if (typeof initializeApp === 'function') {
            initializeApp();
        }
    } else {
        // User is signed out
        currentUser = null;
        
        // Update UI
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
        
        // Clear forms
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
        showLoginForm();
    }
});

// Get user-friendly error messages
function getErrorMessage(errorCode) {
    const messages = {
        'auth/email-already-in-use': 'Dit e-mailadres is al in gebruik.',
        'auth/invalid-email': 'Ongeldig e-mailadres.',
        'auth/operation-not-allowed': 'Deze actie is niet toegestaan.',
        'auth/weak-password': 'Wachtwoord is te zwak. Gebruik minimaal 6 tekens.',
        'auth/user-disabled': 'Dit account is uitgeschakeld.',
        'auth/user-not-found': 'Geen account gevonden met dit e-mailadres.',
        'auth/wrong-password': 'Onjuist wachtwoord.',
        'auth/invalid-credential': 'Onjuist e-mailadres of wachtwoord.',
        'auth/too-many-requests': 'Te veel pogingen. Probeer het later opnieuw.',
        'auth/network-request-failed': 'Netwerkfout. Controleer je internetverbinding.',
        'auth/popup-blocked': 'Pop-up geblokkeerd. Sta pop-ups toe voor deze site.',
        'auth/popup-closed-by-user': 'Pop-up gesloten.',
        'auth/cancelled-popup-request': 'Aanvraag geannuleerd.'
    };
    
    return messages[errorCode] || 'Er is een fout opgetreden. Probeer het opnieuw.';
}
