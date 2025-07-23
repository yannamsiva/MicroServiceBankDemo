// Dashboard JavaScript for Digital Banking System

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Utils.requireAuth()) {
        return;
    }

    // Initialize dashboard
    initializeDashboard();
    loadRecentTransactions();
    updateAccountSummary();
});

function initializeDashboard() {
    // Update user name in navigation
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userNameElements = document.querySelectorAll('#navbarDropdown');
    userNameElements.forEach(element => {
        element.innerHTML = `<i class="fas fa-user-circle me-1"></i>${user.firstName || 'User'}`;
    });

    // Initialize quick action cards
    initializeQuickActions();
}

function initializeQuickActions() {
    const quickActionCards = document.querySelectorAll('.card a');
    quickActionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Add loading state
            const icon = this.querySelector('i');
            const originalClass = icon.className;
            icon.className = 'fas fa-spinner fa-spin';
            
            setTimeout(() => {
                icon.className = originalClass;
            }, 1000);
        });
    });
}

function loadRecentTransactions() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let recentTransactions = [];
    if (user.email === 'demo@example.com') {
        recentTransactions = [
            {
                id: 1,
                date: new Date(),
                description: 'Salary Deposit',
                amount: 5000.00,
                type: 'credit',
                account: 'Main Account',
                status: 'completed'
            },
            {
                id: 2,
                date: new Date(Date.now() - 24 * 60 * 60 * 1000),
                description: 'Grocery Store',
                amount: -125.50,
                type: 'debit',
                account: 'Main Account',
                status: 'completed'
            },
            {
                id: 3,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                description: 'Transfer to Savings',
                amount: -1000.00,
                type: 'transfer',
                account: 'Main Account',
                status: 'completed'
            },
            {
                id: 4,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                description: 'Online Purchase',
                amount: -89.99,
                type: 'debit',
                account: 'Main Account',
                status: 'completed'
            },
            {
                id: 5,
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                description: 'Interest Payment',
                amount: 45.25,
                type: 'credit',
                account: 'Savings Account',
                status: 'completed'
            }
        ];
    } else {
        // For new users, show nothing by default
        recentTransactions = [];
    }
    const transactionsContainer = document.getElementById('recentTransactions');
    if (!transactionsContainer) return;
    if (recentTransactions.length === 0) {
        transactionsContainer.innerHTML = '<div class="text-center text-muted">No recent transactions to display.</div>';
        return;
    }
    const transactionsHtml = recentTransactions.map(transaction => `
        <div class="transaction-item ${transaction.type} mb-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${transaction.description}</h6>
                    <small class="text-muted">${transaction.account} • ${Utils.formatDate(transaction.date)}</small>
                </div>
                <div class="text-end">
                    <h6 class="mb-1 ${transaction.type === 'credit' ? 'text-success' : 'text-danger'}">
                        ${transaction.type === 'credit' ? '+' : ''}${Utils.formatCurrency(Math.abs(transaction.amount))}
                    </h6>
                    <small class="text-muted">
                        <i class="fas fa-${getTransactionIcon(transaction.type)} me-1"></i>
                        ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </small>
                    <div class="mt-1">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.Dashboard.downloadReceipt('${transaction.reference || transaction.id}')">
                            <i class="fas fa-download me-1"></i>Download Receipt
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="window.Dashboard.printReceipt('${transaction.reference || transaction.id}')">
                            <i class="fas fa-print me-1"></i>Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    transactionsContainer.innerHTML = transactionsHtml;
}

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
        accounts = JSON.parse(localStorage.getItem('userAccounts')) || {
            main: 1000.00,
            savings: 0.00,
            investment: 0.00
        };
    }
    return accounts;
}

function updateAccountSummary() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let summaryElements;
    let accounts = getUserAccounts();
    if (user.email === 'demo@example.com') {
        summaryElements = {
            totalBalance: '$72,350.00',
            thisMonth: '+$2,450.00',
            lastMonth: '-$1,200.00',
            totalAccounts: '3'
        };
    } else {
        const total = accounts.main + accounts.savings + accounts.investment;
        summaryElements = {
            totalBalance: `$${total.toFixed(2)}`,
            thisMonth: '+$0.00',
            lastMonth: '-$0.00',
            totalAccounts: '3'
        };
    }
    Object.entries(summaryElements).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = value;
        }
    });
    // Update account cards
    updateAccountCards();
}

function updateAccountCards() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let accounts;
    if (user.email === 'demo@example.com') {
        accounts = [
            { id: 'main', name: 'Main Account', balance: '$24,500.00', number: '****1234', color: 'success', icon: 'fa-credit-card' },
            { id: 'savings', name: 'Savings Account', balance: '$15,750.00', number: '****5678', color: 'success', icon: 'fa-piggy-bank' },
            { id: 'investment', name: 'Investment Account', balance: '$32,100.00', number: '****9012', color: 'info', icon: 'fa-chart-line' }
        ];
    } else {
        const userAccounts = getUserAccounts();
        accounts = [
            { id: 'main', name: 'Main Account', balance: `$${userAccounts.main.toFixed(2)}`, number: '****0001', color: 'success', icon: 'fa-credit-card' },
            { id: 'savings', name: 'Savings Account', balance: `$${userAccounts.savings.toFixed(2)}`, number: '****0002', color: 'success', icon: 'fa-piggy-bank' },
            { id: 'investment', name: 'Investment Account', balance: `$${userAccounts.investment.toFixed(2)}`, number: '****0003', color: 'info', icon: 'fa-chart-line' }
        ];
    }
    const accountCardIds = ['mainAccountCard', 'savingsAccountCard', 'investmentAccountCard'];
    accounts.forEach((acc, idx) => {
        const card = document.getElementById(accountCardIds[idx]);
        if (card) {
            card.style.display = '';
            card.querySelector('.account-balance').textContent = acc.balance;
            card.querySelector('.account-number').textContent = `Account: ${acc.number}`;
        }
    });
}

function getTransactionIcon(type) {
    const icons = {
        credit: 'arrow-down',
        debit: 'arrow-up',
        transfer: 'exchange-alt'
    };
    return icons[type] || 'circle';
}

// Account balance update function
function updateAccountBalances() {
    const balances = {
        main: 24500.00,
        savings: 15750.00,
        investment: 32100.00
    };

    // Simulate real-time balance updates
    setInterval(() => {
        // Add small random fluctuations to simulate real-time updates
        Object.keys(balances).forEach(account => {
            const fluctuation = (Math.random() - 0.5) * 10; // ±$5 fluctuation
            balances[account] += fluctuation;
            
            const balanceElement = document.querySelector(`[data-account="${account}"] .balance-amount`);
            if (balanceElement) {
                balanceElement.textContent = Utils.formatCurrency(balances[account]);
            }
        });
    }, 30000); // Update every 30 seconds
}

// Initialize real-time updates
function initializeRealTimeUpdates() {
    // Update account balances periodically
    updateAccountBalances();
    
    // Simulate new transaction notifications
    setInterval(() => {
        const shouldShowNotification = Math.random() < 0.1; // 10% chance every interval
        if (shouldShowNotification) {
            showTransactionNotification();
        }
    }, 60000); // Check every minute
}

function showTransactionNotification() {
    const notifications = [
        'New transaction: Salary deposit received',
        'Payment processed: Utility bill paid',
        'Transfer completed: Funds moved to savings',
        'Interest earned: $12.45 added to savings'
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    Utils.showAlert(randomNotification, 'info', 3000);
}

function downloadReceipt(reference) {
    // Try to find the transaction in recent transactions
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let txns = [];
    if (user.email === 'demo@example.com') {
        txns = [
            {
                id: 1, reference: 'REF-001', date: new Date(), description: 'Salary Deposit', account: 'Main Account', type: 'credit', amount: 5000.00, status: 'completed'
            },
            {
                id: 2, reference: 'REF-002', date: new Date(Date.now() - 24 * 60 * 60 * 1000), description: 'Grocery Store', account: 'Main Account', type: 'debit', amount: -125.50, status: 'completed'
            },
            {
                id: 3, reference: 'REF-003', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), description: 'Transfer to Savings', account: 'Main Account', type: 'transfer', amount: -1000.00, status: 'completed'
            },
            {
                id: 4, reference: 'REF-004', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), description: 'Online Purchase', account: 'Main Account', type: 'debit', amount: -89.99, status: 'completed'
            },
            {
                id: 5, reference: 'REF-005', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), description: 'Interest Payment', account: 'Savings Account', type: 'credit', amount: 45.25, status: 'completed'
            }
        ];
    } else {
        txns = JSON.parse(localStorage.getItem('recentTransfers')) || [];
    }
    const txn = txns.find(t => (t.reference || t.id) == reference);
    if (!txn) {
        Utils.showAlert('Transaction not found for receipt.', 'danger');
        return;
    }
    const receiptText = `--- Transaction Receipt ---\nReference: ${txn.reference || txn.id}\nDate: ${Utils.formatDate(txn.date)}\nDescription: ${txn.description}\nAccount: ${txn.account || txn.from}\nType: ${txn.type}\nAmount: ${Utils.formatCurrency(Math.abs(txn.amount))}\nStatus: ${txn.status}`;
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${txn.reference || txn.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
function printReceipt(reference) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let txns = [];
    if (user.email === 'demo@example.com') {
        txns = [
            {
                id: 1, reference: 'REF-001', date: new Date(), description: 'Salary Deposit', account: 'Main Account', type: 'credit', amount: 5000.00, status: 'completed'
            },
            {
                id: 2, reference: 'REF-002', date: new Date(Date.now() - 24 * 60 * 60 * 1000), description: 'Grocery Store', account: 'Main Account', type: 'debit', amount: -125.50, status: 'completed'
            },
            {
                id: 3, reference: 'REF-003', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), description: 'Transfer to Savings', account: 'Main Account', type: 'transfer', amount: -1000.00, status: 'completed'
            },
            {
                id: 4, reference: 'REF-004', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), description: 'Online Purchase', account: 'Main Account', type: 'debit', amount: -89.99, status: 'completed'
            },
            {
                id: 5, reference: 'REF-005', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), description: 'Interest Payment', account: 'Savings Account', type: 'credit', amount: 45.25, status: 'completed'
            }
        ];
    } else {
        txns = JSON.parse(localStorage.getItem('recentTransfers')) || [];
    }
    const txn = txns.find(t => (t.reference || t.id) == reference);
    if (!txn) {
        Utils.showAlert('Transaction not found for receipt.', 'danger');
        return;
    }
    const html = `
        <html><head><title>Transaction Receipt</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h2 { color: #007bff; }
            .receipt-table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            .receipt-table td { padding: 8px 12px; border-bottom: 1px solid #eee; }
        </style>
        </head><body>
        <h2>Transaction Receipt</h2>
        <table class='receipt-table'>
            <tr><td><strong>Reference:</strong></td><td>${txn.reference || txn.id}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${Utils.formatDate(txn.date)}</td></tr>
            <tr><td><strong>Description:</strong></td><td>${txn.description}</td></tr>
            <tr><td><strong>Account:</strong></td><td>${txn.account || txn.from}</td></tr>
            <tr><td><strong>Type:</strong></td><td>${txn.type}</td></tr>
            <tr><td><strong>Amount:</strong></td><td>${Utils.formatCurrency(Math.abs(txn.amount))}</td></tr>
            <tr><td><strong>Status:</strong></td><td>${txn.status}</td></tr>
        </table>
        <p style='margin-top:30px; color:#888;'>Thank you for banking with us.</p>
        </body></html>
    `;
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}
// Export functions for use in other modules
window.Dashboard = {
    loadRecentTransactions,
    updateAccountSummary,
    initializeRealTimeUpdates,
    downloadReceipt,
    printReceipt
}; 