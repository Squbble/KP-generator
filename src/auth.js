export const AuthMixin = {
    checkAuth() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.showMainApp();
            } catch (e) {
                console.error('Error parsing saved user:', e);
                this.showLoginScreen();
            }
        } else {
            this.showLoginScreen();
        }
    },
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (!username || !password) {
            this.showError('Пожалуйста, заполните все поля');
            return;
        }
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.hideError();
                this.showMainApp();
            } else {
                this.showError('Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Ошибка входа в систему');
        }
    },
    handleLogout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.showLoginScreen();
    },
    showError(message) {
        const errorEl = document.getElementById('loginError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    },
    hideError() {
        const errorEl = document.getElementById('loginError');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    },
    showLoginScreen() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    },
    showMainApp() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        if (loginScreen) loginScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        const currentUserEl = document.getElementById('currentUser');
        const welcomeUserEl = document.getElementById('welcomeUser');
        if (currentUserEl) currentUserEl.textContent = this.currentUser.name;
        if (welcomeUserEl) welcomeUserEl.textContent = this.currentUser.name;
        if (this.currentUser.role === 'admin') {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.classList.add('show');
            });
        } else {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.classList.remove('show');
            });
        }
        this.showPage('dashboard');
        this.updateTranslations();
    }
};
