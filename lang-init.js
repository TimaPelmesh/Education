/**
 * Инициализация и управление языком для всех страниц KUDO®
 * Этот скрипт должен быть подключен после локализационного файла
 */

(function() {
    // Загружаем сохраненный язык при загрузке страницы
    document.addEventListener('DOMContentLoaded', initLanguage);
    
    // Настройка обработчика для переключения языка
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            toggleLanguage();
        });
    }

    /**
     * Инициализация языка сайта
     */
    function initLanguage() {
        const currentLang = getSavedLanguage();
        setLanguage(currentLang);
    }

    /**
     * Получение текущего языка браузера
     * @returns {string} Код языка ('ru' или 'en')
     */
    function getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('ru') ? 'ru' : 'en';
    }

    /**
     * Получение сохраненного языка из localStorage или определение языка браузера
     * @returns {string} Код языка ('ru' или 'en')
     */
    function getSavedLanguage() {
        return localStorage.getItem('kudo_language') || getBrowserLanguage();
    }

    /**
     * Переключение между языками
     */
    function toggleLanguage() {
        const currentLang = getSavedLanguage();
        const newLang = currentLang === 'ru' ? 'en' : 'ru';
        setLanguage(newLang);
    }

    /**
     * Установка языка и применение соответствующих переводов
     * @param {string} lang - Код языка ('ru' или 'en')
     */
    function setLanguage(lang) {
        // Если указанный язык не поддерживается, используем русский
        if (!localization[lang]) {
            lang = 'ru';
        }
        
        // Сохраняем выбранный язык
        localStorage.setItem('kudo_language', lang);
        
        // Обновляем отображение текущего языка
        const currentLangElements = document.querySelectorAll('#current-lang');
        currentLangElements.forEach(element => {
            element.textContent = lang.toUpperCase();
        });
        
        // Обновляем значение в селекторе языка, если он есть на странице
        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            langSelect.value = lang;
        }
        
        // Применяем переводы ко всем элементам с атрибутом data-lang-key
        translatePage(lang);
        
        // Обновляем плейсхолдеры для полей ввода
        updatePlaceholders(lang);
    }

    /**
     * Перевод всех элементов на странице
     * @param {string} lang - Код языка ('ru' или 'en')
     */
    function translatePage(lang) {
        const translations = localization[lang];
        
        // Переводим все элементы с атрибутом data-lang-key
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    }

    /**
     * Обновление плейсхолдеров для полей ввода
     * @param {string} lang - Код языка ('ru' или 'en')
     */
    function updatePlaceholders(lang) {
        const translations = localization[lang];
        
        // Обновляем плейсхолдеры для полей ввода
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });
    }

    // Экспортируем функцию для глобального доступа
    window.applyLanguage = setLanguage;
    
    /**
     * Получение текста по ключу для текущего языка
     * @param {string} key - Ключ локализации
     * @returns {string} Переведенный текст
     */
    window.localize = function(key) {
        const currentLang = localStorage.getItem('kudo_language') || 'ru';
        if (localization[currentLang] && localization[currentLang][key]) {
            return localization[currentLang][key];
        }
        // Возвращаем ключ, если перевод не найден
        return key;
    };
    
    /**
     * Динамический перевод элемента
     * @param {HTMLElement} element - DOM элемент для перевода
     * @param {string} key - Ключ локализации
     */
    window.translateElement = function(element, key) {
        const currentLang = localStorage.getItem('kudo_language') || 'ru';
        if (element && localization[currentLang] && localization[currentLang][key]) {
            element.textContent = localization[currentLang][key];
        }
    };
})(); 