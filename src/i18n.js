export const currencies = {
    KZT: { name: 'Казахстанский тенге', symbol: '₸', nameEn: 'Kazakhstani Tenge' },
    USD: { name: 'Доллар США', symbol: '$', nameEn: 'US Dollar' },
    EUR: { name: 'Евро', symbol: '€', nameEn: 'Euro' }
};

export const exchangeRates = {
    USD: { KZT: 465, EUR: 0.92 },
    EUR: { KZT: 505, USD: 1.09 },
    KZT: { USD: 0.00215, EUR: 0.00198 }
};

export const translations = {
    ru: {
        login: 'Вход в систему',
        username: 'Имя пользователя',
        password: 'Пароль',
        signIn: 'Войти',
        dashboard: 'Панель управления',
        proposals: 'Коммерческие предложения',
        createProposal: 'Создать КП',
        allProposals: 'Все КП',
        profile: 'Профиль',
        logout: 'Выход',
        admin: 'Администратор',
        totalProposals: 'Всего КП',
        drafts: 'Черновики',
        sent: 'Отправлено',
        approved: 'Одобрено',
        recentProposals: 'Недавние КП',
        viewAll: 'Посмотреть все',
        edit: 'Редактировать',
        duplicate: 'Дублировать',
        delete: 'Удалить',
        download: 'Скачать PDF',
        clientInfo: 'Информация о клиенте',
        clientName: 'Название клиента',
        clientEmail: 'Email клиента',
        clientAddress: 'Адрес клиента',
        services: 'Услуги',
        serviceName: 'Название услуги',
        description: 'Описание',
        quantity: 'Количество',
        price: 'Цена',
        total: 'Сумма',
        addService: 'Добавить услугу',
        removeService: 'Удалить',
        terms: 'Условия',
        notes: 'Примечания',
        validUntil: 'Действительно до',
        save: 'Сохранить',
        saveDraft: 'Сохранить как черновик',
        generatePDF: 'Создать PDF',
        currency: 'Валюта',
        language: 'Язык',
        search: 'Поиск',
        filter: 'Фильтр',
        status: 'Статус',
        createdDate: 'Дата создания',
        amount: 'Сумма',
        proposalTitle: 'КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ',
        noProposalsFound: 'Предложения не найдены'
    },
    en: {
        login: 'System Login',
        username: 'Username',
        password: 'Password',
        signIn: 'Sign In',
        dashboard: 'Dashboard',
        proposals: 'Commercial Proposals',
        createProposal: 'Create Proposal',
        allProposals: 'All Proposals',
        profile: 'Profile',
        logout: 'Logout',
        admin: 'Admin',
        totalProposals: 'Total Proposals',
        drafts: 'Drafts',
        sent: 'Sent',
        approved: 'Approved',
        recentProposals: 'Recent Proposals',
        viewAll: 'View All',
        edit: 'Edit',
        duplicate: 'Duplicate',
        delete: 'Delete',
        download: 'Download PDF',
        clientInfo: 'Client Information',
        clientName: 'Client Name',
        clientEmail: 'Client Email',
        clientAddress: 'Client Address',
        services: 'Services',
        serviceName: 'Service Name',
        description: 'Description',
        quantity: 'Quantity',
        price: 'Price',
        total: 'Total',
        addService: 'Add Service',
        removeService: 'Remove',
        terms: 'Terms & Conditions',
        notes: 'Notes',
        validUntil: 'Valid Until',
        save: 'Save',
        saveDraft: 'Save as Draft',
        generatePDF: 'Generate PDF',
        currency: 'Currency',
        language: 'Language',
        search: 'Search',
        filter: 'Filter',
        status: 'Status',
        createdDate: 'Created Date',
        amount: 'Amount',
        proposalTitle: 'COMMERCIAL PROPOSAL',
        noProposalsFound: 'No proposals found'
    }
};

export const I18nMixin = {
    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        this.updateTranslations();
    },
    changeCurrency(currency) {
        this.currentCurrency = currency;
        localStorage.setItem('preferredCurrency', currency);
        this.calculateTotal();
        if (this.currentPage === 'dashboard') {
            this.loadDashboard();
        } else if (this.currentPage === 'proposals') {
            this.loadProposalsList();
        }
    },
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
    },
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    },
    formatCurrency(amount, currency) {
        const info = this.currencies[currency];
        if (!info) return amount.toString();
        const formatted = new Intl.NumberFormat('ru-RU').format(amount);
        return `${formatted} ${info.symbol}`;
    },
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    },
    convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return amount;
        if (fromCurrency === 'KZT') {
            return amount * (this.exchangeRates.KZT[toCurrency] || 1);
        } else if (toCurrency === 'KZT') {
            return amount * (this.exchangeRates[fromCurrency]?.KZT || 1);
        }
        const kztAmount = amount * (this.exchangeRates[fromCurrency]?.KZT || 1);
        return kztAmount * (this.exchangeRates.KZT[toCurrency] || 1);
    }
};
