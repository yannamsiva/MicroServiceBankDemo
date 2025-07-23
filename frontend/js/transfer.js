// Transfer JavaScript for Digital Banking System

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Utils.requireAuth()) {
        return;
    }

    // Initialize transfer page
    initializeTransfer();
    loadRecentTransfers();
    populateAccountDropdowns();
});

function initializeTransfer() {
    // Initialize transfer type toggles
    initializeTransferTypeToggles();
    
    // Initialize transfer form
    initializeTransferForm();
    
    // Initialize scheduled date toggle
    initializeScheduledDateToggle();
    
    // Initialize amount validation
    initializeAmountValidation();
}

function initializeTransferTypeToggles() {
    const internalTransfer = document.getElementById('internalTransfer');
    const externalTransfer = document.getElementById('externalTransfer');
    const internalSection = document.getElementById('internalTransferSection');
    const externalSection = document.getElementById('externalTransferSection');

    if (internalTransfer && externalTransfer) {
        internalTransfer.addEventListener('change', function() {
            if (this.checked) {
                internalSection.style.display = 'block';
                externalSection.style.display = 'none';
                resetExternalForm();
            }
        });

        externalTransfer.addEventListener('change', function() {
            if (this.checked) {
                externalSection.style.display = 'block';
                internalSection.style.display = 'none';
                resetInternalForm();
            }
        });
    }
}

function initializeTransferForm() {
    const transferForm = document.getElementById('transferForm');
    if (!transferForm) return;

    transferForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateTransferForm()) {
            return;
        }

        const formData = new FormData(transferForm);
        const transferData = {
            transferType: formData.get('transferType'),
            fromAccount: formData.get('fromAccount'),
            toAccount: formData.get('toAccount'),
            recipientName: formData.get('recipientName'),
            recipientAccount: formData.get('recipientAccount'),
            bankName: formData.get('bankName'),
            swiftCode: formData.get('swiftCode'),
            amount: parseFloat(formData.get('amount')),
            description: formData.get('description'),
            transferDate: formData.get('transferDate'),
            scheduledDate: formData.get('scheduledDate')
        };

        try {
            Utils.showSpinner('transferBtn', 'transferBtnText');
            
            // Show confirmation modal
            showTransferConfirmation(transferData);
            
        } catch (error) {
            Utils.showAlert('Transfer failed. Please try again.', 'danger');
        } finally {
            Utils.hideSpinner('transferBtn', 'transferBtnText');
        }
    });
}

function initializeScheduledDateToggle() {
    const immediateTransfer = document.getElementById('immediateTransfer');
    const scheduledTransfer = document.getElementById('scheduledTransfer');
    const scheduledDateSection = document.getElementById('scheduledDateSection');

    if (immediateTransfer && scheduledTransfer) {
        immediateTransfer.addEventListener('change', function() {
            if (this.checked) {
                scheduledDateSection.style.display = 'none';
            }
        });

        scheduledTransfer.addEventListener('change', function() {
            if (this.checked) {
                scheduledDateSection.style.display = 'block';
            }
        });
    }
}

function initializeAmountValidation() {
    const amountInput = document.getElementById('amount');
    if (!amountInput) return;

    amountInput.addEventListener('input', function() {
        const amount = parseFloat(this.value);
        const minAmount = 1.00;
        const maxAmount = getMaxTransferAmount();

        if (amount < minAmount) {
            this.setCustomValidity(`Minimum transfer amount is $${minAmount.toFixed(2)}`);
        } else if (amount > maxAmount) {
            this.setCustomValidity(`Maximum transfer amount is $${maxAmount.toFixed(2)}`);
        } else {
            this.setCustomValidity('');
        }
    });
}

