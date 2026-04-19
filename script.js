// Load data from LocalStorage
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.save-data');
    
    elements.forEach(el => {
        const saved = localStorage.getItem('neniflow_meal_' + el.id);
        if (saved !== null) {
            if (el.type === 'checkbox') {
                el.checked = saved === 'true';
            } else {
                el.value = saved;
            }
        }

        // Save on change
        el.addEventListener('input', () => {
            if (el.type === 'checkbox') {
                localStorage.setItem('neniflow_meal_' + el.id, el.checked);
            } else {
                localStorage.setItem('neniflow_meal_' + el.id, el.value);
            }
        });
    });

    // Initial calculation
    calculateBudget();
});

// Translations
const i18nData = {
    es: {
        app_title: "Meal Planner", btn_reset: "✨ Reiniciar", settings_title: "Ajustes Visuales",
        lbl_lang: "Idioma / Language", lbl_currency: "Moneda", lbl_primary: "Color Fondo", lbl_accent: "Color de Acento", lbl_font: "Tipografía", lbl_zoom: "Tamaño (Zoom)",
        title_budget: "💸 Presupuesto y Gastos", lbl_budget_total: "Presupuesto Semanal", lbl_expense_day: "Día del Gasto", lbl_add_expense: "Detalle y Monto del Gasto", ph_expense_desc: "Detalle...", btn_clear_expenses: "🧹 Reiniciar Gastos", txt_spent: "Gasto Semanal:", txt_remaining: "Restante:",
        opt_mon: "Lunes", opt_tue: "Martes", opt_wed: "Miércoles", opt_thu: "Jueves", opt_fri: "Viernes", opt_sat: "Sábado", opt_sun: "Domingo",
        title_prep: "🍱 Preparación de Comidas", lbl_cook: "👩🏻‍🍳 Cocinar con anticipación", ph_cook: "Ej: Arroz, lavar vegetales...", lbl_freeze: "❄️ Refrigerar / Congelar", ph_freeze: "Ej: Pollo marinado, sopas...",
        title_recipe: "📖 Control de Recetas", lbl_recipe_name: "Nombre de la Receta", ph_recipe_name: "Ej: Pasta al Pesto", lbl_time: "Tiempo (min)", lbl_diff: "Dificultad",
        opt_easy: "Fácil", opt_medium: "Medio", opt_hard: "Difícil", lbl_cat: "Categoría", opt_healthy: "🥗 Saludable", opt_fast: "⚡ Rápido", opt_cheap: "🪙 Económico", opt_gourmet: "✨ Gourmet",
        title_daily_meals: "🍽️ Registro de Comidas Diario", lbl_breakfast: "☀️ Desayuno", ph_breakfast: "Ej: Avena con frutas...", lbl_lunch: "🥗 Almuerzo", ph_lunch: "Ej: Pollo con vegetales...", lbl_dinner: "🌙 Cena", ph_dinner: "Ej: Ensalada ligera...", lbl_snacks: "🍎 Snacks", ph_snacks: "Ej: Almendras, yogurt..."
    },
    en: {
        app_title: "Meal Planner", btn_reset: "✨ Reset", settings_title: "Visual Settings",
        lbl_lang: "Language", lbl_currency: "Currency", lbl_primary: "Background Color", lbl_accent: "Accent Color", lbl_font: "Typography", lbl_zoom: "Size (Zoom)",
        title_budget: "💸 Budget & Expenses", lbl_budget_total: "Weekly Budget", lbl_expense_day: "Expense Day", lbl_add_expense: "Expense Detail & Amount", ph_expense_desc: "Detail...", btn_clear_expenses: "🧹 Reset Expenses", txt_spent: "Weekly Spent:", txt_remaining: "Remaining:",
        opt_mon: "Monday", opt_tue: "Tuesday", opt_wed: "Wednesday", opt_thu: "Thursday", opt_fri: "Friday", opt_sat: "Saturday", opt_sun: "Sunday",
        title_prep: "🍱 Meal Prep Planner", lbl_cook: "👩🏻‍🍳 Cook in advance", ph_cook: "Ex: Rice, wash veggies...", lbl_freeze: "❄️ Refrigerate / Freeze", ph_freeze: "Ex: Marinated chicken, soups...",
        title_recipe: "📖 Recipe Control", lbl_recipe_name: "Recipe Name", ph_recipe_name: "Ex: Pesto Pasta", lbl_time: "Time (min)", lbl_diff: "Difficulty",
        opt_easy: "Easy", opt_medium: "Medium", opt_hard: "Hard", lbl_cat: "Category", opt_healthy: "🥗 Healthy", opt_fast: "⚡ Fast", opt_cheap: "🪙 Budget", opt_gourmet: "✨ Gourmet",
        title_daily_meals: "🍽️ Daily Meal Log", lbl_breakfast: "☀️ Breakfast", ph_breakfast: "Ex: Oatmeal with fruits...", lbl_lunch: "🥗 Lunch", ph_lunch: "Ex: Chicken with veggies...", lbl_dinner: "🌙 Dinner", ph_dinner: "Ex: Light salad...", lbl_snacks: "🍎 Snacks", ph_snacks: "Ex: Almonds, yogurt..."
    }
};

