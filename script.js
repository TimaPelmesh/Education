document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loadingAnimation = document.getElementById('loading-animation');
    const forgotPassword = document.getElementById('forgot-password');
    
    // Инициализация языка
    const currentLang = localStorage.getItem('kudo_language') || 'ru';
    if (typeof applyLanguage === 'function') {
        applyLanguage(currentLang);
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;
        
        // Show loading animation
        loadingAnimation.classList.remove('hidden');
        
        // Simulate API call with timeout
        setTimeout(function() {
            loadingAnimation.classList.add('hidden');
            
            // Simple validation for demo purposes
            if (username && password) {
                // Save username if "Remember me" is checked
                if (rememberMe) {
                    localStorage.setItem('kudo_username', username);
                } else {
                    localStorage.removeItem('kudo_username');
                }
                
                // Redirect to main page
                window.location.href = 'menu.html';
            } else {
                // Показываем локализованное сообщение об ошибке
                const currentLang = localStorage.getItem('kudo_language') || 'ru';
                const errorMessage = localization[currentLang].login_error;
                
                alert(errorMessage);
            }
        }, 1500);
    });
    
    // Check if username is already saved
    const savedUsername = localStorage.getItem('kudo_username');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('remember-me').checked = true;
    }
    
    // Handle forgot password
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Показываем локализованное сообщение
        const currentLang = localStorage.getItem('kudo_language') || 'ru';
        const message = localization[currentLang].password_recovery_message;
        
        alert(message);
    });
});