function validateTransferForm() {
    const form = document.getElementById('transferForm');
    const transferType = form.querySelector('input[name="transferType"]:checked').value;
    
    let isValid = true;
    
    // Reset validation states
    const fields = form.querySelectorAll('.form-control, .form-select');
    fields.forEach(field => {
        field.classList.remove('is-invalid');
    });
    
    // Validate from account
    const fromAccount = document.getElementById('fromAccount');
    if (!fromAccount.value) {
        fromAccount.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate amount
    const amount = document.getElementById('amount');
    if (!amount.value || parseFloat(amount.value) < 1.00) {
        amount.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate based on transfer type
    if (transferType === 'internal') {
        const toAccount = document.getElementById('toAccount');
        if (!toAccount.value) {
            toAccount.classList.add('is-invalid');
            isValid = false;
        }
        
        // Check if from and to accounts are different
        if (fromAccount.value === toAccount.value) {
            toAccount.classList.add('is-invalid');
            isValid = false;
            Utils.showAlert('Source and destination accounts must be different.', 'danger');
        }
    } else {
        // External transfer validation
        const fields = ['recipientName', 'recipientAccount', 'bankName', 'swiftCode'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        });
    }
    
    return isValid;
}

function getMaxTransferAmount() {
    const transferType = document.querySelector('input[name="transferType"]:checked').value;
    return transferType === 'internal' ? 50000 : 25000;
}

function resetInternalForm() {
    document.getElementById('toAccount').value = '';
}

function resetExternalForm() {
    const fields = ['recipientName', 'recipientAccount', 'bankName', 'swiftCode'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
}

function showTransferConfirmation(transferData) {
    const modalBody = document.getElementById('transferConfirmationBody');
    if (!modalBody) return;

    const transferType = transferData.transferType === 'internal' ? 'Internal Transfer' : 'External Transfer';
    const recipient = transferData.transferType === 'internal' 
        ? getAccountName(transferData.toAccount)
        : transferData.recipientName;

    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Transfer Details</h6>
                <table class="table table-borderless">
                    <tr>
                        <td><strong>Transfer Type:</strong></td>
                        <td>${transferType}</td>
                    </tr>
                    <tr>
                        <td><strong>From Account:</strong></td>
                        <td>${getAccountName(transferData.fromAccount)}</td>
                    </tr>
                    <tr>
                        <td><strong>To:</strong></td>
                        <td>${recipient}</td>
                    </tr>
                    <tr>
                        <td><strong>Amount:</strong></td>
                        <td class="text-success fw-bold">${Utils.formatCurrency(transferData.amount)}</td>
                    </tr>
                    <tr>
                        <td><strong>Description:</strong></td>
                        <td>${transferData.description || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Transfer Date:</strong></td>
                        <td>${transferData.transferDate === 'immediate' ? 'Immediate' : transferData.scheduledDate}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>Transfer Summary</h6>
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Processing Time:</strong><br>
                    ${transferData.transferType === 'internal' ? 'Instant' : '1-3 business days'}
                </div>
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Fee:</strong><br>
                    ${transferData.transferType === 'internal' ? 'Free' : '$5.00'}
                </div>
                <div class="mt-3">
                    <small class="text-muted">
                        By confirming this transfer, you agree to the terms and conditions.
                        This action cannot be undone once processed.
                    </small>
                </div>
            </div>
        </div>
    `;

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('transferConfirmationModal'));
    modal.show();

    // Initialize confirm button
    const confirmBtn = document.getElementById('confirmTransfer');
    if (confirmBtn) {
        confirmBtn.onclick = () => processTransfer(transferData);
    }
}

function getAccountName(accountValue) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let accounts;
    if (user.email === 'demo@example.com') {
        accounts = {
            'main': 'Main Account - $24,500.00',
            'savings': 'Savings Account - $15,750.00',
            'investment': 'Investment Account - $32,100.00'
        };
    } else {
        accounts = {
            'main': 'Main Account - $1,000.00',
            'savings': 'Savings Account - $0.00',
            'investment': 'Investment Account - $0.00'
        };
    }
    return accounts[accountValue] || accountValue;
}

async function processTransfer(transferData) {
    try {
        Utils.showSpinner('confirmBtn', 'confirmBtnText');
        
        // Simulate API call
        await simulateTransfer(transferData);
        
        // Hide confirmation modal
        const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('transferConfirmationModal'));
        confirmationModal.hide();
        
        // Show success modal
        showTransferSuccess(transferData);
        
    } catch (error) {
        Utils.showAlert('Transfer failed. Please try again.', 'danger');
    } finally {
        Utils.hideSpinner('confirmBtn', 'confirmBtnText');
    }
}

function showTransferSuccess(transferData) {
    const modalBody = document.getElementById('transferSuccessDetails');
    if (!modalBody) return;

    const transferId = 'TXN-' + Date.now();
    const recipient = transferData.transferType === 'internal' 
        ? getAccountName(transferData.toAccount)
        : transferData.recipientName;

    modalBody.innerHTML = `
        <div class="mt-3">
            <table class="table table-borderless">
                <tr>
                    <td><strong>Transaction ID:</strong></td>
                    <td>${transferId}</td>
                </tr>
                <tr>
                    <td><strong>Amount:</strong></td>
                    <td class="text-success fw-bold">${Utils.formatCurrency(transferData.amount)}</td>
                </tr>
                <tr>
                    <td><strong>Recipient:</strong></td>
                    <td>${recipient}</td>
                </tr>
                <tr>
                    <td><strong>Status:</strong></td>
                    <td><span class="badge bg-success">Completed</span></td>
                </tr>
                <tr>
                    <td><strong>Date:</strong></td>
                    <td>${Utils.formatDate(new Date())}</td>
                </tr>
            </table>
        </div>
    `;

    // Show success modal
    const modal = new bootstrap.Modal(document.getElementById('transferSuccessModal'));
    modal.show();

    // Reset form
    document.getElementById('transferForm').reset();
    
    // Update recent transfers
    loadRecentTransfers();
}

function loadRecentTransfers() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let recentTransfers = [];
    if (user.email === 'demo@example.com') {
        recentTransfers = [
            {
                id: 1,
                date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                description: 'Transfer to Savings',
                amount: 1000.00,
                type: 'internal',
                status: 'completed'
            },
            {
                id: 2,
                date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                description: 'Payment to John Smith',
                amount: 500.00,
                type: 'external',
                status: 'completed'
            },
            {
                id: 3,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                description: 'Transfer to Investment',
                amount: 2000.00,
                type: 'internal',
                status: 'completed'
            }
        ];
    } else {
        // For new users, show nothing by default
        recentTransfers = [];
    }
    const recentTransfersContainer = document.getElementById('recentTransfers');
    if (!recentTransfersContainer) return;
    if (recentTransfers.length === 0) {
        recentTransfersContainer.innerHTML = '<div class="text-center text-muted">No recent transfers to display.</div>';
        return;
    }
    const transfersHtml = recentTransfers.map(transfer => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <small class="fw-bold">${transfer.description}</small>
                <br>
                <small class="text-muted">${Utils.formatDate(transfer.date)}</small>
            </div>
            <div class="text-end">
                <small class="text-danger fw-bold">-${Utils.formatCurrency(transfer.amount)}</small>
                <br>
                <small class="text-muted">${transfer.type}</small>
            </div>
        </div>
    `).join('');
    recentTransfersContainer.innerHTML = transfersHtml;
}

function populateAccountDropdowns() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let accounts;
    if (user.email === 'demo@example.com') {
        accounts = [
            { id: 'main', name: 'Main Account', balance: '$24,500.00' },
            { id: 'savings', name: 'Savings Account', balance: '$15,750.00' },
            { id: 'investment', name: 'Investment Account', balance: '$32,100.00' }
        ];
    } else {
        accounts = [
            { id: 'main', name: 'Main Account', balance: '$1,000.00' },
            { id: 'savings', name: 'Savings Account', balance: '$0.00' },
            { id: 'investment', name: 'Investment Account', balance: '$0.00' }
        ];
    }
    const fromAccount = document.getElementById('fromAccount');
    const toAccount = document.getElementById('toAccount');
    if (fromAccount) {
        fromAccount.innerHTML = '<option value="">Select source account</option>' +
            accounts.map(acc => `<option value="${acc.id}">${acc.name} - ${acc.balance}</option>`).join('');
    }
    if (toAccount) {
        toAccount.innerHTML = '<option value="">Select destination account</option>' +
            accounts.map(acc => `<option value="${acc.id}">${acc.name} - ${acc.balance}</option>`).join('');
    }
}

// Simulate API call for transfer
async function simulateTransfer(transferData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful transfer
            if (transferData.amount > 0 && transferData.amount <= getMaxTransferAmount()) {
                resolve({
                    success: true,
                    transactionId: 'TXN-' + Date.now(),
                    message: 'Transfer processed successfully'
                });
            } else {
                reject(new Error('Transfer failed'));
            }
        }, 2000);
    });
}