const messages = {
    es: [
        "¡Cocinar en casa es el primer paso para ahorrar y cuidar tu cuerpo! 💖",
        "Planifica tus comidas, salva tu cartera y nutre tu alma. ✨",
        "Un dólar ahorrado es un paso más hacia tus metas. 💸",
        "Comida sana, mente sana, finanzas sanas. 🌱",
        "¡Tú puedes! Tu presupuesto y tu cuerpo te lo agradecerán. 💪🏼"
    ],
    en: [
        "Cooking at home is the first step to save money and care for your body! 💖",
        "Plan your meals, save your wallet, nourish your soul. ✨",
        "A dollar saved is a step closer to your goals. 💸",
        "Healthy food, healthy mind, healthy finances. 🌱",
        "You got this! Your budget and your body will thank you. 💪🏼"
    ]
};

function applyTranslations(lang) {
    const dict = i18nData[lang] || i18nData['es'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(dict[key]) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if(dict[key]) el.setAttribute('placeholder', dict[key]);
    });
    randomizeMessage(lang);
}

function randomizeMessage(lang = 'es') {
    const msgEl = document.getElementById('motivational-message');
    const msgs = messages[lang] || messages['es'];
    if(msgEl) {
        msgEl.innerText = msgs[Math.floor(Math.random() * msgs.length)];
    }
}

let expenseList = [];

function loadExpenses() {
    const saved = localStorage.getItem('neniflow_expenses');
    if (saved) {
        expenseList = JSON.parse(saved);
    }
    renderExpenses();
}

function renderExpenses() {
    const listEl = document.getElementById('expense-list');
    const containerEl = document.getElementById('expense-list-container');
    const currency = document.getElementById('currency-symbol') ? document.getElementById('currency-symbol').value : '$';
    
    listEl.innerHTML = '';
    if (expenseList.length > 0) {
        containerEl.style.display = 'block';
        expenseList.forEach((exp, idx) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.padding = '0.3rem 0.5rem';
            li.style.borderBottom = '1px solid rgba(0,0,0,0.03)';
            
            const dayBadge = exp.day ? `<span style="background: var(--primary-pink); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.7rem; margin-right: 0.5rem; color: var(--text-dark); font-weight: 600;">${exp.day}</span>` : '';

            li.innerHTML = `
                <span style="flex:1; display:flex; align-items:center;">${dayBadge} ${exp.desc || 'Gasto'}</span>
                <span style="font-weight:600; margin-right:1rem; display:flex; align-items:center;">${formatMoney(exp.amount)}</span>
                <span style="cursor:pointer; color:var(--text-muted); display:flex; align-items:center;" onclick="removeExpense(${idx})">❌</span>
            `;
            listEl.appendChild(li);
        });
    } else {
        containerEl.style.display = 'none';
    }
    calculateBudget();
}

