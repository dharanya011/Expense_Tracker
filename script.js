// LocalStorage Keys
const KEYS = {
  USER: 'et_user',
  BUDGETS: 'et_budgets',
  EXPENSES: 'et_expenses',
  PAYMENTS: 'et_payments'
};

// Seed Data
const SEED_BUDGETS = [
  { id: 'b1', name: 'Shopping', amount: 2300, emoji: '🛍', createdAt: new Date('2026-07-01').toISOString() },
  { id: 'b2', name: 'Home Decor', amount: 3800, emoji: '🏠', createdAt: new Date('2026-07-02').toISOString() },
  { id: 'b3', name: 'Garden', amount: 1500, emoji: '🌴', createdAt: new Date('2026-07-03').toISOString() },
  { id: 'b4', name: 'Car', amount: 2500, emoji: '🚘', createdAt: new Date('2026-07-04').toISOString() },
  { id: 'b5', name: 'Youtube', amount: 5000, emoji: '📺', createdAt: new Date('2026-07-05').toISOString() }
];

const SEED_EXPENSES = [
  { id: 'e1', budgetId: 'b1', name: 'Shirts Adidas', amount: 150, date: '01/07/2026' },
  { id: 'e2', budgetId: 'b2', name: 'Leaving Room', amount: 800, date: '02/07/2026' },
  { id: 'e3', budgetId: 'b2', name: 'Bath', amount: 1000, date: '03/07/2026' },
  { id: 'e4', budgetId: 'b3', name: 'Mowing', amount: 90, date: '04/07/2026' },
  { id: 'e5', budgetId: 'b5', name: 'Source Code', amount: 800, date: '05/07/2026' },
  { id: 'e6', budgetId: 'b5', name: 'Youtube Ads', amount: 300, date: '06/07/2026' },
  { id: 'e7', budgetId: 'b4', name: 'Oil Change', amount: 120, date: '07/07/2026' },
  { id: 'e8', budgetId: 'b3', name: 'Hanging Tree', amount: 70, date: '08/07/2026' },
  { id: 'e9', budgetId: 'b2', name: 'Kitchen Decor', amount: 1500, date: '09/07/2024' },
  { id: 'e10', budgetId: 'b1', name: 'Shopping', amount: 450, date: '07/07/2026' },
  { id: 'e12', budgetId: 'b2', name: 'Home Decor', amount: 750, date: '07/07/2026' }
];

const SEED_USER = {
  email: 'gameplay@example.com',
  name: 'Game Play'
};

// Database Accessor Methods
const DB = {
  getUser() {
    const user = localStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  
  saveUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  
  clearUser() {
    localStorage.removeItem(KEYS.USER);
  },

  getBudgets() {
    const budgets = localStorage.getItem(KEYS.BUDGETS);
    return budgets ? JSON.parse(budgets) : [];
  },

  saveBudgets(budgets) {
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
  },

  addBudget(budget) {
    const budgets = this.getBudgets();
    budgets.push(budget);
    this.saveBudgets(budgets);
  },

  updateBudget(updatedBudget) {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.id === updatedBudget.id);
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updatedBudget };
      this.saveBudgets(budgets);
    }
  },

  deleteBudget(budgetId) {
    // Delete budget
    let budgets = this.getBudgets();
    budgets = budgets.filter(b => b.id !== budgetId);
    this.saveBudgets(budgets);

    // Delete associated expenses
    let expenses = this.getExpenses();
    expenses = expenses.filter(e => e.budgetId !== budgetId);
    this.saveExpenses(expenses);
  },

  getExpenses() {
    const expenses = localStorage.getItem(KEYS.EXPENSES);
    return expenses ? JSON.parse(expenses) : [];
  },

  saveExpenses(expenses) {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getExpensesForBudget(budgetId) {
    return this.getExpenses().filter(e => e.budgetId === budgetId);
  },

  addExpense(expense) {
    const expenses = this.getExpenses();
    expenses.push(expense);
    this.saveExpenses(expenses);
  },

  deleteExpense(expenseId) {
    let expenses = this.getExpenses();
    expenses = expenses.filter(e => e.id !== expenseId);
    this.saveExpenses(expenses);
  },

  /* Payments */
  getPayments() {
    const payments = localStorage.getItem(KEYS.PAYMENTS);
    return payments ? JSON.parse(payments) : [];
  },

  savePayments(payments) {
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
  },

  addPayment(payment) {
    const payments = this.getPayments();
    payments.push(payment);
    this.savePayments(payments);
  },

  initSeed() {
    if (!localStorage.getItem(KEYS.BUDGETS)) {
      localStorage.setItem(KEYS.BUDGETS, JSON.stringify(SEED_BUDGETS));
    } else {
      const budgets = this.getBudgets();
      const missingBudgets = SEED_BUDGETS.filter(seedBudget => !budgets.some(b => b.id === seedBudget.id || b.name.toLowerCase() === seedBudget.name.toLowerCase()));
      if (missingBudgets.length) {
        this.saveBudgets([...budgets, ...missingBudgets]);
      }
    }

    if (!localStorage.getItem(KEYS.EXPENSES)) {
      localStorage.setItem(KEYS.EXPENSES, JSON.stringify(SEED_EXPENSES));
    } else {
      const expenses = this.getExpenses();
      const missingExpenses = SEED_EXPENSES.filter(seedExpense => !expenses.some(e => e.id === seedExpense.id || (e.name.toLowerCase() === seedExpense.name.toLowerCase() && e.date === seedExpense.date)));
      if (missingExpenses.length) {
        this.saveExpenses([...expenses, ...missingExpenses]);
      }
    }

    if (!localStorage.getItem(KEYS.USER)) {
      localStorage.setItem(KEYS.USER, JSON.stringify(SEED_USER));
    }
    if (!localStorage.getItem(KEYS.PAYMENTS)) {
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify([]));
    }
  }
};