// Store balances in localStorage for new users (not demo@example.com)
function getUserAccounts() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let accounts;
    if (user.email === 'demo@example.com') {
        accounts = {
            main: 24500.00,
            savings: 15750.00,
            investment: 32100.00
        };
    } else {
        // Try to get from localStorage, else initialize
        accounts = JSON.parse(localStorage.getItem('userAccounts')) || {
            main: 1000.00,
            savings: 0.00,
            investment: 0.00
        };
    }
    return accounts;
}

function setUserAccounts(accounts) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email !== 'demo@example.com') {
        localStorage.setItem('userAccounts', JSON.stringify(accounts));
    }
}

function addRecentTransaction(transaction) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email !== 'demo@example.com') {
        let txns = JSON.parse(localStorage.getItem('recentTransfers')) || [];
        txns.unshift(transaction);
        if (txns.length > 5) txns = txns.slice(0, 5);
        localStorage.setItem('recentTransfers', JSON.stringify(txns));
    }
}

// Patch populateAccountDropdowns to use localStorage for new users
function populateAccountDropdowns() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let accounts;
    if (user.email === 'demo@example.com') {
        accounts = [
            { id: 'main', name: 'Main Account', balance: '$24,500.00' },
            { id: 'savings', name: 'Savings Account', balance: '$15,750.00' },
            { id: 'investment', name: 'Investment Account', balance: '$32,100.00' }
        ];
    } else {
        const userAccounts = getUserAccounts();
        accounts = [
            { id: 'main', name: 'Main Account', balance: `$${userAccounts.main.toFixed(2)}` },
            { id: 'savings', name: 'Savings Account', balance: `$${userAccounts.savings.toFixed(2)}` },
            { id: 'investment', name: 'Investment Account', balance: `$${userAccounts.investment.toFixed(2)}` }
        ];
    }
    const fromAccount = document.getElementById('fromAccount');
    const toAccount = document.getElementById('toAccount');
    if (fromAccount) {
        fromAccount.innerHTML = '<option value="">Select source account</option>' +
            accounts.map(acc => `<option value="${acc.id}">${acc.name} - ${acc.balance}</option>`).join('');
    }
    if (toAccount) {
        toAccount.innerHTML = '<option value="">Select destination account</option>' +
            accounts.map(acc => `<option value="${acc.id}">${acc.name} - ${acc.balance}</option>`).join('');
    }
}

