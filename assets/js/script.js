// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // Убираем #
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Command Palette (Ctrl+K)
    const paletteOverlay = document.getElementById('command-palette');
    const paletteInput = document.getElementById('palette-input');
    const paletteToggleBtn = document.getElementById('palette-toggle');

    // Карта команд: команда -> ID секции
    const commandMap = {
        'about': 'hero',
        'stack': 'stack',
        'projects': 'projects',
        'opensource': 'opensource',
        'contact': 'contact'
    };

    /**
     * Открывает или закрывает командную палитру.
     * @param {boolean} show - true для открытия, false для закрытия.
     */
    function togglePalette(show) {
        if (show) {
            paletteOverlay.setAttribute('aria-hidden', 'false');
            paletteOverlay.style.display = 'flex';
            paletteInput.focus();
        } else {
            paletteOverlay.setAttribute('aria-hidden', 'true');
            paletteOverlay.style.display = 'none';
            paletteInput.value = '';
        }
    }

    /**
     * Выполняет команду (скроллит к секции).
     * @param {string} command - Введенная команда.
     */
    function executeCommand(command) {
        const targetId = commandMap[command];
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
            togglePalette(false); // Закрыть после выполнения
        } else {
            // Опционально: вывод ошибки или подсказки, если команда не найдена
            console.warn(`Command not found: ${command}`);
        }
    }

    // Обработчик нажатий клавиш (Ctrl+K, Escape, Enter)
    document.addEventListener('keydown', (e) => {
        const isPaletteOpen = paletteOverlay.getAttribute('aria-hidden') === 'false';

        // Ctrl + K для открытия/закрытия
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            togglePalette(!isPaletteOpen);
        }

        // Escape для закрытия
        if (e.key === 'Escape' && isPaletteOpen) {
            togglePalette(false);
        }

        // Enter для выполнения команды
        if (e.key === 'Enter' && isPaletteOpen) {
            e.preventDefault();
            const command = paletteInput.value.trim().toLowerCase();
            if (commandMap.hasOwnProperty(command)) {
                executeCommand(command);
            } else {
                // Если команда не найдена, можно очистить ввод
                paletteInput.value = '';
            }
        }
    });

    // Обработчик клика по кнопке
    paletteToggleBtn.addEventListener('click', () => {
        togglePalette(true);
    });

    // Закрытие при клике вне палитры
    paletteOverlay.addEventListener('click', (e) => {
        if (e.target === paletteOverlay) {
            togglePalette(false);
        }
    });

    // 3. Наблюдатель для Header (sticky on scroll)
    const header = document.getElementById('header');
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    document.body.prepend(sentinel);

    const headerObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, {
        rootMargin: "-1px 0px 0px 0px"
    });

    headerObserver.observe(sentinel);

    // 4. Observer для анимаций (Fade-in-up on scroll)
    const fadeInElements = document.querySelectorAll('.fade-in-up');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        fadeInObserver.observe(el);
    });
});