// Initialize Seeding
DB.initSeed();

// Handle Active Navigation Items
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.scrollBehavior = 'smooth';

  const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
  const activePath = currentPath === 'index.html' ? 'dashboard.html' : currentPath;

  if (currentPath.toLowerCase() === 'dashboard.html' && !DB.getUser()) {
    window.location.href = 'signin.html';
    return;
  }
  
  // Highlight sidebar links based on location
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
  sidebarLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === activePath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Handle header & profile displays across all logged-in pages
  const user = DB.getUser();
  if (user) {
    // Update profile letters with user first letter
    const profileIcons = document.querySelectorAll('.bg-success');
    profileIcons.forEach(icon => {
      icon.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    });
    
    // Update dashboard greetings if we are on dashboard page
    const greetingEl = document.querySelector('h1.display-5');
    if (greetingEl && greetingEl.textContent.includes('Hi,')) {
      greetingEl.innerHTML = `Hi, ${user.name} ✌`;
    }
  }

  const landingDots = document.querySelectorAll('.page-pagination .dot');
  const landingSections = ['home', 'features', 'insights', 'workflow', 'faq'];

  if (landingDots.length) {
    const updateActiveDot = () => {
      const scrollPosition = window.scrollY + 220;
      let activeSection = 'home';

      landingSections.forEach(section => {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          activeSection = section;
        }
      });

      landingDots.forEach(dot => {
        dot.classList.toggle('active', dot.getAttribute('data-section-link') === activeSection);
      });
    };

    window.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();
  }

  // Payment modal & history handlers (Upgrade page)
  const paymentListEl = document.getElementById('paymentHistory');
  const paymentModalEl = document.getElementById('paymentModal');
  let _selectedPlan = null;

  function renderPaymentHistory() {
    if (!paymentListEl) return;
    const payments = DB.getPayments();
    paymentListEl.innerHTML = '';
    if (!payments || payments.length === 0) {
      paymentListEl.innerHTML = '<li class="list-group-item text-center text-muted">No payments yet</li>';
      return;
    }

    // show newest first
    payments.slice().reverse().forEach(p => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start';

      const left = document.createElement('div');
      left.innerHTML = `<div><strong>${p.plan}</strong><div class="small text-muted">${new Date(p.date).toLocaleString()}</div></div>`;

      const right = document.createElement('div');
      right.innerHTML = `<span class="fw-bold text-primary">$${p.price}</span>`;

      li.appendChild(left);
      li.appendChild(right);
      paymentListEl.appendChild(li);
    });
  }

  // Set up modal interactions
  if (paymentModalEl) {
    const paymentModal = new bootstrap.Modal(paymentModalEl);

    document.querySelectorAll('[data-plan]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const plan = btn.getAttribute('data-plan');
        const price = btn.getAttribute('data-price');
        _selectedPlan = { plan, price };
        const summary = document.getElementById('paymentSummary');
        if (summary) summary.textContent = `${plan} — $${price}`;
        paymentModal.show();
      });
    });

    const confirmBtn = document.getElementById('confirmPaymentBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (!_selectedPlan) return;
        const name = (document.getElementById('cardName') || {}).value || '';
        const card = (document.getElementById('cardNumber') || {}).value || '';
        const payment = {
          id: 'p' + Date.now(),
          plan: _selectedPlan.plan,
          price: Number(_selectedPlan.price),
          cardName: name,
          cardLast4: card.slice(-4),
          date: new Date().toISOString()
        };

        DB.addPayment(payment);
        paymentModal.hide();
        renderPaymentHistory();
      });
    }

    // render initial
    renderPaymentHistory();
  }
});
