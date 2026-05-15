// Consolidated Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Global Settings (Colors, Theme, Lang, etc.)
    loadSettings();
    
    // 2. Load Expense List
    loadExpenses();
    
    // 3. Load Save-Data Elements (Budget, Meals, Checkboxes)
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

        // Save on every input change for instant persistence
        el.addEventListener('input', () => {
            if (el.type === 'checkbox') {
                localStorage.setItem('neniflow_meal_' + el.id, el.checked);
            } else {
                localStorage.setItem('neniflow_meal_' + el.id, el.value);
            }
            // If it's the budget, recalculate
            if(el.id === 'budget-total') calculateBudget();
            showSaveIndicator();
        });
    });

    // 4. Initial UI Polish
    calculateBudget();
    randomizeMessage();
});

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    if (indicator) {
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 1500);
    }
}

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
        opt_easy: "Easy", opt_medium: "Medium", opt_hard: "Hard", lbl_cat: "Category", opt_healthy: "🥗 Healthy", opt_fast: "⚡ Fast", opt_cheap: "Budget", opt_gourmet: "✨ Gourmet",
        title_daily_meals: "🍽️ Daily Meal Log", lbl_breakfast: "☀️ Breakfast", ph_breakfast: "Ex: Oatmeal with fruits...", lbl_lunch: "🥗 Lunch", ph_lunch: "Ex: Chicken with veggies...", lbl_dinner: "🌙 Dinner", ph_dinner: "Ex: Light salad...", lbl_snacks: "🍎 Snacks", ph_snacks: "Ex: Almonds, yogurt..."
    },
    fr: {
        app_title: "Planificateur", btn_reset: "✨ Réinitialiser", settings_title: "Paramètres",
        lbl_lang: "Langue", lbl_currency: "Devise", lbl_primary: "Fond", lbl_accent: "Accent", lbl_font: "Typographie", lbl_zoom: "Taille",
        title_budget: "💸 Budget et Dépenses", lbl_budget_total: "Budget Hebdo", lbl_expense_day: "Jour", lbl_add_expense: "Détail et Montant", ph_expense_desc: "Détail...", btn_clear_expenses: "🧹 Effacer", txt_spent: "Dépense:", txt_remaining: "Restant:",
        opt_mon: "Lundi", opt_tue: "Mardi", opt_wed: "Mercredi", opt_thu: "Jeudi", opt_fri: "Vendredi", opt_sat: "Samedi", opt_sun: "Dimanche",
        title_prep: "🍱 Préparation", lbl_cook: "👩🏻‍🍳 Cuisiner", ph_cook: "Ex: Riz, légumes...", lbl_freeze: "❄️ Congeler", ph_freeze: "Ex: Poulet, soupes...",
        title_recipe: "📖 Recettes", lbl_recipe_name: "Nom", ph_recipe_name: "Ex: Pâtes", lbl_time: "Temps", lbl_diff: "Difficulté",
        opt_easy: "Facile", opt_medium: "Moyen", opt_hard: "Difficile", lbl_cat: "Catégorie", opt_healthy: "🥗 Sain", opt_fast: "⚡ Rapide", opt_cheap: "Budget", opt_gourmet: "✨ Gourmet",
        title_daily_meals: "🍽️ Journal", lbl_breakfast: "☀️ Petit Déjeuner", ph_breakfast: "Ex: Avoine...", lbl_lunch: "🥗 Déjeuner", ph_lunch: "Ex: Poulet...", lbl_dinner: "🌙 Dîner", ph_dinner: "Ex: Salade...", lbl_snacks: "🍎 Collations", ph_snacks: "Ex: Yaourt..."
    },
    pt: {
        app_title: "Planejador", btn_reset: "✨ Reiniciar", settings_title: "Ajustes",
        lbl_lang: "Idioma", lbl_currency: "Moeda", lbl_primary: "Fundo", lbl_accent: "Acento", lbl_font: "Tipografia", lbl_zoom: "Tamanho",
        title_budget: "💸 Orçamento", lbl_budget_total: "Orçamento Semanal", lbl_expense_day: "Dia", lbl_add_expense: "Detalhe e Valor", ph_expense_desc: "Detalhe...", btn_clear_expenses: "🧹 Limpar", txt_spent: "Gasto:", txt_remaining: "Restante:",
        opt_mon: "Segunda", opt_tue: "Terça", opt_wed: "Quarta", opt_thu: "Quinta", opt_fri: "Sexta", opt_sat: "Sábado", opt_sun: "Domingo",
        title_prep: "🍱 Preparação", lbl_cook: "👩🏻‍🍳 Cozinhar", ph_cook: "Ex: Arroz, vegetais...", lbl_freeze: "❄️ Congelar", ph_freeze: "Ex: Frango, sopas...",
        title_recipe: "📖 Receitas", lbl_recipe_name: "Nome", ph_recipe_name: "Ex: Massa", lbl_time: "Tempo", lbl_diff: "Dificuldade",
        opt_easy: "Fácil", opt_medium: "Médio", opt_hard: "Difícil", lbl_cat: "Categoria", opt_healthy: "🥗 Saudável", opt_fast: "⚡ Rápido", opt_cheap: "Econômico", opt_gourmet: "✨ Gourmet",
        title_daily_meals: "🍽️ Registro Diário", lbl_breakfast: "☀️ Café da Manhã", ph_breakfast: "Ex: Aveia...", lbl_lunch: "🥗 Almoço", ph_lunch: "Ex: Frango...", lbl_dinner: "🌙 Jantar", ph_dinner: "Ex: Salada...", lbl_snacks: "🍎 Lanches", ph_snacks: "Ex: Iogurte..."
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
    ],
    fr: [
        "Cuisiner à la maison est le premier pas pour économiser et prendre soin de soi ! 💖",
        "Planifiez vos repas, sauvez votre budget et nourrissez votre âme. ✨",
        "Une économie faite est un pas de plus vers vos objectifs. 💸",
        "Nourriture saine, esprit sain, finances saines. 🌱",
        "Vous pouvez le faire ! Votre budget y gagnera. 💪🏼"
    ],
    pt: [
        "Cozinhar em casa é o primeiro passo para economizar e cuidar do seu corpo! 💖",
        "Planeje suas refeições, salve sua carteira e nutra sua alma. ✨",
        "Um real economizado é um passo a mais para suas metas. 💸",
        "Comida saudável, mente saudável, finanças saudáveis. 🌱",
        "Você consegue! Seu orçamento e seu corpo agradecerão. 💪🏼"
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
    
    if (!listEl) return;
    
    listEl.innerHTML = '';
    if (expenseList.length > 0) {
        containerEl.style.display = 'block';
        expenseList.forEach((exp, idx) => {
            const li = document.createElement('li');
            li.className = 'expense-item';
            
            const dayBadge = exp.day ? `<span style="color: var(--primary-pink); font-weight: 700; margin-right: 8px;">${exp.day.substring(0,2)}</span>` : '';

            li.innerHTML = `
                <span style="flex:1;">${dayBadge}${exp.desc || 'Gasto'}</span>
                <span style="font-weight:700; margin-right:12px;">${formatMoney(exp.amount)}</span>
                <span style="cursor:pointer; opacity:0.5;" onclick="removeExpense(${idx})">✕</span>
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

function calculateBudget() {
    const budgetTotalInput = document.getElementById('budget-total');
    const budgetTotal = parseFloat(budgetTotalInput.value) || 0;
    
    // Update the currency prefix based on symbol
    const currencyPrefix = document.querySelector('.currency-prefix');
    const currencyCode = document.getElementById('currency-symbol') ? document.getElementById('currency-symbol').value : 'USD';
    let symbol = '$';
    if(currencyCode === 'EUR') symbol = '€';
    if(currencyCode === 'GBP') symbol = '£';
    if(currencyPrefix) currencyPrefix.innerText = symbol;
    
    const totalSpent = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = budgetTotal - totalSpent;
    
    const spentEl = document.getElementById('spent-amount');
    const remainingEl = document.getElementById('remaining-amount');
    
    if (spentEl) spentEl.innerText = formatMoney(totalSpent);
    if (remainingEl) {
        remainingEl.innerText = formatMoney(remaining);
        if (remaining < 0) {
            remainingEl.style.color = '#FF5252';
        } else {
            remainingEl.style.color = '';
        }
    }
    
    const progress = document.getElementById('budget-progress');
    const percentText = document.getElementById('budget-percent');
    
    if (budgetTotal > 0) {
        let perc = Math.round((totalSpent / budgetTotal) * 100);
        if (perc > 100) perc = 100;
        if (progress) progress.style.width = perc + '%';
        if (percentText) percentText.innerText = perc + '%';
    } else {
        if (progress) progress.style.width = '0%';
        if (percentText) percentText.innerText = '0%';
    }
}

// Settings Menu Logic
function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    if (panel) panel.classList.toggle('active');
}

// Theme Toggle Logic
function toggleDarkMode() {
    const isDark = document.getElementById('dark-mode-toggle').checked;
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    saveSettings();
}

function updateTheme() {
    const root = document.documentElement;
    const primaryInput = document.getElementById('color-primary');
    const bgInput = document.getElementById('color-bg');
    const fontInput = document.getElementById('font-family');
    const zoomInput = document.getElementById('widget-zoom');
    const langInput = document.getElementById('language-select');

    if (primaryInput) {
        root.style.setProperty('--primary-pink', primaryInput.value);
        root.style.setProperty('--light-pink', primaryInput.value + '33'); 
    }
    if (bgInput) {
        root.style.setProperty('--bg-main', bgInput.value);
    }
    if (fontInput) root.style.setProperty('--font-main', fontInput.value);
    
    if (zoomInput) {
        const wrapper = document.getElementById('scale-wrapper');
        if (wrapper) wrapper.style.transform = `scale(${zoomInput.value})`;
    }

    if (langInput) applyTranslations(langInput.value);

    calculateBudget();
    saveSettings();
}

function saveSettings() {
    const settings = {
        primary: document.getElementById('color-primary')?.value,
        bg: document.getElementById('color-bg')?.value,
        font: document.getElementById('font-family')?.value,
        zoom: document.getElementById('widget-zoom')?.value,
        currency: document.getElementById('currency-symbol')?.value,
        lang: document.getElementById('language-select')?.value,
        darkMode: document.getElementById('dark-mode-toggle')?.checked
    };
    localStorage.setItem('neniflow_settings', JSON.stringify(settings));
}

function loadSettings() {
    const settingsStr = localStorage.getItem('neniflow_settings');
    if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        if (settings.primary && document.getElementById('color-primary')) document.getElementById('color-primary').value = settings.primary;
        if (settings.bg && document.getElementById('color-bg')) document.getElementById('color-bg').value = settings.bg;
        if (settings.font && document.getElementById('font-family')) document.getElementById('font-family').value = settings.font;
        if (settings.zoom && document.getElementById('widget-zoom')) document.getElementById('widget-zoom').value = settings.zoom;
        if (settings.currency && document.getElementById('currency-symbol')) document.getElementById('currency-symbol').value = settings.currency;
        if (settings.lang && document.getElementById('language-select')) document.getElementById('language-select').value = settings.lang;
        if (settings.darkMode !== undefined) {
            const toggle = document.getElementById('dark-mode-toggle');
            if(toggle) {
                toggle.checked = settings.darkMode;
                if (settings.darkMode) document.body.classList.add('dark-mode');
            }
        }
    }
    updateTheme();
}

function resetPlanner() {
    const elements = document.querySelectorAll('.save-data');
    elements.forEach(el => {
        if (el.type === 'checkbox') {
            el.checked = false;
        } else {
            el.value = '';
        }
        localStorage.removeItem('neniflow_meal_' + el.id);
    });
    calculateBudget();
    randomizeMessage();
}
