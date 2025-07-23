// Transactions JavaScript for Digital Banking System

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Utils.requireAuth()) {
        return;
    }

    // Initialize transactions page
    initializeTransactions();
    loadTransactions();
    initializeFilters();
});

let currentTransactions = [];
let filteredTransactions = [];
let currentPage = 1;
const transactionsPerPage = 10;

function initializeTransactions() {
    // Initialize pagination controls
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayTransactions();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
            if (currentPage < maxPages) {
                currentPage++;
                displayTransactions();
            }
        });
    }

    // Initialize export functionality
    const exportBtn = document.getElementById('exportTransactions');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTransactions);
    }
}

function loadTransactions() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let mockTransactions = [];
    if (user.email === 'demo@example.com') {
        mockTransactions = [
            {
                id: 1,
                date: new Date(),
                description: 'Salary Deposit',
                account: 'Main Account',
                type: 'credit',
                amount: 5000.00,
                balance: 24500.00,
                status: 'completed',
                reference: 'REF-001'
            },
            {
                id: 2,
                date: new Date(Date.now() - 24 * 60 * 60 * 1000),
                description: 'Grocery Store Purchase',
                account: 'Main Account',
                type: 'debit',
                amount: -125.50,
                balance: 24000.00,
                status: 'completed',
                reference: 'REF-002'
            },
            {
                id: 3,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                description: 'Transfer to Savings',
                account: 'Main Account',
                type: 'transfer',
                amount: -1000.00,
                balance: 24125.50,
                status: 'completed',
                reference: 'REF-003'
            },
            {
                id: 4,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                description: 'Online Purchase - Amazon',
                account: 'Main Account',
                type: 'debit',
                amount: -89.99,
                balance: 25125.50,
                status: 'completed',
                reference: 'REF-004'
            },
            {
                id: 5,
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                description: 'Interest Payment',
                account: 'Savings Account',
                type: 'credit',
                amount: 45.25,
                balance: 15750.00,
                status: 'completed',
                reference: 'REF-005'
            },
            {
                id: 6,
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                description: 'Utility Bill Payment',
                account: 'Main Account',
                type: 'debit',
                amount: -150.00,
                balance: 25215.49,
                status: 'completed',
                reference: 'REF-006'
            },
            {
                id: 7,
                date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                description: 'Investment Dividend',
                account: 'Investment Account',
                type: 'credit',
                amount: 250.00,
                balance: 32100.00,
                status: 'completed',
                reference: 'REF-007'
            },
            {
                id: 8,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                description: 'Restaurant Payment',
                account: 'Main Account',
                type: 'debit',
                amount: -75.25,
                balance: 25365.49,
                status: 'completed',
                reference: 'REF-008'
            },
            {
                id: 9,
                date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
                description: 'Gas Station',
                account: 'Main Account',
                type: 'debit',
                amount: -45.00,
                balance: 25440.74,
                status: 'completed',
                reference: 'REF-009'
            },
            {
                id: 10,
                date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                description: 'Freelance Payment',
                account: 'Main Account',
                type: 'credit',
                amount: 1200.00,
                balance: 25485.74,
                status: 'completed',
                reference: 'REF-010'
            }
        ];
    } else {
        // For new users, show nothing by default
        mockTransactions = [];
    }
    currentTransactions = mockTransactions;
    filteredTransactions = [...currentTransactions];
    displayTransactions();
    updateTransactionSummary();
}

function displayTransactions() {
    const tableBody = document.getElementById('transactionsTableBody');
    if (!tableBody) return;

    if (filteredTransactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="text-center">No transactions to display.</td></tr>';
        updatePaginationInfo();
        return;
    }

    const transactionsHtml = filteredTransactions.map(transaction => `
        <tr>
            <td>${Utils.formatDate(transaction.date)}</td>
            <td>
                <div>
                    <strong>${transaction.description}</strong>
                    <br>
                    <small class="text-muted">Ref: ${transaction.reference}</small>
                </div>
            </td>
            <td>${transaction.account}</td>
            <td>
                <span class="badge bg-${getTransactionTypeColor(transaction.type)}">
                    ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </span>
            </td>
            <td class="${transaction.type === 'credit' ? 'text-success' : 'text-danger'}">
                <strong>${transaction.type === 'credit' ? '+' : ''}${Utils.formatCurrency(Math.abs(transaction.amount))}</strong>
            </td>
            <td>${transaction.balance !== undefined ? Utils.formatCurrency(transaction.balance) : '-'}</td>
            <td>
                <span class="badge bg-success">${transaction.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="window.Transactions.downloadReceipt('${transaction.reference}')">
                    <i class="fas fa-download me-1"></i>Download Receipt
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="window.Transactions.printReceipt('${transaction.reference}')">
                    <i class="fas fa-print me-1"></i>Print Receipt
                </button>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewTransactionDetails(${transaction.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tableBody.innerHTML = transactionsHtml;
    updatePaginationInfo();
}

function updatePaginationInfo() {
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');
    
    if (showingCount) {
        const startIndex = (currentPage - 1) * transactionsPerPage + 1;
        const endIndex = Math.min(currentPage * transactionsPerPage, filteredTransactions.length);
        showingCount.textContent = `${startIndex}-${endIndex}`;
    }
    
    if (totalCount) {
        totalCount.textContent = filteredTransactions.length;
    }

    // Update pagination button states
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        const maxPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
        nextBtn.disabled = currentPage >= maxPages;
    }
}

function initializeFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const searchInput = document.getElementById('searchTransaction');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
}

function applyFilters() {
    const accountFilter = document.getElementById('accountFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const searchTerm = document.getElementById('searchTransaction').value.toLowerCase();

    filteredTransactions = currentTransactions.filter(transaction => {
        // Account filter
        if (accountFilter && transaction.account !== accountFilter) {
            return false;
        }

        // Type filter
        if (typeFilter && transaction.type !== typeFilter) {
            return false;
        }

        // Date filter
        if (dateFilter && dateFilter !== 'custom') {
            const daysAgo = parseInt(dateFilter);
            const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            if (transaction.date < cutoffDate) {
                return false;
            }
        }

        // Search filter
        if (searchTerm) {
            const searchableText = `${transaction.description} ${transaction.reference} ${transaction.account}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        return true;
    });

    currentPage = 1;
    displayTransactions();
    updateTransactionSummary();
}

