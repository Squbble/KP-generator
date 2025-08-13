// Application State and Data
class ProposalApp {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = 'ru';
        this.currentCurrency = 'KZT';
        this.currentPage = 'dashboard';
        this.editingProposalId = null;
        this.authToken = null;
        
        // Initialize data from the provided JSON
        this.initializeData();
        
        // Wait for DOM to be fully loaded
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
        // Sample proposals
        if (!localStorage.getItem('proposals')) {
            const proposals = [
                {
                    "id": 1,
                    "title": "Разработка корпоративного веб-сайта",
                    "clientName": "ТОО \"Инновационные Технологии\"",
                    "clientEmail": "info@innovations.kz",
                    "clientAddress": "г. Алматы, ул. Абая 150/230",
                    "createdDate": "2024-08-10",
                    "modifiedDate": "2024-08-10",
                    "totalAmount": 850000,
                    "currency": "KZT",
                    "language": "ru",
                    "status": "draft",
                    "services": [
                        {"name": "Дизайн интерфейса", "description": "Создание современного дизайна", "quantity": 1, "price": 200000, "total": 200000},
                        {"name": "Frontend разработка", "description": "Разработка клиентской части", "quantity": 1, "price": 300000, "total": 300000},
                        {"name": "Backend разработка", "description": "Разработка серверной части", "quantity": 1, "price": 250000, "total": 250000},
                        {"name": "Тестирование", "description": "Комплексное тестирование", "quantity": 1, "price": 100000, "total": 100000}
                    ],
                    "terms": "Сроки выполнения: 45 рабочих дней. Оплата: 50% предоплата, 50% по завершению.",
                    "notes": "Включает техническую поддержку 3 месяца",
                    "validUntil": "2024-09-10",
                    "userId": 2,
                    "userName": "Менеджер Продаж"
                },
                {
                    "id": 2,
                    "title": "Mobile App Development",
                    "clientName": "Tech Innovations LLC",
                    "clientEmail": "contact@techinnovations.com",
                    "clientAddress": "New York, 5th Avenue 123",
                    "createdDate": "2024-08-05",
                    "modifiedDate": "2024-08-08",
                    "totalAmount": 8500,
                    "currency": "USD",
                    "language": "en",
                    "status": "sent",
                    "services": [
                        {"name": "UI/UX Design", "description": "Modern mobile interface design", "quantity": 1, "price": 2000, "total": 2000},
                        {"name": "iOS Development", "description": "Native iOS application", "quantity": 1, "price": 3000, "total": 3000},
                        {"name": "Android Development", "description": "Native Android application", "quantity": 1, "price": 2500, "total": 2500},
                        {"name": "Testing & QA", "description": "Comprehensive testing", "quantity": 1, "price": 1000, "total": 1000}
                    ],
                    "terms": "Development time: 60 business days. Payment: 40% upfront, 60% upon completion.",
                    "notes": "Includes 6 months of technical support",
                    "validUntil": "2024-09-05",
                    "userId": 1,
                    "userName": "Администратор Системы"
                }
            ];
            localStorage.setItem('proposals', JSON.stringify(proposals));
        }

        // Currencies and exchange rates
        this.currencies = {
            "KZT": {"name": "Казахстанский тенге", "symbol": "₸", "nameEn": "Kazakhstani Tenge"},
            "USD": {"name": "Доллар США", "symbol": "$", "nameEn": "US Dollar"},
            "EUR": {"name": "Евро", "symbol": "€", "nameEn": "Euro"}
        };

        this.exchangeRates = {
            "USD": {"KZT": 465, "EUR": 0.92},
            "EUR": {"KZT": 505, "USD": 1.09},
            "KZT": {"USD": 0.00215, "EUR": 0.00198}
        };

