// Application State and Data
class ProposalApp {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = 'ru';
        this.currentCurrency = 'KZT';
        this.currentPage = 'dashboard';
        this.editingProposalId = null;
        
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

    sanitize(text) {
        return typeof text === 'string' ? text.replace(/[<>&]/g, '') : '';
    }

    initializeApp() {
        this.loadUserPreferences();
        this.bindEvents();
        this.checkAuth();
    }

    initializeData() {
        // Users data
        if (!localStorage.getItem('users')) {
            const users = [
                {"id": 1, "username": "admin", "email": "admin@company.kz", "password": "admin123", "role": "admin", "name": "Администратор Системы", "company": "ТОО \"Цифровые Решения\""},
                {"id": 2, "username": "manager", "email": "manager@company.kz", "password": "manager123", "role": "user", "name": "Менеджер Продаж", "company": "ТОО \"Цифровые Решения\""}
            ];
            localStorage.setItem('users', JSON.stringify(users));
        }

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
                    "userId": 2
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
                    "userId": 1
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
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        console.log('Attempting login with:', username); // Debug log
        
        if (!username || !password) {
            this.showError('Пожалуйста, заполните все поля');
            return;
        }
        
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            console.log('Available users:', users); // Debug log
            
            const user = users.find(u => u.username === username && u.password === password);
            console.log('Found user:', user); // Debug log
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.hideError();
                this.showMainApp();
                console.log('Login successful'); // Debug log
            } else {
                this.showError('Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Ошибка входа в систему');
        }
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
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
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            const p = document.createElement('p');
            p.textContent = this.t('noProposalsFound');
            emptyState.appendChild(p);
            container.appendChild(emptyState);
            return;
        }

        proposals.forEach(proposal => {
            const proposalEl = document.createElement('div');
            proposalEl.className = 'proposal-item';

            const statusClass = `status-badge--${proposal.status}`;
            const formattedAmount = this.formatCurrency(proposal.totalAmount, proposal.currency);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'proposal-info';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'proposal-title';
            titleDiv.textContent = this.sanitize(proposal.title);
            infoDiv.appendChild(titleDiv);

            const clientDiv = document.createElement('div');
            clientDiv.className = 'proposal-client';
            clientDiv.textContent = this.sanitize(proposal.clientName);
            infoDiv.appendChild(clientDiv);

            if (showUser) {
                const users = JSON.parse(localStorage.getItem('users'));
                const user = users.find(u => u.id === proposal.userId);
                const userDiv = document.createElement('div');
                userDiv.className = 'proposal-user';
                userDiv.textContent = `Автор: ${this.sanitize(user ? user.name : 'Неизвестно')}`;
                infoDiv.appendChild(userDiv);
            }

            const metaDiv = document.createElement('div');
            metaDiv.className = 'proposal-meta';
            const statusSpan = document.createElement('span');
            statusSpan.className = `status-badge ${statusClass}`;
            statusSpan.textContent = this.t(proposal.status);
            const dateSpan = document.createElement('span');
            dateSpan.textContent = this.formatDate(proposal.createdDate);
            metaDiv.appendChild(statusSpan);
            metaDiv.appendChild(dateSpan);
            infoDiv.appendChild(metaDiv);

            proposalEl.appendChild(infoDiv);

            const amountDiv = document.createElement('div');
            amountDiv.className = 'proposal-amount';
            amountDiv.textContent = formattedAmount;
            proposalEl.appendChild(amountDiv);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'proposal-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn--sm btn--outline';
            editBtn.textContent = this.t('edit');
            editBtn.addEventListener('click', () => this.editProposal(proposal.id));
            actionsDiv.appendChild(editBtn);

            const dupBtn = document.createElement('button');
            dupBtn.className = 'btn btn--sm btn--secondary';
            dupBtn.textContent = this.t('duplicate');
            dupBtn.addEventListener('click', () => this.duplicateProposal(proposal.id));
            actionsDiv.appendChild(dupBtn);

            const downBtn = document.createElement('button');
            downBtn.className = 'btn btn--sm btn--primary';
            downBtn.textContent = this.t('download');
            downBtn.addEventListener('click', () => this.downloadProposalPDF(proposal.id));
            actionsDiv.appendChild(downBtn);

            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn--sm btn--outline';
            delBtn.style.color = 'var(--color-error)';
            delBtn.textContent = this.t('delete');
            delBtn.addEventListener('click', () => this.deleteProposal(proposal.id));
            actionsDiv.appendChild(delBtn);

            proposalEl.appendChild(actionsDiv);

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

        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.name = 'serviceName';
        nameInput.className = 'form-control';
        nameInput.placeholder = this.t('serviceName');
        nameInput.required = true;
        nameGroup.appendChild(nameInput);
        serviceItem.appendChild(nameGroup);

        const descGroup = document.createElement('div');
        descGroup.className = 'form-group';
        const descTextarea = document.createElement('textarea');
        descTextarea.name = 'serviceDescription';
        descTextarea.className = 'form-control';
        descTextarea.placeholder = this.t('description');
        descGroup.appendChild(descTextarea);
        serviceItem.appendChild(descGroup);

        const qtyGroup = document.createElement('div');
        qtyGroup.className = 'form-group';
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.name = 'serviceQuantity';
        quantityInput.className = 'form-control';
        quantityInput.placeholder = this.t('quantity');
        quantityInput.value = 1;
        quantityInput.min = 1;
        quantityInput.required = true;
        qtyGroup.appendChild(quantityInput);
        serviceItem.appendChild(qtyGroup);

        const priceGroup = document.createElement('div');
        priceGroup.className = 'form-group';
        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.name = 'servicePrice';
        priceInput.className = 'form-control';
        priceInput.placeholder = this.t('price');
        priceInput.step = '0.01';
        priceInput.required = true;
        priceGroup.appendChild(priceInput);
        serviceItem.appendChild(priceGroup);

        const totalGroup = document.createElement('div');
        totalGroup.className = 'form-group';
        const totalInput = document.createElement('input');
        totalInput.type = 'number';
        totalInput.name = 'serviceTotal';
        totalInput.className = 'form-control';
        totalInput.placeholder = this.t('total');
        totalInput.readOnly = true;
        totalGroup.appendChild(totalInput);
        serviceItem.appendChild(totalGroup);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-service-btn';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => {
            serviceItem.remove();
            this.calculateTotal();
        });
        serviceItem.appendChild(removeBtn);
        
        // Add event listeners for calculation
        const calculateServiceTotal = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
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
        
        const formData = new FormData(form);
        
        // Validate required fields
        if (!formData.get('title') || !formData.get('clientName')) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }
        
        // Collect services
        const serviceItems = document.querySelectorAll('.service-item');
        const services = [];
        
        serviceItems.forEach(item => {
            const name = this.sanitize(item.querySelector('[name="serviceName"]').value);
            const description = this.sanitize(item.querySelector('[name="serviceDescription"]').value);
            const quantity = parseFloat(item.querySelector('[name="serviceQuantity"]').value) || 0;
            const price = parseFloat(item.querySelector('[name="servicePrice"]').value) || 0;
            const total = quantity * price;
            
            if (name && quantity > 0 && price > 0) {
                services.push({ name, description, quantity, price, total });
            }
        });
        
        if (services.length === 0) {
            alert('Добавьте хотя бы одну услугу');
            return;
        }
        
        const totalAmount = services.reduce((sum, service) => sum + service.total, 0);
        
        const proposal = {
            id: this.editingProposalId || Date.now(),
            title: this.sanitize(formData.get('title')),
            clientName: this.sanitize(formData.get('clientName')),
            clientEmail: this.sanitize(formData.get('clientEmail') || ''),
            clientAddress: this.sanitize(formData.get('clientAddress') || ''),
            services: services,
            terms: this.sanitize(formData.get('terms') || ''),
            notes: this.sanitize(formData.get('notes') || ''),
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
        if (titleEl) titleEl.textContent = this.t('edit') + ' - ' + this.sanitize(proposal.title);
        
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
        
        if (titleField) titleField.value = this.sanitize(proposal.title);
        if (clientNameField) clientNameField.value = this.sanitize(proposal.clientName);
        if (clientEmailField) clientEmailField.value = this.sanitize(proposal.clientEmail || '');
        if (clientAddressField) clientAddressField.value = this.sanitize(proposal.clientAddress || '');
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
        
        if (titleField) titleField.value = this.sanitize(proposal.title) + ' (копия)';
        if (clientNameField) clientNameField.value = this.sanitize(proposal.clientName);
        if (clientEmailField) clientEmailField.value = this.sanitize(proposal.clientEmail || '');
        if (clientAddressField) clientAddressField.value = this.sanitize(proposal.clientAddress || '');
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
        const clientInfoEl = document.getElementById('pdfClientInfo');
        if (clientInfoEl) {
            clientInfoEl.innerHTML = '';
            const nameStrong = document.createElement('strong');
            nameStrong.textContent = this.sanitize(formData.get('clientName'));
            clientInfoEl.appendChild(nameStrong);

            const clientEmail = this.sanitize(formData.get('clientEmail'));
            if (clientEmail) {
                clientInfoEl.appendChild(document.createElement('br'));
                const emailSpan = document.createElement('span');
                emailSpan.textContent = `Email: ${clientEmail}`;
                clientInfoEl.appendChild(emailSpan);
            }

            const clientAddress = this.sanitize(formData.get('clientAddress'));
            if (clientAddress) {
                clientInfoEl.appendChild(document.createElement('br'));
                const addressSpan = document.createElement('span');
                addressSpan.textContent = `Адрес: ${clientAddress}`;
                clientInfoEl.appendChild(addressSpan);
            }
        }
        
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
                    const tdIndex = document.createElement('td');
                    tdIndex.textContent = index + 1;
                    const tdName = document.createElement('td');
                    tdName.textContent = this.sanitize(name);
                    const tdDesc = document.createElement('td');
                    tdDesc.textContent = this.sanitize(description);
                    const tdQty = document.createElement('td');
                    tdQty.textContent = quantity;
                    const tdPrice = document.createElement('td');
                    tdPrice.textContent = this.formatCurrency(price, this.currentCurrency);
                    const tdTotal = document.createElement('td');
                    tdTotal.textContent = this.formatCurrency(total, this.currentCurrency);
                    row.append(tdIndex, tdName, tdDesc, tdQty, tdPrice, tdTotal);
                    servicesTable.appendChild(row);
                }
            });
            
            const totalAmountEl = document.getElementById('pdfTotalAmount');
            if (totalAmountEl) {
                totalAmountEl.textContent = this.formatCurrency(totalAmount, this.currentCurrency);
            }
        }
        
        // Terms and notes
        const terms = this.sanitize(formData.get('terms'));
        const notes = this.sanitize(formData.get('notes'));
        
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
        
        const pdfTitle = this.sanitize(formData.get('title')) || 'Коммерческое предложение';
        this.downloadPDF(pdfTemplate, pdfTitle);
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
        const clientInfoEl = document.getElementById('pdfClientInfo');
        if (clientInfoEl) {
            clientInfoEl.innerHTML = '';
            const nameStrong = document.createElement('strong');
            nameStrong.textContent = this.sanitize(proposal.clientName);
            clientInfoEl.appendChild(nameStrong);

            const clientEmail = this.sanitize(proposal.clientEmail);
            if (clientEmail) {
                clientInfoEl.appendChild(document.createElement('br'));
                const emailSpan = document.createElement('span');
                emailSpan.textContent = `Email: ${clientEmail}`;
                clientInfoEl.appendChild(emailSpan);
            }

            const clientAddress = this.sanitize(proposal.clientAddress);
            if (clientAddress) {
                clientInfoEl.appendChild(document.createElement('br'));
                const addressSpan = document.createElement('span');
                addressSpan.textContent = `Адрес: ${clientAddress}`;
                clientInfoEl.appendChild(addressSpan);
            }
        }
        
        // Services table
        const servicesTable = document.getElementById('pdfServicesTable');
        if (servicesTable) {
            servicesTable.innerHTML = '';
            
            proposal.services.forEach((service, index) => {
                const row = document.createElement('tr');
                const tdIndex = document.createElement('td');
                tdIndex.textContent = index + 1;
                const tdName = document.createElement('td');
                tdName.textContent = this.sanitize(service.name);
                const tdDesc = document.createElement('td');
                tdDesc.textContent = this.sanitize(service.description || '');
                const tdQty = document.createElement('td');
                tdQty.textContent = service.quantity;
                const tdPrice = document.createElement('td');
                tdPrice.textContent = this.formatCurrency(service.price, proposal.currency);
                const tdTotal = document.createElement('td');
                tdTotal.textContent = this.formatCurrency(service.total, proposal.currency);
                row.append(tdIndex, tdName, tdDesc, tdQty, tdPrice, tdTotal);
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

        const sanitizedTerms = this.sanitize(proposal.terms);
        if (sanitizedTerms) {
            if (termsEl) termsEl.textContent = sanitizedTerms;
            if (termsSection) termsSection.style.display = 'block';
        } else {
            if (termsSection) termsSection.style.display = 'none';
        }

        const sanitizedNotes = this.sanitize(proposal.notes);
        if (sanitizedNotes) {
            if (notesEl) notesEl.textContent = sanitizedNotes;
            if (notesSection) notesSection.style.display = 'block';
        } else {
            if (notesSection) notesSection.style.display = 'none';
        }
        
        this.downloadPDF(pdfTemplate, this.sanitize(proposal.title));
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