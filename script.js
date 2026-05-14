document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    //  QUIZ LOGIC
    // ============================================================
    const quizContainer = document.getElementById('quiz-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const progressFill = document.querySelector('.progress-fill');

    let currentStep = 1;
    const totalSteps = 9;
    let selections = {
        type: null,
        goal: [],
        platform: null,
        scale: 'small',
        sections: [],
        features: [],
        content: null,
        urgency: 'standard',
        name: '',
        phone: '',
        email: ''
    };

    const steps = {
        1: {
            id: 'type',
            title: 'Какая основная задача стоит?',
            subtitle: 'Выберите базовую услугу для старта.',
            type: 'single',
            options: [
                { id: 'fix',       label: 'Доработка',           desc: 'Правка дизайна, аналитика и т.д.',    price: 'от 25 000 ₸', icon: 'wrench' },
                { id: 'redesign',  label: 'Редизайн сайта',      desc: 'Обновление текущего дизайна',        price: 'от 100 000 ₸', icon: 'refresh-cw' },
                { id: 'figma',     label: 'Дизайн в Figma',      desc: 'Создание прототипа сайта',            price: 'от 10 000 ₸', icon: 'figma' },
                { id: 'landing',   label: 'Одностраничный сайт', desc: 'Лендинг для целевого действия',       price: 'от 75 000 ₸', icon: 'layout' },
                { id: 'corporate', label: 'Многостраничный сайт',desc: 'Сложная структура и меню',            price: 'от 150 000 ₸', icon: 'layers' },
                { id: 'ecommerce', label: 'Интернет-магазин',    desc: 'Каталог, корзина и оплата',           price: 'от 150 000 ₸', icon: 'shopping-cart' }
            ]
        },
        2: {
            id: 'goal',
            title: 'Какие задачи должен решать сайт?',
            subtitle: 'Выберите основные цели (можно несколько).',
            type: 'multi',
            options: [
                { id: 'leads', label: 'Заявки и лиды', desc: 'Сбор контактов потенциальных клиентов', price: 'Standard', icon: 'target' },
                { id: 'sales', label: 'Продажи онлайн', desc: 'Прямая торговля товарами или услугами', price: 'Standard', icon: 'shopping-bag' },
                { id: 'brand', label: 'Имидж и бренд', desc: 'Повышение узнаваемости и доверия', price: 'Standard', icon: 'award' },
                { id: 'info',  label: 'Инфо / Портфолио', desc: 'Демонстрация работ или знаний', price: 'Standard', icon: 'eye' }
            ]
        },
        3: {
            id: 'platform',
            title: 'На чем будет сделан сайт?',
            subtitle: 'Выберите технологию реализации проекта.',
            type: 'single',
            options: [
                { id: 'tilda',  label: 'Tilda Publishing', desc: 'Быстрый запуск и легкое управление', price: 'Standard', icon: 'layout' },
                { id: 'custom', label: 'Digital Engineering', desc: 'Максимальная скорость, SEO и любая сложность', price: '+20%', icon: 'code-2' }
            ]
        },
        4: {
            id: 'scale',
            title: 'Объем проекта',
            subtitle: 'Примерное количество блоков или страниц.',
            type: 'single',
            options: [
                { id: 'small',  label: 'Малый',        desc: 'До 5 блоков / страниц', price: 'x1.0', icon: 'monitor' },
                { id: 'medium', label: 'Средний',      desc: '5-10 блоков / страниц', price: 'x1.3', icon: 'copy' },
                { id: 'large',  label: 'Масштабный',   desc: '10+ блоков / страниц',  price: 'x1.8', icon: 'layout' }
            ]
        },
        5: {
            id: 'sections',
            title: 'Какие разделы нужны?',
            subtitle: 'Выберите необходимые страницы / блоки.',
            type: 'multi',
            options: [
                { id: 'home',    label: 'Главная',       desc: 'Основная страница', price: 'Free', icon: 'home' },
                { id: 'about',   label: 'О компании',    desc: 'История, команда', price: 'Free', icon: 'info' },
                { id: 'services',label: 'Услуги',        desc: 'Каталог услуг', price: 'Free', icon: 'briefcase' },
                { id: 'pricing', label: 'Цены / Прайс',  desc: 'Тарифы и стоимость', price: 'Free', icon: 'credit-card' },
                { id: 'cases',   label: 'Кейсы / Работы',desc: 'Портфолио', price: 'Free', icon: 'image' },
                { id: 'team',    label: 'Команда',       desc: 'Сотрудники, лица', price: 'Free', icon: 'users' },
                { id: 'blog',    label: 'Блог / Новости',desc: 'Статьи и анонсы', price: 'Free', icon: 'file-text' },
                { id: 'reviews', label: 'Отзывы',        desc: 'Социальное подтверждение', price: 'Free', icon: 'message-square' },
                { id: 'faq',     label: 'FAQ',           desc: 'Вопросы и ответы', price: 'Free', icon: 'help-circle' },
                { id: 'gallery', label: 'Галерея',       desc: 'Фото и видео', price: 'Free', icon: 'camera' },
                { id: 'contacts',label: 'Контакты',      desc: 'Карта, формы, соцсети', price: 'Free', icon: 'map-pin' }
            ]
        },
        6: {
            id: 'features',
            title: 'Нужны ли дополнительные услуги?',
            subtitle: 'Добавьте опции для усиления проекта (можно выбрать несколько).',
            type: 'multi',
            options: [
                { id: 'ads',       label: 'Настройка рекламы',   desc: 'Google / Яндекс',                     price: 'от 75 000 ₸', icon: 'trending-up' },
                { id: 'copy',      label: 'Написание текстов',   desc: 'Копирайтинг',                         price: 'Бонусом',   icon: 'edit-3' },
                { id: 'crm',       label: 'Интеграция CRM',      desc: 'AmoCRM, Bitrix24 и др.',              price: 'от 5 000 ₸',  icon: 'database' },
                { id: 'ai',        label: 'ИИ-ассистент',        desc: 'Умный чат-бот для продаж',            price: 'от 50 000 ₸', icon: 'bot' },
                { id: 'anim',      label: '3D и анимации',       desc: 'WOW-эффекты для сайта',              price: 'от 30 000 ₸', icon: 'box' }
            ]
        },
        7: {
            id: 'content',
            title: 'Готовность контента и дизайн',
            subtitle: 'Что у вас уже есть на данный момент?',
            type: 'single',
            options: [
                { id: 'all',     label: 'Всё готово',      desc: 'Есть тексты, фото и логотип', price: 'Standard', icon: 'check-circle' },
                { id: 'refs',    label: 'Есть референсы',  desc: 'Знаю что хочу, но нужен контент', price: 'Standard', icon: 'bookmark' },
                { id: 'site',    label: 'Есть сайт',       desc: 'Нужен редизайн / перенос', price: 'Standard', icon: 'refresh-cw' },
                { id: 'nothing', label: 'Ничего нет',      desc: 'Нужна помощь с нуля', price: '+15%', icon: 'sparkles' }
            ]
        },
        8: {
            id: 'urgency',
            title: 'Сроки реализации',
            subtitle: 'Насколько срочно вам нужен результат?',
            type: 'single',
            options: [
                { id: 'standard', label: 'В стандартном темпе', desc: 'Обычный график разработки',             price: 'x1.0', icon: 'clock' },
                { id: 'urgent',   label: 'Нужно срочно',        desc: 'Приоритет в очереди',                   price: 'x1.3', icon: 'zap' }
            ]
        },
        9: {
            id: 'contacts',
            title: 'Куда отправить расчет?',
            subtitle: 'Оставьте ваши контакты, чтобы мы закрепили за вами стоимость.',
            type: 'form'
        }
    };

    const basePrices = { fix: 25000, redesign: 100000, figma: 10000, landing: 75000, corporate: 150000, ecommerce: 150000 };
    const featurePrices = { ads: 75000, copy: 0, crm: 5000, ai: 50000, anim: 30000 };
    const scaleMultipliers = { small: 1.0, medium: 1.3, large: 1.8 };
    const urgencyMultipliers = { standard: 1.0, urgent: 1.3 };

    function calculateTotalPrice(sel) {
        let total = basePrices[sel.type] || 0;
        (sel.features || []).forEach(f => { total += featurePrices[f] || 0; });
        if (sel.platform === 'custom') total *= 1.2;
        if (sel.content === 'nothing') total *= 1.15;
        total *= scaleMultipliers[sel.scale] || 1;
        total *= urgencyMultipliers[sel.urgency] || 1;
        return Math.round(total);
    }

    function renderStep() {
        const step = steps[currentStep];
        const stepId = step.id;

        if (step.type === 'form') {
            quizContainer.innerHTML = `
                <div class="quiz-step-header">
                    <h3>${step.title}</h3>
                    <p>${step.subtitle}</p>
                </div>
                <div class="quiz-form">
                    <input type="text" id="quiz-name" name="name" placeholder="Ваше имя" value="${selections.name || ''}">
                    <input type="tel" id="quiz-phone" name="phone" placeholder="+7 (___) ___-__-__" value="${selections.phone || ''}">
                    <input type="email" id="quiz-email" name="email" placeholder="example@mail.com" value="${selections.email || ''}">
                    <p class="form-hint">Мы вышлем детализацию стоимости. Оставьте хотя бы один контакт.</p>
                </div>`;
            
            const nameInput = document.getElementById('quiz-name');
            const phoneInput = document.getElementById('quiz-phone');
            const emailInput = document.getElementById('quiz-email');
            
            nameInput.addEventListener('input', (e) => { selections.name = e.target.value; updateButtons(); });
            phoneInput.addEventListener('input', (e) => { 
                applyPhoneMask(e.target);
                selections.phone = e.target.value; 
                updateButtons(); 
            });
            emailInput.addEventListener('input', (e) => { selections.email = e.target.value; updateButtons(); });
        } else {
            quizContainer.innerHTML = `
                <div class="quiz-step-header">
                    <h3>${step.title}</h3>
                    <p>${step.subtitle}</p>
                </div>
                <div class="options-grid">
                    ${step.options.map(opt => {
                        const isSelected = step.type === 'multi'
                            ? (selections[stepId] || []).includes(opt.id)
                            : selections[stepId] === opt.id;
                        return `
                            <button class="option-btn ${isSelected ? 'selected' : ''}" data-id="${opt.id}">
                                <div class="opt-main">
                                    <i data-lucide="${opt.icon}"></i>
                                    <div class="opt-text">
                                        <span class="opt-label">${opt.label}</span>
                                        <span class="opt-desc">${opt.desc}</span>
                                    </div>
                                </div>
                                <span class="opt-price">${opt.price}</span>
                            </button>`;
                    }).join('')}
                </div>`;

            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', () => handleSelect(stepId, btn.dataset.id, step.type));
            });
        }

        updateButtons();
        updateProgress();

        try { lucide.createIcons(); } catch (e) {}
    }

    function handleSelect(stepId, value, type) {
        if (type === 'multi') {
            if (!selections[stepId]) selections[stepId] = [];
            const idx = selections[stepId].indexOf(value);
            if (idx > -1) selections[stepId].splice(idx, 1);
            else selections[stepId].push(value);
        } else {
            selections[stepId] = value;
        }
        renderStep();
    }

    function updateButtons() {
        prevBtn.disabled = currentStep === 1;
        nextBtn.textContent = currentStep === totalSteps ? 'Получить расчет' : 'Далее';
        
        const step = steps[currentStep];
        let isValid = false;
        
        if (step.type === 'form') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneClean = (selections.phone || '').replace(/\D/g, '');
            const isPhoneValid = phoneClean.length >= 10;
            const isEmailValid = emailRegex.test(selections.email || '');
            
            isValid = isPhoneValid || isEmailValid;
        } else if (step.type === 'multi') {
            isValid = (selections[step.id] || []).length > 0;
        } else {
            isValid = selections[step.id] !== null;
        }
        
        nextBtn.disabled = !isValid;
    }

    function updateProgress() {
        progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
    }

    async function submitQuiz() {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Отправка...';
        
        const finalPrice = calculateTotalPrice(selections);
        const formatted = new Intl.NumberFormat('ru-RU').format(finalPrice);
        
        const getLabel = (stepIdx, id) => steps[stepIdx].options.find(o => o.id === id)?.label || '—';
        const getMultiLabels = (stepIdx, ids) => (ids || []).map(id => steps[stepIdx].options.find(o => o.id === id)?.label).filter(Boolean).join(', ') || 'Нет';

        const typeLabel = getLabel(1, selections.type);
        const goalLabel = getMultiLabels(2, selections.goal);
        const platformLabel = getLabel(3, selections.platform);
        const scaleLabel = getLabel(4, selections.scale);
        const sectionsLabel = getMultiLabels(5, selections.sections);
        const featuresLabel = getMultiLabels(6, selections.features);
        const contentLabel = getLabel(7, selections.content);
        const urgencyLabel = getLabel(8, selections.urgency);

        const summaryMessage = `🚀 НОВАЯ ЗАЯВКА ИЗ КВИЗА (Elite)
Имя: ${selections.name || 'Не указано'}
Телефон: ${selections.phone || 'Не указан'}
Email: ${selections.email || 'Не указан'}
---
Услуга: ${typeLabel}
Цель: ${goalLabel}
Платформа: ${platformLabel}
Объем: ${scaleLabel}
Разделы: ${sectionsLabel}
Фичи: ${featuresLabel}
Контент: ${contentLabel}
Срок: ${urgencyLabel}
---
Итоговая оценка: ${formatted} ₸`.trim();

        const payload = {
            name: selections.name,
            phone: selections.phone,
            email: selections.email,
            typeLabel, goalLabel, platformLabel, scaleLabel, sectionsLabel, featuresLabel, contentLabel, urgencyLabel,
            formattedPrice: formatted,
            message: summaryMessage,
            _gotcha: "",
            _subject: `Elite Quiz: ${typeLabel} (${selections.name || 'Без имени'})`
        };

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('API failed');
        } catch (e) {
            console.warn('Fallback to direct Formspree...');
            try {
                await fetch(`https://formspree.io/f/xpqbndjo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.error('Fallback also failed:', err);
            }
        }

        renderFinalResult(formatted, typeLabel, platformLabel, scaleLabel, featuresLabel, urgencyLabel);
    }



    function renderFinalResult(formatted, typeLabel, platformLabel, scaleLabel, featLabels, urgencyLabel) {
        quizContainer.innerHTML = `
            <div class="result-card">
                <div class="price-badge">
                    <span class="price-label">Ориентировочная стоимость</span>
                    <h2 class="price-value">${formatted} ₸</h2>
                </div>
                <div class="result-summary">
                    <div class="summary-item">
                        <span class="summary-label">Услуга:</span>
                        <span class="summary-value">${typeLabel}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Платформа:</span>
                        <span class="summary-value">${platformLabel}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Объем:</span>
                        <span class="summary-value">${scaleLabel}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Опции:</span>
                        <span class="summary-value">${featLabels}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Срок:</span>
                        <span class="summary-value">${urgencyLabel}</span>
                    </div>
                </div>
                <a class="btn btn-cta" href="#" target="_blank">
                    <i data-lucide="message-circle"></i> Написать в WhatsApp
                </a>
            </div>`;

        const waMessage = encodeURIComponent(`Здравствуйте! Я прошел Elite Квиз на вашем сайте. Результаты:
- Услуга: ${typeLabel}
- Платформа: ${platformLabel}
- Объем: ${scaleLabel}
- Фичи: ${featLabels}
- Срок: ${urgencyLabel}
- Оценка: ${formatted} ₸

Контакт: ${selections.name || 'Без имени'}, ${selections.phone || selections.email}
Хочу обсудить детали проекта.`);

        const waBtn = quizContainer.querySelector('.btn-cta');
        if (waBtn) waBtn.href = `https://wa.me/77770752008?text=${waMessage}`;

        nextBtn.style.display = 'none';
        prevBtn.textContent = 'Начать заново';
        prevBtn.onclick = () => location.reload();
        progressFill.style.width = '100%';
        try { lucide.createIcons(); } catch (e) {}
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) { currentStep++; renderStep(); }
        else submitQuiz();
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) { currentStep--; renderStep(); }
    });

    renderStep();



    // ============================================================
    //  SCROLL REVEAL
    // ============================================================
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    // ============================================================
    //  CONTACT FORM AJAX SUBMISSION (BACKEND PROXY)
    // ============================================================
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');
    const contactSubmit = document.getElementById('contact-submit');
    const contactPhone = document.getElementById('contact-phone');

    if (contactPhone) {
        contactPhone.addEventListener('input', (e) => applyPhoneMask(e.target));
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            const formAction = contactForm.getAttribute('action'); // Fallback URL
            
            contactSubmit.disabled = true;
            contactSubmit.textContent = 'Отправка...';
            
            try {
                // 1. Пытаемся отправить через наш API (Telegram + Formspree)
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showSuccess();
                } else {
                    // Если API не ответил (например, нет переменных окружения), 
                    // пробуем отправить напрямую в Formspree
                    throw new Error('API failed, trying fallback');
                }
            } catch (error) {
                console.warn('Primary API failed, attempting direct Formspree submission...', error);
                
                try {
                    const fallbackResponse = await fetch(formAction, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    
                    if (fallbackResponse.ok) {
                        showSuccess();
                    } else {
                        throw new Error('Fallback failed too');
                    }
                } catch (fallbackError) {
                    showError();
                }
            }
        });

        function showSuccess() {
            contactStatus.textContent = '✅ Заявка успешно отправлена! Мы скоро свяжемся с вами.';
            contactStatus.style.color = '#4CAF50';
            contactStatus.style.display = 'block';
            contactForm.reset();
            contactSubmit.textContent = 'Отправлено';
            setTimeout(() => {
                contactSubmit.disabled = false;
                contactSubmit.textContent = 'Отправить еще раз';
            }, 3000);
        }

        function showError() {
            contactStatus.textContent = '❌ Ошибка отправки. Пожалуйста, напишите нам в WhatsApp или Telegram.';
            contactStatus.style.color = '#f44336';
            contactStatus.style.display = 'block';
            contactSubmit.disabled = false;
            contactSubmit.textContent = 'Попробовать снова';
        }
    }

    // Burger Menu Logic
    const burgerToggle = document.getElementById('burger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (burgerToggle && mobileMenu) {
        burgerToggle.addEventListener('click', () => {
            burgerToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Project Card Spotlight Effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ============================================================
    //  PHONE MASK HELPER
    // ============================================================
    function applyPhoneMask(input) {
        let matrix = "+7 (___) ___-__-__",
            i = 0,
            val = input.value.replace(/\D/g, "");
        
        if (val.length === 0) {
            input.value = "";
            return;
        }

        // Если введено 11 цифр и первая 7 или 8 — убираем её, так как +7 уже есть в маске
        if (val.length >= 11 && (val[0] === '7' || val[0] === '8')) {
            val = val.slice(1);
        }

        input.value = matrix.replace(/./g, function(a) {
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
        });
    }
});