        // Translations
        this.translations = {
            "ru": {
                "login": "Вход в систему",
                "username": "Имя пользователя",
                "password": "Пароль",
                "signIn": "Войти",
                "dashboard": "Панель управления",
                "proposals": "Коммерческие предложения",
                "createProposal": "Создать КП",
                "allProposals": "Все КП",
                "profile": "Профиль",
                "logout": "Выход",
                "admin": "Администратор",
                "totalProposals": "Всего КП",
                "drafts": "Черновики",
                "sent": "Отправлено",
                "approved": "Одобрено",
                "recentProposals": "Недавние КП",
                "viewAll": "Посмотреть все",
                "edit": "Редактировать",
                "duplicate": "Дублировать",
                "delete": "Удалить",
                "download": "Скачать PDF",
                "clientInfo": "Информация о клиенте",
                "clientName": "Название клиента",
                "clientEmail": "Email клиента",
                "clientAddress": "Адрес клиента",
                "services": "Услуги",
                "serviceName": "Название услуги",
                "description": "Описание",
                "quantity": "Количество",
                "price": "Цена",
                "total": "Сумма",
                "addService": "Добавить услугу",
                "removeService": "Удалить",
                "terms": "Условия",
                "notes": "Примечания",
                "validUntil": "Действительно до",
                "save": "Сохранить",
                "saveDraft": "Сохранить как черновик",
                "generatePDF": "Создать PDF",
                "currency": "Валюта",
                "language": "Язык",
                "search": "Поиск",
                "filter": "Фильтр",
                "status": "Статус",
                "createdDate": "Дата создания",
                "amount": "Сумма",
                "proposalTitle": "КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ",
                "noProposalsFound": "Предложения не найдены"
            },
            "en": {
                "login": "System Login",
                "username": "Username",
                "password": "Password",
                "signIn": "Sign In",
                "dashboard": "Dashboard",
                "proposals": "Commercial Proposals",
                "createProposal": "Create Proposal",
                "allProposals": "All Proposals",
                "profile": "Profile",
                "logout": "Logout",
                "admin": "Admin",
                "totalProposals": "Total Proposals",
                "drafts": "Drafts",
                "sent": "Sent",
                "approved": "Approved",
                "recentProposals": "Recent Proposals",
                "viewAll": "View All",
                "edit": "Edit",
                "duplicate": "Duplicate",
                "delete": "Delete",
                "download": "Download PDF",
                "clientInfo": "Client Information",
                "clientName": "Client Name",
                "clientEmail": "Client Email",
                "clientAddress": "Client Address",
                "services": "Services",
                "serviceName": "Service Name",
                "description": "Description",
                "quantity": "Quantity",
                "price": "Price",
                "total": "Total",
                "addService": "Add Service",
                "removeService": "Remove",
                "terms": "Terms & Conditions",
                "notes": "Notes",
                "validUntil": "Valid Until",
                "save": "Save",
                "saveDraft": "Save as Draft",
                "generatePDF": "Generate PDF",
                "currency": "Currency",
                "language": "Language",
                "search": "Search",
                "filter": "Filter",
                "status": "Status",
                "createdDate": "Created Date",
                "amount": "Amount",
                "proposalTitle": "COMMERCIAL PROPOSAL",
                "noProposalsFound": "No proposals found"
            }
        };
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
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link, [data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                if (page) this.showPage(page);
            }
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Language and currency selectors
        const languageSelector = document.getElementById('languageSelector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        const currencySelector = document.getElementById('currencySelector');
        if (currencySelector) {
            currencySelector.addEventListener('change', (e) => {
                this.changeCurrency(e.target.value);
            });
        }

        // Proposal form events
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

        // Search and filter
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterProposals());
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.filterProposals());
        }
    }

    checkAuth() {
        const session = sessionStorage.getItem('session');
        if (session) {
            try {
                const { user, token } = JSON.parse(session);
                this.currentUser = user;
                this.authToken = token;
                this.showMainApp();
            } catch (e) {
                console.error('Error parsing session:', e);
                this.showLoginScreen();
            }
        } else {
            this.showLoginScreen();
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            this.showError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                this.showError('Неверное имя пользователя или пароль');
                return;
            }

            const data = await response.json();
            this.currentUser = data.user;
            this.authToken = data.token;
            sessionStorage.setItem('session', JSON.stringify({ token: data.token, user: data.user }));

            this.hideError();
            this.showMainApp();
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Ошибка входа в систему');
        }
    }

    handleLogout() {
        sessionStorage.removeItem('session');
        this.currentUser = null;
        this.authToken = null;
        this.showLoginScreen();
    }

    showError(message) {
        const errorEl = document.getElementById('loginError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    hideError() {
        const errorEl = document.getElementById('loginError');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }

    showLoginScreen() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    }

    showMainApp() {
        const loginScreen = document.getElementById('loginScreen');
        const mainApp = document.getElementById('mainApp');
        
        if (loginScreen) loginScreen.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        
        // Update user info
        const currentUserEl = document.getElementById('currentUser');
        const welcomeUserEl = document.getElementById('welcomeUser');
        
        if (currentUserEl) currentUserEl.textContent = this.currentUser.name;
        if (welcomeUserEl) welcomeUserEl.textContent = this.currentUser.name;
        
        // Show admin elements if user is admin
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

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('hidden');
        });

        // Remove active class from nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected page
        const pageEl = document.getElementById(pageName + 'Page');
        if (pageEl) {
            pageEl.classList.remove('hidden');
        }

        // Set active nav link
        const navLink = document.querySelector(`[data-page="${pageName}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }

        this.currentPage = pageName;

        // Load page-specific content
        switch (pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'proposals':
                this.loadProposalsList();
                break;
            case 'create':
                this.resetProposalForm();
                break;
            case 'admin':
                this.loadAdminPanel();
                break;
        }
    }

    loadDashboard() {
        const proposals = this.getUserProposals();
        
        // Update statistics
        const totalEl = document.getElementById('totalProposalsCount');
        const draftsEl = document.getElementById('draftsCount');
        const sentEl = document.getElementById('sentCount');
        const approvedEl = document.getElementById('approvedCount');
        
        if (totalEl) totalEl.textContent = proposals.length;
        if (draftsEl) draftsEl.textContent = proposals.filter(p => p.status === 'draft').length;
        if (sentEl) sentEl.textContent = proposals.filter(p => p.status === 'sent').length;
        if (approvedEl) approvedEl.textContent = proposals.filter(p => p.status === 'approved').length;
        
        // Load recent proposals
        const recentProposals = proposals.slice(0, 5);
        this.renderProposalsList(recentProposals, 'recentProposalsList');
    }

    loadProposalsList() {
        const proposals = this.getUserProposals();
        this.renderProposalsList(proposals, 'proposalsList');
    }

    loadAdminPanel() {
        if (this.currentUser.role !== 'admin') return;
        
        const allProposals = JSON.parse(localStorage.getItem('proposals')) || [];
        const adminTotalEl = document.getElementById('adminTotalProposals');
        const adminMonthlyEl = document.getElementById('adminMonthlyProposals');
        
        if (adminTotalEl) adminTotalEl.textContent = allProposals.length;
        
        if (adminMonthlyEl) {
            const monthlyCount = allProposals.filter(p => {
                const createdDate = new Date(p.createdDate);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
            }).length;
            adminMonthlyEl.textContent = monthlyCount;
        }
        
        this.renderProposalsList(allProposals, 'adminProposalsList', true);
    }

    getUserProposals() {
        const allProposals = JSON.parse(localStorage.getItem('proposals')) || [];
        if (this.currentUser.role === 'admin') {
            return allProposals;
        }
        return allProposals.filter(p => p.userId === this.currentUser.id);
    }

    renderProposalsList(proposals, containerId, showUser = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (proposals.length === 0) {
            container.innerHTML = `<div class="empty-state">
                <p>${this.t('noProposalsFound')}</p>
            </div>`;
            return;
        }

        proposals.forEach(proposal => {
            const proposalEl = document.createElement('div');
            proposalEl.className = 'proposal-item';
            
            const statusClass = `status-badge--${proposal.status}`;
            const formattedAmount = this.formatCurrency(proposal.totalAmount, proposal.currency);
            
            let userInfo = '';
            if (showUser && proposal.userName) {
                userInfo = `<div class="proposal-user">Автор: ${proposal.userName}</div>`;
            }

            proposalEl.innerHTML = `
                <div class="proposal-info">
                    <div class="proposal-title">${proposal.title}</div>
                    <div class="proposal-client">${proposal.clientName}</div>
                    ${userInfo}
                    <div class="proposal-meta">
                        <span class="status-badge ${statusClass}">${this.t(proposal.status)}</span>
                        <span>${this.formatDate(proposal.createdDate)}</span>
                    </div>
                </div>
                <div class="proposal-amount">${formattedAmount}</div>
                <div class="proposal-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.editProposal(${proposal.id})">${this.t('edit')}</button>
                    <button class="btn btn--sm btn--secondary" onclick="app.duplicateProposal(${proposal.id})">${this.t('duplicate')}</button>
                    <button class="btn btn--sm btn--primary" onclick="app.downloadProposalPDF(${proposal.id})">${this.t('download')}</button>
                    <button class="btn btn--sm btn--outline" style="color: var(--color-error)" onclick="app.deleteProposal(${proposal.id})">${this.t('delete')}</button>
                </div>
            `;
            
            container.appendChild(proposalEl);
        });
    }

    filterProposals() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        
        if (!searchInput || !statusFilter) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilterValue = statusFilter.value;
        
        const proposals = this.getUserProposals();
        const filtered = proposals.filter(proposal => {
            const matchesSearch = proposal.title.toLowerCase().includes(searchTerm) || 
                                proposal.clientName.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilterValue || proposal.status === statusFilterValue;
            return matchesSearch && matchesStatus;
        });
        
        this.renderProposalsList(filtered, 'proposalsList');
    }

    resetProposalForm() {
        this.editingProposalId = null;
        const titleEl = document.getElementById('createPageTitle');
        const form = document.getElementById('proposalForm');
        
        if (titleEl) titleEl.textContent = this.t('createProposal');
        if (form) form.reset();

        const errorEl = document.getElementById('proposalError');
        if (errorEl) errorEl.classList.add('hidden');
        
        // Clear services container
        const container = document.getElementById('servicesContainer');
        if (container) {
            container.innerHTML = '';
            // Add initial service
            this.addServiceItem();
        }
        
        // Set today's date + 30 days as default valid until
        const validUntilField = document.querySelector('[name="validUntil"]');
        if (validUntilField) {
            const validUntilDate = new Date();
            validUntilDate.setDate(validUntilDate.getDate() + 30);
            validUntilField.value = validUntilDate.toISOString().split('T')[0];
        }
    }

    addServiceItem() {
        const container = document.getElementById('servicesContainer');
        if (!container) return;
        
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        
        serviceItem.innerHTML = `
            <div class="form-group">
                <input type="text" name="serviceName" class="form-control" placeholder="${this.t('serviceName')}" required>
            </div>
            <div class="form-group">
                <textarea name="serviceDescription" class="form-control" placeholder="${this.t('description')}"></textarea>
            </div>
            <div class="form-group">
                <input type="number" name="serviceQuantity" class="form-control" placeholder="${this.t('quantity')}" value="1" min="1" required>
            </div>
            <div class="form-group">
                <input type="number" name="servicePrice" class="form-control" placeholder="${this.t('price')}" step="0.01" min="0" required>
            </div>
            <div class="form-group">
                <input type="number" name="serviceTotal" class="form-control" placeholder="${this.t('total')}" readonly>
            </div>
            <button type="button" class="remove-service-btn" onclick="this.parentElement.remove(); app.calculateTotal();">×</button>
        `;
        
        // Add event listeners for calculation
        const quantityInput = serviceItem.querySelector('[name="serviceQuantity"]');
        const priceInput = serviceItem.querySelector('[name="servicePrice"]');
        const totalInput = serviceItem.querySelector('[name="serviceTotal"]');
        
        const calculateServiceTotal = () => {
            const quantity = Math.max(parseFloat(quantityInput.value) || 0, 0);
            const price = Math.max(parseFloat(priceInput.value) || 0, 0);
            const total = quantity * price;
            totalInput.value = total.toFixed(2);
            this.calculateTotal();
        };
        
        quantityInput.addEventListener('input', calculateServiceTotal);
        priceInput.addEventListener('input', calculateServiceTotal);
        
        container.appendChild(serviceItem);
        this.calculateTotal();
    }

    calculateTotal() {
        const serviceItems = document.querySelectorAll('.service-item');
        let total = 0;
        
        serviceItems.forEach(item => {
            const serviceTotal = parseFloat(item.querySelector('[name="serviceTotal"]').value) || 0;
            total += serviceTotal;
        });
        
        const totalAmountEl = document.getElementById('totalAmount');
        if (totalAmountEl) {
            const formattedTotal = this.formatCurrency(total, this.currentCurrency);
            totalAmountEl.textContent = formattedTotal;
        }
    }

    saveProposal(status = 'draft') {
        const form = document.getElementById('proposalForm');
        if (!form) return;

        const errorEl = document.getElementById('proposalError');
        if (errorEl) {
            errorEl.classList.add('hidden');
            errorEl.textContent = '';
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            if (errorEl) {
                errorEl.textContent = 'Пожалуйста, заполните обязательные поля';
                errorEl.classList.remove('hidden');
            }
            return;
        }

        const formData = new FormData(form);

        // Collect services
        const serviceItems = document.querySelectorAll('.service-item');
        const services = [];

        serviceItems.forEach(item => {
            const name = item.querySelector('[name="serviceName"]').value;
            const description = item.querySelector('[name="serviceDescription"]').value;
            const quantity = Math.max(parseFloat(item.querySelector('[name="serviceQuantity"]').value) || 0, 0);
            const price = Math.max(parseFloat(item.querySelector('[name="servicePrice"]').value) || 0, 0);
            const total = quantity * price;

            if (name && quantity > 0 && price > 0) {
                services.push({ name, description, quantity, price, total });
            }
        });

        if (services.length === 0) {
            if (errorEl) {
                errorEl.textContent = 'Добавьте хотя бы одну услугу';
                errorEl.classList.remove('hidden');
            } else {
                alert('Добавьте хотя бы одну услугу');
            }
            return;
        }
        
        const totalAmount = services.reduce((sum, service) => sum + service.total, 0);
        
        const proposal = {
            id: this.editingProposalId || Date.now(),
            title: formData.get('title'),
            clientName: formData.get('clientName'),
            clientEmail: formData.get('clientEmail') || '',
            clientAddress: formData.get('clientAddress') || '',
            services: services,
            terms: formData.get('terms') || '',
            notes: formData.get('notes') || '',
            validUntil: formData.get('validUntil') || '',
            totalAmount: totalAmount,
            currency: this.currentCurrency,
            language: this.currentLanguage,
            status: status,
            userId: this.currentUser.id,
            createdDate: this.editingProposalId ? 
                this.getProposalById(this.editingProposalId).createdDate : 
                new Date().toISOString().split('T')[0],
            modifiedDate: new Date().toISOString().split('T')[0]
        };
        
        // Save to localStorage
        const proposals = JSON.parse(localStorage.getItem('proposals')) || [];
        
        if (this.editingProposalId) {
            const index = proposals.findIndex(p => p.id === this.editingProposalId);
            if (index !== -1) {
                proposals[index] = proposal;
            }
        } else {
            proposals.push(proposal);
        }
        
        localStorage.setItem('proposals', JSON.stringify(proposals));
        
        alert('Коммерческое предложение сохранено!');
        this.showPage('proposals');
    }

    getProposalById(id) {
        const proposals = JSON.parse(localStorage.getItem('proposals')) || [];
        return proposals.find(p => p.id === id);
    }

    editProposal(id) {
        const proposal = this.getProposalById(id);
        if (!proposal) return;
        
        this.editingProposalId = id;
        this.showPage('create');
        
        // Update title
        const titleEl = document.getElementById('createPageTitle');
        if (titleEl) titleEl.textContent = this.t('edit') + ' - ' + proposal.title;
        
        // Fill form
        const form = document.getElementById('proposalForm');
        if (!form) return;
        
        const titleField = form.querySelector('[name="title"]');
        const clientNameField = form.querySelector('[name="clientName"]');
        const clientEmailField = form.querySelector('[name="clientEmail"]');
        const clientAddressField = form.querySelector('[name="clientAddress"]');
        const termsField = form.querySelector('[name="terms"]');
        const notesField = form.querySelector('[name="notes"]');
        const validUntilField = form.querySelector('[name="validUntil"]');
        
        if (titleField) titleField.value = proposal.title;
        if (clientNameField) clientNameField.value = proposal.clientName;
        if (clientEmailField) clientEmailField.value = proposal.clientEmail || '';
        if (clientAddressField) clientAddressField.value = proposal.clientAddress || '';
        if (termsField) termsField.value = proposal.terms || '';
        if (notesField) notesField.value = proposal.notes || '';
        if (validUntilField) validUntilField.value = proposal.validUntil || '';
        
        // Clear and fill services
        const container = document.getElementById('servicesContainer');
        if (container) {
            container.innerHTML = '';
            
            proposal.services.forEach(service => {
                this.addServiceItem();
                const lastItem = container.lastElementChild;
                if (lastItem) {
                    const nameField = lastItem.querySelector('[name="serviceName"]');
                    const descField = lastItem.querySelector('[name="serviceDescription"]');
                    const quantityField = lastItem.querySelector('[name="serviceQuantity"]');
                    const priceField = lastItem.querySelector('[name="servicePrice"]');
                    const totalField = lastItem.querySelector('[name="serviceTotal"]');
                    
                    if (nameField) nameField.value = service.name;
                    if (descField) descField.value = service.description || '';
                    if (quantityField) quantityField.value = service.quantity;
                    if (priceField) priceField.value = service.price;
                    if (totalField) totalField.value = service.total;
                }
            });
        }
        
        this.calculateTotal();
    }

    duplicateProposal(id) {
        const proposal = this.getProposalById(id);
        if (!proposal) return;
        
        this.editingProposalId = null;
        this.showPage('create');
        
        // Update title
        const titleEl = document.getElementById('createPageTitle');
        if (titleEl) titleEl.textContent = this.t('createProposal');
        
        // Fill form with duplicated data
        const form = document.getElementById('proposalForm');
        if (!form) return;
        
        const titleField = form.querySelector('[name="title"]');
        const clientNameField = form.querySelector('[name="clientName"]');
        const clientEmailField = form.querySelector('[name="clientEmail"]');
        const clientAddressField = form.querySelector('[name="clientAddress"]');
        const termsField = form.querySelector('[name="terms"]');
        const notesField = form.querySelector('[name="notes"]');
        const validUntilField = form.querySelector('[name="validUntil"]');
        
        if (titleField) titleField.value = proposal.title + ' (копия)';
        if (clientNameField) clientNameField.value = proposal.clientName;
        if (clientEmailField) clientEmailField.value = proposal.clientEmail || '';
        if (clientAddressField) clientAddressField.value = proposal.clientAddress || '';
        if (termsField) termsField.value = proposal.terms || '';
        if (notesField) notesField.value = proposal.notes || '';
        
        // Set new valid until date
        if (validUntilField) {
            const validUntilDate = new Date();
            validUntilDate.setDate(validUntilDate.getDate() + 30);
            validUntilField.value = validUntilDate.toISOString().split('T')[0];
        }
        
        // Clear and fill services
        const container = document.getElementById('servicesContainer');
        if (container) {
            container.innerHTML = '';
            
            proposal.services.forEach(service => {
                this.addServiceItem();
                const lastItem = container.lastElementChild;
                if (lastItem) {
                    const nameField = lastItem.querySelector('[name="serviceName"]');
                    const descField = lastItem.querySelector('[name="serviceDescription"]');
                    const quantityField = lastItem.querySelector('[name="serviceQuantity"]');
                    const priceField = lastItem.querySelector('[name="servicePrice"]');
                    
                    if (nameField) nameField.value = service.name;
                    if (descField) descField.value = service.description || '';
                    if (quantityField) quantityField.value = service.quantity;
                    if (priceField) priceField.value = service.price;
                }
            });
        }
        
        this.calculateTotal();
    }

    deleteProposal(id) {
        if (!confirm('Вы уверены, что хотите удалить это коммерческое предложение?')) {
            return;
        }
        
        const proposals = JSON.parse(localStorage.getItem('proposals')) || [];
        const filteredProposals = proposals.filter(p => p.id !== id);
        localStorage.setItem('proposals', JSON.stringify(filteredProposals));
        
        // Refresh current page
        if (this.currentPage === 'dashboard') {
            this.loadDashboard();
        } else if (this.currentPage === 'proposals') {
            this.loadProposalsList();
        } else if (this.currentPage === 'admin') {
            this.loadAdminPanel();
        }
    }

    generatePDF() {
        // Save as sent status first
        this.saveProposal('sent');
        
        // Get current form data for PDF
        const form = document.getElementById('proposalForm');
        if (!form) return;
        
        const formData = new FormData(form);
        
        this.showLoading();
        
        setTimeout(() => {
            this.createPDFContent(formData);
            this.hideLoading();
        }, 1000);
    }

    downloadProposalPDF(id) {
        const proposal = this.getProposalById(id);
        if (!proposal) return;
        
        this.showLoading();
        
        setTimeout(() => {
            this.createPDFFromProposal(proposal);
            this.hideLoading();
        }, 1000);
    }

    createPDFContent(formData) {
        const pdfTemplate = document.getElementById('pdfTemplate');
        if (!pdfTemplate) return;
        
        // Update template content
        const proposalNumberEl = document.getElementById('pdfProposalNumber');
        const dateEl = document.getElementById('pdfDate');
        
        if (proposalNumberEl) proposalNumberEl.textContent = Date.now();
        if (dateEl) dateEl.textContent = this.formatDate(new Date().toISOString().split('T')[0]);
        
        // Client info
        const clientInfo = `
            <strong>${formData.get('clientName')}</strong><br>
            ${formData.get('clientEmail') ? 'Email: ' + formData.get('clientEmail') + '<br>' : ''}
            ${formData.get('clientAddress') ? 'Адрес: ' + formData.get('clientAddress') : ''}
        `;
        const clientInfoEl = document.getElementById('pdfClientInfo');
        if (clientInfoEl) clientInfoEl.innerHTML = clientInfo;
        
        // Services table
        const servicesTable = document.getElementById('pdfServicesTable');
        if (servicesTable) {
            servicesTable.innerHTML = '';
            
            const serviceItems = document.querySelectorAll('.service-item');
            let totalAmount = 0;
            
            serviceItems.forEach((item, index) => {
                const name = item.querySelector('[name="serviceName"]').value;
                const description = item.querySelector('[name="serviceDescription"]').value;
                const quantity = parseFloat(item.querySelector('[name="serviceQuantity"]').value) || 0;
                const price = parseFloat(item.querySelector('[name="servicePrice"]').value) || 0;
                const total = quantity * price;
                totalAmount += total;
                
                if (name && quantity > 0 && price > 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${name}</td>
                        <td>${description}</td>
                        <td>${quantity}</td>
                        <td>${this.formatCurrency(price, this.currentCurrency)}</td>
                        <td>${this.formatCurrency(total, this.currentCurrency)}</td>
                    `;
                    servicesTable.appendChild(row);
                }
            });
            
            const totalAmountEl = document.getElementById('pdfTotalAmount');
            if (totalAmountEl) {
                totalAmountEl.textContent = this.formatCurrency(totalAmount, this.currentCurrency);
            }
        }
        
        // Terms and notes
        const terms = formData.get('terms');
        const notes = formData.get('notes');
        
        const termsSection = document.getElementById('pdfTermsSection');
        const termsEl = document.getElementById('pdfTerms');
        const notesSection = document.getElementById('pdfNotesSection');
        const notesEl = document.getElementById('pdfNotes');
        
        if (terms) {
            if (termsEl) termsEl.textContent = terms;
            if (termsSection) termsSection.style.display = 'block';
        } else {
            if (termsSection) termsSection.style.display = 'none';
        }
        
        if (notes) {
            if (notesEl) notesEl.textContent = notes;
            if (notesSection) notesSection.style.display = 'block';
        } else {
            if (notesSection) notesSection.style.display = 'none';
        }
        
        this.downloadPDF(pdfTemplate, formData.get('title') || 'Коммерческое предложение');
    }

    createPDFFromProposal(proposal) {
        const pdfTemplate = document.getElementById('pdfTemplate');
        if (!pdfTemplate) return;
        
        // Update template content
        const proposalNumberEl = document.getElementById('pdfProposalNumber');
        const dateEl = document.getElementById('pdfDate');
        
        if (proposalNumberEl) proposalNumberEl.textContent = proposal.id;
        if (dateEl) dateEl.textContent = this.formatDate(proposal.createdDate);
        
        // Client info
        const clientInfo = `
            <strong>${proposal.clientName}</strong><br>
            ${proposal.clientEmail ? 'Email: ' + proposal.clientEmail + '<br>' : ''}
            ${proposal.clientAddress ? 'Адрес: ' + proposal.clientAddress : ''}
        `;
        const clientInfoEl = document.getElementById('pdfClientInfo');
        if (clientInfoEl) clientInfoEl.innerHTML = clientInfo;
        
        // Services table
        const servicesTable = document.getElementById('pdfServicesTable');
        if (servicesTable) {
            servicesTable.innerHTML = '';
            
            proposal.services.forEach((service, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${service.name}</td>
                    <td>${service.description || ''}</td>
                    <td>${service.quantity}</td>
                    <td>${this.formatCurrency(service.price, proposal.currency)}</td>
                    <td>${this.formatCurrency(service.total, proposal.currency)}</td>
                `;
                servicesTable.appendChild(row);
            });
            
            const totalAmountEl = document.getElementById('pdfTotalAmount');
            if (totalAmountEl) {
                totalAmountEl.textContent = this.formatCurrency(proposal.totalAmount, proposal.currency);
            }
        }
        
        // Terms and notes
        const termsSection = document.getElementById('pdfTermsSection');
        const termsEl = document.getElementById('pdfTerms');
        const notesSection = document.getElementById('pdfNotesSection');
        const notesEl = document.getElementById('pdfNotes');
        
        if (proposal.terms) {
            if (termsEl) termsEl.textContent = proposal.terms;
            if (termsSection) termsSection.style.display = 'block';
        } else {
            if (termsSection) termsSection.style.display = 'none';
        }
        
        if (proposal.notes) {
            if (notesEl) notesEl.textContent = proposal.notes;
            if (notesSection) notesSection.style.display = 'block';
        } else {
            if (notesSection) notesSection.style.display = 'none';
        }
        
        this.downloadPDF(pdfTemplate, proposal.title);
    }

    downloadPDF(element, filename) {
        if (typeof html2pdf === 'undefined') {
            alert('PDF generation library not loaded');
            return;
        }
        
        const opt = {
            margin: 1,
            filename: filename + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        this.updateTranslations();
    }

    changeCurrency(currency) {
        this.currentCurrency = currency;
        localStorage.setItem('preferredCurrency', currency);
        this.calculateTotal();
        
        // Refresh current page to update currency displays
        if (this.currentPage === 'dashboard') {
            this.loadDashboard();
        } else if (this.currentPage === 'proposals') {
            this.loadProposalsList();
        }
    }

    updateTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.t(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.t(key);
            if (translation !== key) {
                element.placeholder = translation;
            }
        });
    }

    t(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }

    formatCurrency(amount, currency) {
        const currencyInfo = this.currencies[currency];
        if (!currencyInfo) return amount.toString();
        
        const formatted = new Intl.NumberFormat('ru-RU').format(amount);
        return `${formatted} ${currencyInfo.symbol}`;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return amount;
        
        if (fromCurrency === 'KZT') {
            return amount * (this.exchangeRates.KZT[toCurrency] || 1);
        } else if (toCurrency === 'KZT') {
            return amount * (this.exchangeRates[fromCurrency]?.KZT || 1);
        } else {
            // Convert through KZT
            const kztAmount = amount * (this.exchangeRates[fromCurrency]?.KZT || 1);
            return kztAmount * (this.exchangeRates.KZT[toCurrency] || 1);
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
    }
}

// Initialize the application
const app = new ProposalApp();

// Global functions for inline event handlers
window.app = app;