// Patch getAccountName to use localStorage for new users
function getAccountName(accountValue) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let accounts;
    if (user.email === 'demo@example.com') {
        accounts = {
            'main': 'Main Account - $24,500.00',
            'savings': 'Savings Account - $15,750.00',
            'investment': 'Investment Account - $32,100.00'
        };
    } else {
        const userAccounts = getUserAccounts();
        accounts = {
            'main': `Main Account - $${userAccounts.main.toFixed(2)}`,
            'savings': `Savings Account - $${userAccounts.savings.toFixed(2)}`,
            'investment': `Investment Account - $${userAccounts.investment.toFixed(2)}`
        };
    }
    return accounts[accountValue] || accountValue;
}

// Patch processTransfer to update balances and recent transfers for new users
async function processTransfer(transferData) {
    try {
        Utils.showSpinner('confirmBtn', 'confirmBtnText');
        // Simulate API call
        await simulateTransfer(transferData);
        // Hide confirmation modal
        const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('transferConfirmationModal'));
        confirmationModal.hide();
        // Update balances and recent transfers for new users
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.email !== 'demo@example.com' && transferData.transferType === 'internal') {
            let accounts = getUserAccounts();
            const from = transferData.fromAccount;
            const to = transferData.toAccount;
            const amt = parseFloat(transferData.amount);
            if (accounts[from] !== undefined && accounts[to] !== undefined && from !== to && amt > 0 && accounts[from] >= amt) {
                accounts[from] -= amt;
                accounts[to] += amt;
                setUserAccounts(accounts);
                addRecentTransaction({
                    id: Date.now(),
                    date: new Date(),
                    description: `Transfer to ${getAccountName(to)}`,
                    amount: amt,
                    type: 'internal',
                    from: getAccountName(from),
                    to: getAccountName(to),
                    status: 'completed'
                });
            }
            // Update dropdowns and dashboard if open
            populateAccountDropdowns();
            if (window.Dashboard && typeof window.Dashboard.updateAccountSummary === 'function') {
                window.Dashboard.updateAccountSummary();
            }
        }
        // Show success modal
        showTransferSuccess(transferData);
    } catch (error) {
        Utils.showAlert('Transfer failed. Please try again.', 'danger');
    } finally {
        Utils.hideSpinner('confirmBtn', 'confirmBtnText');
    }
}

// Patch loadRecentTransfers to use localStorage for new users
function loadRecentTransfers() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let recentTransfers = [];
    if (user.email === 'demo@example.com') {
        recentTransfers = [
            {
                id: 1,
                date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                description: 'Transfer to Savings',
                amount: 1000.00,
                type: 'internal',
                status: 'completed'
            },
            {
                id: 2,
                date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                description: 'Payment to John Smith',
                amount: 500.00,
                type: 'external',
                status: 'completed'
            },
            {
                id: 3,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                description: 'Transfer to Investment',
                amount: 2000.00,
                type: 'internal',
                status: 'completed'
            }
        ];
    } else {
        recentTransfers = JSON.parse(localStorage.getItem('recentTransfers')) || [];
    }
    const recentTransfersContainer = document.getElementById('recentTransfers');
    if (!recentTransfersContainer) return;
    if (recentTransfers.length === 0) {
        recentTransfersContainer.innerHTML = '<div class="text-center text-muted">No recent transfers to display.</div>';
        return;
    }
    const transfersHtml = recentTransfers.map(transfer => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <small class="fw-bold">${transfer.description}</small>
                <br>
                <small class="text-muted">${Utils.formatDate(transfer.date)}</small>
            </div>
            <div class="text-end">
                <small class="text-danger fw-bold">-${Utils.formatCurrency(transfer.amount)}</small>
                <br>
                <small class="text-muted">${transfer.type}</small>
            </div>
        </div>
    `).join('');
    recentTransfersContainer.innerHTML = transfersHtml;
}

// Export functions for use in other modules
window.Transfer = {
    initializeTransfer,
    validateTransferForm,
    processTransfer,
    loadRecentTransfers
}; 