function addExpense() {
    const dayEl = document.getElementById('expense-day');
    const day = dayEl ? dayEl.value : '';
    const desc = document.getElementById('expense-desc').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    
    if (amount && amount > 0) {
        expenseList.push({ day: day, desc: desc, amount: amount });
        localStorage.setItem('neniflow_expenses', JSON.stringify(expenseList));
        document.getElementById('expense-desc').value = '';
        document.getElementById('expense-amount').value = '';
        renderExpenses();
    }
}

function removeExpense(idx) {
    expenseList.splice(idx, 1);
    localStorage.setItem('neniflow_expenses', JSON.stringify(expenseList));
    renderExpenses();
}

function clearExpenses() {
    expenseList = [];
    localStorage.setItem('neniflow_expenses', JSON.stringify(expenseList));
    renderExpenses();
}

// Format Money Helper
function formatMoney(amount) {
    const currencyCode = document.getElementById('currency-symbol') ? document.getElementById('currency-symbol').value : 'USD';
    let locale = 'en-US';
    
    switch(currencyCode) {
        case 'COP': locale = 'es-CO'; break;
        case 'MXN': locale = 'es-MX'; break;
        case 'EUR': locale = 'de-DE'; break;
        case 'GBP': locale = 'en-GB'; break;
        default: locale = 'en-US';
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2
    }).format(amount);
}

// Calculate Budget
function calculateBudget() {
    const budgetTotal = parseFloat(document.getElementById('budget-total').value) || 0;
    
    const totalSpent = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = budgetTotal - totalSpent;
    
    document.getElementById('spent-amount').innerText = formatMoney(totalSpent);
    document.getElementById('remaining-amount').innerText = formatMoney(remaining);
    
    const progress = document.getElementById('budget-progress');
    if(budgetTotal > 0) {
        let perc = (totalSpent / budgetTotal) * 100;
        if(perc > 100) perc = 100;
        progress.style.width = perc + '%';
        
        progress.style.background = 'var(--accent-pink)';
    } else {
        progress.style.width = '0%';
    }
}

// Settings Menu Logic
function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('active');
}

function updateTheme() {
    const root = document.documentElement;
    const primary = document.getElementById('color-primary').value;
    const accent = document.getElementById('color-accent').value;
    const font = document.getElementById('font-family').value;
    const zoom = document.getElementById('widget-zoom').value;
    const currency = document.getElementById('currency-symbol').value;
    const lang = document.getElementById('language-select').value;

    root.style.setProperty('--primary-pink', primary);
    root.style.setProperty('--white', primary);
    root.style.setProperty('--glass-bg', primary);
    root.style.setProperty('--beige', primary);
    root.style.setProperty('--accent-pink', accent);
    root.style.setProperty('--font-main', font);
    
    document.getElementById('scale-wrapper').style.transform = `scale(${zoom})`;

    // Apply translations
    applyTranslations(lang);

    // Update budget rendering and expense list to use new currency
    renderExpenses();

    // Save to local storage
    localStorage.setItem('neniflow_settings', JSON.stringify({ primary, accent, font, zoom, currency, lang }));
}

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('neniflow_settings'));
    if(settings) {
        if(document.getElementById('color-primary')) document.getElementById('color-primary').value = settings.primary || '#FFFFFF';
        if(document.getElementById('color-accent')) document.getElementById('color-accent').value = settings.accent || '#FFB6C1';
        if(document.getElementById('font-family')) document.getElementById('font-family').value = settings.font || "'Poppins', sans-serif";
        if(document.getElementById('widget-zoom')) document.getElementById('widget-zoom').value = settings.zoom || "1";
        if(document.getElementById('currency-symbol')) document.getElementById('currency-symbol').value = settings.currency || "USD";
        if(document.getElementById('language-select')) document.getElementById('language-select').value = settings.lang || "es";
    }
    updateTheme();
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadExpenses();
});

// Reset Planner
function resetPlanner() {
    const elements = document.querySelectorAll('.save-data');
    elements.forEach(el => {
        if (el.type === 'checkbox') {
            el.checked = false;
            localStorage.removeItem('neniflow_meal_' + el.id);
        } else {
            el.value = '';
            localStorage.removeItem('neniflow_meal_' + el.id);
        }
    });
    calculateBudget();
    randomizeMessage();
}
