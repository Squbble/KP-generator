import { AuthMixin } from './auth.js';
import { ProposalsMixin } from './proposals.js';
import { I18nMixin, translations, currencies, exchangeRates } from './i18n.js';
import './styles/base.css';
import './styles/login.css';
import './styles/dashboard.css';
import './styles/proposals.css';

class ProposalApp {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = 'ru';
        this.currentCurrency = 'KZT';
        this.currentPage = 'dashboard';
        this.editingProposalId = null;
        this.currencies = currencies;
        this.exchangeRates = exchangeRates;
        this.translations = translations;
        this.initializeData();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }
    initializeApp() {
        this.loadUserPreferences();
        this.bindEvents();
        this.checkAuth();
    }
    initializeData() {
        if (!localStorage.getItem('users')) {
            const users = [
                {"id":1,"username":"admin","email":"admin@company.kz","password":"admin123","role":"admin","name":"Администратор Системы","company":"ТОО \"Цифровые Решения\""},
                {"id":2,"username":"manager","email":"manager@company.kz","password":"manager123","role":"user","name":"Менеджер Продаж","company":"ТОО \"Цифровые Решения\""}
            ];
            localStorage.setItem('users', JSON.stringify(users));
        }
        if (!localStorage.getItem('proposals')) {
            const proposals = [
                {"id":1,"title":"Разработка корпоративного веб-сайта","clientName":"ТОО \"Инновационные Технологии\"","clientEmail":"info@innovations.kz","clientAddress":"г. Алматы, ул. Абая 150/230","createdDate":"2024-08-10","modifiedDate":"2024-08-10","totalAmount":850000,"currency":"KZT","language":"ru","status":"draft","services":[{"name":"Дизайн интерфейса","description":"Создание современного дизайна","quantity":1,"price":200000,"total":200000},{"name":"Frontend разработка","description":"Разработка клиентской части","quantity":1,"price":300000,"total":300000},{"name":"Backend разработка","description":"Разработка серверной части","quantity":1,"price":250000,"total":250000},{"name":"Тестирование","description":"Комплексное тестирование","quantity":1,"price":100000,"total":100000}],"terms":"Сроки выполнения: 45 рабочих дней. Оплата: 50% предоплата, 50% по завершению.","notes":"Включает техническую поддержку 3 месяца","validUntil":"2024-09-10","userId":2},
                {"id":2,"title":"Mobile App Development","clientName":"Tech Innovations LLC","clientEmail":"contact@techinnovations.com","clientAddress":"New York, 5th Avenue 123","createdDate":"2024-08-05","modifiedDate":"2024-08-08","totalAmount":8500,"currency":"USD","language":"en","status":"sent","services":[{"name":"UI/UX Design","description":"Modern mobile interface design","quantity":1,"price":2000,"total":2000},{"name":"iOS Development","description":"Native iOS application","quantity":1,"price":3000,"total":3000},{"name":"Android Development","description":"Native Android application","quantity":1,"price":2500,"total":2500},{"name":"Testing & QA","description":"Comprehensive testing","quantity":1,"price":1000,"total":1000}],"terms":"Development time: 60 business days. Payment: 40% upfront, 60% upon completion.","notes":"Includes 6 months of technical support","validUntil":"2024-09-05","userId":1}
            ];
            localStorage.setItem('proposals', JSON.stringify(proposals));
        }
    }
    loadUserPreferences() {
        const savedLang = localStorage.getItem('preferredLanguage');
        const savedCurrency = localStorage.getItem('preferredCurrency');
        if (savedLang) {
            this.currentLanguage = savedLang;
            const langSelector = document.getElementById('languageSelector');
            if (langSelector) langSelector.value = savedLang;
        }
        if (savedCurrency) {
            this.currentCurrency = savedCurrency;
            const currencySelector = document.getElementById('currencySelector');
            if (currencySelector) currencySelector.value = savedCurrency;
        }
    }
    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', e => this.handleLogin(e));
        }
        document.addEventListener('click', e => {
            if (e.target.matches('.nav-link, [data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                if (page) this.showPage(page);
            }
        });
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.addEventListener('change', e => {
                this.changeLanguage(e.target.value);
            });
        }
        const currencySelector = document.getElementById('currencySelector');
        if (currencySelector) {
            currencySelector.addEventListener('change', e => {
                this.changeCurrency(e.target.value);
            });
        }
        const addServiceBtn = document.getElementById('addServiceBtn');
        if (addServiceBtn) {
            addServiceBtn.addEventListener('click', () => this.addServiceItem());
        }
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => this.saveProposal('draft'));
        }
        const generatePdfBtn = document.getElementById('generatePdfBtn');
        if (generatePdfBtn) {
            generatePdfBtn.addEventListener('click', () => this.generatePDF());
        }
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProposals());
        }
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterProposals());
        }
    }
    showPage(pageName) {
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('hidden');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const pageElement = document.getElementById(`${pageName}Page`);
        const linkElement = document.querySelector(`.nav-link[data-page="${pageName}"]`);
        if (pageElement) pageElement.classList.remove('hidden');
        if (linkElement) linkElement.classList.add('active');
        this.currentPage = pageName;
        if (pageName === 'dashboard') {
            this.loadDashboard();
        } else if (pageName === 'proposals') {
            this.loadProposalsList();
        } else if (pageName === 'admin') {
            this.loadAdminPanel();
        }
    }
    filterProposals() {
        this.loadProposalsList();
    }
}

Object.assign(ProposalApp.prototype, AuthMixin, ProposalsMixin, I18nMixin);

const app = new ProposalApp();
window.app = app;
export default app;
