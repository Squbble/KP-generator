export const ProposalsMixin = {
    loadDashboard() {
        const proposals = this.getUserProposals();
        const totalEl = document.getElementById('totalProposalsCount');
        const draftsEl = document.getElementById('draftsCount');
        const sentEl = document.getElementById('sentCount');
        const approvedEl = document.getElementById('approvedCount');
        if (totalEl) totalEl.textContent = proposals.length;
        if (draftsEl) draftsEl.textContent = proposals.filter(p => p.status === 'draft').length;
        if (sentEl) sentEl.textContent = proposals.filter(p => p.status === 'sent').length;
        if (approvedEl) approvedEl.textContent = proposals.filter(p => p.status === 'approved').length;
        const recentProposals = proposals.slice(0, 5);
        this.renderProposalsList(recentProposals, 'recentProposalsList');
    },
    loadProposalsList() {
        const proposals = this.getUserProposals();
        this.renderProposalsList(proposals, 'proposalsList');
    },
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
    },
    getUserProposals() {
        const allProposals = JSON.parse(localStorage.getItem('proposals')) || [];
        if (this.currentUser.role === 'admin') {
            return allProposals;
        }
        return allProposals.filter(p => p.userId === this.currentUser.id);
    },
    renderProposalsList(proposals, containerId, showUser = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        if (proposals.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>${this.t('noProposalsFound')}</p></div>`;
            return;
        }
        proposals.forEach(proposal => {
            const proposalEl = document.createElement('div');
            proposalEl.className = 'proposal-item';
            const statusClass = `status-badge--${proposal.status}`;
            const formattedAmount = this.formatCurrency(proposal.totalAmount, proposal.currency);
            let userInfo = '';
            if (showUser) {
                const users = JSON.parse(localStorage.getItem('users'));
                const user = users.find(u => u.id === proposal.userId);
                userInfo = `<div class="proposal-user">Автор: ${user ? user.name : 'Неизвестно'}</div>`;
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
                </div>`;
            container.appendChild(proposalEl);
        });
    },
    filterProposals() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        if (!searchInput || !statusFilter) return;
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilterValue = statusFilter.value;
        const proposals = this.getUserProposals();
        const filtered = proposals.filter(proposal => {
            const matchesSearch = proposal.title.toLowerCase().includes(searchTerm) || proposal.clientName.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilterValue || proposal.status === statusFilterValue;
            return matchesSearch && matchesStatus;
        });
        this.renderProposalsList(filtered, 'proposalsList');
    },
    resetProposalForm() {
        this.editingProposalId = null;
        const titleEl = document.getElementById('createPageTitle');
        const form = document.getElementById('proposalForm');
        if (titleEl) titleEl.textContent = this.t('createProposal');
        if (form) form.reset();
        const container = document.getElementById('servicesContainer');
        if (container) {
            container.innerHTML = '';
            this.addServiceItem();
        }
        const validUntilField = document.querySelector('[name="validUntil"]');
        if (validUntilField) {
            const validUntilDate = new Date();
            validUntilDate.setDate(validUntilDate.getDate() + 30);
            validUntilField.value = validUntilDate.toISOString().split('T')[0];
        }
    },
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
                <input type="number" name="servicePrice" class="form-control" placeholder="${this.t('price')}" step="0.01" required>
            </div>
            <div class="form-group">
                <input type="number" name="serviceTotal" class="form-control" placeholder="${this.t('total')}" readonly>
            </div>
            <button type="button" class="remove-service-btn" onclick="this.parentElement.remove(); app.calculateTotal();">×</button>`;
        const quantityInput = serviceItem.querySelector('[name="serviceQuantity"]');
        const priceInput = serviceItem.querySelector('[name="servicePrice"]');
        const totalInput = serviceItem.querySelector('[name="serviceTotal"]');
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
    },
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
    },
    saveProposal(status = 'draft') {
        const form = document.getElementById('proposalForm');
        if (!form) return;
        const formData = new FormData(form);
        if (!formData.get('title') || !formData.get('clientName')) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }
        const serviceItems = document.querySelectorAll('.service-item');
        const services = [];
        serviceItems.forEach(item => {
            const name = item.querySelector('[name="serviceName"]').value;
            const description = item.querySelector('[name="serviceDescription"]').value;
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
            title: formData.get('title'),
            clientName: formData.get('clientName'),
            clientEmail: formData.get('clientEmail') || '',
            clientAddress: formData.get('clientAddress') || '',
            services,
            terms: formData.get('terms') || '',
            notes: formData.get('notes') || '',
            validUntil: formData.get('validUntil') || '',
            totalAmount,
            currency: this.currentCurrency,
            language: this.currentLanguage,
            status,
            userId: this.currentUser.id,
            createdDate: this.editingProposalId ? this.getProposalById(this.editingProposalId).createdDate : new Date().toISOString().split('T')[0],
            modifiedDate: new Date().toISOString().split('T')[0]
        };
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
    },
    getProposalById(id) {
        const proposals = JSON.parse(localStorage.getItem('proposals')) || [];
        return proposals.find(p => p.id === id);
    },
    editProposal(id) {
        const proposal = this.getProposalById(id);
        if (!proposal) return;
        this.editingProposalId = id;
        this.showPage('create');
        const titleEl = document.getElementById('createPageTitle');
        if (titleEl) titleEl.textContent = this.t('edit') + ' - ' + proposal.title;
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
    },
    duplicateProposal(id) {
        const proposal = this.getProposalById(id);
        if (!proposal) return;
        this.editingProposalId = null;
        this.showPage('create');
        const titleEl = document.getElementById('createPageTitle');
        if (titleEl) titleEl.textContent = this.t('createProposal');
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
        if (validUntilField) {
            const validUntilDate = new Date();
            validUntilDate.setDate(validUntilDate.getDate() + 30);
            validUntilField.value = validUntilDate.toISOString().split('T')[0];
        }
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
    },
    deleteProposal(id) {
        if (!confirm('Вы уверены, что хотите удалить это коммерческое предложение?')) {
            return;
        }
        const proposals = JSON.parse(localStorage.getItem('proposals')) || [];
        const filteredProposals = proposals.filter(p => p.id !== id);
        localStorage.setItem('proposals', JSON.stringify(filteredProposals));
        if (this.currentPage === 'dashboard') {
            this.loadDashboard();
        } else if (this.currentPage === 'proposals') {
            this.loadProposalsList();
        } else if (this.currentPage === 'admin') {
            this.loadAdminPanel();
        }
    },
    generatePDF() {
        this.saveProposal('sent');
        const form = document.getElementById('proposalForm');
        if (!form) return;
        const formData = new FormData(form);
        this.showLoading();
        setTimeout(() => {
            this.createPDFContent(formData);
            this.hideLoading();
        }, 1000);
    },
    downloadProposalPDF(id) {
        const proposal = this.getProposalById(id);
        if (!proposal) return;
        this.showLoading();
        setTimeout(() => {
            this.createPDFFromProposal(proposal);
            this.hideLoading();
        }, 1000);
    },
    createPDFContent(formData) {
        const pdfTemplate = document.getElementById('pdfTemplate');
        if (!pdfTemplate) return;
        const proposalNumberEl = document.getElementById('pdfProposalNumber');
        const dateEl = document.getElementById('pdfDate');
        if (proposalNumberEl) proposalNumberEl.textContent = Date.now();
        if (dateEl) dateEl.textContent = this.formatDate(new Date().toISOString().split('T')[0]);
        const clientInfo = `
            <strong>${formData.get('clientName')}</strong><br>
            ${formData.get('clientEmail') ? 'Email: ' + formData.get('clientEmail') + '<br>' : ''}
            ${formData.get('clientAddress') ? 'Адрес: ' + formData.get('clientAddress') : ''}`;
        const clientInfoEl = document.getElementById('pdfClientInfo');
        if (clientInfoEl) clientInfoEl.innerHTML = clientInfo;
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
                        <td>${this.formatCurrency(total, this.currentCurrency)}</td>`;
                    servicesTable.appendChild(row);
                }
            });
            const totalAmountEl = document.getElementById('pdfTotalAmount');
            if (totalAmountEl) {
                totalAmountEl.textContent = this.formatCurrency(totalAmount, this.currentCurrency);
            }
        }
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
    },
    createPDFFromProposal(proposal) {
        const pdfTemplate = document.getElementById('pdfTemplate');
        if (!pdfTemplate) return;
        const proposalNumberEl = document.getElementById('pdfProposalNumber');
        const dateEl = document.getElementById('pdfDate');
        if (proposalNumberEl) proposalNumberEl.textContent = proposal.id;
        if (dateEl) dateEl.textContent = this.formatDate(proposal.createdDate);
        const clientInfo = `
            <strong>${proposal.clientName}</strong><br>
            ${proposal.clientEmail ? 'Email: ' + proposal.clientEmail + '<br>' : ''}
            ${proposal.clientAddress ? 'Адрес: ' + proposal.clientAddress : ''}`;
        const clientInfoEl = document.getElementById('pdfClientInfo');
        if (clientInfoEl) clientInfoEl.innerHTML = clientInfo;
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
                    <td>${this.formatCurrency(service.total, proposal.currency)}</td>`;
                servicesTable.appendChild(row);
            });
            const totalAmountEl = document.getElementById('pdfTotalAmount');
            if (totalAmountEl) {
                totalAmountEl.textContent = this.formatCurrency(proposal.totalAmount, proposal.currency);
            }
        }
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
    },
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
    },
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    },
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
    }
};