function clearFilters() {
    document.getElementById('accountFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('dateFilter').value = '30';
    document.getElementById('searchTransaction').value = '';

    filteredTransactions = [...currentTransactions];
    currentPage = 1;
    displayTransactions();
    updateTransactionSummary();
}

function updateTransactionSummary() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email !== 'demo@example.com' && currentTransactions.length === 0) {
        // For new users with no transactions, show all summary cards as zero
        const elements = {
            totalTransactions: 0,
            totalCredits: Utils.formatCurrency(0),
            totalDebits: Utils.formatCurrency(0),
            netAmount: Utils.formatCurrency(0)
        };
        Object.entries(elements).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = value;
            }
        });
        return;
    }
    const totalCredits = filteredTransactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalDebits = filteredTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netAmount = totalCredits - totalDebits;

    // Update summary cards
    const elements = {
        totalTransactions: filteredTransactions.length,
        totalCredits: Utils.formatCurrency(totalCredits),
        totalDebits: Utils.formatCurrency(totalDebits),
        netAmount: Utils.formatCurrency(netAmount)
    };

    Object.entries(elements).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = value;
        }
    });
}

function getTransactionTypeColor(type) {
    const colors = {
        credit: 'success',
        debit: 'danger',
        transfer: 'primary'
    };
    return colors[type] || 'secondary';
}

function viewTransactionDetails(transactionId) {
    const transaction = currentTransactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const modalBody = document.getElementById('transactionModalBody');
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Transaction Details</h6>
                    <table class="table table-borderless">
                        <tr>
                            <td><strong>Reference:</strong></td>
                            <td>${transaction.reference}</td>
                        </tr>
                        <tr>
                            <td><strong>Date:</strong></td>
                            <td>${Utils.formatDate(transaction.date)}</td>
                        </tr>
                        <tr>
                            <td><strong>Description:</strong></td>
                            <td>${transaction.description}</td>
                        </tr>
                        <tr>
                            <td><strong>Account:</strong></td>
                            <td>${transaction.account}</td>
                        </tr>
                        <tr>
                            <td><strong>Type:</strong></td>
                            <td>
                                <span class="badge bg-${getTransactionTypeColor(transaction.type)}">
                                    ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Amount:</strong></td>
                            <td class="${transaction.type === 'credit' ? 'text-success' : 'text-danger'}">
                                <strong>${transaction.type === 'credit' ? '+' : ''}${Utils.formatCurrency(Math.abs(transaction.amount))}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Balance:</strong></td>
                            <td>${Utils.formatCurrency(transaction.balance)}</td>
                        </tr>
                        <tr>
                            <td><strong>Status:</strong></td>
                            <td><span class="badge bg-success">${transaction.status}</span></td>
                        </tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6>Additional Information</h6>
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        This transaction has been processed and completed successfully.
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-outline-primary btn-sm me-2">
                            <i class="fas fa-download me-1"></i>Download Receipt
                        </button>
                        <button class="btn btn-outline-secondary btn-sm">
                            <i class="fas fa-print me-1"></i>Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
    modal.show();
}

function exportTransactions() {
    // Simulate export functionality
    Utils.showAlert('Exporting transactions...', 'info');
    
    setTimeout(() => {
        // Create CSV content
        const csvContent = [
            ['Date', 'Description', 'Account', 'Type', 'Amount', 'Balance', 'Status', 'Reference'],
            ...filteredTransactions.map(t => [
                Utils.formatDate(t.date),
                t.description,
                t.account,
                t.type,
                t.amount,
                t.balance,
                t.status,
                t.reference
            ])
        ].map(row => row.join(',')).join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        Utils.showAlert('Transactions exported successfully!', 'success');
    }, 1000);
}

function downloadReceipt(reference) {
    const txn = (filteredTransactions || []).find(t => t.reference === reference || t.id == reference);
    if (!txn) {
        Utils.showAlert('Transaction not found for receipt.', 'danger');
        return;
    }
    const receiptText = `--- Transaction Receipt ---\nReference: ${txn.reference || txn.id}\nDate: ${Utils.formatDate(txn.date)}\nDescription: ${txn.description}\nAccount: ${txn.account}\nType: ${txn.type}\nAmount: ${Utils.formatCurrency(Math.abs(txn.amount))}\nStatus: ${txn.status}`;
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
    const txn = (filteredTransactions || []).find(t => t.reference === reference || t.id == reference);
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
            <tr><td><strong>Account:</strong></td><td>${txn.account}</td></tr>
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

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other modules
window.Transactions = {
    loadTransactions,
    applyFilters,
    clearFilters,
    viewTransactionDetails,
    exportTransactions,
    downloadReceipt,
    printReceipt
}; 